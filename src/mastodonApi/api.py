from flask import Flask, jsonify, request   # Import necessary Flask modules
from flask_cors import CORS                 # Import CORS for handling Cross-Origin Resource Sharing
import json                                 # Import json module for JSON-related operations
from updateRecommendations import *         # Import updateRecs and recommendPeople functions from updateRecommendations module
import threading                            # Import threading module for creating threads

app = Flask(__name__)   # Creating a Flask application instance
CORS(app)               # Enable CORS for the Flask app

# Route to get recommendations
@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    with open('./recommendations.json', 'r') as file:
        data = json.load(file)      # Load recommendations data from 'recommendations.json'
    return jsonify(data)    # Return recommendations data as JSON response

# Route to get recommended people based on user's Mastodon URL
@app.route('/get_recommendedpeople', methods=['GET'])
def get_recommendedpeople():
    userMastodonURL = request.args.get('userMastodonURL')   # Get user's Mastodon URL from request arguments
    return jsonify(recommendPeople(userMastodonURL))    # Return recommended people based on the provided Mastodon URL

if __name__ == '__main__':
    
    recThread = threading.Thread(target=updateRecs) # Create a separate thread to update recommendations continuously
    recThread.start()   # Start the thread to continuously update recommendations

    app.run(port=5000)  # Run the Flask app on port 5000
    