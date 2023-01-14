# Ioana A Mititean
# Exercise 19.5 - Flask Testing (Boggle)

"""
Main code for Boggle application - Flask setup, routes, and view functions.
"""

from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "ceva foarte secreta"
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

BOARD_KEY = "board"
MAX_SCORE_KEY = "max"
NUM_GAMES = "num_games"

boggle_game = Boggle()


@app.route("/", methods=["GET"])
def homepage():
    """
    Display the homepage, where the Boggle board will be located.
    """

    board = boggle_game.make_board()
    session[BOARD_KEY] = board

    return render_template("/boggle_home.jinja2", board=board)


@app.route("/process_guess", methods=["POST"])
def process_guess():
    """
    Retrieve and process guess input by user.
    """

    request_data = request.get_json()
    guess = request_data["guess"]
    board = session[BOARD_KEY]

    word_validity = boggle_game.check_valid_word(board, guess)

    return jsonify(result=word_validity)


@app.route("/update_stats", methods=["POST"])
def update_stats():
    """
    Update player statistics -
    Retrieve user score and update max score in session.
    Update number of total games this user has played (in session).
    """

    request_data = request.get_json()
    score = request_data["score"]

    curr_max = session.get(MAX_SCORE_KEY, 0)
    is_new_max = False

    if score > curr_max:
        is_new_max = True
        session[MAX_SCORE_KEY] = score
        curr_max = score

    session[NUM_GAMES] = session.get(NUM_GAMES, 0) + 1
    curr_num_games = session[NUM_GAMES]

    return jsonify(is_new_max=is_new_max,
                   max_score=curr_max,
                   num_games=curr_num_games)
