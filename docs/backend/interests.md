# Interests

This documentation provides a concise overview of the interests functionality in our application, highlighting its purpose, key features, endpoints, and associated tests.

## Functionality

### Overview

The interests functionality enables users to select interests from an available list. This will be used to streamline recommendations to the user based on their interests selection.

### Key Features

- **Interests Selection:** Allows a user to select interests from an expandable listing. They can also type in interests through the textbox above.
- **Link ActivityPub Account:** Optional functionality letting the user link their ActivityPub (Mastodon) account

## Frontend Interaction

### `script.js`

The frontend script (`script.js`) contains a `updateInterests` function responsible for keeping track of user selection on interests, sending a POST request to the server, and handling the response.

#### Usage

1. **Interest Selection:** Scan selected (checked with mouse) interests by the user.
2. **Direct Selection:** Textbox allowing the user to select the interest they want by typing instead (if it exists).
3. **POST Request:** Sends a secure POST request to the server with username + interests.
4. **Response Handling:** Interprets the server's response, redirecting on "next" to a recommendations page based on interests selected or displaying an error or alert if that failed.

## Server-side Implementation

### `server.js`

The server-side implementation includes a `/interests` endpoint responsible for validating user interests and updating data in the backend accordingly.

#### Endpoint Details

- **Endpoint:** `/interests`
- **Method:** POST
- **Request Body:**
  - `username`: User's username
  - `interests`: List containing user interests selected

#### Authentication Process

1. **User Lookup:** Finds the user based on the provided username.
2. **Update Data:** Update user interests in the backend.
   - User ID exists: update matching user ID's interests.
   - User ID doesn't exist: create a new user in the backend with selected interests.
3. **Response:**
   - Success: Returns a JSON response indicating a successful interest update.

## Testing

### `interests.test.js`

The testing file contains various test cases to ensure the robustness of the interests selection functionality.

#### Test Scenarios

1. **Successful Interest Update:**
   - Validates that an existing user can successfully update/pick their interests.

2. **Invalid Request Bodies:**
   - Ensure that a POST request in the wrong format (no interests sent) will throw a 404 error code.

3. **Correct Response Format**
   - Ensures that the structure of the response is correct upon receiving a valid interest update request.