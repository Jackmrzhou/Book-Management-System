from app import app
from flask import render_template, jsonify, request, redirect
from app.models import *
from flask_login import login_user, login_required, current_user, logout_user
from app.util import *

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/login", methods = ["GET", "POST"])
def login():
	msg = ""
	form_dict = request.form.to_dict()
	if form_dict:
		admin = Administrator.query.filter_by(id = form_dict.get("ID")).first()
		if admin:
			if form_dict.get("passwd") == admin.passwd:
				login_user(admin)
				next = request.args.get('next')
				return redirect(next or "/manage")
			else:
				msg = "Invalid password!"
		else:
			msg = "Invalid ID!"
	return render_template("login.html", msg = msg)

@app.route("/logout")
def logout():
	logout_user()
	return redirect("/")

@app.route("/manage")
@login_required
def manage():
	return render_template("manage.html")

@app.route("/Add", methods = ["GET", "POST"])
@login_required
def Addbooks():
	data_dict = request.form.to_dict()
	if data_dict:
		add_one_book(data_dict)
	return render_template("Add.html")

@app.route("/bookmanage", methods = ["POST", "GET"])
@login_required
def borrow():
	return render_template("BorrowReturn.html")

@app.route("/Card", methods = ["POST", "GET"])
@login_required
def card_manage():
	return render_template("Card.html")

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
				"contact_info":a.contact_info,
				"password": a.passwd
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
				"operator":b.operator.name
			}for b in bos]
		})