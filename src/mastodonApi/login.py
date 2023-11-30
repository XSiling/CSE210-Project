from mastodon import Mastodon       # Importing the Mastodon class from the 'mastodon' module
import os                           # Importing the 'os' module for operating system related operations
from registerApp import register    # Importing the register function from the 'registerApp' module
import env                          # Importing the 'env' module (assuming it contains environment-related configurations)

"""
    Logs in a user to the Mastodon server using saved client and user credentials.

    This function checks if the client credentials file exists. If not, it calls the register() function
    to create the client credentials. Then, it uses the Mastodon library to log in the user by providing
    the Mastodon username, password, and saves the user credentials to a file named 'pytooter_usercred.secret'.

    Environment variables 'Mastodon_username' and 'Mastodon_password' are used to retrieve the username and password.

    Returns:
    Mastodon: A Mastodon object authenticated with the user's credentials.
"""
def log_in():

    if not os.path.exists('pytooter_clientcred.secret'):
        register()      # If client credentials file does not exist, register the app
        
    mastodon = Mastodon(client_id = 'pytooter_clientcred.secret',request_timeout=10*60*60) # Create a Mastadon instance using client credentials with large request timeout

    mastodon.log_in(
        os.environ.get('Mastodon_username'),    # Retrieve Mastodon username from environment variables
        os.environ.get('Mastodon_password'),    # Retrieve Mastodon password from environment variables
        to_file = 'pytooter_usercred.secret'    # Save user credentials to this file
    )
    return mastodon     # Return Mastodon object authenticated with the user's credentials