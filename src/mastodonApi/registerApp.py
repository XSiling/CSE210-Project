from mastodon import Mastodon

def register():
    Mastodon.create_app(
    'pytooterapp',
    api_base_url = 'https://mastodon.social',
    to_file = 'pytooter_clientcred.secret'
)
