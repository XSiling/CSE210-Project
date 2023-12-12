import unittest
import os
import sys
from datetime import datetime
import pytz
import math
import random

# Adding 'src/mastodonApi' to the sys path to import modules
path = 'src/mastodonApi'
sys.path.insert(1, path)


from search import *
from mastodon.utility import AttribAccessDict

# Expected field lists for account and post objects
expected_account_fields_22 = (
            ['id', 'username', 'acct', 'display_name', 'locked', 'bot', 
            'discoverable', 'group', 'created_at', 'note', 'url', 'uri', 'avatar', 
            'avatar_static', 'header', 'header_static', 'followers_count', 
            'following_count', 'statuses_count', 'last_status_at', 'emojis', 'fields']
        )

expected_account_fields_24 = (
            ['id', 'username', 'acct', 'display_name', 'locked', 'bot', 
            'discoverable', 'group', 'created_at', 'note', 'url', 'uri', 'avatar', 
            'avatar_static', 'header', 'header_static', 'followers_count', 
            'following_count', 'statuses_count', 'last_status_at', 'noindex', 'emojis', 'roles', 'fields']
        )
        
expected_post_fields = (
            ['id', 'created_at', 'in_reply_to_id', 'in_reply_to_account_id', 'sensitive', 'spoiler_text', 
            'visibility', 'language', 'uri', 'url', 'replies_count', 'reblogs_count', 'favourites_count', 
            'edited_at', 'favourited', 'reblogged', 'muted', 'bookmarked', 'content', 'filtered', 'reblog', 
            'account', 'media_attachments', 'mentions', 'tags', 'emojis', 'card', 'poll']
        )


"""
    Checks if the input dictionary contains expected fields.
    
    Args:
    - input_dict (dict): The dictionary to be checked.
    - expected_fields (list): List of expected fields.

    Returns:
    - bool: True if all expected fields are present, False otherwise.
"""
def has_expected_fields(input_dict, expected_fields):
    for field in input_dict.keys():
        if field not in expected_fields:
            return False
    return True

class TestAll(unittest.TestCase):

    """
        Test case for the searchInterest function.
    """
    def test_searchInterest(self):
        # Fetching best accounts and posts related to 'travel'
        interest = 'travel'
        bestAccounts, bestPosts = searchInterest(interest)
        
        # Asserting fields and instance types for bestAccounts
        for i in range(len(bestAccounts)):
            account = bestAccounts[i]
            self.assertIsInstance(account, AttribAccessDict)
            if len(account.keys()) == 22:
               self.assertTrue(has_expected_fields(account, expected_account_fields_22))
            elif len(account.keys()) == 24:
                self.assertTrue(has_expected_fields(account, expected_account_fields_24))

        # Asserting fields and instance types for bestPosts
        for i in range(len(bestPosts)):
            post = bestPosts[i]
            self.assertIsInstance(post, AttribAccessDict)
            self.assertEqual(28, len(post.keys()))
            self.assertTrue(has_expected_fields(post, expected_post_fields))


    """
        Test case for the calculate_activity function.
    """
    def test_calculate_activity(self):
        date_format = '%Y-%m-%d %H:%M:%S'

        # Creating test data for calculate_activity function
        user1_acct_dict = {'created_at': datetime.strptime('2022-11-08 00:00:00', date_format), 'statuses_count': 86}
        user2_acct_dict = {'created_at': datetime.strptime('2022-11-05 00:00:00', date_format), 'statuses_count': 0}

        # Calculating activity and comparing with expected values
        current_datetime = datetime.now(pytz.UTC)
        time_created = user1_acct_dict['created_at']
        time_created = time_created.replace(tzinfo=pytz.UTC)
        days_elapsed = (current_datetime - time_created).days

        statuses_count = user1_acct_dict['statuses_count']
        activity_1_test = days_elapsed / statuses_count

        activity_1 = calculate_activity(user1_acct_dict)
        self.assertEqual(math.floor(activity_1_test),math.floor(activity_1))


        activity_2 = calculate_activity(user2_acct_dict)
        self.assertEqual(activity_2,0)


    """
        Test case for the remove_nsfw_posts function.
    """
    def test_remove_nsfw_posts(self):
        # Generate random test data
        sample_toot_list = [
            {'sensitive': False, 'tags': [{'name': 'tag_first'}, {'name': 'tag_second'}]},
            {'sensitive': False, 'tags': [{'name': 'nsfw'}, {'name': 'tag2'}]},
            {'sensitive': True, 'tags': [{'name': 'nsfw'}, {'name': 'tag3'}]},
            {'sensitive': False, 'tags': [{'name': 'tag4'}, {'name': 'tag5'}]},
            {'sensitive': False, 'tags': [{'name': 'nsfw'}, {'name': 'tag6'}, {'name': 'tag7'}]},
            {'sensitive': True, 'tags': [{'name': 'tag8'}, {'name': 'tag9'}, {'name': 'nsfw'}]}
        ]

        random.shuffle(sample_toot_list) #  shuffle to ensure randomness

        filtered_toots = remove_nsfw_posts(sample_toot_list)

        #print('filtered roots from function: ', filtered_toots)

        manually_filtered = [
            {'sensitive': False, 'tags': [{'name': 'tag_first'}, {'name': 'tag_second'}]},
            {'sensitive': False, 'tags': [{'name': 'tag4'}, {'name': 'tag5'}]}
        ]

        self.assertCountEqual(filtered_toots,manually_filtered)
        

    """
        Test case for the recommendPeople function.
    """
    def test_recommendPeople(self):
        # Recommending people based on userMastodonURL and asserting fields and instance types
        userMastodonURL = '@stephenfry@mastodonapp.uk'
        recommendedPeople = recommendPeople(userMastodonURL)

        #print('length of list: ', len(recommendedPeople))
        for i in range(len(recommendedPeople)):

            person = recommendedPeople[i]
            self.assertIsInstance(person, AttribAccessDict)
            if len(person.keys()) == 22:
               self.assertTrue(has_expected_fields(person, expected_account_fields_22))
            elif len(person.keys()) == 24:
                self.assertTrue(has_expected_fields(person, expected_account_fields_24))
    
if __name__ == '__main__':
    unittest.main()