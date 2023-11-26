from mastodon import Mastodon
import os
import registerApp


def log_in():

    if not os.path.exists('pytooter_clientcred.secret'):
        registerApp()
        
    mastodon = Mastodon(client_id = 'pytooter_clientcred.secret',)
    mastodon.log_in(
        'cse210team1@gmail.com',
        'negative10xdevelopers',
        to_file = 'pytooter_usercred.secret'
    )

    return mastodon