from app import app
from flask_login import current_user
from flask import jsonify, request
from app.util import *
from app.models import *
from datetime import datetime
import functools
from werkzeug.utils import secure_filename
import os

def check_authen(func):
	@functools.wraps(func)
	def wrapper(*args, **kw):
		if not current_user.is_authenticated:
			return jsonify({"status": 0, "msg" : "You are not authentiacted!"})
		return func(*args, **kw)
	return wrapper

@app.route("/cardapi")
@check_authen
def cardapi():
	cardnum = request.args.get("cardnum")

	bs = Borrow.query.filter_by(card_num = cardnum, return_date = None).all()
	if not bs:	
		if Card.query.get(cardnum):
			return jsonify({"status":0, "msg":"No borrows!"})
		else:
			return jsonify({"status":0, "msg":"Card doesn't exsist!"})
		
	bks = [b.book for b in bs]
	return jsonify({
		"status":1,
		"Book":[{
				"book_num":b.book_num,
				"category":b.category,
				"name":b.name,
				"publisher":b.publisher,
				"year":b.year,
				"author":b.author,
				"price":b.price,
				"total":b.total,
				"stock":b.stock
			}for b in bks],
		"msg" : "Totally {} borrows for card {}:".format(len(bks), cardnum)
		})

@app.route("/borrowapi")
@check_authen
def borrowapi():
	booknum = request.args.get('booknum')
	cardnum = request.args.get('cardnum')

	book = Book.query.filter_by(book_num = booknum).first()
	card = Card.query.filter_by(card_num = cardnum).first()
	if not (book or card):
		return jsonify({"status": 0, "msg":"Book or Card not exsist!"})
	if book.stock == 0:
		return jsonify({
			"status":2, 
			"msg":"Out of stock!", 
			"date":Borrow.query.filter(Borrow.book_num==book.book_num, Borrow.return_date!=None)\
					.order_by(Borrow.return_date.desc()).first().return_date
			})
	else:
		b = Borrow(
			card = card,
			book = book,
			borrow_date = datetime.now(),
			return_date = None,
			operator = current_user
			)
		book.stock -= 1
		db.session.add(b)
		db.session.commit()
		return jsonify({"status":1, "msg":"Borrowing successfully!"})

@app.route("/returnapi")
@check_authen
def returnapi():
	booknum = request.args.get('booknum')
	cardnum = request.args.get('cardnum')
	card = Card.query.filter_by(card_num = cardnum).first()
	if not card:
		return jsonify({"status":0, "msg":"Card doesn't exsist!"})

	borrow_record = Borrow.query.filter_by(card_num = cardnum, 
											book_num = booknum,
											return_date = None).first()
	if not borrow_record:
		return jsonify({"status":0, "msg" : "Book is not in the current card's borrow list."})
	else:
		book = borrow_record.book
		book.stock += 1
		borrow_record.return_date = datetime.now()
		db.session.commit()
		return jsonify({"status":1, "msg" : "Returning successfully!"})

@app.route("/delcardapi")
@check_authen
def del_card():
	cardnum = request.args.get("cardnum")
	card = Card.query.get(cardnum)
	if not card:
		return jsonify({"status":0, "msg":"Card doesn't exsist!"})
	
	bs = Borrow.query.filter_by(card_num = cardnum, return_date = None).all()
	if bs:
		return jsonify({"status":0, "msg":"Deleting failed due to the card still have borrows."})

	else:
		db.session.delete(card)
		db.session.commit()
		return jsonify({"status":1, "msg":"Deletion successfully!"})

@app.route("/createcardapi", methods = ["POST"])
@check_authen
def create_card():
	data_dict = request.form.to_dict()
	status, msg = add_one_card(data_dict)
	return jsonify({"status":status, "msg": msg})

@app.route("/uploadapi", methods = ["POST"])
@check_authen
def upload():
	try:
		f = request.files['file']
		f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))
		total = 0
		with open(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))) as fp:
			total = process_file(fp)
		if total == -1:
			return jsonify({"status":0})
		return jsonify({"status":1, 'total':total})
	except:
		return jsonify({"status":0})


@app.route("/addbookapi", methods = ["POST"])
@check_authen
def addbook():
	data_dict = request.form.to_dict()
	status, msg = add_one_book(data_dict)
	return jsonify({"status":status, "msg" : msg})

@app.route("/searchapi", methods = ["POST"])
def searchapi():
	data_dict = request.form.to_dict()
	#front-end should check the emptiness
	bs = Book.query
	if data_dict.get("Category") != "":
		bs = bs.filter(Book.category == data_dict["Category"])
	if data_dict.get("Title") != "":
		bs = bs.filter(Book.name == data_dict["Title"])
	if data_dict.get("Publisher") != "":
		bs = bs.filter(Book.publisher == data_dict["Publisher"])
	if data_dict.get("Author") != "":
		bs = bs.filter(Book.author == data_dict['Author'])
	if data_dict.get("Year_start") != "":
		bs = bs.filter(Book.year >= int(data_dict["Year_start"]))
	if data_dict.get("Year_end") != "":
		bs = bs.filter(Book.year <= int(data_dict['Year_end']))
	if data_dict.get("Price_start") != "":
		bs = bs.filter(Book.price >= float(data_dict['Price_start']))
	if data_dict.get("Price_end") != "":
		bs = bs.filter(Book.price <= float(data_dict['Price_end']))

	trans = {
		"def":Book.book_num,
		"cate":Book.category,
		"tit":Book.name,
		"pub":Book.publisher,
		"aut":Book.author,
		"year":Book.year,
		"pri":Book.price
	}
	if data_dict.get("order") == "asce":
		bs = bs.order_by(trans[data_dict.get("orderby")])
	else:
		bs = bs.order_by(db.desc(trans[data_dict.get("orderby")]))

	bks = bs.all()
	if (len(bks)==0):
		return jsonify({"status":0, "msg":"Sorry, we can't find such books."})
	return jsonify({
		"status":1,
		"Book":[{
				"book_num":b.book_num,
				"category":b.category,
				"name":b.name,
				"publisher":b.publisher,
				"year":b.year,
				"author":b.author,
				"price":b.price,
				"total":b.total,
				"stock":b.stock
			}for b in bks],
		"msg" : "Totally {} records.".format(len(bks))
		})



