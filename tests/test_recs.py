import unittest
import os
import sys
from datetime import datetime

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