const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const screen = 600;
const block = screen / 20
ctx.canvas.height = screen;
ctx.canvas.width = screen;

let x = 10;
let y = 10;
let dx = -1;
let dy = 0;
let prevKey = 37;
let snake = [[10,10],[11,10],[12,10],[13,10],[14,10]];
let apple = [];

function makeApple() {
    apple = [Math.floor(Math.random() * 20),Math.floor(Math.random() * 20)];
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    snake.forEach((s,i) => {        
        ctx.fillStyle = 'green';
        ctx.fillRect(s[0]*block, s[1]*block, block, block);
    });

    //ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.arc(apple[0]*block+(block/2), apple[1]*block+(block/2), block/2, 0, 360);    
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
}

function game() {
    let prev = snake[0];
    snake.forEach((s,i) => {        
        if (i == 0) {
            return;
        }                
        snake[i] = prev;
        prev = s;
    });

    x += dx;
    y += dy;

    if (x >= 20) {
        x = 0;
    } else if (x < 0) {
        x = 19;
    } 

    if (y >= 20) {
        y = 0;
    } else if (y < 0) {
        y = 19;
    } 
    snake[0] = [x,y];

    let hasCrash = snake.some((s,i) => {
        let result = snake.filter(f => f[0] == s[0] && f[1] == s[1]);    
        return result.length > 1;    
    });
    if (hasCrash) {
        console.log('crash!, new game');
        reset();
    }

    let hasApple = snake[0][0] == apple[0] && snake[0][1] == apple[1];
    if (hasApple) {              
        snake.push(apple);
        makeApple();
    }    

    draw();    
}


function keyAction(event) {    
    let key = event.keyCode;
    if (key == 37 && prevKey != 39) { // left        
        dx = -1;
        dy = 0;
    } else if (key == 38 && prevKey != 40) { // up        
        dx = 0;
        dy = -1;
    } else if (key == 39 && prevKey != 37) { // right        
        dx = 1;
        dy = 0;
    } else if (key == 40 && prevKey != 38) { // down        
        dx = 0;
        dy = 1;
    } else {
        console.log('no!');
        return;
    }
    prevKey = key;
}

document.addEventListener('keydown', keyAction);
document.querySelector('.controls').addEventListener('mousedown', (ev) => {
    if (ev.target.className == 'up') {
        keyAction({keyCode: 38});
    } else if (ev.target.className == 'down') {
        keyAction({keyCode: 40});
    } else if (ev.target.className == 'left') {
        keyAction({keyCode: 37});
    } else if (ev.target.className == 'right') {
        keyAction({keyCode: 39});
    }
    //console.log(ev.target.className)
});

let clock = setInterval(game, 200);
let isRunning = true;
makeApple();

function reset() {
    x = 10;
    y = 10;
    dx = -1;
    dy = 0;
    prevKey = 37;
    snake = [[10,10],[11,10],[12,10],[13,10],[14,10]];
    makeApple();
}