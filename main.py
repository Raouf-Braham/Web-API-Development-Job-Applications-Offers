from flask import Flask, render_template, request, jsonify, redirect
from elasticsearch import Elasticsearch, exceptions
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import time

app = Flask(__name__)
es = Elasticsearch(
    hosts=[{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
    basic_auth=('elastic', 'fbuDidwzJFK9KcF4L1vU')
)

index_name = "wg-offres"
applications_index_name = "job_applications"
app.config['UPLOADS_DIRECTORY'] = 'uploads/'

# Ensure the directory exists
if not os.path.exists(app.config['UPLOADS_DIRECTORY']):
    os.makedirs(app.config['UPLOADS_DIRECTORY'])

@app.route('/', methods=['GET', 'POST'])
def index():
    page = request.args.get('page', 1, type=int)
    size = 10  # Number of jobs per page
    start = (page - 1) * size

    filter_name = request.form.get('filter_name')
    filter_value = request.form.get('filter_value')

    # Retrieve search term from POST request form data
    search = request.form.get('search', '')  # Default to an empty string if not provided

    if search:
        # Search body for fetching paginated results
        search_body = {
            "query": {
                "match": {
                    "job_title": {
                        "query": search,
                        "fuzziness": "AUTO"  # Optional: for partial matches
                    }
                }
            },
            "from": start,
            "size": size
        }

        # Count query to get the total number of documents
        count_body = {
            "query": {
                "match": {
                    "job_title": {
                        "query": search,
                        "fuzziness": "AUTO"  # Optional: for partial matches
                    }
                }
            }
        }

        search_query_display = f'{search}'
        
    else :
        # Search body for fetching paginated results
        search_body = {
            "query": {"match_all": {}},
            "from": start,
            "size": size
        }
        

        # Count query to get the total number of documents
        count_body = {
            "query": {"match_all": {}}
        }

        search_query_display = 'Tous les emplois'
    
    
    try:
        rep = es.search(index=index_name, body=search_body)
        count_rep = es.count(index=index_name, body=count_body)
    except Exception as e:
        print(f"Elasticsearch error: {e}")
        return jsonify({'error': 'Elasticsearch query failed'}), 500

    total_jobs = count_rep['count']
    total_pages = (total_jobs + size - 1) // size  # Ceiling division

    # Process job_description to replace '\n' with '<br>'
    for hit in rep['hits']['hits']:
        if 'job_description' in hit['_source']:
            hit['_source']['job_description'] = hit['_source']['job_description'].replace('\n', '<br>')

    no_results = total_jobs == 0

    return render_template('offres_table.html', response=rep, page=page, total_pages=total_pages, search=search, total_jobs=total_jobs, search_query_display=search_query_display, no_results=no_results)


@app.route('/job-details', methods=['POST'])
def job_details():
    job_id = request.form.get('job_id')

    print(f"Received job_id: {job_id}")

    search_body = {
        "query": {
            "term": {"_id": job_id}
        }
    }

    try:
        rep = es.search(index="wg-offres", body=search_body)
    except Exception as e:
        print(f"Elasticsearch error: {e}")
        return jsonify({'error': 'Elasticsearch query failed'}), 500

    if rep['hits']['total']['value'] > 0:
        job = rep['hits']['hits'][0]['_source']
        return jsonify(job)
    else:
        return jsonify({'error': 'Job not found'}), 404


@app.route('/locations', methods=['GET'])
def locations():
    try:
        # Fetch all documents with the location field
        search_body = {
            "_source": ["location"],
            "size": 10000  # Adjust size as needed
        }

        response = es.search(index=index_name, body=search_body)
        
        # Extract locations from the search results
        locations = [hit['_source'].get('location', '') for hit in response['hits']['hits']]
        
        # Remove duplicates by converting the list to a set
        unique_locations = list(set(locations))
        
        # Debugging: Print out the unique locations to check
        print(f"Unique Locations Response: {unique_locations}")

        return jsonify(unique_locations)
    except Exception as e:
        print(f"Elasticsearch error: {e}")
        return jsonify({'error': 'Elasticsearch query failed'}), 500





@app.route('/job-application', methods=['POST'])
def job_application():
    # Extract form data
    firstname = request.form.get('firstname')
    lastname = request.form.get('lastname')
    email = request.form.get('email')
    gender = request.form.get('occupation')
    phone = request.form.get('phone')
    job_name = request.form.get('job-name-application')
    dob = request.form.get('dob')
    address = request.form.get('address')
    message = request.form.get('message')

    # Handle file upload
    resume = request.files.get('upload')
    message_type = 'success'
    message_content = 'Votre candidature a été envoyée avec succès !'
    icon_type = 'success'

    if resume and resume.filename:
        try:
            resume_path = os.path.join(app.config['UPLOADS_DIRECTORY'], secure_filename(resume.filename))
            resume.save(resume_path)
        except Exception as e:
            message_type = 'error'
            message_content = f"Erreur lors de l'enregistrement du fichier : {str(e)}"
            icon_type = 'error'
    else:
        message_type = 'error'
        message_content = "Impossible de télécharger un fichier vide, le champ CV est requis."
        icon_type = 'error'

    # Validate and format the date
    formatted_dob = None
    if dob:
        try:
            formatted_dob = datetime.strptime(dob, '%Y-%m-%d').strftime('%Y-%m-%d')
        except ValueError:
            return jsonify({"message_type": "error", "message_content": "Format de date invalide.", "icon_type": "error"}), 400

    # Prepare document for Elasticsearch
    doc = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "gender": gender,
        "phone": phone,
        "position": job_name,
        "start_date": formatted_dob,
        "address": address,
        "cover_letter": message,
        "resume": resume_path
    }

    # Index the document in Elasticsearch
    try:
        es.index(index=applications_index_name, document=doc)
    except exceptions.RequestError as e:
        message_type = 'error'
        message_content = 'Erreur lors de l\'indexation du document.'
        icon_type = 'error'
        return jsonify({"message_type": message_type, "message_content": message_content, "icon_type": icon_type}), 500

    time.sleep(3)
    return redirect('/')

if __name__ == "__main__":
    app.run(debug=True)
