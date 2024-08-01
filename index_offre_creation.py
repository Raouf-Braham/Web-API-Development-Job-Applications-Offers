import requests

url = "http://localhost:9200/"

headers = {
    "Content-Type": "application/json",
}

offer_details = {
    "employment_type": "CDD, portage, indépendant",
    "referent": "BENAMEUR El Hadi",
    "end_service": "31/12/2025",
    "origin": "IHM",
    "date_update": "2024-01-09T12:24:33.0372",
    "skills": "Terraform, Azure, AWS, Ansible, Jenkins, SonarQube, OWASP ZAP, OWASP Dependency-Check, Kubernetes, Docker, Helm",
    "start_service": "9/1/2024",
    "company": "DGD17YwBo07EFqGYobN2",
    "date_fin": "22/1/2024",
    "id": "D2At7owBo07EFqGY3LP-",
    "job_title": "Chef de projet MOA/Business Analyst",
    "date_publication": "2024-01-08",
    "date_creation": "2024-01-09T12:23:52.3182",
    "job_description": "\nTravaux de Chef de projet MOA/BA sur le périmètre MKT360\n\n• Accompagnement pour assistance et conception dans l'équipe Capteurs Digitaux\n\nPrincipaux livrables : \n\n• Spécifications \n• cahier de recette\n• construction de \nCompétences requises : \n\n• Bonne communication orale et écrite, savoir discuter avec des interlocuteurs PU/PP/CR\n• Maitrise de l'Agile\n• outil Jira serait un plus\n• connaissance du domaine bancaire",
    "user_id": 1,
    "company_name": "ALLIANCE HIGH TECH",
    "industries": "Finance",
    "location": "Paris 12e",
    "internal_reference": "PI-ATOS-24-4",
    "seniority": 8,
    "status": "new"
}

response = requests.put(url+"offre/_doc/1?pretty",headers=headers,json=offer_details,auth=("elastic", "fbuDidwzJFK9KcF4L1vU"))
print(response)


   