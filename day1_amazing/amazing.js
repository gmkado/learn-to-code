const mazeCanvas = document.getElementById('mazeCanvas');
const directionLabel = document.getElementById('directions');
const resultLabel = document.getElementById('result');
const difficultySelection = document.getElementById('difficultySelection');
const ctx = mazeCanvas.getContext('2d');
let resetButton;

mazeOptions =
{'easy':
[
    [0, 0, 0, 0, 0],
    [2, 1, 1, 1, 3],
    [0, 0, 0, 0, 0]
], 
'medium':
[
    [0, 0, 0, 1, 3],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [2, 1, 0, 0, 0]
],
'hard':
[
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 3, 0, 1],
    [1, 0, 1, 0, 0, 0, 1],
    [2, 0, 1, 1, 1, 1, 1]
],
};

for(const key in mazeOptions) {
    let optionButton = document.createElement('input');
    optionButton.type = 'radio';
    optionButton.name = 'difficulty';
    optionButton.addEventListener('click', (event)=>{
        maze = mazeOptions[key];
        resetAndRunGame();
    });

    // ignore arrow keys
    optionButton.addEventListener('keydown', (evt)=>{
        if(evt.key === 'ArrowDown' ||
            evt.key === 'ArrowUp' ||
            evt.key === 'ArrowLeft' ||
            evt.key === 'ArrowRight'){
            evt.preventDefault();
        }
    });

    let optionLabel = document.createElement('label');
    optionLabel.textContent = key;
    optionLabel.htmlFor = optionButton;

    difficultySelection.appendChild(optionButton);
    difficultySelection.appendChild(optionLabel);
}


let cellWidth;
let cellHeight;
let currentPos;
let currentDir; 
let directions;

// resetAndRunGame();

// direction is an angle in rad with 0 pointing right, position are [x, y]
function resetAndRunGame() {
    currentPos = getStartPos();
    currentDir = 0;
    directions = [];
    directionLabel.textContent = 'Press arrow keys and [enter] when you\'re ready';
    resultLabel.textContent = '';
    resultLabel.style.backgroundColor = 'white';
    cellWidth = Math.floor(mazeCanvas.width / maze[0].length);
    cellHeight = Math.floor(mazeCanvas.height / maze.length);
    if(resetButton) {
        document.body.removeChild(resetButton);
        resetButton = null;        
    }
    drawCurrentStep();
    listenForDirections();
}

// find the start pos (value 2) of the current mase
function getStartPos(){
    for([rowInd, row] of maze.entries()) {
        for([colInd, value] of row.entries()) {
            if(value === 2) {
                return [colInd,rowInd];
            }
        }
    }
}

// listen for left right arrow keys until enter is pressed
function listenForDirections() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
    let keyName = event.key;

    switch (keyName) {
        case 'ArrowLeft':
            directions.push('←');
            break;
        case 'ArrowRight':
            directions.push('→');
            break;
        case 'ArrowUp':
            directions.push('↑');
            break;
        case 'ArrowDown':
            directions.push('↓');
            break;
        case 'Backspace':
            directions.pop();
            break;
        case 'Enter':
            document.removeEventListener('keydown', handleKeyDown);

            // start game
            window.setTimeout(runSingleStep, 500);
            break;
        default:
            return;
    }

    // update the ui
    directionLabel.textContent = 'Directions:' + directions.join('');
}

function runSingleStep() {
    directionLabel.textContent = 'Directions:' + directions.join('');

    drawCurrentStep();

    if (!gameOver(onWin, onLose)) {
        getNextPos();
        window.setTimeout(runSingleStep, 500);
    }
}

function onWin(){
    resultLabel.style.backgroundColor = 'green';
    resultLabel.textContent = 'Congrats, you win!';

    addResetButton();
}

function addResetButton() {
    resetButton = document.createElement('button');
    resetButton.textContent = 'Play again';
    resetButton.addEventListener('click', resetAndRunGame);
    document.body.append(resetButton);
}

function onLose(){
    resultLabel.style.backgroundColor = 'red';
    resultLabel.textContent = 'Sorry, you lost!';

    addResetButton();
}

// game is over if current pos is outside the maze limits, in a wall, or at the end
function gameOver(onWin, onLose){
    if(outsideLimits() || maze[currentPos[1]][currentPos[0]] === 0) {
        onLose();
        return true;
    }else if(directions.length === 0){
        if(maze[currentPos[1]][currentPos[0]] === 3) {        
            onWin();
            return true;
        }else{
            onLose();
            return true;
        }
    }else{
        return false;
    }
}

function outsideLimits(){
    let xPos = currentPos[0];
    let yPos = currentPos[1];
    let xMax = maze[0].length-1;
    let yMax = maze.length-1;

    if(xPos < 0 || xPos > xMax || yPos < 0 || yPos > yMax) {
        return true;
    }else{
        return false;
    }
}

// remove the first item from the directions list
function getNextPos() {
    let nextDir = directions.shift();

    let incr;
    switch (nextDir) {
        case '←':
            incr = [-1, 0];
            currentDir = Math.PI;
            break;
        case '→':
            incr = [1, 0];
            currentDir = 0;
            break;
        case '↑':
            incr = [0, -1];
            currentDir = 3/2 * Math.PI;
            break;
        case '↓':
            incr = [0, 1];
            currentDir = 1/2 * Math.PI;
            break;
        default:
            return;
    }
    currentPos[0] += incr[0];
    currentPos[1] += incr[1];
}

function drawCurrentStep() {
    // display the initial position
    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height); // clear canvas
    drawMaze();
    drawPlayer(currentPos, currentDir);
}

function drawMaze() {
    maze.forEach((row, rowInd) => {
        row.forEach((cell, cellInd) => {
            switch (cell) {
                case 0: // wall
                    ctx.fillStyle = 'rgb(0,0,0)';
                    break;
                case 1: // path                
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    break;
                case 2: // start
                    ctx.fillStyle = 'rgb(0, 255, 0)';
                    break;
                case 3: // end
                    ctx.fillStyle = 'rgb(255, 0, 0)';
                    break;
            }
            
            ctx.fillRect(x = (cellInd) * cellWidth, y = (rowInd) * cellHeight, w = cellWidth, h = cellHeight);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.strokeRect(x = (cellInd) * cellWidth, y = (rowInd) * cellHeight, w = cellWidth, h = cellHeight);
        });
    });
}

function drawPlayer(pos, dir) {
    // draw a pacman circle with arc in the direction indicated
    ctx.fillStyle = 'blue';

    const mouthAngle = Math.PI / 2;
    let x = pos[0] * cellWidth + cellWidth / 2;
    let y = pos[1] * cellHeight + cellHeight / 2;
    const radius = Math.min(cellWidth, cellHeight) / 2;
    let startAngle = dir + mouthAngle / 2;
    let endAngle = dir + 2 * Math.PI - mouthAngle / 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
}