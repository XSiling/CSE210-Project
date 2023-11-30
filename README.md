# CSE210-Recommender-Project

**CSE-210 Project**

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Additional Setup](#additional-setup)
4. [Detailed Documentation](#documentation-references)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/XSiling/CSE210-Project.git
    ```

2. **Navigate to the project folder:**

    ```bash
    cd CSE210-Project
    ```
    
3. **Install Dependencies:**

    Run the following command to install the project dependencies.

    ```bash
    npm install
    ```

4. **Start the Server:**

    Launch the Node.js server using the following command.

    ```bash
    node src/server.js
    ```

    The server will start running at `http://localhost:3000`.

5. **Launch the Website:**

    Open the project in Visual Studio Code and use the Live Server extension to launch the website.

    - Install the Live Server extension if you haven't already.
    - Right-click on your HTML file and select "Open with Live Server."

    This will open your website in a new browser window/tab.

## Additional Setup

For the recommendation system, you need to install the following:

```bash
pip3 install Mastodon.py
pip install flask
pip install flask-cors
python -m pip install mysql-connector-python
```


### Set environment variables
Create an env.py file as follows:


```python
import os
os.environ['Mastodon_username'] = 'Your mastodon email'
os.environ['Mastodon_password'] = 'Your mastodon password'
```

### MongoDB Setup

1. **Install MongoDB:**
   - Download and install MongoDB from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
   - Follow the installation instructions based on your operating system.

2. **Start MongoDB:**
   - Open a terminal or command prompt and start the MongoDB server.

3. **Create a Database:**
   - Open a new terminal or command prompt and run `mongosh` to open the MongoDB shell.
   - In the shell, create a new database using `use userdb`.

4. **Add User for DB**
    - Add an admin user for the db.

        ```bash
        db.createUser({
            user: 'admin',
            pwd: 'admin',
            roles: [{ role: 'readWrite', db: 'userdb' }]
        })
        ```

4. **Set MongoDB URI in your project:**
   - Update the MongoDB connection URI in your `server.js` file.

      ```javascript
      mongoose.connect('mongodb://admin:admin@localhost:27017/userdb');
      ```

## Documentation References

For more details on implementational functionality and tests, refer to individual function and API pages.

- [Login Functionality](docs/backend/login.md)
- [Registration Functionality](docs/backend/register.md)


