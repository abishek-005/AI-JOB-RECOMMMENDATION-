import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sentence_transformers import SentenceTransformer

# 1. Define the Neural Network Architecture
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

def main():
    print("Loading SBERT model (this might take a few seconds)...")
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Loading synthetic dataset...")
    with open('synthetic_data.json', 'r', encoding='utf-8') as f:
        dataset = json.load(f)
        
    texts = [item['text'] for item in dataset]
    labels = [item['label'] for item in dataset]
    
    # 2. Map string labels to integer indices
    unique_labels = sorted(list(set(labels)))
    label_to_idx = {label: idx for idx, label in enumerate(unique_labels)}
    idx_to_label = {idx: label for label, idx in label_to_idx.items()}
    
    # Save the mapping so the inference engine can use it later
    with open('label_mapping.json', 'w') as f:
        json.dump(idx_to_label, f, indent=4)
        
    y_indices = [label_to_idx[label] for label in labels]
    
    print("Converting resumes into 384-dimensional SBERT vectors...")
    X_embeddings = sbert_model.encode(texts, convert_to_tensor=True)
    y_tensor = torch.tensor(y_indices, dtype=torch.long)
    
    # 3. Create PyTorch DataLoader
    train_dataset = TensorDataset(X_embeddings, y_tensor)
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    
    # 4. Initialize Model, Loss Function, and Optimizer
    model = JobPredictorMLP(input_dim=384, output_dim=len(unique_labels))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # 5. Training Loop
    epochs = 40
    print(f"\nStarting PyTorch Training Loop for {epochs} Epochs...")
    model.train()
    
    for epoch in range(epochs):
        total_loss = 0
        correct = 0
        total = 0
        
        for batch_X, batch_y in train_loader:
            # Zero gradients
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(batch_X)
            
            # Calculate loss
            loss = criterion(outputs, batch_y)
            
            # Backward pass and optimize
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            # Calculate accuracy for this batch
            _, predicted = torch.max(outputs.data, 1)
            total += batch_y.size(0)
            correct += (predicted == batch_y).sum().item()
            
        avg_loss = total_loss / len(train_loader)
        accuracy = 100 * correct / total
        
        if (epoch + 1) % 5 == 0 or epoch == 0:
            print(f"Epoch [{epoch+1}/{epochs}] | Loss: {avg_loss:.4f} | Accuracy: {accuracy:.2f}%")
            
    # 6. Save the trained weights
    torch.save(model.state_dict(), 'mlp_model.pth')
    print("\nTraining Complete! Weights saved to 'mlp_model.pth'.")
    print("Label mapping saved to 'label_mapping.json'.")

if __name__ == "__main__":
    main()
