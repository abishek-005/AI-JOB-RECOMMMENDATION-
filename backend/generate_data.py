import json
import random

# Our target roles
ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Product Manager",
    "AI/ML Engineer",
    "Core Python Developer",
    "Java Developer",
    "System Designer",
    "Non-Tech / Other"
]

# Vocabulary pools for synthetic generation
VOCABULARY = {
    "Frontend Developer": {
        "skills": ["React", "JavaScript", "TypeScript", "Next.js", "Vue.js", "Angular", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Framer Motion", "Webpack"],
        "verbs": ["Developed", "Built", "Designed", "Optimized", "Implemented", "Architected", "Maintained"],
        "nouns": ["user interfaces", "web applications", "responsive layouts", "single-page applications", "UI components", "frontend architectures"]
    },
    "Backend Developer": {
        "skills": ["Python", "Java", "Node.js", "Django", "FastAPI", "Express", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "Docker", "Microservices", "REST APIs", "GraphQL"],
        "verbs": ["Engineered", "Deployed", "Scaled", "Secured", "Built", "Maintained", "Optimized"],
        "nouns": ["server-side logic", "database schemas", "RESTful APIs", "microservices architectures", "authentication systems", "distributed systems"]
    },
    "Data Scientist": {
        "skills": ["Python", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "SQL", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Visualization", "Matplotlib", "Seaborn"],
        "verbs": ["Trained", "Analyzed", "Modeled", "Evaluated", "Visualized", "Cleaned", "Predicted"],
        "nouns": ["predictive models", "neural networks", "large datasets", "statistical models", "A/B tests", "data pipelines", "regression algorithms"]
    },
    "UI/UX Designer": {
        "skills": ["Figma", "Sketch", "Adobe XD", "Illustrator", "Photoshop", "InVision", "Wireframing", "Prototyping", "User Research", "Usability Testing", "Interaction Design"],
        "verbs": ["Designed", "Researched", "Prototyped", "Iterated", "Conducted", "Created", "Sketched"],
        "nouns": ["user journeys", "high-fidelity mockups", "wireframes", "design systems", "user interfaces", "interactive prototypes", "usability studies"]
    },
    "DevOps Engineer": {
        "skills": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "CI/CD", "Linux", "Bash", "Prometheus", "Grafana"],
        "verbs": ["Automated", "Deployed", "Provisioned", "Monitored", "Scaled", "Secured", "Orchestrated"],
        "nouns": ["cloud infrastructure", "deployment pipelines", "kubernetes clusters", "monitoring alerts", "containerized applications", "infrastructure as code"]
    },
    "Product Manager": {
        "skills": ["Agile", "Scrum", "Jira", "Confluence", "Roadmapping", "A/B Testing", "Go-to-market Strategy", "Data Analysis", "User Interviews", "Stakeholder Management"],
        "verbs": ["Led", "Managed", "Prioritized", "Launched", "Analyzed", "Coordinated", "Strategized"],
        "nouns": ["product roadmaps", "sprint cycles", "cross-functional teams", "feature launches", "user requirements", "market research"]
    },
    "AI/ML Engineer": {
        "skills": ["Deep Learning", "PyTorch", "TensorFlow", "Transformers", "LLMs", "NLP", "Computer Vision", "Keras", "HuggingFace", "Model Optimization"],
        "verbs": ["Engineered", "Trained", "Fine-tuned", "Deployed", "Architected", "Optimized", "Researched"],
        "nouns": ["large language models", "neural architectures", "transformer models", "inference pipelines", "generative AI systems"]
    },
    "Core Python Developer": {
        "skills": ["Python", "Asyncio", "Multithreading", "Flask", "Pytest", "FastAPI", "Celery", "SQLAlchemy", "REST APIs", "Data Structures"],
        "verbs": ["Developed", "Optimized", "Refactored", "Maintained", "Automated", "Scripted", "Engineered"],
        "nouns": ["backend services", "concurrent systems", "API endpoints", "automation scripts", "data processing pipelines"]
    },
    "Java Developer": {
        "skills": ["Java", "Spring Boot", "Hibernate", "JVM", "Microservices", "Kafka", "Maven", "Gradle", "JUnit", "Tomcat"],
        "verbs": ["Built", "Engineered", "Deployed", "Scaled", "Maintained", "Architected", "Integrated"],
        "nouns": ["enterprise applications", "microservices architectures", "J2EE platforms", "message queues", "backend logic"]
    },
    "System Designer": {
        "skills": ["System Architecture", "Scalability", "Distributed Systems", "Cloud Architecture", "System Design", "Microservices", "Load Balancing", "Caching"],
        "verbs": ["Designed", "Architected", "Scaled", "Evaluated", "Modeled", "Planned", "Structured"],
        "nouns": ["distributed architectures", "high-availability systems", "system topologies", "scalability strategies", "infrastructure designs"]
    },
    "Non-Tech / Other": {
        "skills": ["Patient Care", "Surgery", "Culinary Arts", "Litigation", "Lesson Planning", "Customer Service", "Accounting", "Public Speaking", "Event Planning", "Sales", "Nursing", "Legal Research", "Food Preparation"],
        "verbs": ["Diagnosed", "Cooked", "Represented", "Taught", "Assisted", "Managed", "Organized", "Treated", "Advised", "Prepared"],
        "nouns": ["patients", "menus", "clients", "students", "financial records", "events", "sales targets", "legal documents", "medical records", "customer inquiries"]
    }
}

def generate_resume(role):
    vocab = VOCABULARY[role]
    
    # Randomly select a subset of skills
    num_skills = random.randint(4, 8)
    selected_skills = random.sample(vocab["skills"], num_skills)
    
    # Generate 3-4 bullet points
    num_bullets = random.randint(3, 4)
    bullets = []
    for _ in range(num_bullets):
        verb = random.choice(vocab["verbs"])
        noun = random.choice(vocab["nouns"])
        skill_used = random.choice(selected_skills)
        bullets.append(f"{verb} {noun} utilizing {skill_used}.")
    
    # Compile into a resume text snippet
    resume_text = (
        f"Experienced professional with a background in {role.lower()} roles.\n"
        f"Core competencies include: {', '.join(selected_skills)}.\n"
        f"Key Achievements:\n"
        + "\n".join([f"- {b}" for b in bullets])
    )
    return resume_text

def main():
    print("Generating synthetic dataset...")
    dataset = []
    SAMPLES_PER_ROLE = 50
    
    for role in ROLES:
        for _ in range(SAMPLES_PER_ROLE):
            resume = generate_resume(role)
            dataset.append({
                "text": resume,
                "label": role
            })
            
    # Shuffle the dataset so it's randomized
    random.shuffle(dataset)
    
    with open('synthetic_data.json', 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=4)
        
    print(f"Successfully generated {len(dataset)} synthetic resumes and saved to 'synthetic_data.json'")

if __name__ == "__main__":
    main()
