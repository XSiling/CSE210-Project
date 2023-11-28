# Login

This documentation provides a concise overview of the login functionality in our application, highlighting its purpose, key features, endpoints, and associated tests.

## Functionality

### Overview

The login functionality enables users to authenticate themselves within the application. It ensures a secure communication process between the frontend and backend, validating user credentials.

### Key Features

- **User Authentication:** Validates user identity based on provided username and password.
- **Secure Communication:** Utilizes HTTPS and encryption to secure the transmission of user credentials.

## Frontend Interaction

### `script.js`

The frontend script (`script.js`) contains a `login` function responsible for collecting user input, sending a POST request to the server, and handling the response.

#### Usage

1. **User Input:** Collects username and password from user input fields.
2. **POST Request:** Sends a secure POST request to the server with user credentials.
3. **Response Handling:** Interprets the server's response, redirecting on successful login or displaying an alert for unsuccessful attempts.

## Server-side Implementation

### `server.js`

The server-side implementation includes a `/login` endpoint responsible for validating user credentials and responding accordingly.

#### Endpoint Details

- **Endpoint:** `/login`
- **Method:** POST
- **Request Body:**
  - `username`: User's username
  - `password`: User's password

#### Authentication Process

1. **User Lookup:** Finds the user based on the provided username.
2. **Password Verification:** Compares the hashed password stored on the server with the provided password using bcrypt.
3. **Response:**
   - Success: Returns a JSON response indicating a successful login.
   - Failure: Returns a 401 status with a JSON response for invalid credentials.

## Testing

### `login.test.js`

The testing file contains various test cases to ensure the robustness of the login functionality.

#### Test Scenarios

1. **Successful Login:**
   - Validates that a user can successfully log in with correct credentials.

2. **Incorrect Password:**
   - Verifies that the system handles incorrect passwords appropriately.

3. **Non-existent Username:**
   - Ensures proper handling of login attempts with non-existent usernames.

4. **Missing Username or Password:**
   - Tests the system's response to requests with missing username or password.

5. **Error Handling:**
   - Checks the system's response when an error occurs during the authentication process.