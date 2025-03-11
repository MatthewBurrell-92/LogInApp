from flask import Flask, request, jsonify
from flask_cors import CORS
from bcrypt import hashpw, gensalt

app = Flask(__name__)
CORS(app, resources={r"/hash_password": {"origins": "http://localhost:3000"}})

print("things")

@app.route('/hash_password', methods=['POST'])
def hash_password():
    data = request.get_json()
    password = data['password'].encode('utf-8')
    print(f"Not hashed: {password}")
    hashed_password = hashpw(password, gensalt())
    print(f"Hashed: {hashed_password}")
    return jsonify(hashed_password=hashed_password.decode('utf-8'))

if __name__ == '__main__':
    app.run(port=5000)