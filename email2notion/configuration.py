import imaplib
from flask import Blueprint, jsonify
from flask_restful import abort, Api, reqparse, Resource

from . import models
from . import scheduler
from . import email2notion

bp = Blueprint('configuration', __name__)
api = Api(bp)

parser = reqparse.RequestParser()
parser.add_argument('check_freq')


def get_configuration():
    mailserver = models.Mailserver.query.first()
    notionaccount = models.NotionAccount.query.first()
    foldermapping = models.FolderMapping.query.first()

    return mailserver, notionaccount, foldermapping


class Configuration(Resource):
    def get(self):
        configuration = models.Configuration.query.first()
        if configuration:
            return jsonify(configuration)
        else:
            abort(404, message="Configuration doesn't exist")

    def post(self):
        args = parser.parse_args()
        configuration = models.Configuration.query.first()

        if configuration:
            configuration.check_freq = args['check_freq']
            models.db.session.commit()
        else:
            configuration = models.Configuration(
                check_freq=args['check_freq'])
            models.db.session.add(configuration)
            models.db.session.commit()

        # scheduler freq is stored as ##m or #m
        # Drop the 'm' before parsing the int
        scheduler_minutes = int(configuration.check_freq[:-1])
        mailserver, notionaccount, foldermapping = get_configuration()
        job_args = mailserver, foldermapping.src_mailbox, notionaccount, foldermapping.dest_page
        scheduler.scheduler.add_job(email2notion.import_pages, "interval", args=job_args, id='process_emails',
                                    coalesce=True, max_instances=1, minutes=scheduler_minutes, replace_existing=True)

        return jsonify(configuration)


class Process(Resource):
    def get(self):
        mailserver, notionaccount, foldermapping = get_configuration()
        email2notion.import_pages(
            mailserver, foldermapping.src_mailbox, notionaccount, foldermapping.dest_page)
        return jsonify({"message": "Success!"})


api.add_resource(Configuration, '/configuration')
api.add_resource(Process, '/process')
