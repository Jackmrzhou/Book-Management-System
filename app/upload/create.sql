CREATE DATABASE library;

USE library;

CREATE TABLE book (
	bno char(8) ,
	category char(10),
	title varchar(40),
	press varchar(30),
	year int,
	author varchar(20),
	price decimal(7,2),
	total int,
	stock int,
	PRIMARY KEY (bno)
);

CREATE TABLE card(
	cno char(7),
	name varchar(10),
	department
	varchar(40),
	type char(1) CHECK(type='T' OR type='G' OR type='U' OR type='O'),
	PRIMARY KEY (cno)
);

CREATE TABLE borrow(
	cno char(7),
	bno char(8),
	borrow_date datetime,
	return_date datetime,
	FOREIGN KEY(bno) REFERENCES book(bno)
		ON DELETE CASCADE,
	FOREIGN KEY(cno) REFERENCES card(cno)
		ON UPDATE CASCADE
);
