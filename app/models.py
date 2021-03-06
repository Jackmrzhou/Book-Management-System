from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Administrator(db.Model, UserMixin):

	id = db.Column(db.String(20), primary_key = True)
	name = db.Column(db.String(20))
	passwd = db.Column(db.String(100))
	contact_info = db.Column(db.String(40))

	def __init__(self, **kw):
		super(Administrator, self).__init__(**kw)
		self.id = kw["id"]
		self.name = kw["name"]
		self.passwd = generate_password_hash(kw["passwd"])
		self.contact_info = kw["contact_info"]

	def check_passwd(self, psd):
		return check_password_hash(self.passwd, psd)


	def __repr__(self):
		return "<Administrator {}>".format(self.name)


class Book(db.Model):

	book_num = db.Column(db.String(30), primary_key = True)
	category = db.Column(db.String(60))
	name = db.Column(db.String(100))
	publisher = db.Column(db.String(100))
	year = db.Column(db.Integer)
	author = db.Column(db.String(30))
	price = db.Column(db.Float)
	total = db.Column(db.Integer)
	stock = db.Column(db.Integer)

	def __repr__(self):
		return "<Book {}>".format(self.name)


class Card(db.Model):

	card_num = db.Column(db.String(20), primary_key = True)
	name = db.Column(db.String(20))
	department = db.Column(db.String(40))
	type = db.Column(db.String(10))

	def __repr__(self):
		return "<Card {}>".format(self.card_num)

class Borrow(db.Model):
	id = db.Column(db.Integer, primary_key = True)

	card_num = db.Column(db.String(20), db.ForeignKey("card.card_num"))
	card = db.relationship("Card", backref = db.backref("borrows", lazy = True))

	book_num = db.Column(db.String(30), db.ForeignKey("book.book_num"))
	book = db.relationship("Book", backref = db.backref("borrows", lazy = True))

	borrow_date = db.Column(db.DateTime)
	return_date = db.Column(db.DateTime)

	operator_id = db.Column(db.String(20), db.ForeignKey("administrator.id"))
	operator = db.relationship("Administrator", backref = db.backref("borrows", lazy = True))

	def __repr__(self):
		return "<Borrow Record of {}>".format(self.card_num)
