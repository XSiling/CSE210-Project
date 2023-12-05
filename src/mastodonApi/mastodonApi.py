from flask import Flask, jsonify, request, Response   # Import necessary Flask modules
from flask_cors import CORS                 # Import CORS for handling Cross-Origin Resource Sharing
import json                                 # Import json module for JSON-related operations
from updateRecommendations import *         # Import updateRecs and recommendPeople functions from updateRecommendations module
import threading                            # Import threading module for creating threads
# from userLogin import client_auth_url
from mastodon import Mastodon
from registerApp import register

app = Flask(__name__)   # Creating a Flask application instance
CORS(app)               # Enable CORS for the Flask app

state_to_ClientMap = {}
userMastodonID_to_ClientMap = {}


def client_auth_url(userMastodonID):

    m_id, m_secret = register(userMastodonID)

    generate_state = random.random()

    userClient = Mastodon(client_id = m_id, client_secret = m_secret, api_base_url = 'https://mastodon.social', request_timeout=10*60*60) # Create a Mastadon instance using client credentials with large request timeout

    state_to_ClientMap[str(generate_state)] = userClient
    userMastodonID_to_ClientMap[userMastodonID] = userClient

    return userClient.auth_request_url(client_id = m_id, redirect_uris = "http://127.0.0.1:5000/get_Auth_Code", state = generate_state, force_login=True)
    

# Route to get recommendations
@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    with open('./src/mastodonApi/recommendations.json', 'r') as file:
        # Load recommendations data from 'recommendations.json'
        data = json.load(file)
    return jsonify(data)    # Return recommendations data as JSON response

# Route to get recommended people based on user's Mastodon URL
@app.route('/get_recommendedpeople', methods=['GET'])
def get_recommendedpeople():
    userMastodonURL = request.args.get('userMastodonURL')   # Get user's Mastodon URL from request arguments
    return jsonify(recommendPeople(userMastodonURL))    # Return recommended people based on the provided Mastodon URL


@app.route('/get_Auth_URL', methods=['GET'])
def get_Auth_URL():
    userMastodonURL = request.args.get('userMastodonURL')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    return client_auth_url(userMastodonID)


@app.route('/get_Auth_Code', methods=['GET'])
def get_Auth_Code():
    authCode = request.args.get('code')
    state = request.args.get('state')
    userClient = state_to_ClientMap[state]
    userClient.log_in(code = authCode, redirect_uri = "http://127.0.0.1:5000/get_Auth_Code")
    return Response("Success. Please close this window")


@app.route('/follow_People', methods=['GET'])
def follow_People():
    userMastodonURL = request.args.get('userMastodonURL')
    followList = request.args.get('followList')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    userClient = userMastodonID_to_ClientMap[userMastodonID]
    for followId in followList:
        userClient.account_follow(followId)
    return Response("Success")


@app.route('/check_User_Isloggedin', methods=['GET'])
def check_User_Isloggedin():
    userMastodonURL = request.args.get('userMastodonURL')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    try:
        userClient = userMastodonID_to_ClientMap[userMastodonID]
        userClient.account_verify_credentials()
    except:
        return Response("False")
    return Response("True")


@app.route('/check_User_Exists', methods=['GET'])
def check_User_Exists():
    userMastodonURL = request.args.get('userMastodonURL')
    try:
        mainClient.account_lookup(userMastodonURL)['id']
    except:
        return Response("False")
    return Response("True")
    


if __name__ == '__main__':   
    recThread = threading.Thread(target=updateRecs) # Create a separate thread to update recommendations continuously
    recThread.start()   # Start the thread to continuously update recommendations

    app.run(port=5000)  # Run the Flask app on port 5000
 
