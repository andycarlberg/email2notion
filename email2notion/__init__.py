import os

from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True,
                static_folder="../frontend/build/static", template_folder='../frontend/build')
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:////tmp/email2notion.db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import models
    models.init_app(app)

    from . import mailserver
    app.register_blueprint(mailserver.bp)

    from . import notionaccount
    app.register_blueprint(notionaccount.bp)

    from . import foldermapping
    app.register_blueprint(foldermapping.bp)

    @app.route('/')
    def index():
        return app.render_template('index.html')

    return app
