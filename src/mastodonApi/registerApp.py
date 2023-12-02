from mastodon import Mastodon   # Importing the Mastodon class from the 'mastodon' module

"""
    Registers an application on the Mastodon server and saves the client credentials to a file.

    This function creates an application on the Mastodon server with the specified name.
    It saves the client credentials (client_id and client_secret) to a file named 'pytooter_clientcred.secret'.

    Note: The client credentials are required to authenticate and use the Mastodon API.

    Returns:
    None
"""
def register(clientName):
    return Mastodon.create_app(
    clientName,                              # Name of the application
    api_base_url = 'https://mastodon.social',   # Mastodon server's base URL
    # to_file = str(clientName)+ '.secret',      # File to save the client credentials
    redirect_uris = "http://127.0.0.1:5000/get_Auth_Code"
    
)
