import os
basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object):
	SECRET_KEY = "justtest"
	UPLOAD_FOLDER = os.path.join(basedir, "upload/")


class DevConfig(BaseConfig):
	DEBUG=True
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'DevData.sqlite')
	SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProConfig(BaseConfig):
	SQLALCHEMY_DATABASE_URI = "mysql+pymysql://ex5user@localhost/ex5"
	SQLALCHEMY_TRACK_MODIFICATIONS = False