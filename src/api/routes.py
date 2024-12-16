import os
import smtplib
import string
import random
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Book, Location, Schedule 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import cloudinary.uploader
import cloudinary
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash



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
def get_users():
    users = User.query.all()
    result = [{"user_id": user.user_id, "full_name": user.full_name, "email": user.email, "is_active": user.is_active, "image_url":user.image_url, "is_admin":user.is_admin} for user in users]
    return jsonify(result), 200

@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user:
        result = {"user_id": user.user_id, "full_name": user.full_name, "email": user.email, "is_active": user.is_active, "is_admin":user.is_admin, "image_url":user.image_url}
        return jsonify(result), 200
    return jsonify({"error": "User not found"}), 404

@api.route('/user/<string:email>', methods=['GET'])
def get_user_by_email(email):
    # Buscar al usuario por su email
    user = User.query.filter_by(email=email).first()
    if user:
        # Construir la respuesta con los datos del usuario
        result = {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "image_url": user.image_url
        }
        return jsonify(result), 200
    # Devolver error si no se encuentra el usuario
    return jsonify({"error": "User not found"}), 404


@api.route('/user', methods=['POST'])
def add_user():
    data = request.get_json()
    
    # Validación básica
    if not data.get('full_name') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing required fields"}), 400
    
    password = data.get('password')
    hashed_password = generate_password_hash(data.get('password'))
    
    # Crear nuevo usuario
    new_user = User(
        full_name=data.get('full_name'),
        email=data.get('email'),
        password=hashed_password,
        image_url=data.get('image_url'),
        is_active=data.get('is_active', True),  # Default True if not provided
        is_admin=data.get('is_admin', False)   # Default False if not provided
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User added successfully", "user_id": new_user.user_id}), 201

@api.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    user.full_name = data.get('full_name', user.full_name)
    user.email     = data.get('email', user.email)
    user.password  = data.get('password', user.password)
    user.image_url = data.get('image_url', user.image_url)
    user.is_admin  = data.get('is_admin', user.is_admin)
    user.is_active = data.get('is_active', user.is_active)
    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

@api.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@api.route('/book', methods=['GET'])
def get_books():
    books = Book.query.all()
    result = [{"book_id": book.book_id, "title": book.title, "author": book.author, "is_active": book.is_active} for book in books]
    return jsonify(result), 200

@api.route('/book/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get(id)
    if book:
        result = {"book_id": book.book_id, "title": book.title, "author": book.author, "is_active": book.is_active}
        return jsonify(result), 200
    return jsonify({"error": "Book not found"}), 404

@api.route('/book', methods=['POST'])
def add_book():
    data = request.get_json()
    new_book = Book(title=data.get('title'), author=data.get('author'))
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully", "book_id": new_book.book_id}), 201

@api.route('/book/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.is_active = data.get('is_active', book.is_active)
    db.session.commit()
    return jsonify({"message": "Book updated successfully"}), 200

@api.route('/book/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200


@api.route('/place', methods=['GET'])
def get_places():
    locations = Location.query.all()
    result = [{"location_id": loc.location_id, "name": loc.name, "capacity": loc.capacity, "address": loc.address, "is_active": loc.is_active, "image_url": loc.image_url} for loc in locations]
    return jsonify(result), 200

@api.route('/place/<int:id>', methods=['GET'])
def get_place(id):
    location = Location.query.get(id)
    if location:
        result = {"location_id": location.location_id, "name": location.name, "capacity": location.capacity, "address": location.address, "is_active": location.is_active, "image_url": location.image_url}
        return jsonify(result), 200
    return jsonify({"error": "Location not found"}), 404

@api.route('/place', methods=['POST'])
def add_place():
    data = request.get_json()
    new_location = Location(
        name=data.get('name'),
        capacity=data.get('capacity'),
        address=data.get('address'),
        image_url=data.get('image_url')
        )
    db.session.add(new_location)
    db.session.commit()
    return jsonify({"message": "Location added successfully", "location_id": new_location.location_id}), 201

@api.route('/place/<int:id>', methods=['PUT'])
def update_place(id):
    location = Location.query.get(id)
    if not location:
        return jsonify({"error": "Location not found"}), 404
    data = request.get_json()
    location.name = data.get('name', location.name)
    location.capacity = data.get('capacity', location.capacity)
    location.address = data.get('address', location.address)
    location.image_url = data.get('image_url', location.image_url)
    location.is_active = data.get('is_active', location.is_active)
    db.session.commit()
    return jsonify({"message": "Location updated successfully"}), 200

@api.route('/place/<int:id>', methods=['DELETE'])
def delete_place(id):
    location = Location.query.get(id)
    if not location:
        return jsonify({"error": "Location not found"}), 404
    db.session.delete(location)
    db.session.commit()
    return jsonify({"message": "Location deleted successfully"}), 200

@api.route('/schedule', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    result = [
        {
            "schedule_id": schedule.schedule_id,
            "user_id": schedule.user_id,
            "book_id": schedule.book_id,
            "location_id": schedule.location_id,
            "start_time": schedule.start_time.isoformat(),
            "end_time": schedule.end_time.isoformat(),
            "status": schedule.status,
            "created_at": schedule.created_at.isoformat(),
        }
        for schedule in schedules
    ]
    return jsonify(result), 200


@api.route('/schedule/<int:id>', methods=['GET'])
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule:
        result = {
            "schedule_id": schedule.schedule_id,
            "user_id": schedule.user_id,
            "book_id": schedule.book_id,
            "location_id": schedule.location_id,
            "start_time": schedule.start_time.isoformat(),
            "end_time": schedule.end_time.isoformat(),
            "status": schedule.status,
            "created_at": schedule.created_at.isoformat(),
        }
        return jsonify(result), 200
    return jsonify({"error": "Schedule not found"}), 404

@api.route('/schedule/user/<int:user_id>', methods=['GET'])
def get_schedules_by_user(user_id):
    schedules = (
        db.session.query(
            Schedule,
            Book.title.label("book_title"),
            Location.name.label("location_name")
        )
        .outerjoin(Book, Schedule.book_id == Book.book_id)
        .outerjoin(Location, Schedule.location_id == Location.location_id)
        .filter(Schedule.user_id == user_id, Schedule.status != "cancelado")
        .all()
    )

    if schedules:
        results = []
        for schedule, book_title, location_name in schedules:
            results.append({
                "schedule_id": schedule.schedule_id,
                "user_id": schedule.user_id,
                "book_id": schedule.book_id,
                "location_id": schedule.location_id,
                "start_time": schedule.start_time.isoformat(),
                "end_time": schedule.end_time.isoformat(),
                "status": schedule.status,
                "created_at": schedule.created_at.isoformat(),
                "book_title": book_title,
                "location_name": location_name,
            })
        return jsonify(results), 200

    return jsonify({"error": "No schedules found for this user"}), 404

@api.route('/schedule', methods=['POST'])
def add_schedule():
    data = request.get_json()
    user_id = data.get('user_id')
    book_id = data.get('book_id')
    location_id = data.get('location_id')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    status = data.get('status')

    if not user_id or not start_time or not end_time:
        return jsonify({"error": "Missing required fields"}), 400

    from datetime import datetime
    try:
        start_time = datetime.fromisoformat(start_time.replace("Z", ""))
        end_time = datetime.fromisoformat(end_time.replace("Z", ""))
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    new_schedule = Schedule(
        user_id=user_id,
        book_id=book_id,
        location_id=location_id,
        start_time=start_time,
        end_time=end_time,
        status=status,
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({"message": "Schedule added successfully", "schedule_id": new_schedule.schedule_id}), 201


@api.route('/schedule/<int:id>', methods=['PUT'])
def update_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404

    data = request.get_json()
    if 'user_id' in data:
        schedule.user_id = data['user_id']
    if 'book_id' in data:
        schedule.book_id = data['book_id']
    if 'location_id' in data:
        schedule.location_id = data['location_id']
    if 'start_time' in data:
        from datetime import datetime
        try:
            schedule.start_time = datetime.fromisoformat(data['start_time'])
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
    if 'end_time' in data:
        try:
            schedule.end_time = datetime.fromisoformat(data['end_time'])
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
    if 'status' in data:
        schedule.status = data['status']

    db.session.commit()
    return jsonify({"message": "Schedule updated successfully"}), 200


@api.route('/schedule/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200

#Login

@api.route('/login', methods=['POST'])
def login():
    body = request.json
    email = body.get("email", None)
    password = body.get("password", None)
    user = User.query.filter_by(email=email).one_or_none()

    if user == None:
        return jsonify ({"msg":"Bad email or password"}), 401
    
    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401
    
    access_token = create_access_token(identity=user.email)
    return jsonify ({
        "token": access_token,
        "user": {
            "id": user.user_id,
            "email": user.email,
            "name": user.full_name,
            "is_admin": user.is_admin
        }    
        }), 201



@api.route('/recover-password', methods=['PUT'])
def recoverPassword():
    def generate_random_password(length=10):
        # Generar una contraseña aleatoria con caracteres alfanuméricos y de puntuación
        characters = string.ascii_letters + string.digits + string.punctuation
        return ''.join(random.choice(characters) for i in range(length))

    # Obtener el correo desde la solicitud JSON
    body = request.json
    email = body.get("email")

    # Validar que se ha proporcionado un correo
    if not email:
        return jsonify({"error": "Please enter a valid email"}), 400
    
    # Buscar al usuario con ese correo
    user = User.query.filter_by(email=email).one_or_none()

    # Si no se encuentra al usuario, enviar mensaje de error
    if user is None:
        return jsonify({"msg": "User doesn't exist"}), 404

    # Generar una nueva contraseña aleatoria
    new_password = generate_random_password()

    
    # Encriptar la nueva contraseña antes de guardarla
    hashed_password = generate_password_hash(new_password)

    # Actualizar la contraseña del usuario en la base de datos
    user.password = hashed_password
    db.session.commit()

    email_data = {
        'to': email,
        'subject': 'Recuperación de contraseña',
        'body': f"Tu nueva contraseña es: {new_password}. No olvides cambiarla después de iniciar sesión."
    }

    try:
        # Hacer la solicitud POST a tu API de correo
        response = requests.post(f"{os.getenv('BACKEND_URL')}/api/send-email", json=email_data)

        
        if response.status_code == 200:
            return jsonify({"msg": "Correo enviado con la nueva contraseña"}), 200
        else:
           
            return jsonify({"error": "Error al enviar el correo"}), 500

    except Exception as e:
        return jsonify({"error": f"Error al enviar el correo: {str(e)}"}), 500
    
    #return jsonify({"message": "Password reovery succesefuly"}), 200
    # Datos para el correo        

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200

