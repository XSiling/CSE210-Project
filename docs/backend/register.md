# Registration

This documentation provides insights into the registration functionality within our application, covering its purpose, key features, endpoints, and associated tests.

## Functionality

### Overview

The registration functionality enables users to create a new account, involving user input collection, validation, and secure communication with the server for the registration process.

### Key Features

- **User Registration:** Allows users to create a new account with a unique username and matching password confirmation.
- **Input Validation:** Ensures username, password, and password confirmation are provided and match before initiating the registration.
- **Secure Communication:** Utilizes a secure POST request to communicate user details securely to the server for registration.

## Frontend Interaction

### `script.js`

The frontend script (`script.js`) contains a `register` function responsible for collecting user input, performing basic validation, sending a POST request to the server, and handling the response.

#### Usage

1. **User Input:** Collects username, password, password confirmation, and email from user input fields.
2. **Password Matching:** Ensures entered password and password confirmation match.
3. **POST Request:** Sends a secure POST request to the server with user registration details.
4. **Response Handling:** Interprets the server's response, displaying alerts for successful registration or providing feedback for unsuccessful attempts.

## Server-side Implementation

### `server.js`

The server-side implementation includes a `/register` endpoint responsible for validating user registration details, ensuring username uniqueness, hashing passwords, and responding accordingly.

#### Endpoint Details

- **Endpoint:** `/register`
- **Method:** POST
- **Request Body:**
  - `username`: User's desired username
  - `password`: User's chosen password
  - `confirmPassword`: Confirmation of the chosen password

#### Registration Process

1. **Input Validation:**
   - Checks if the username, password, and confirmPassword are provided.
   - Verifies that the password and confirmPassword match.

2. **Username Uniqueness:**
   - Ensures the chosen username is unique by checking against existing users.

3. **Password Hashing:**
   - Hashes the user's password using bcrypt for secure storage.

4. **User Addition:**
   - Adds the new user with the hashed password to the users array.

5. **Response:**
   - Success: Returns a JSON response indicating successful registration.
   - Failure: Returns a 400 status with a JSON response for various failure scenarios.

## Testing

### `register.test.js`

The testing file contains various test cases to ensure the robustness of the registration functionality.

#### Test Scenarios

1. **Successful Registration:**
   - Validates that a new user can successfully register with unique credentials.

2. **Duplicate Usernames:**
   - Ensures proper handling of registration attempts with existing usernames.

3. **Missing Username or Password:**
   - Tests the system's response to requests with missing username or password.

4. **Password Mismatch:**
   - Verifies that the system handles password mismatch scenarios.
