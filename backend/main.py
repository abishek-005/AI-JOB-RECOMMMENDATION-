from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io

import re

app = FastAPI(title="Candidate-Centric Job Rec API", version="1.0")

# Setup CORS to allow requests from the Next.js frontend (Local and Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins, necessary for Vercel deployment if domain isn't known
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
            num_pages = len(pdf.pages)
            if num_pages > 2:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Warning: Your resume is {num_pages} pages long. Recruiters and ATS systems strongly prefer 1-2 page resumes. A long resume negatively impacts your placement chances. Please condense it and try again."
                )

            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        
        cleaned_text = clean_text(extracted_text)
        
        # 3. Call the SBERT ML Engine to predict roles
        from ml_engine import predict_roles
        prediction_output = predict_roles(cleaned_text)
        
        return {
            "filename": file.filename,
            "page_count": num_pages,
            "is_eligible": prediction_output["is_eligible"],
            "predicted_roles": prediction_output["predicted_roles"],
            "extracted_text": cleaned_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")
