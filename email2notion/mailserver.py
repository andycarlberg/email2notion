import imaplib
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


class MailserverList(Resource):
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


class Mailserver(Resource):
    def get(self, mailserver_id):
        mailserver = models.Mailserver.query.get(mailserver_id)
        return jsonify(mailserver)

    def put(self, mailserver_id):
        args = parser.parse_args()

        mailserver = models.Mailserver.query.get(mailserver_id)
        mailserver.name = args['name']
        mailserver.host = args['host']
        mailserver.port = args['port']
        mailserver.user = args['user']
        mailserver.passw = args['passw']
        models.db.session.commit()

        return jsonify(mailserver)


class MailserverMailboxList(Resource):
    def get(self, mailserver_id):
        mailserver = models.Mailserver.query.get(mailserver_id)

        imap = imaplib.IMAP4_SSL(mailserver.host, mailserver.port)
        imap.login(mailserver.user, mailserver.passw)

        imap_mailboxes = imap.list()[1]
        mailboxes = []
        for imap_mailbox in imap_mailboxes:
            mailbox_name = imap_mailbox.decode().split(' "/" ')[1].strip('\"')
            mailboxes.append(mailbox_name)

        imap.logout()

        return mailboxes


api.add_resource(MailserverList, '/mailservers')
api.add_resource(Mailserver, '/mailservers/<mailserver_id>')
api.add_resource(MailserverMailboxList,
                 '/mailservers/<mailserver_id>/mailboxes')
