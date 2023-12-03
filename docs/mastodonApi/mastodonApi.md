# Mastodon API Documentation

This documentation offers an overview of the Mastodon API functionalities, endpoints, associated functions, and their purposes within our application.

## Functionality Overview

### Mastodon Interaction and Recommendations

This API handles Mastodon interactions, providing recommendations based on user interests. It comprises endpoints for retrieving recommendations and recommended people.

## Endpoints and Functions

## api.py

### `get_recommendations()`

- **Endpoint:** `/get_recommendations`
- **Method:** GET
- **Functionality:** Retrieves recommendations based on user interests stored in 'recommendations.json' and returns the data as a JSON response.

### `get_recommendedpeople()`

- **Endpoint:** `/get_recommendedpeople`
- **Method:** GET
- **Functionality:** Fetches recommended people based on a user's Mastodon URL by calling the `recommendPeople()` function. Returns recommended people as a JSON response.


## updateRecommendations.py

### `updateRecs()`

- **Purpose:** Continuously updates recommendations for user interests in an infinite loop.
- **Functionality:** Iterates through each interest in the predefined list of user interests. Fetches the top 2 followed accounts and top 2 posts using the `searchInterest()` function. Stores the data as JSON in 'recommendations.json'.

## search.py

### `searchInterest(interest)`

- **Purpose:** Searches for an interest on Mastodon and retrieves top followed accounts and posts related to that interest.
- **Returns:** A tuple containing the top 2 followed accounts and the top 2 posts related to the interest.

### `recommendPeople(userMastodonURL)`

- **Purpose:** Recommends accounts followed by someone the user follows on Mastodon based on the provided Mastodon URL.
- **Returns:** A list of recommended people in the form of account dicts.

## Implementation Details

### Libraries and Modules

The Flask API utilizes various modules:

- `Flask`: For the creation of the API application instance.
- `flask_cors`: Enabling CORS for handling Cross-Origin Resource Sharing.
- `json`: Supporting JSON operations.
- `threading`: Used for creating threads for continuous updates.

### Associated Modules

- `updateRecommendations`: Contains functions for updating recommendations.
- `login`: Includes the `log_in` function for Mastodon user login.
- `registerApp`: Consists of the `register` function for registering the Mastodon application.
- `search`: Provides functions for searching Mastodon platform data.

### User Interests

The `userInterests` list holds various interests used for fetching recommendations.

### Continuous Update

The `updateRecs()` function executes an infinite loop to continuously update recommendations based on user interests.

## Considerations and Notes

- Continuous updates using `updateRecs()` might need appropriate management or termination mechanisms based on application requirements.
- Recommendation accuracy may vary depending on Mastodon platform data and user interactions.

This documentation covers the Mastodon and Flask API functionalities, endpoints, functions, and implementation details related to Mastodon interaction and recommendation functionalities within our application.