from search import *
import json
import time

userInterests = [
    'Star', 'Beauty', 'Customs', 'Digital', 'Finance', 'Home', 'Book', 'Sport', 'Emotion',
    'Fun', 'Food', 'International', 'Data', 'Business', 'Pet', 'School', 'Athletics', 'Relationship',
    'Movie', 'Fashion', 'History', 'Innovation', 'Investment', 'Family', 'Library', 'Exercise', 'Charity',
    'TV', 'Travel', 'Law', 'Gadgets', 'Banking', 'Domestic', 'Learning', 'Fitness', 'Love',
    'Photography', 'Art', 'Tradition', 'Software', 'Markets', 'Decor', 'Knowledge', 'Competition', 'Empathy',
    'Music', 'Dance', 'Culture', 'Internet', 'Stocks', 'Garden', 'Study', 'Games', 'Advocacy',
    'Pop', 'Wellness', 'Community', 'Cybersecurity', 'Wealth', 'Housing', 'Research', 'Outdoor', 'Philanthropy',
    'Comic', 'Recreation', 'Heritage', 'Programming', 'Budgeting', 'Comfort', 'Literature', 'Adventure', 'Volunteering'
]

def updateRecs():
    while True:
        recommendations = {}

        for interest in userInterests:
            recommendations[interest]={}
            recommendations[interest]['top2FollowedAccounts'], recommendations[interest]['top2Posts'] = searchInterest(interest)
            time.sleep(5*60)

        json_object = json.dumps(recommendations, default=str, indent=4)
        
        with open("recommendations.json", "w") as outfile:
            outfile.write(json_object)
