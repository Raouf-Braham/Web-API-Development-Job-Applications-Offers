from elasticsearch import Elasticsearch, exceptions

# Initialize the Elasticsearch client
es = Elasticsearch(['http://localhost:9200'])

# Index name
index_name = 'job_applications'

# Define the mapping for the index
mapping = {
    "mappings": {
        "properties": {
            "firstname": {
                "type": "text"
            },
            "lastname": {
                "type": "text"
            },
            "email": {
                "type": "keyword"  # Use "keyword" for exact match
            },
            "gender": {
                "type": "keyword"  # Use "keyword" for gender values
            },
            "phone": {
                "type": "text"  # Phone numbers can be stored as text
            },
            "position": {
                "type": "text"  # Applying for position
            },
            "start_date": {
                "type": "date",  # When can the applicant start
                "format": "yyyy-MM-dd"  # Define the date format
            },
            "address": {
                "type": "text"
            },
            "cover_letter": {
                "type": "text"
            },
            "resume": {
                "type": "text"  # Storing URL or path to the resume
            }
        }
    }
}

try:
    # Check if the index already exists
    if es.indices.exists(index=index_name):
        print(f"Index '{index_name}' already exists.")
    else:
        # Create the index with the specified mapping
        es.indices.create(index=index_name, body=mapping)
        print(f"Index '{index_name}' created successfully.")
except exceptions.RequestError as e:
    print(f"Error creating index: {e.info}")

# Example of indexing a document (you can comment this out if not needed)
doc = {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "gender": "male",
    "phone": "123-456-7890",
    "position": "Software Engineer",
    "start_date": "2024-09-01",
    "address": "123 Main St, Anytown, USA",
    "cover_letter": "I am excited to apply for the Software Engineer position...",
    "resume": "URL_to_the_resume.pdf"  # Replace with actual file URL if needed
}

try:
    # Index the document
    es.index(index=index_name, document=doc)
    print("Document indexed successfully.")
except exceptions.RequestError as e:
    print(f"Error indexing document: {e.info}")
