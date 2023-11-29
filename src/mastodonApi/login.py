from mastodon import Mastodon
import os
from registerApp import register
import env


def log_in():

    if not os.path.exists('pytooter_clientcred.secret'):
        register()
        
    mastodon = Mastodon(client_id = 'pytooter_clientcred.secret',request_timeout=10*60*60) # Large request timeout

    mastodon.log_in(
        os.environ.get('Mastodon_username'),
        os.environ.get('Mastodon_password'),
        to_file = 'pytooter_usercred.secret'
    )
    return mastodon