from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')
mail = Mail(app)
s = URLSafeTimedSerializer('your-secret-key')

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/musicApp')
mongo = MongoClient(MONGO_URI)
db = mongo.get_database()
users_collection = db['users']

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email requerido'}), 400

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    token = s.dumps(email, salt='reset-password')
    link = f'http://localhost:4200/reset-password/{token}'

    msg = Message('Restablece tu contraseña', recipients=[email])
    msg.body = f'Para restablecer tu contraseña, haz clic en el siguiente enlace:\n{link}'
    try:
        mail.send(msg)
        return jsonify({'message': 'Correo enviado'})
    except Exception as e:
        print('Error sending email:', e)
        return jsonify({'message': 'Error enviando el correo', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)