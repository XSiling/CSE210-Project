from login import log_in
import copy

client = log_in()


def searchInterests(interest):
    searchResults = client.search(interest)
    searchResults['accounts'].sort(key=lambda account: account['followers_count'], reverse = True)
    topFollowedAccounts = searchResults['accounts'][:2]
    topPosts = searchResults['statuses']
    print()

searchInterests("travel")