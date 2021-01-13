import imaplib
from flask import Blueprint, jsonify
from flask_restful import abort, Api, reqparse, Resource

from . import models

bp = Blueprint('configuration', __name__)
api = Api(bp)

parser = reqparse.RequestParser()
parser.add_argument('check_freq')


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

        return jsonify(configuration)


class Process(Resource):
    def get(self):
        print("Checking for new pages")
        return jsonify({"message": "Success!"})


api.add_resource(Configuration, '/configuration')
api.add_resource(Process, '/process')
