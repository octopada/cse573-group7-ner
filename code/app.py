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

    test_result = [
        {
            'word': 'This',
            'tag': 'PER'
        },
        {
            'word': 'is',
            'tag': 'PER'
        },
        {
            'word': 'a',
            'tag': 'O'
        },
        {
            'word': 'test',
            'tag': 'MISC'
        },
        {
            'word': '.',
            'tag': 'O'
        },
        {
            'word': 'Elon',
            'tag': 'PER'
        },
        {
            'word': 'Musk',
            'tag': 'PER'
        },
        {
            'word': 'owns',
            'tag': 'O'
        },
        {
            'word': 'Tesla',
            'tag': 'ORG'
        },
        {
            'word': '.',
            'tag': 'O'
        },
        {
            'word': 'Mark',
            'tag': 'PER'
        },
        {
            'word': 'Zuckerberg',
            'tag': 'PER'
        },
        {
            'word': 'is',
            'tag': 'O'
        },
        {
            'word': 'the',
            'tag': 'O'
        },
        {
            'word': 'CEO',
            'tag': 'MISC'
        },
        {
            'word': 'of',
            'tag': 'O'
        },
        {
            'word': 'Facebook',
            'tag': 'ORG'
        },
        {
            'word': '.',
            'tag': 'O'
        },
        {
            'word': 'Tempe',
            'tag': 'LOC'
        },
        {
            'word': 'is',
            'tag': 'O'
        },
        {
            'word': 'a',
            'tag': 'O'
        },
        {
            'word': 'nice',
            'tag': 'O'
        },
        {
            'word': 'city',
            'tag': 'MISC'
        },
        {
            'word': '.',
            'tag': 'O'
        }
    ]

    message = {
        'result': test_result,
        'meta': 'test_meta'
    }
    return jsonify(message)

@app.route('/<path:path>')
def get_all_other_files(path):
    return send_file( path)

@app.route('/')
def get_home_page():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)