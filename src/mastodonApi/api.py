from flask import Flask, jsonify, request
import json
from updateRecommendations import *
import threading

app = Flask(__name__)

@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    with open('./recommendations_ref.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)


@app.route('/get_recommendedpeople', methods=['GET'])
def get_recommendedpeople():
    userMastodonURL = request.args.get('userMastodonURL')
    return jsonify(recommendPeople(userMastodonURL))


if __name__ == '__main__':
    recThread = threading.Thread(target=updateRecs)
    recThread.start()
    app.run(port=5000)
