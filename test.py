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

    def test_get_homepage(self):
        """
        Test that GET "/" results in a code of 200 (OK) and contains a form to submit a guess.
        """

        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h2>Guess a word!</h2>", html)
            self.assertIn("<form", html)

    def test_initial_session(self):
        """
        Test that for a first-time user, the session is initialized with the correct info.
        """

        with app.test_client() as client:
            client.get("/")
            board = session.get("board")

            self.assertIsInstance(board, list)
            self.assertFalse("max" in session)
            self.assertFalse("num_games" in session)

    def test_guess_submit(self):
        """
        Test submission of word guess to /process_guess:
        - Status code of 200 (OK)
        - Server response data (JSON) contains correct key and an appropriate message
        """

        with app.test_client() as client:

            with client.session_transaction() as change_session:
                change_session['board'] = Boggle().make_board()

            resp = client.post("/process_guess", json={"guess": "word"})
            data = resp.get_json()

            self.assertEqual(resp.status_code, 200)
            self.assertIn("result", data)
            self.assertIn(data["result"], {"ok", "duplicate", "not-on-board", "not-word"})

    def test_update_stats_post(self):
        """
        Test submission of user score (POST request):
        - Status code of 200 (OK)
        - Server response data (JSON) contains correct keys and value types
        """

        with app.test_client() as client:

            with client.session_transaction() as change_session:
                change_session['board'] = Boggle().make_board()

            resp = client.post("/update_stats", json={"score": 5})
            data = resp.get_json()

            self.assertEqual(resp.status_code, 200)
            self.assertIn("max_score", data)
            self.assertIn("num_games", data)
            self.assertIsInstance(data["max_score"], int)
            self.assertIsInstance(data["num_games"], int)

    def test_update_stats_values(self):
        """
        Test that the user's max score and number of games are updated accordingly in session and
        returned in the server response.
        """

        with app.test_client() as client:

            with client.session_transaction() as change_session:
                change_session['board'] = Boggle().make_board()

            data0 = client.post("/update_stats", json={"score": 0}).get_json()
            self.assertEqual(session["max"], 0)
            self.assertEqual(session["num_games"], 1)
            self.assertEqual(data0["max_score"], 0)
            self.assertEqual(data0["num_games"], 1)

            data1 = client.post("/update_stats", json={"score": 7}).get_json()
            self.assertEqual(session["max"], 7)
            self.assertEqual(session["num_games"], 2)
            self.assertEqual(data1["max_score"], 7)
            self.assertEqual(data1["num_games"], 2)

            data2 = client.post("/update_stats", json={"score": 7}).get_json()
            self.assertEqual(session["max"], 7)
            self.assertEqual(session["num_games"], 3)
            self.assertEqual(data2["max_score"], 7)
            self.assertEqual(data2["num_games"], 3)

            data3 = client.post("/update_stats", json={"score": 1}).get_json()
            self.assertEqual(session["max"], 7)
            self.assertEqual(session["num_games"], 4)
            self.assertEqual(data3["max_score"], 7)
            self.assertEqual(data3["num_games"], 4)
