# Ioana A Mititean
# Exercise 19.5 - Flask Testing (Boggle)

from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):
    """
    Tests for every view and helper function in Boggle Flask application (app.py).
    """

    def test_homepage(self):
        pass

    def test_process_guess(self):
        pass

    def test_update_stats(self):
        pass

    def test_update_max_score(self):
        pass

    def test_update_num_games(self):
        pass
