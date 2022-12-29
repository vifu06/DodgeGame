let gamePiece;
let gameCanvas;
let maxSpeed = 5;
let obstacle;
const gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.id = "gameArea";
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.canvas.tabIndex = 1;
        this.canvas.autofocus = true;
        document.body.append(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function setupGame() {
    console.log("Game starts");
    gameArea.start();
    gameCanvas = document.getElementById('gameArea');
    gamePiece = new Component(30,30,"red",10,120);
    obstacle = new Component(30,30,"green",gameCanvas.width-30,20);
}

class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function() {
            let ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        this.newPos = function() {
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
    }
}

function updateGameArea() {
    gameArea.clear();
    obstacle.update();
    gamePiece.newPos();
    gamePiece.update();
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