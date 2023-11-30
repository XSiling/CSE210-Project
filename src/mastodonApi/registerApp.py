from mastodon import Mastodon   # Importing the Mastodon class from the 'mastodon' module

"""
    Registers an application on the Mastodon server and saves the client credentials to a file.

    This function creates an application on the Mastodon server with the specified name.
    It saves the client credentials (client_id and client_secret) to a file named 'pytooter_clientcred.secret'.

    Note: The client credentials are required to authenticate and use the Mastodon API.

    Returns:
    None
"""
def register():
    Mastodon.create_app(
    'pytooterapp',                              # Name of the application
    api_base_url = 'https://mastodon.social',   # Mastodon server's base URL
    to_file = 'pytooter_clientcred.secret'      # File to save the client credentials
)
