import random
from faker import Faker
from elasticsearch import Elasticsearch

# Configuration de Elasticsearch avec Authentification
es = Elasticsearch(
    hosts=[{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
    basic_auth=('elastic', 'fbuDidwzJFK9KcF4L1vU')  # Authentification de base
)

index_name = 'wg-offres'

# Assurer que l'index existe
if not es.indices.exists(index=index_name):
    print(f"Index '{index_name}' n'existe pas. Veuillez le créer avant d'exécuter ce script.")
    exit()

# Créer une instance de Faker
fake = Faker()

# Listes de données pour générer les documents
employment_types = ["CDI", "CDD", "Freelance", "Stage", "Alternance"]
origins = ["IHM", "RH", "Finance", "IT", "Marketing"]
skills_list = [
    "Python, Django, Flask",
    "Java, Spring, Hibernate",
    "JavaScript, React, Node.js",
    "C#, .NET, Azure",
    "PHP, Laravel, Symfony",
    "Ruby, Ruby on Rails",
    "AWS, GCP, Azure",
    "DevOps, Docker, Kubernetes",
    "Machine Learning, AI, Data Science",
    "SQL, NoSQL, MongoDB"
]
locations = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Nantes", "Strasbourg", "Montpellier", "Rennes"]
companies = ["Société Générale", "Accenture", "Capgemini", "Atos", "IBM", "Microsoft", "Google", "Amazon", "SAP", "Oracle"]

# Générer 20 documents d'offres
for i in range(22, 44):
    offer_details = {
        "employment_type": random.choice(employment_types),
        "referent": fake.name(),
        "end_service": fake.date_between(start_date='today', end_date='+2y').strftime("%d/%m/%Y"),  # Date formatée en texte
        "origin": random.choice(origins),
        "skills": random.choice(skills_list),
        "start_service": fake.date_between(start_date='today', end_date='+6m').strftime("%d/%m/%Y"),  # Date formatée en texte
        "company": f"Company_{i}",
        "date_fin": fake.date_between(start_date='+1d', end_date='+1y').strftime("%d/%m/%Y"),  # Date formatée en texte
        "id": f"offer_{i}",
        "job_title": fake.job(),
        "date_publication": fake.date_this_year().strftime("%Y-%m-%d"),  # Date formatée en texte
        "date_creation": fake.date_time_this_year().isoformat(),  # Date formatée en texte
        "job_description": fake.text(max_nb_chars=200),
        "user_id": random.randint(1, 10),
        "company_name": random.choice(companies),
        "industries": random.choice(["Finance", "Technologie", "Éducation", "Santé", "Marketing"]),
        "location": random.choice(locations),
        "internal_reference": f"REF-{i}",
        "seniority": random.randint(1, 15),
        "status": random.choice(["new", "in-progress", "closed"])
    }

    try:
        es.index(index=index_name, id=offer_details["id"], body=offer_details)
        print(f"Document with ID '{offer_details['id']}' indexed.")
    except Exception as e:
        print(f"Error indexing document '{offer_details['id']}': {e}")

print("Tous les documents ont été indexés.")
