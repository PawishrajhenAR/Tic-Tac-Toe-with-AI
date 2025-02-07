document.addEventListener("DOMContentLoaded", function () {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let currentPlayer = "X";  // X starts first
    let gameActive = false;  // Game starts only when button is clicked

    const boardDiv = document.getElementById("board");
    const winnerMessage = document.getElementById("winnerMessage");
    const resetButton = document.getElementById("resetGame");
    const playWithFriendButton = document.getElementById("playWithFriend");
    const playWithAIButton = document.getElementById("playWithAI");
    const goBackButton = document.getElementById("goBackButton");

    // Create board cells dynamically
    function renderBoard() {
        boardDiv.innerHTML = "";
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.innerText = board[row][col];
                cell.addEventListener("click", handleMove);
                boardDiv.appendChild(cell);
            }
        }
    }

    // Handle player moves
// Handle player moves
// Handle player moves
function handleMove(event) {
    if (!gameActive) return;  // Stop if game hasn't started
    let row = event.target.dataset.row;
    let col = event.target.dataset.col;

    if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        event.target.innerText = currentPlayer;
        event.target.classList.add(currentPlayer); // Add class 'X' or 'O' to style

        checkWinner();
        
        currentPlayer = currentPlayer === "X" ? "O" : "X";  // Switch player

        // If playing with AI, make AI move after player
        if (currentPlayer === "O" && gameActive && playMode === "AI") {
            aiMove(); // AI moves immediately after player without delay
        }
    }
}



    // AI Move - Random Move for now
    function aiMove() {
        const emptyCells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    emptyCells.push({ row, col });
                }
            }
        }

        // Select a random empty cell
        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomMove.row][randomMove.col] = "O";  // AI is 'O'
        document.querySelector(`[data-row='${randomMove.row}'][data-col='${randomMove.col}']`).innerText = "O";
        checkWinner();
        currentPlayer = "X";  // Switch back to player
    }

    // Check for a winner
    function checkWinner() {
        const winningCombos = [
            [[0, 0], [0, 1], [0, 2]], // Rows
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]], // Columns
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]], // Diagonals
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                winnerMessage.innerText = `${board[a[0]][a[1]]} Wins!`;
                gameActive = false;
                return;
            }
        }

        // Check for a tie
        if (board.flat().every(cell => cell !== "")) {
            winnerMessage.innerText = "It's a Draw!";
            gameActive = false;
        }
    }

    // Start "Play with Friend" game
    playWithFriendButton.addEventListener("click", function () {
        playMode = "Friend";  // Set game mode to 'Friend'
        gameActive = true;
        boardDiv.style.display = "grid";  // Show board
        resetButton.style.display = "inline";  // Show reset button
        goBackButton.style.display = "inline";  // Show go back button
        playWithFriendButton.style.display = "none";  // Hide play with friend button
        playWithAIButton.style.display = "none";  // Hide play with AI button
        winnerMessage.innerText = "";  // Clear message
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        currentPlayer = "X";
        renderBoard();
    });

    // Start "Play with AI" game
    playWithAIButton.addEventListener("click", function () {
        playMode = "AI";  // Set game mode to 'AI'
        gameActive = true;
        boardDiv.style.display = "grid";  // Show board
        resetButton.style.display = "inline";  // Show reset button
        goBackButton.style.display = "inline";  // Show go back button
        playWithFriendButton.style.display = "none";  // Hide play with friend button
        playWithAIButton.style.display = "none";  // Hide play with AI button
        winnerMessage.innerText = "";  // Clear message
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        currentPlayer = "X";  // Player starts first
        renderBoard();
    });

    // Reset the game
    resetButton.addEventListener("click", function () {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        currentPlayer = "X";
        gameActive = true;
        winnerMessage.innerText = "";
        renderBoard();
    });

    // Go Back to main menu
    goBackButton.addEventListener("click", function () {
        // Reset everything and show main menu
        gameActive = false;
        boardDiv.style.display = "none";  // Hide board
        resetButton.style.display = "none";  // Hide reset button
        goBackButton.style.display = "none";  // Hide go back button
        playWithFriendButton.style.display = "inline";  // Show play with friend button
        playWithAIButton.style.display = "inline";  // Show play with AI button
        winnerMessage.innerText = "";  // Clear message
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        renderBoard();
    });

    // Initial render
    renderBoard();
});
