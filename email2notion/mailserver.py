from flask import Blueprint, jsonify
from flask_restful import Api, reqparse, Resource

from . import models

bp = Blueprint('mailservers', __name__)
api = Api(bp)

parser = reqparse.RequestParser()
parser.add_argument('name')
parser.add_argument('host')
parser.add_argument('port')
parser.add_argument('user')
parser.add_argument('passw')


class MailServer(Resource):
    def get(self, mailserver_id):
        return {'name': 'My First Mailserver'}

    def put(self, mailserver_id):
        args = parser.parse_args()
        return {'name': args['name']}


class MailServerList(Resource):
    def get(self):
        mailservers = models.Mailserver.query.all()
        return jsonify(mailservers)

    def post(self):
        args = parser.parse_args()
        new_mailserver = models.Mailserver(
            name=args['name'], host=args['host'], port=args['port'], user=args['user'], passw=args['passw'])
        models.db.session.add(new_mailserver)
        models.db.session.commit()
        return jsonify(new_mailserver)


api.add_resource(MailServerList, '/mailservers')
api.add_resource(MailServer, '/mailservers/<mailserver_id>')
