from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def init_app(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()


@dataclass
class Mailserver(db.Model):
    id: int
    name: str
    host: str
    port: str
    user: str
    passw: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    host = db.Column(db.Text, nullable=False)
    port = db.Column(db.Text, nullable=False)
    user = db.Column(db.Text, nullable=False)
    passw = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return '<Mailserver %r>' % self.name


@dataclass
class NotionAccount(db.Model):
    id: int
    name: str
    token: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    token = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return '<NotionAccount %r>' % self.name
