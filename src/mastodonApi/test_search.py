from search import *
from mastodon.utility import AttribAccessDict

interest = 'travel'

bestAccounts, bestPosts = searchInterest(interest)
#print(type(bestAccounts[0]))
#print(type(bestPosts[0]))

assert(isinstance(bestAccounts[0], AttribAccessDict))
assert(isinstance(bestPosts[0], AttribAccessDict))

print('keys of dictionary: ', len(bestAccounts[0].keys()))
print('keys of dictionary: ', len(bestAccounts[1].keys()))

print('keys of dictionary: ', (bestAccounts[0].keys()))
print('keys of dictionary: ', (bestAccounts[1].keys()))

'''
userMastodonURL = '@stephenfry@mastodonapp.uk'
recommendedPeople = recommendPeople(userMastodonURL)

print(type(recommendedPeople))
print(type(recommendedPeople[0]))


assert(isinstance(recommendedPeople[0], AttribAccessDict))
assert(isinstance(recommendedPeople[0], AttribAccessDict))
'''
print('COMPLETE')


