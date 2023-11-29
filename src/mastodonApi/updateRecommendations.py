from search import *    # Importing necessary functions from the 'search' module
import json             # Importing the 'json' module for JSON operations
import time             # Importing the 'time' module for time-related operations

# List of user interests
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


"""
    Continuously updates recommendations for user interests in an infinite loop.

    This function iterates through each interest in the user's interests. 
    For each interest, it retrieves the top 2 followed accounts and top 2 posts using the searchInterest function.
    The results are stored in a dictionary named 'recommendations', which is then converted to
    a JSON object and written to a file named 'recommendations.json'.
"""
def updateRecs():
    while True:
        recommendations = {}    # Dictionary to store recommendations for each interest

        # Iterating through each interest in the user's interests
        for interest in userInterests:
            # For each interest, retrieve top 2 followed accounts and top 2 posts using searchInterest function
            recommendations[interest]={}
            recommendations[interest]['top2FollowedAccounts'], recommendations[interest]['top2Posts'] = searchInterest(interest)
            time.sleep(5*60)    # Pause before searching the next interest

        # Convert recommendations dictionary to a JSON object
        json_object = json.dumps(recommendations, default=str, indent=4)
        
        # Write the JSON object to a file named "recommendations.json"
        with open("recommendations.json", "w") as outfile:
            outfile.write(json_object)

