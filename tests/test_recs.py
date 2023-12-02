import unittest
import os
import sys

path = '../src/mastodonApi'
sys.path.insert(1, path)


from search import *
from mastodon.utility import AttribAccessDict


def has_expected_fields(input_dict, expected_fields):
    for field in input_dict:
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

            contains_fields = has_expected_fields(account, expected_fields)
            self.assertTrue(contains_fields)

        for i in range(len(bestPosts)):
            post = bestPosts[i]
            self.assertIsInstance(post, AttribAccessDict)


    
    def test_recommendPeople(self):
        userMastodonURL = '@stephenfry@mastodonapp.uk'
        recommendedPeople = recommendPeople(userMastodonURL)

        for i in range(len(recommendedPeople)):
            person = recommendedPeople[i]
            self.assertIsInstance(person, AttribAccessDict)



if __name__ == '__main__':
    unittest.main()