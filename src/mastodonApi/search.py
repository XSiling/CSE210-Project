from login import log_in    # Importing the log_in function from the 'login' module
import random               # Importing the 'random' module for random operations
from datetime import datetime
import pytz



# Logging in the client
mainClient = log_in("main")


"""
    Searches for an interest on Mastodon platform and retrieves top followed accounts and posts related to that interest.

    Args:
    interest (str): The interest keyword to search for.

    Returns:
    tuple: A tuple containing the top 2 followed accounts (as account dicts) and the top 2 posts related to the interest (as status dicts).
"""
def searchInterest(interest):
    # userMastodonURL must be like this "travel"
    # Return the top2FollowedAccounts in the form of account dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#account-dicts
    # AND Return the top2Posts in the form of status dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#toot-status-dicts


    searchResults = mainClient.search(interest)     # Search for the given interest on Mastodon
    searchResults['accounts'].sort(key=lambda account: account['followers_count'], reverse = True)  # Sort users by follower count

    # Selecting top followed accounts and hashtags related to the interest

    top2FollowedAccounts = random.sample(searchResults['accounts'][:int(0.1*len(searchResults['accounts']))], 2) 
    top10FollowedAccounts = searchResults['accounts'][:10]
    top5Hastags = searchResults['hashtags'][:5]

    topPosts = []
     # Retrieve top posts from top followed accounts
    for account in top10FollowedAccounts:
        account_statuses = mainClient.account_statuses(account['id'])

        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)     # Sort by likes
        if account_statuses:
            topPosts += random.sample(account_statuses[:5], min(len(account_statuses), 2))                                  # Add some random top accounts

    # Retrieve top posts from top hashtags
    for hashtag in top5Hastags:
        account_statuses = mainClient.timeline_hashtag(hashtag['name'])

        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)     # Sort by likes
        if account_statuses:
            topPosts += random.sample(account_statuses[:5], min(len(account_statuses), 2))                                  # Add some random posts to top posts

    top2Posts = random.sample(topPosts, 2)  # Selecting top 2 posts

    return top2FollowedAccounts, top2Posts  # Return top followed accounts and posts related to the interest

def calculate_activity(account):
    current_datetime = datetime.now(pytz.UTC)

    time_created = account['created_at']
    time_created = time_created.replace(tzinfo=pytz.UTC)
    time_diff = current_datetime - time_created

    statuses_count = account['statuses_count']
    if statuses_count == 0:
        return 0
    days_elapsed = time_diff.days
    activity = days_elapsed / statuses_count
    
    return activity


def calculate_interest_intersect(user_id, account_id):

    user_featured_tags = [tag['name'] for tag in mainClient.account_featured_tags(user_id)]
    account_featured_tags = [tag['name'] for tag in mainClient.account_featured_tags(account_id)]

    user_set = set(user_featured_tags)
    account_set = set(account_featured_tags)

    common_featured_tags = user_set & account_set

    return len(common_featured_tags)


"""
    Recommends accounts followed by someone the user follows on Mastodon.

    Args:
    userMastodonURL (str): The Mastodon URL of the user.

    Returns:
    list: A list of recommended people in the form of account dicts.
"""
def recommendPeople(userMastodonURL):
    # userMastodonURL must be like this @travelleisure@flipboard.com
    # Recommends accounts that are followed by someone that the user follows
    # Returns a list of people in the form of account dicts as mentioned in https://mastodonpy.readthedocs.io/en/stable/02_return_values.html#account-dicts

    famousProfiles = ['@stephenfry@mastodonapp.uk','@jamesgunn@c.im','@gretathunberg@mastodon.nu','@kathygriffin@mstdn.social','@deborahmeaden@toot.community',\
                  '@georgetakei@universeodon.com','@profbriancox@universeodon.com']

    famousProfilesAccounts = [mainClient.account_lookup(famousProfile) for famousProfile in famousProfiles]


    userId = mainClient.account_lookup(userMastodonURL)['id']   # Retrieve user's ID
    
    following = mainClient.account_following(userId)            # Retrieve user's following
    followers = mainClient.account_followers(userId)            # Retrieve user's followers
    followersOfFollowing = []
    followingOfFollowers = []

    # Retrieve followers of following
    for users in following:
        followersOfFollowing += mainClient.account_followers(users['id'])
    
    followersOfFollowing.sort(key=lambda account: (calculate_interest_intersect(userID, account), -calculate_activity(account), account['followers_count']),reverse=True)    # sort profiles by follower count
    
    # Retrievefollowing of followers
    for users in followers:
        followingOfFollowers += mainClient.account_following(users['id'])
    
    followingOfFollowers.sort(key=lambda account: (calculate_interest_intersect(userID, account), -calculate_activity(account), account['followers_count']),reverse=True)    # sort profiles by follower count

    # Combine followers of following and following of followers to recommend people
    recommendedPeople = random.sample(followersOfFollowing[:5] + followingOfFollowers[:5], min(3,len(followersOfFollowing[:5] + followingOfFollowers[:5])))

    print('length of list before adding famous people: ', len(recommendedPeople))
    
    # Add some of the famous profiles to recommended People
    recommendedPeople += random.sample(famousProfilesAccounts, 5 - len(recommendedPeople))

    return recommendedPeople    # Return recommended people
