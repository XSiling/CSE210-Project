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
    npm install express body-parser cors bcrypt
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

## Documentation References

For more details on implementational functionality and tests, refer to individual function and API pages.

- [Login Functionality](docs/backend/login.md)
- [Registration Functionality](docs/backend/register.md)


