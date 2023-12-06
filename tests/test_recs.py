import unittest
import os
import sys
from datetime import datetime
import pytz
import math

path = '../src/mastodonApi'
sys.path.insert(1, path)


from search import *
from mastodon.utility import AttribAccessDict


def has_expected_fields(input_dict, expected_fields):
    for field in input_dict.keys():
        if field not in expected_fields:
            return False
    return True



class TestAll(unittest.TestCase):

    def test_searchInterest(self):
        interest = 'travel'
        bestAccounts, bestPosts = searchInterest(interest)
        expected_fields = ['id', 'acct', 'username']
        for i in range(len(bestAccounts)):
            account = bestAccounts[i]
            self.assertIsInstance(account, AttribAccessDict)

        for i in range(len(bestPosts)):
            post = bestPosts[i]
            self.assertIsInstance(post, AttribAccessDict)

    def test_calculate_activity(self):
        date_format = '%Y-%m-%d %H:%M:%S'

        user1_acct_dict = {'created_at': datetime.strptime('2022-11-08 00:00:00', date_format), 'statuses_count': 86}
        user2_acct_dict = {'created_at': datetime.strptime('2022-11-05 00:00:00', date_format), 'statuses_count': 0}

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
        
    
    def test_recommendPeople(self):
        userMastodonURL = '@stephenfry@mastodonapp.uk'
        recommendedPeople = recommendPeople(userMastodonURL)

        for i in range(len(recommendedPeople)):
            person = recommendedPeople[i]
            self.assertIsInstance(person, AttribAccessDict)



if __name__ == '__main__':
    unittest.main()