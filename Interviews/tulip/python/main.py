from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import sqlite3

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('../reports.db')

curs = conn.cursor()
curs.execute("SELECT count(*) FROM reports")
count = curs.fetchone()[0]

if count != 20000:
    print('Could not connect to sqlite3 database. Please check your python installation')
    sys.exit(1)


@app.route("/test")
def test():
    return jsonify({ 'ok': True })

if __name__=="__main__":
    app.run("127.0.0.1", 3265)
