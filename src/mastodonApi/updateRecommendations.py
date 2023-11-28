from search import *
import json

userInterests = ['travel','soccer']

recommendations = {}

for interest in userInterests:
    recommendations[interest]={}
    recommendations[interest]['top2FollowedAccounts'], recommendations[interest]['top2Posts'] = searchInterest(interest)



json_object = json.dumps(recommendations, default=str, indent=4)
 
with open("recommendations.json", "w") as outfile:
    outfile.write(json_object)
