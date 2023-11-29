from login import log_in
import random
import json

client = log_in()

famousProfiles = ['@stephenfry@mastodonapp.uk','@jamesgunn@c.im','@gretathunberg@mastodon.nu','@kathygriffin@mstdn.social','@deborahmeaden@toot.community',\
                  '@georgetakei@universeodon.com','@profbriancox@universeodon.com']


def searchInterest(interest):
    # interest must be like this "travel"
    # Return the top2FollowedAccounts in the form of account dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#account-dicts
    # AND Return the top2Posts in the form of status dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#toot-status-dicts

    searchResults = client.search(interest)
    searchResults['accounts'].sort(key=lambda account: account['followers_count'], reverse = True)

    top2FollowedAccounts = random.sample(searchResults['accounts'][:int(0.1*len(searchResults['accounts']))], 2) 
    top10FollowedAccounts = searchResults['accounts'][:10]
    topHastags = searchResults['hashtags']

    topPosts = []
    for account in top10FollowedAccounts:
        account_statuses = client.account_statuses(account['id'])
        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)
        topPosts += random.sample(account_statuses[:int(0.1*len(account_statuses))], 2)

    
    for hashtag in topHastags:
        account_statuses = client.timeline_hashtag(hashtag['name'])
        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)
        topPosts += random.sample(account_statuses[:int(0.1*len(account_statuses))], 2)

    top2Posts = random.sample(topPosts, 2)

    return top2FollowedAccounts, top2Posts


def recommendPeople(userMastodonURL):
    # userMastodonURL must be like this @travelleisure@flipboard.com
    # Recommends accounts that are followed by someone that the user follows
    # Returns a list of people in the form of account dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#account-dicts

    famousProfilesAccounts = [client.account_lookup(famousProfile) for famousProfile in famousProfiles]


    userId = client.account_lookup(userMastodonURL)['id']
    
    following = client.account_following(userId)
    followers = client.account_followers(userId)
    followersOfFollowing = []
    followingOfFollowers = []
    for users in following:
        followersOfFollowing += client.account_followers(users['id'])
    
    followersOfFollowing.sort(key=lambda account: (account['followers_count']),reverse=True)
    
    for users in followers:
        followingOfFollowers += client.account_following(users['id'])
    
    followingOfFollowers.sort(key=lambda account: (account['followers_count']),reverse=True)

    recommendedPeople = random.sample(followersOfFollowing[:5] + followingOfFollowers[:5], min(3,len(followersOfFollowing[:5] + followingOfFollowers[:5])))
    
    recommendedPeople += random.sample(famousProfilesAccounts, 5 - len(recommendedPeople))

    return json.dumps(recommendedPeople, default=str)
