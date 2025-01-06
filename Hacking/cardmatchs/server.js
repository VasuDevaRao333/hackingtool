const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const IP_ADDRESS = '0.0.0.0'; // Replace with your desired IP address
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Game state variables
let players = [];
let cards = [];
let currentTurnIndex = 0;
let gameStarted = false;
let scores = {};
let level = 'easy'; // Default level

// Define card decks for different levels
const cardDeck = ['🍎', '🍌', '🍉', '🍓', '🍍', '🍑', '🍏', '🍊', '🍇', '🍒'];
const levels = {
    easy: 6, // 3 pairs
    medium: 12, // 6 pairs
    hard: 20, // 10 pairs
};

// Function to shuffle cards
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// Route to serve the HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A player connected: ' + socket.id);

    socket.on('playerJoined', (data) => {
        if (players.length < 2 && !gameStarted) {
            players.push({ id: socket.id, name: data.name });
            scores[socket.id] = 0; // Initialize the player's score
            socket.emit('playerStatus', `Welcome ${data.name}! Waiting for another player.`);
            if (players.length === 2) {
                gameStarted = true;
                startGame();
            }
        } else {
            socket.emit('playerStatus', 'Game is already in progress.');
        }
    });

    socket.on('setLevel', (selectedLevel) => {
        if (!gameStarted) {
            level = selectedLevel;
            socket.emit('levelSet', `Game level set to ${level}.`);
        }
    });

    socket.on('revealCard', (data) => {
        const { index } = data;
        socket.emit('cardRevealed', { index, value: cards[index] });
    });

    socket.on('checkMatch', ({ firstIndex, secondIndex }) => {
        const match = cards[firstIndex] === cards[secondIndex];
        io.emit('matchResult', { match, indices: [firstIndex, secondIndex] });

        if (match) {
            scores[socket.id] += 1; // Increment score for the current player
            if (isGameComplete()) {
                endGame();
                return;
            }
        } else {
            // Switch turn
            currentTurnIndex = (currentTurnIndex + 1) % players.length;
        }

        updateTurns();
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected: ' + socket.id);
        players = players.filter(player => player.id !== socket.id);
        gameStarted = false;
        io.emit('playerStatus', 'Player disconnected. Waiting for players to join.');
    });

    const startGame = () => {
        const numberOfPairs = levels[level];
        cards = cardDeck.slice(0, numberOfPairs).concat(cardDeck.slice(0, numberOfPairs)); // Duplicate pairs
        shuffleArray(cards);

        io.emit('initializeBoard', cards.map(() => null)); // Send empty board initially
        updateTurns();
    };

    const updateTurns = () => {
        const currentPlayer = players[currentTurnIndex];
        players.forEach((player) => {
            const isMyTurn = player.id === currentPlayer.id;
            io.to(player.id).emit('turnUpdate', {
                isMyTurn,
                message: isMyTurn ? "It's your turn!" : "Waiting for the other player...",
            });
        });
    };

    const isGameComplete = () => {
        // Check if all cards are matched
        return Object.values(scores).reduce((a, b) => a + b, 0) === levels[level];
    };

    const endGame = () => {
        const winner = players.reduce((bestPlayer, player) => {
            return scores[player.id] > (scores[bestPlayer?.id] || 0) ? player : bestPlayer;
        }, null);

        const message = winner
            ? `${winner.name} wins with ${scores[winner.id]} points!`
            : "It's a draw!";
        io.emit('gameOver', { message });
        resetGame();
    };

    const resetGame = () => {
        players = [];
        cards = [];
        currentTurnIndex = 0;
        gameStarted = false;
        scores = {};
        level = 'easy'; // Reset to default level
    };
});

// Start the server
server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running on http://${IP_ADDRESS}:${PORT}`);
});
