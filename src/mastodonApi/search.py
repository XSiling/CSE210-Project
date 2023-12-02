from login import log_in    # Importing the log_in function from the 'login' module
import random               # Importing the 'random' module for random operations

# Logging in the client
client = log_in()


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


    searchResults = client.search(interest)     # Search for the given interest on Mastodon
    searchResults['accounts'].sort(key=lambda account: account['followers_count'], reverse = True)  # Sort users by follower count

    # Selecting top followed accounts and hashtags related to the interest

    top2FollowedAccounts = random.sample(searchResults['accounts'][:int(0.1*len(searchResults['accounts']))], 2) 
    top10FollowedAccounts = searchResults['accounts'][:10]
    top5Hastags = searchResults['hashtags'][:5]

    topPosts = []
     # Retrieve top posts from top followed accounts
    for account in top10FollowedAccounts:
        account_statuses = client.account_statuses(account['id'])

        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)     # Sort by likes
        if account_statuses:
            topPosts += random.sample(account_statuses[:5], min(len(account_statuses), 2))                                  # Add some random top accounts

    # Retrieve top posts from top hashtags
    for hashtag in top5Hastags:
        account_statuses = client.timeline_hashtag(hashtag['name'])

        account_statuses.sort(key=lambda account: (account['reblogs_count'], account['favourites_count']),reverse=True)     # Sort by likes
        if account_statuses:
            topPosts += random.sample(account_statuses[:5], min(len(account_statuses), 2))                                  # Add some random posts to top posts

    top2Posts = random.sample(topPosts, 2)  # Selecting top 2 posts

    return top2FollowedAccounts, top2Posts  # Return top followed accounts and posts related to the interest

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

    famousProfilesAccounts = [client.account_lookup(famousProfile) for famousProfile in famousProfiles]


    userId = client.account_lookup(userMastodonURL)['id']   # Retrieve user's ID
    
    following = client.account_following(userId)            # Retrieve user's following
    followers = client.account_followers(userId)            # Retrieve user's followers
    
    followedByFollowing = []
    for user in following:
        userID = user['id']
        followedByFollowing.extend(client.account_following(userID))

    print('length of followedByFollowing: ', len(followedByFollowing))
    print('first account in this list: ', followedByFollowing[0]['username'])

    followersOfFollowing = []
    followingOfFollowers = []

    # Retrieve followers of following
    for users in following:
        followersOfFollowing += client.account_followers(users['id'])
    
    followersOfFollowing.sort(key=lambda account: (account['followers_count']),reverse=True)    # sort profiles by follower count
    
    # Retrievefollowing of followers
    for users in followers:
        followingOfFollowers += client.account_following(users['id'])
    
    followingOfFollowers.sort(key=lambda account: (account['followers_count']),reverse=True)    # sort profiles by follower count

    # Combine followers of following and following of followers to recommend people
    recommendedPeople = random.sample(followersOfFollowing[:5] + followingOfFollowers[:5], min(3,len(followersOfFollowing[:5] + followingOfFollowers[:5])))
    
    # Add some of the famous profiles to recommended People
    recommendedPeople += random.sample(famousProfilesAccounts, 5 - len(recommendedPeople))

    return recommendedPeople    # Return recommended people


userMastodonURL = '@stephenfry@mastodonapp.uk'

recommendPeople(userMastodonURL)

userMastodonURL2 = '@jamesgunn@c.im'

recommendPeople(userMastodonURL2)

userMastodonURL3 = '@gretathunberg@mastodon.nu'

recommendPeople(userMastodonURL3)


print('COMPLETE')

