from flask import Flask, request, json, render_template, make_response, session,redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_restful import marshal, fields
from flask_cors import CORS
from random import randint
import os
import jwt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:bismillah@localhost:5432/Library'
app.config['SECRET_KEY'] = os.urandom(24)
CORS(app)
db = SQLAlchemy(app)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String())
    password = db.Column(db.String())

class Book(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name_book = db.Column(db.String())
    category = db.Column(db.String())

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String())
    phone = db.Column(db.String())
    name_book = db.Column(db.String())
    start = db.Column(db.String())
    end = db.Column(db.String())

@app.route('/')
def test():
    return 'Masuk Pa Eko'

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        request_data = request.get_json()
        req_email = request_data.get('email')
        req_password = request_data.get('password')
        adminDB = Admin.query.filter_by(email=req_email, password=req_password).first()

        if adminDB is not None:
            payload = {
                'email' : adminDB.email,
                'rahasia' : 'secret'
            }

            encoded = jwt.encode(payload, 'lalala', algorithm='HS256')
            return encoded, 200

        else:
            respons = {
                'sukses' : False,
                'message' : 'Email and password did not match'
            }
            respons = json.dumps(respons)
            return respons, 404

    else:
        respons = {
            'sukses' : False,
            'message' : 'Method not allowed'
        }
        respons = json.dumps(respons)
        return respons, 405

@app.route('/addBook', methods = ['POST'])
def add_book():
    # try:
    #     decoded = jwt.decode(request.headers["Authorization"], 'lalala', algorithms=['HS256'])
    #     if decoded['rahasia'] != 'secret':
    #         respons = {
    #             'sukses': False,
    #             'message': 'You have to logged in'
    #         }
    #         respons = json.dumps(respons)
    #         return respons, 400
    # except jwt.exceptions.DecodeError:
    #     respons = {
    #             'sukses': False,
    #             'message': 'You have to logged in'
    #         }
    #     respons = json.dumps(respons)
    #     return respons, 400

    if request.method == 'POST':
        request_data = request.get_json()

        bookDB = Book.query.filter_by(name_book=request_data.get('name_book')).first()

        if bookDB is None:
            send_data = Book(
                name_book = request_data.get('name_book'),
                category = request_data.get('category')
            )

            db.session.add(send_data)
            db.session.commit()

            respons = {
                'sukses':True,
                'message': 'Add Book Success'
            }
            respons = json.dumps(respons)
            return respons, 200
        
        else:
            respons = {
                'sukses' : False,
                'message' : 'Book already exist'
            }
            respons = json.dumps(respons)
            return respons, 400
        
    else:
        respons = {
            'sukses' : False,
            'message' : 'Method not Allowed'
        }
        respons = json.dumps(respons)
        return respons, 405

@app.route('/allbook')
def get_book():
    allbook = Book.query.all()
    book_json = {
        'id' : fields.Integer,
        'name_book' : fields.String,
        'category' : fields.String
    }
    return json.dumps(marshal(allbook, book_json)), 200

@app.route('/submitborrower', methods = ['POST'])
def submitBorrowe():
    if request.method == 'POST':

        request_data = request.get_json()
        name = request_data.get('name')
        phone = request_data.get('phone')
        name_book = request_data.get('name_book')
        start = request_data.get('start')
        end = request_data.get('end')

        newBorrowing = Loan(
            name = name,
            phone = phone,
            name_book = name_book,
            start = start,
            end = end
        )

        db.session.add(newBorrowing)
        db.session.commit()

        return 'Success', 200
    else:
        return 'Method Not Allowed', 405


if __name__ == '__main__':
    app.run(debug=True)

