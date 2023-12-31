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


"""
    Generate authentication URL for the userMastodonID.
    
    Args:
        userMastodonID (str): User's Mastodon ID.

    Returns:
        str: Authentication URL for the user.
"""
def client_auth_url(userMastodonID):

    m_id, m_secret = register(userMastodonID)

    generate_state = random.random()

    userClient = Mastodon(client_id = m_id, client_secret = m_secret, api_base_url = 'https://mastodon.social', request_timeout=10*60*60) # Create a Mastadon instance using client credentials with large request timeout

    state_to_ClientMap[str(generate_state)] = userClient
    userMastodonID_to_ClientMap[userMastodonID] = userClient

    return userClient.auth_request_url(client_id = m_id, redirect_uris = "http://127.0.0.1:5000/get_Auth_Code", state = generate_state, force_login=True)

"""
    Get recommendations from recommendations.json.

    Returns:
        Response: JSON response with recommendations data.
"""
# Route to get recommendations
@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    with open('./src/mastodonApi/recommendations.json', 'r') as file:
        # Load recommendations data from 'recommendations.json'
        data = json.load(file)
    return jsonify(data)    # Return recommendations data as JSON response


"""
    Get recommended people based on user's Mastodon URL.

    Returns:
        Response: JSON response with recommended people.
"""
# Route to get recommended people based on user's Mastodon URL
@app.route('/get_recommendedpeople', methods=['GET'])
def get_recommendedpeople():
    userMastodonURL = request.args.get('userMastodonURL')   # Get user's Mastodon URL from request arguments
    return jsonify(recommendPeople(userMastodonURL))    # Return recommended people based on the provided Mastodon URL


"""
    Get authentication URL for the user's Mastodon URL.

    Returns:
        str: Authentication URL for the user.
"""
@app.route('/get_Auth_URL', methods=['GET'])
def get_Auth_URL():
    userMastodonURL = request.args.get('userMastodonURL')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    return client_auth_url(userMastodonID)

# """
#     Handle authentication code for the user's Mastodon URL.

#     Returns:
#         Response: Message indicating successful authentication.
# """
@app.route('/get_Auth_Code', methods=['GET'])
def get_Auth_Code():
    authCode = request.args.get('code')
    state = request.args.get('state')

    # Error handling
    if 'error' in request.args:
        error_description = request.args.get('error_description', 'Unknown error')
        # return Response(f"Error during authorization: {error_description}")
        return Response("<script>window.close();</script>")

    if authCode and state:
        try:
            userClient = state_to_ClientMap[state]
            # Exchange the authorization code for a token
            userClient.log_in(code=authCode, redirect_uri="http://127.0.0.1:5000/get_Auth_Code")
            # return Response("Success. You can now close this window.")
            return Response("<script>window.close();</script>")
        except Exception as e:
            return Response(f"An error occurred: {str(e)}")
    else:
        return Response("Invalid request")

"""
    Follow people on Mastodon.

    Returns:
        Response: Message indicating successful follow operation.
"""
@app.route('/follow_People', methods=['GET'])
def follow_People():
    userMastodonURL = request.args.get('userMastodonURL')
    followUserURL = request.args.get('followUserURL')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    followID = mainClient.account_lookup(followUserURL)['id']
    userClient = userMastodonID_to_ClientMap[userMastodonID]
    userClient.account_follow(followID)
    return Response("Success")

"""
    Unfollow people on Mastodon.

    Returns:
        Response: Message indicating successful unfollow operation.
"""
@app.route('/unfollow_People', methods=['GET'])
def unfollow_People():
    userMastodonURL = request.args.get('userMastodonURL')
    unfollowUserURL = request.args.get('unfollowUserURL')
    userMastodonID = mainClient.account_lookup(userMastodonURL)['id']
    unfollowID = mainClient.account_lookup(unfollowUserURL)['id']
    userClient = userMastodonID_to_ClientMap[userMastodonID]
    userClient.account_unfollow(unfollowID)
    return Response("Success")


"""
    Check if the user is logged in on Mastodon.

    Returns:
        Response: Message indicating user's login status.
"""
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


"""
    Check if the user exists on Mastodon.

    Returns:
        Response: Message indicating user's existence status.
"""
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
 
