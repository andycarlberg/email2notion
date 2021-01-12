import imaplib
from flask import Blueprint, jsonify
from flask_restful import Api, reqparse, Resource

from . import models

bp = Blueprint('foldermappings', __name__)
api = Api(bp)

parser = reqparse.RequestParser()
parser.add_argument('src_mailserver', type=int)
parser.add_argument('src_mailbox')
parser.add_argument('dest_notionaccount', type=int)
parser.add_argument('dest_page')


class FolderMappingList(Resource):
    def get(self):
        foldermappings = models.FolderMapping.query.all()
        return jsonify(foldermappings)

    def post(self):
        args = parser.parse_args()
        new_foldermapping = models.FolderMapping(
            src_mailserver=args['src_mailserver'], src_mailbox=args['src_mailbox'], dest_notionaccount=args['dest_notionaccount'], dest_page=args['dest_page'])
        models.db.session.add(new_foldermapping)
        models.db.session.commit()
        return jsonify(new_foldermapping)


class FolderMapping(Resource):
    def get(self, foldermapping_id):
        foldermapping = models.FolderMapping.query.get(foldermapping_id)
        return jsonify(foldermapping)

    def put(self, foldermapping_id):
        args = parser.parse_args()

        print(args)
        foldermapping = models.FolderMapping.query.get(foldermapping_id)
        foldermapping.src_mailserver = args['src_mailserver']
        foldermapping.src_mailbox = args['src_mailbox']
        foldermapping.dest_notionaccount = args['dest_notionaccount']
        foldermapping.dest_page = args['dest_page']
        models.db.session.commit()

        return jsonify(foldermapping)


api.add_resource(FolderMappingList, '/foldermappings')
api.add_resource(FolderMapping, '/foldermappings/<foldermapping_id>')
