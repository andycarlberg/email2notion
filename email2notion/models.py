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
    folder_mappings: list

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    host = db.Column(db.Text, nullable=False)
    port = db.Column(db.Text, nullable=False)
    user = db.Column(db.Text, nullable=False)
    passw = db.Column(db.Text, nullable=False)
    folder_mappings = db.relationship(
        'FolderMapping', backref='mailserver', lazy=True)

    def __repr__(self):
        return '<Mailserver %r>' % self.name


@dataclass
class NotionAccount(db.Model):
    id: int
    name: str
    token: str
    folder_mappings: list

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    token = db.Column(db.Text, nullable=False)
    folder_mappings = db.relationship(
        'FolderMapping', backref='notionaccount', lazy=True)

    def __repr__(self):
        return '<NotionAccount %r>' % self.name


@dataclass
class FolderMapping(db.Model):
    id: int
    src_mailserver: int
    src_mailbox: str
    dest_notionaccount: int
    dest_page: str

    id = db.Column(db.Integer, primary_key=True)
    src_mailserver = db.Column(db.Integer, db.ForeignKey(
        Mailserver.id), nullable=False)
    src_mailbox = db.Column(db.Text, nullable=False)
    dest_notionaccount = db.Column(
        db.Integer, db.ForeignKey(NotionAccount.id), nullable=False)
    dest_page = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return '<FolderMapping %r>' % self.name
