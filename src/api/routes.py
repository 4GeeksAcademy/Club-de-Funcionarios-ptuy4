"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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
def add_user(id):

    response_body = {
        "message": "Hola, esto sube usuarios"
    }

    return jsonify(response_body), 200

@api.route('/book/<int:id>', methods=['GET'])
def hadd_book(id):

    response_body = {
        "message": "Hola, esto sube libros"
    }

    return jsonify(response_body), 200


@api.route('/place/<int:id>', methods=['GET'])
def add_place(id):

    response_body = {
        "message": "Hola, esto sube locales"
    }

    return jsonify(response_body), 200




@api.route('/user', methods=['POST'])
def add_user():

    response_body = {
        "message": "Hola, esto sube usuarios"
    }

    return jsonify(response_body), 200

@api.route('/book', methods=['POST'])
def hadd_book():

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
        "message": "Hola, esto eactualiza un usuario"
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
        "message": "Hola, esto sube locales"
    }

    return jsonify(response_body), 200
