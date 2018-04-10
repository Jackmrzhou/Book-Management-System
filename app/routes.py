from app import app
from flask import render_template, jsonify
from app.models import *

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/test")
def test():
	ads = Administrator.query.all()
	bs = Book.query.all()
	cs = Card.query.all()
	bos = Borrow.query.all()
	return jsonify({
			"Administrator":[{
				"id":a.id,
				"name":a.name,
				"contact_info":a.contact_info
			}for a in ads],
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
			}for b in bs],
			"Card":[{
				"Card_num": c.card_num,
				"name":c.name,
				"department":c.department,
				"type":c.type
			}for c in cs],
			"Borrow":[{
				"card_num":b.card_num,
				"book_num":b.book_num,
				"borrow_date":b.borrow_date,
				"return_date":b.return_date,
				"operator":b.operator
			}for b in bos]
		})