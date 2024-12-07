from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'anda_user'
    user_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)  
    password = db.Column(db.String(50), nullable=False, unique=False)
    image_url = db.Column(db.String(250), nullable=True, unique=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    schedules = db.relationship('Schedule', back_populates='user')  # One-to-Many with Schedule


class Book(db.Model):
    __tablename__ = 'book'
    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    schedules = db.relationship('Schedule', back_populates='book')  # One-to-Many with Schedule


class Location(db.Model):
    __tablename__ = 'location'
    location_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(250), nullable=True, unique=False)
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    schedules = db.relationship('Schedule', back_populates='location')  # One-to-Many with Schedule


class Schedule(db.Model):
    __tablename__ = 'schedule'
    schedule_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('anda_user.user_id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'), nullable=True)
    location_id = db.Column(db.Integer, db.ForeignKey('location.location_id'), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=db.func.now())

    # Relationships
    user = db.relationship('User', back_populates='schedules')  # Many-to-One with User
    book = db.relationship('Book', back_populates='schedules')  # Many-to-One with Book
    location = db.relationship('Location', back_populates='schedules')  # Many-to-One with Location
