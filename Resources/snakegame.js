document.addEventListener("DOMContentLoaded", function() {
    pTag = document.querySelector("div");
    newVal = document.createElement("p");
    newVal.innerHTML = ' ';
    pTag.appendChild(newVal);
});

//Canvas and Snake Build
const board_border = 'black';
const board_background = 'gray';
const snake_col = '#00b4cc';
const snake_border = 'darkblue';

let snake = [ 
    {x: 200, y: 200}, 
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200},
];

let score = 0;
// True if changing direction
let changing_direction = false;

let food_x;
let food_y;
// Horizontal Velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get canvas element
const snakeBoard = document.getElementById("snakeBoard");
// Return a two dimensional drawing context
const snakeBoard_ctx = snakeBoard.getContext("2d");
// Start a game
main();

gen_food();

document.addEventListener('keydown', change_direction);

// Main function
function main() {
    if (has_game_ended()) return;

    changing_direction = false;
    setTimeout(function onTick() {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        main();
    }, 100)
}

function clear_board() {
    //Selects the color to fill background
    snakeBoard_ctx.fillStyle = board_background;
    // selects color for border of game
    snakeBoard_ctx.strokeStyle = board_border;
    // draws a 'filled' rectangle to cover canvas
    snakeBoard_ctx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    // draws a border around canvs
    snakeBoard_ctx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

// Draws snake on canvas
function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    snakeBoard_ctx.fillStyle = 'lightgreen';
    snakeBoard_ctx.strokeStyle = 'darkgreen';
    snakeBoard_ctx.fillRect(food_x, food_y, 10, 10,);
    snakeBoard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// draw one snake part
function drawSnakePart(snakePart) {
    snakeBoard_ctx.fillStyle = snake_col;
    snakeBoard_ctx.strokeStyle = snake_border;
    snakeBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x <0;
    const hitRightWall = snake[0].x > snakeBoard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeBoard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
    // Generates random food on x-coordinate
    food_x = random_food(0, snakeBoard.width - 10);
    // Generates random food on y-coordinate
    food_y = random_food(0, snakeBoard.height - 10);
    // Generates food in new spot from snake
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    });
}

function change_direction(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    //Prevents snake from reversing
    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function move_snake() {
    // Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
      // Increase score
      score += 10;
      // Display score on screen
      document.getElementById('score').innerHTML = score;
      // Generate new food location
      gen_food();
    } else {
      // Remove the last part of snake body
      snake.pop();
    }
  }
  