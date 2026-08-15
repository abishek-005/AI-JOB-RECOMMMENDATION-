import re
import json
import torch
import torch.nn as nn
from sentence_transformers import SentenceTransformer

# 1. Define the Neural Network Architecture (must match train_mlp.py)
class JobPredictorMLP(nn.Module):
    def __init__(self, input_dim=384, hidden_dim=128, output_dim=6):
        super(JobPredictorMLP, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, output_dim)
        )

    def forward(self, x):
        return self.network(x)

# 2. Initialize Models and Load Weights
sbert_model = None
mlp_model = None
idx_to_label = {}

try:
    print("Loading SBERT model...")
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Loading label mapping...")
    with open('label_mapping.json', 'r') as f:
        # JSON keys are always strings, we need to convert them back to integers
        mapping = json.load(f)
        idx_to_label = {int(k): v for k, v in mapping.items()}
        
    print("Loading PyTorch MLP model...")
    mlp_model = JobPredictorMLP(input_dim=384, output_dim=len(idx_to_label))
    mlp_model.load_state_dict(torch.load('mlp_model.pth', weights_only=True))
    mlp_model.eval() # Set to evaluation mode (turns off dropout)
    
    print("AI Engine ready!")
except Exception as e:
    print(f"Error loading models: {e}")

def extract_core_text(text: str) -> str:
    """
    Aggressively distills a resume down to core skills and nouns to prevent 
    SBERT's 512-token truncation limit from dropping important data on page 2.
    """
    text = text.lower()
    
    stop_words = {
        'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 
        'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 
        'so', 'if', 'out', 'not', 'am', 'my', 'me', 'who', 'highly', 'motivated', 
        'team', 'player', 'seeking', 'opportunity', 'responsible', 'worked'
    }
    
    words = re.findall(r'\b[a-z0-9]+\b', text)
    filtered_words = [w for w in words if w not in stop_words]
    return " ".join(filtered_words)

def predict_roles(resume_text: str):
    """
    Predicts the top job roles using the custom-trained PyTorch MLP.
    """
    if not sbert_model or not mlp_model:
        return []

    # 1. Distill the text
    core_text = extract_core_text(resume_text)
    
    # 2. Convert to SBERT vector (1x384 tensor)
    resume_embedding = sbert_model.encode([core_text], convert_to_tensor=True)
    
    # 3. Neural Network Forward Pass
    with torch.no_grad(): # Disable gradient calculation for faster inference
        logits = mlp_model(resume_embedding)
        
        # Apply Softmax to convert raw logits into probability percentages (0 to 1)
        probabilities = torch.softmax(logits, dim=1)[0]
    
    # 4. Format results
    results = []
    for idx, prob in enumerate(probabilities):
        role_name = idx_to_label[idx]
        match_percentage = round(prob.item() * 100, 1)
        results.append({
            "role": role_name,
            "match_score": match_percentage
        })
    
    # Sort by highest score first
    results.sort(key=lambda x: x['match_score'], reverse=True)
    
    # Check if the top result is "Non-Tech / Other"
    is_eligible = True
    if results and results[0]['role'] == "Non-Tech / Other":
        is_eligible = False
        
    # Filter out the 'Non-Tech' role so it doesn't show up in the tech dropdown
    filtered_results = [r for r in results if r['role'] != "Non-Tech / Other"]
    
    return {
        "is_eligible": is_eligible,
        "predicted_roles": filtered_results
    }
