import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# 1. Initialize the SBERT Model
# We use 'all-MiniLM-L6-v2' because it's fast, lightweight (~80MB), and heavily optimized 
# for semantic similarity tasks, making it perfect for real-time web APIs.
try:
    print("Loading SBERT model... (this may take a moment on first run to download)")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("SBERT model loaded successfully.")
except Exception as e:
    print(f"Error loading SBERT model: {e}")
    model = None

# 2. Define Target Job Profiles
# These strings act as the "ideal candidate" semantic anchors.
# We embed these once, and then compare the user's resume embedding to them.
JOB_PROFILES = {
    "AI/ML Engineer": "artificial intelligence machine learning deep learning neural networks python pytorch tensorflow computer vision nlp data science predictive modeling",
    "Frontend Developer": "frontend web development user interface react nextjs javascript typescript html css tailwind responsive design ui ux",
    "Backend Developer": "backend server api microservices python fastapi nodejs database sql postgresql nosql mongodb docker aws cloud infrastructure",
    "Data Analyst": "data analysis visualization sql excel tableau powerbi python pandas statistics reporting business intelligence metrics",
    "DevOps Engineer": "devops ci cd pipelines docker kubernetes aws azure gcp linux automation scripting infrastructure as code terraform ansible",
    "Mobile Developer": "mobile app development ios android react native flutter swift kotlin mobile ui performance optimization"
}

# Cache the embeddings for the job profiles so we don't compute them on every request
if model:
    job_roles = list(JOB_PROFILES.keys())
    job_texts = list(JOB_PROFILES.values())
    print("Pre-computing job profile embeddings...")
    job_embeddings = model.encode(job_texts)
else:
    job_roles = []
    job_embeddings = None

def extract_core_text(text: str) -> str:
    """
    Aggressively distills a resume down to core skills and nouns to prevent 
    SBERT's 512-token truncation limit from dropping important data on page 2.
    """
    text = text.lower()
    
    # Simple list of high-frequency filler words to remove
    stop_words = {
        'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 
        'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 
        'so', 'if', 'out', 'not', 'am', 'my', 'me', 'who', 'highly', 'motivated', 
        'team', 'player', 'seeking', 'opportunity', 'responsible', 'worked'
    }
    
    # Keep only alphanumeric words
    words = re.findall(r'\b[a-z0-9]+\b', text)
    
    # Filter out stop words
    filtered_words = [w for w in words if w not in stop_words]
    
    # Join back into a dense string. 
    # A 1000 word resume might become 300 words of pure signal, easily fitting the 512 token limit.
    return " ".join(filtered_words)

def predict_roles(resume_text: str):
    """
    Compares the condensed resume text against target job profiles using Cosine Similarity.
    """
    if not model or job_embeddings is None:
        return []

    # 1. Distill the text to avoid token truncation
    core_text = extract_core_text(resume_text)
    
    # 2. Convert the resume text into a 384-dimensional vector
    resume_embedding = model.encode([core_text])
    
    # 3. Calculate Cosine Similarity between the resume and all job profiles
    # Cosine similarity measures the angle between vectors (1.0 = identical direction)
    similarities = cosine_similarity(resume_embedding, job_embeddings)[0]
    
    # 4. Format and sort the results
    results = []
    for role, score in zip(job_roles, similarities):
        # Convert score (-1 to 1) to a percentage (0 to 100)
        # Note: SBERT embeddings are usually positive, but we clip to 0 just in case
        match_percentage = round(max(0, float(score)) * 100, 1)
        results.append({
            "role": role,
            "match_score": match_percentage
        })
    
    # Sort by highest score first
    results.sort(key=lambda x: x['match_score'], reverse=True)
    
    # Return the top 3 roles
    return results[:3]
