import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import cloudinary.uploader
import cloudinary

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



 

# Endpoint para enviar correos
@api.route('/send-email', methods=['POST'])
def send_email():
    data = request.json

    # Validar datos del cliente
    if not data or not all(key in data for key in ("to", "subject", "body")):
        return jsonify({"error": "Faltan datos obligatorios: 'to', 'subject', 'body'"}), 400

    recipient = data['to']
    subject = data['subject']
    body = data['body']

    try:
        # Crear el mensaje de correo
        message = MIMEMultipart()
        message["From"] = os.getenv("EMAIL_USER")
        message["To"] = recipient
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        # Conectarse al servidor SMTP y enviar el correo
        with smtplib.SMTP (os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT")) as server:
            server.starttls()  # Iniciar conexión segura
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.sendmail(os.getenv("EMAIL_USER"), recipient, message.as_string())

        return jsonify({"message": f"Correo enviado a {recipient}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Para subir imagen a Cloudinary
@api.route('/upload-image', methods=['POST'])
def upload_image():
    # Verifico si el archivo está en la solicitud
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']

    # Verifico si el archivo tiene un nombre
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Subir archivo a Cloudinary
        result = cloudinary.uploader.upload(file)
        return jsonify({"url": result['secure_url']}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Subir imagen redimensionada (opcional)
@api.route('/upload-image-resized', methods=['POST'])
def upload_image_resized():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Subir y redimensionar la imagen
        result = cloudinary.uploader.upload(file, transformation=[
            {"width": 300, "height": 300, "crop": "fill"}
        ])
        return jsonify({"url": result['secure_url']}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rutas existentes
@api.route('/user', methods=['GET'])
def handle_user():
    response_body = {
        "message": "Hola, esto trae usuarios"
    }
    return jsonify(response_body), 200

@api.route('/book', methods=['GET'])
def handle_book():
    response_body = {
        "message": "Hola, esto trae libros"
    }
    return jsonify(response_body), 200

@api.route('/place', methods=['GET'])
def handle_place():
    response_body = {
        "message": "Hola, esto trae locales"
    }
    return jsonify(response_body), 200

@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    response_body = {
        "message": "Hola, esto trae un usuario"
    }
    return jsonify(response_body), 200

@api.route('/book/<int:id>', methods=['GET'])
def get_book(id):
    response_body = {
        "message": "Hola, esto trae un libro"
    }
    return jsonify(response_body), 200

@api.route('/place/<int:id>', methods=['GET'])
def get_place(id):
    response_body = {
        "message": "Hola, esto trae un local"
    }
    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def add_user():
    response_body = {
        "message": "Hola, esto sube usuarios"
    }
    return jsonify(response_body), 200

@api.route('/book', methods=['POST'])
def add_book():
    response_body = {
        "message": "Hola, esto sube libros"
    }
    return jsonify(response_body), 200

@api.route('/place', methods=['POST'])
def add_place():
    response_body = {
        "message": "Hola, esto sube locales"
    }
    return jsonify(response_body), 200

@api.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    response_body = {
        "message": "Hola, esto actualiza un usuario"
    }
    return jsonify(response_body), 200

@api.route('/book/<int:id>', methods=['PUT'])
def upgrade_book(id):
    response_body = {
        "message": "Hola, esto actualiza un libro"
    }
    return jsonify(response_body), 200

@api.route('/place/<int:id>', methods=['PUT'])
def upgrade_place(id):
    response_body = {
        "message": "Hola, esto actualiza un local"
    }
    return jsonify(response_body), 200

@api.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    response_body = {
        "message": "Hola, esto elimina un usuario"
    }
    return jsonify(response_body), 200

@api.route('/book/<int:id>', methods=['DELETE'])
def delete_book(id):
    response_body = {
        "message": "Hola, esto elimina un libro"
    }
    return jsonify(response_body), 200

@api.route('/place/<int:id>', methods=['DELETE'])
def delete_place(id):
    response_body = {
        "message": "Hola, esto elimina un local"
    }
    return jsonify(response_body), 200


