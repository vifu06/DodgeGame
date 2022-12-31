let gamePiece;
let gameCanvas;
let score = 0;
let maxSpeed = 9;
let gameStatus = false;
let obstacles = [];
let clouds = [];
let intervals = [];

const gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.id = "gameArea";
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        this.canvas.tabIndex = 1;
        this.canvas.autofocus = true;
        this.frameNo = 0;
        document.getElementById('canvasHolder').append(this.canvas);
        this.interval = setInterval(updateGameArea, 10);
        intervals.push(this.interval);
    },
    clear : function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        intervals.forEach((interval)=>{
            clearInterval(interval);
        })
    }
}

function setupGame() {
    console.log("Game setup");
    gameArea.start();
    gameCanvas = document.getElementById('gameArea');
    gamePiece = new Component(90,60,'./assets/player.png',10,120,'img');
    document.getElementById('score').textContent = 0;
}

function startGame() {
    console.log("Game starts");
    generateClouds();
    generateObstacles();
    document.getElementById("screen").style.display = "none";
    gameCanvas.focus();
    gameStatus = true;
}

function generateObstacles() {
    let obstacleInterval = setInterval(()=>{
        obstacles.push(new Component(75,50,"./assets/opponent.png",gameCanvas.width,generateRandomNumber(1,gameCanvas.height-50),'img'));
    },generateRandomNumber(1000,2000));
}

function generateClouds() {
    let newCloud = setInterval(()=>{
        console.log('cloud')
        clouds.push(new Component(150,100,'./assets/clouds.png',gameCanvas.width,generateRandomNumber(1,100),'img'));
    }, generateRandomNumber(1000,3000));
    intervals.push(newCloud);
}

function generateRandomNumber(min,max) {
    return Math.floor((Math.random() * (max - min) + min));
}

function updateObstacles() {
    obstacles.forEach((obstacle)=>{
        obstacle.speedX = -3;
        obstacle.newPos('obstacle');
        obstacle.update();
    });
}

function updateClouds() {
    clouds.forEach((cloud)=>{
        cloud.speedX = -1;
        cloud.newPos('obstacle');
        cloud.update();
    })
}

function updateGameArea() {
    if(gameStatus) {
        checkCollision();
        gameArea.clear();
        gameArea.frameNo += 1;
        updateClouds();
        updateObstacles();
        gamePiece.newPos('player');
        gamePiece.update();
        calculateScore();
    }
}

function calculateScore() {
    let score;
    let frameScore = Math.floor(gameArea.frameNo/50);
    score = frameScore;
    document.getElementById('score').textContent = score;
}

function checkCollision() {
    obstacles.forEach((obstacle)=>{
        if(gamePiece.crashCheck(obstacle)){
            gameArea.stop();
        }
    });
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
    }
    update () {
        let ctx = gameArea.context;
        if(this.type == 'img') {
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    newPos(type) {
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
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
    crashCheck (obstacle) {
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