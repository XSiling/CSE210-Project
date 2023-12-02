import unittest
import os
import sys

path = '../src/mastodonApi'
sys.path.insert(1, path)


from search import *
from mastodon.utility import AttribAccessDict


class TestAll(unittest.TestCase):

    def test_searchInterest(self):
        interest = 'travel'
        bestAccounts, bestPosts = searchInterest(interest)
        for i in range(len(bestAccounts)):
            account = bestAccounts[i]
            self.assertIsInstance(account, AttribAccessDict)

        for i in range(len(bestPosts)):
            post = bestPosts[i]
            self.assertIsInstance(post, AttribAccessDict)

if __name__ == '__main__':
    unittest.main()