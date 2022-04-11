from flask import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/classify", methods=['POST'])
def classify():
    data = request.json

    text = data['text']
    model = data['model']
    modifier = data['modifier']

    message = {'result':data['text']}
    return jsonify(message)

@app.route('/<path:path>')
def get_all_other_files(path):
    return send_file( path)

@app.route('/')
def get_home_page():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)