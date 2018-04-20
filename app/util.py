from app import Login
from app.models import Administrator
from app import db
from app.models import *

@Login.user_loader
def load_user(id):
	return Administrator.query.filter_by(id = id).first()

def add_one_book(data_dict):
	bk = Book(
			book_num = data_dict.get("Book_Number"),
			category = data_dict.get("Category"),
			name = data_dict.get("Book_Title"),
			publisher = data_dict.get("Publisher"),
			year = int(data_dict.get("Year")),
			author = data_dict.get("Author"),
			price = float(data_dict.get("Price")),
			total = int(data_dict.get("Total")),
			stock = int(data_dict.get("Total"))
		)
	db.session.add(bk)
	db.session.commit()

def query_card_record(card_num):
	return Card.query.filter_by(card_num = card_num).first()

def add_one_card(data_dict):
	cd = Card(
			card_num = data_dict.get("card_num"),
			name = data_dict.get("name"),
			department = data_dict.get("department"),
			type = data_dict.get("type")
		)
	db.session.add(cd)
	db.session.commit()