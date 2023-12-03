from search import *
from mastodon.utility import AttribAccessDict

interest = 'travel'

bestAccounts, bestPosts = searchInterest(interest)
#print(type(bestAccounts[0]))
#print(type(bestPosts[0]))

assert(isinstance(bestAccounts[0], AttribAccessDict))
assert(isinstance(bestPosts[0], AttribAccessDict))

#print('keys of dictionary: ', len(bestAccounts[0].keys()))
#print('keys of dictionary: ', len(bestAccounts[1].keys()))

#print('keys of dictionary: ', (bestAccounts[0].keys()))
#print('keys of dictionary: ', (bestAccounts[1].keys()))

username = bestAccounts[0]['username']
time_created = type(bestAccounts[0]['created_at'])
status_count = bestAccounts[0]['statuses_count']

print('time created: ', time_created)
print('number of statuses: ', status_count)



'''
userMastodonURL = '@stephenfry@mastodonapp.uk'
recommendedPeople = recommendPeople(userMastodonURL)

print(type(recommendedPeople))
print(type(recommendedPeople[0]))


assert(isinstance(recommendedPeople[0], AttribAccessDict))
assert(isinstance(recommendedPeople[0], AttribAccessDict))
'''
print('COMPLETE')


