let gamePiece;
let gameCanvas;
let maxSpeed = 9;
let obstacles = [];
let obstacleCount = 10;
let gameStatus = false;
let obstaclePosition = new Set();
const gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.id = "gameArea";
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        this.canvas.tabIndex = 1;
        this.canvas.autofocus = true;
        document.getElementById('canvasHolder').append(this.canvas);
        this.interval = setInterval(updateGameArea, 10);
    },
    clear : function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function setupGame() {
    console.log("Game setup");
    gameArea.start();
    gameCanvas = document.getElementById('gameArea');
    gamePiece = new Component(90,60,'./assets/player.png',10,120,'img');
    generateObstacles();
}

function startGame() {
    console.log("Game starts");
    document.getElementById("screen").style.display = "none";
    gameStatus = true;
}

function generateObstacles() {
    let iteration = 1;
    generateObstaclePosition();
    obstaclePosition.forEach((pos)=>{
        setTimeout(()=>{
            obstacles.push(new Component(30,30,"green",gameCanvas.width-30,pos,'box'));
        },iteration * 2000);
        iteration++;
    });
}

function generateObstaclePosition() {
    while (obstaclePosition.size < obstacleCount) {
        obstaclePosition.add(Math.floor((Math.random() * ((gameCanvas.height - 30) - 1) + 1)));
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle)=>{
        if(gamePiece.crashCheck(obstacle)){
            gameArea.stop();
            return;
        }
        obstacle.speedX = -3;
        obstacle.newPos('obstacle');
        obstacle.update();
    });
}

class Component {
    constructor(width, height, color, x, y, type) {
        this.type = type;
        if(type == 'img') {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function() {
            let ctx = gameArea.context;
            if(this.type == 'img') {
                ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        this.newPos = function(type) {
            if(type == 'player') {
                let tx = this.x;
                let ty = this.y;
                tx += this.speedX;
                ty += this.speedY;
                if(tx > 0 && tx < (gameCanvas.width - gamePiece.width)) {
                    this.x = tx;
                }
                if(ty > 0 && ty < (gameCanvas.height - gamePiece.height)) {
                    this.y = ty;
                }
            }
            if(type == 'obstacle') {
                if(this.x >= -30) {
                    this.x += this.speedX;
                }
                this.y += this.speedY;
            }
        }
        this.crashCheck = function(obstacle) {
            let piece = {
                left    : this.x,
                right   : this.x + this.width,
                top     : this.y,
                bottom  : this.y + this.height
            };
            let obsPiece = {
                left    : obstacle.x,
                right   : obstacle.x + obstacle.width,
                top     : obstacle.y,
                bottom  : obstacle.y + obstacle.height
            }
            let isCrash = true;
            if((piece.bottom < obsPiece.top) || (piece.top > obsPiece.bottom) || (piece.right < obsPiece.left) || (piece.left > obsPiece.right)) {
                isCrash = false;
            }
            return isCrash;
        }
    }
}

function updateGameArea() {
    if(gameStatus) {
        gameArea.clear();
        updateObstacles();
        gamePiece.newPos('player');
        gamePiece.update();
    }
}

function moveUp() {
    if(gamePiece.speedY > -(maxSpeed))
        gamePiece.speedY -= 1;
}

function moveDown() {
    if(gamePiece.speedY < maxSpeed)
        gamePiece.speedY += 1;
}

function moveLeft() {
    if(gamePiece.speedX > -(maxSpeed))
        gamePiece.speedX -= 1;
}

function moveRight() {
    if(gamePiece.speedY < maxSpeed)
        gamePiece.speedX += 1;
}

function clearmove() {
    gamePiece.speedX = 0; 
    gamePiece.speedY = 0; 
}

document.addEventListener('keydown', e => {
    if(document.activeElement === gameCanvas) {
        switch (e.code) {
            case 'ArrowLeft':
               moveLeft();
               break;
            case 'ArrowUp':
               moveUp();
               break;
            case 'ArrowRight':
               moveRight();
               break;
            case 'ArrowDown':
               moveDown();
               break;
         }
    }
});

document.addEventListener('keyup', e => {
    if(document.activeElement === gameCanvas) {
        clearmove();
    }
});
