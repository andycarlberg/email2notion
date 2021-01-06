import imaplib
from flask import Blueprint, jsonify
from flask_restful import Api, reqparse, Resource

from . import models

bp = Blueprint('notionaccounts', __name__)
api = Api(bp)

parser = reqparse.RequestParser()
parser.add_argument('name')
parser.add_argument('token')


class NotionAccountList(Resource):
    def get(self):
        notionaccounts = models.NotionAccount.query.all()
        return jsonify(notionaccounts)

    def post(self):
        args = parser.parse_args()
        new_notionaccount = models.NotionAccount(
            name=args['name'], token=args['token'])
        models.db.session.add(new_notionaccount)
        models.db.session.commit()
        return jsonify(new_notionaccount)


class NotionAccount(Resource):
    def get(self, notionaccount_id):
        notionaccount = models.NotionAccount.query.get(notionaccount_id)
        return jsonify(notionaccount)

    def put(self, notionaccount_id):
        args = parser.parse_args()

        notionaccount = models.NotionAccount.query.get(notionaccount_id)
        notionaccount.name = args['name']
        notionaccount.token = args['token']
        models.db.session.commit()

        return jsonify(notionaccount)


api.add_resource(NotionAccountList, '/notionaccounts')
api.add_resource(NotionAccount, '/notionaccounts/<notionaccount_id>')
