from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io

import re

app = FastAPI(title="Candidate-Centric Job Rec API", version="1.0")

# Setup CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_text(text: str) -> str:
    # Replace em-dashes and en-dashes with standard hyphens
    text = text.replace('—', '-').replace('–', '-')
    # Replace pipes with spaces
    text = text.replace('|', ' ')
    
    # Remove weird symbols and bullet markers (keeping letters, numbers, spaces, and basic punctuation)
    cleaned = re.sub(r'[^a-zA-Z0-9\s.,@:/\+\-_?!()&%\$*=\[\]\'";]', '', text)
    
    # Normalize whitespaces and filter out empty lines
    lines = []
    for line in cleaned.splitlines():
        # Replace multiple spaces with a single space
        line = re.sub(r'[ \t]+', ' ', line).strip()
        if line:
            lines.append(line)
            
    return '\n'.join(lines)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Job Recommendation API"}

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        extracted_text = ""
        
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        
        cleaned_text = clean_text(extracted_text)
        
        return {
            "filename": file.filename,
            "extracted_text": cleaned_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")
