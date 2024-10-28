// Fruits as emojis
let fruits = ['🍎', '🍌', '🍇', '🍒', '🍉']; // Different fruit emojis
let currentFruit = getRandomFruit(); // Random fruit initially

// Audio objects for background music and sound effects
let bgMusic = new Audio('music.mp3');
let foodSound = new Audio('food.mp3');
let gameOverSound = new Audio('gameover.mp3');
let moveSound = new Audio('move.mp3');

// Start background music
bgMusic.loop = true;  // Loop background music
bgMusic.play();

// Your existing game variables and canvas setup
let canvas = document.getElementById("gamecanvas");
let ctx = canvas.getContext('2d');

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
        moveSound.play();
    }
    else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
        moveSound.play();
    }
    else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
        moveSound.play();
    }
    else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
        moveSound.play();
    }
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        // Snake head with circular shape
        if (i === 0) {
            ctx.fillStyle = 'DarkGreen';
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'darkgreen';
            ctx.stroke();
        } else {
            // Snake body segments as rounded shapes
            ctx.fillStyle = 'LightGreen';
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'darkgreen';
            ctx.stroke();
        }

        // Draw eyes for snake head
        if (i === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 2 - 5, snake[i].y + box / 2 - 5, 3, 0, Math.PI * 2); // Left eye
            ctx.arc(snake[i].x + box / 2 + 5, snake[i].y + box / 2 - 5, 3, 0, Math.PI * 2); // Right eye
            ctx.fill();
        }
    }
}

// Randomly select a fruit emoji
function getRandomFruit() {
    let randomIndex = Math.floor(Math.random() * fruits.length);
    return fruits[randomIndex];
}

// Update drawFood to display an emoji
function drawFood() {
    ctx.font = '20px Arial'; // Font size for emoji
    ctx.fillText(currentFruit, food.x + 2, food.y + box); // Display emoji at food location
}

function updateGame() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Check if snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        foodSound.play();  // Play food sound
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        currentFruit = getRandomFruit(); // Change to a new random fruit emoji
    }
    else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with walls or itself
    if (snakeX < 0 || snakeY < 0 || snakeX >= 20 * box || snakeY >= 20 * box || collision(newHead, snake)) {
        clearInterval(game);
        bgMusic.pause(); // Stop background music
        gameOverSound.play();  // Play game over sound
        showGameOver(); // Show SweetAlert
    }
    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    updateGame();
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Score: ' + score, box, box);
}

// Function to show SweetAlert on Game Over
function showGameOver() {
    Swal.fire({
        title: 'Game Over!',
        text: 'Your score: ' + score,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Play Again'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame(); // Reset game if "Play Again" is clicked
        }
    });
}
function changeDirectionMobile(newDirection) {
    if (newDirection === 'LEFT' && direction !== 'RIGHT') {
        direction = 'LEFT';
        moveSound.play();
    } else if (newDirection === 'UP' && direction !== 'DOWN') {
        direction = 'UP';
        moveSound.play();
    } else if (newDirection === 'RIGHT' && direction !== 'LEFT') {
        direction = 'RIGHT';
        moveSound.play();
    } else if (newDirection === 'DOWN' && direction !== 'UP') {
        direction = 'DOWN';
        moveSound.play();
    }
}
// Function to reset the game
function resetGame() {
    // Reset game variables
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    score = 0;
    bgMusic.currentTime = 0; // Reset background music
    bgMusic.play(); // Restart background music
    game = setInterval(draw, 200); // Restart the game loop
}

// Start the game loop with an interval of 200 ms
let game = setInterval(draw, 200);
