from flask import Flask, render_template, jsonify, request
from main import State, Player, HumanPlayer
import pickle

app = Flask(__name__)

# Initialize the game state
state = None
current_player = None
game_over = False
human_player = None

# AI Player setup
p1 = Player("AI", exp_rate=0)  # AI player (exploiting)
p1.loadPolicy("policy_p1")  # Load AI policy (pre-trained)
p2 = HumanPlayer("Human")  # Human player

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    global state, current_player, game_over, human_player

    # Initialize a new game for playing with a friend
    state = State(p1, p2)  # State initialized with AI and Human player
    state.reset()
    game_over = False
    current_player = p1  # AI starts
    human_player = p2  # Human is the second player

    print("Game started")
    return jsonify({'board': state.board.tolist(), 'game_over': game_over, 'current_player': current_player.name})


@app.route('/make_move', methods=['POST'])
def make_move():
    global state, current_player, game_over

    if game_over:
        return jsonify({'board': state.board.tolist(), 'game_over': game_over, 'message': 'Game Over'})

    move = request.json
    row, col = move['row'], move['col']

    if state.board[row][col] != 0:  # Ensure move is valid
        return jsonify({'board': state.board.tolist(), 'game_over': game_over, 'message': 'Invalid move, try again!'})

    # Update the game state with the new move
    state.updateState((row, col))

    # Check if there's a winner
    winner = state.winner()

    if winner is not None:
        game_over = True
        if winner == 1:
            message = 'AI wins!'
        elif winner == -1:
            message = 'You win!'
        else:
            message = 'It\'s a tie!'
    else:
        # Switch players
        current_player = p2 if current_player == p1 else p1

    return jsonify({'board': state.board.tolist(), 'game_over': game_over, 'message': message if game_over else ''})

@app.route('/reset_game', methods=['POST'])
def reset_game():
    global state, current_player, game_over

    # Reset the game for a new session
    state.reset()
    game_over = False
    current_player = p1  # AI starts
    return jsonify({'board': state.board.tolist(), 'game_over': game_over, 'current_player': current_player.name})

if __name__ == '__main__':
    app.run(debug=True)
