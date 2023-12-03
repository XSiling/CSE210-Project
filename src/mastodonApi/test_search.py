from search import *
from datetime import datetime
import pytz

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


current_datetime = datetime.now(pytz.UTC)

username = bestAccounts[0]['username']
time_created = bestAccounts[0]['created_at']
time_created = time_created.replace(tzinfo=pytz.UTC)
print('time_created: ', time_created)

status_count = bestAccounts[0]['statuses_count']
print('status_count: ', status_count)
time_diff = current_datetime - time_created
days_elapsed = time_diff.days
print('days elapsed: ', days_elapsed)
activity = days_elapsed/status_count
print('activity: ', activity)

username = bestAccounts[1]['username']
time_created = bestAccounts[1]['created_at']
time_created = time_created.replace(tzinfo=pytz.UTC)
print('time_created: ', time_created)

status_count = bestAccounts[1]['statuses_count']
print('status_count: ', status_count)
time_diff = current_datetime - time_created
days_elapsed = time_diff.days
print('days elapsed: ', days_elapsed)
activity = days_elapsed/status_count
print('activity: ', activity)




'''
userMastodonURL = '@stephenfry@mastodonapp.uk'
recommendedPeople = recommendPeople(userMastodonURL)

print(type(recommendedPeople))
print(type(recommendedPeople[0]))


assert(isinstance(recommendedPeople[0], AttribAccessDict))
assert(isinstance(recommendedPeople[0], AttribAccessDict))
'''
print('COMPLETE')


