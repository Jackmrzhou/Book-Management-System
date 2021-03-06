from app import Login
from app.models import Administrator
from app import db
from app.models import *

@Login.user_loader
def load_user(id):
	return Administrator.query.filter_by(id = id).first()

def add_one_book(data_dict):
	try:
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
		return 1, "Adding book successfully!"
	except:
		db.session.rollback()
		if Book.query.filter_by(book_num =data_dict.get("Book_Number")).first():
			return 0, "Book number duplicated!"
		else:
			return 0, "Adding book failed. Please contact the DBA."

def query_card_record(card_num):
	return Card.query.filter_by(card_num = card_num).first()

def add_one_card(data_dict):
	try:
		cd = Card(
				card_num = data_dict.get("card_num"),
				name = data_dict.get("name"),
				department = data_dict.get("department"),
				type = data_dict.get("type")
			)
		db.session.add(cd)
		db.session.commit()
		return 1, "Creating card successfully!"
	except:
		db.session.rollback()
		if Card.query.get(data_dict.get("card_num")).first():
			return 0, "Card number duplicated!"
		else:
			return 0, "Creating card failed. Please contact the DBA."

def process_file(fp):
	total = 0
	for line in fp:
		val = line.split(",")
		bk = Book(
			book_num = val[0],
			category = val[1],
			name = val[2],
			publisher = val[3],
			year = val[4],
			author = val[5],
			price = float(val[6]),
			total = int(val[7]),
			stock = int(val[7])
		)
		db.session.add(bk)
		total += 1
	try:
		db.session.commit()
	except:
		db.session.rollback()
		return -1
	return total