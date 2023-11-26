const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const screen = 800;
const block = screen / 20
ctx.canvas.width = screen;
ctx.canvas.height = screen / 2;

const p1 = new Paddle(1, ctx);
const p2 = new Paddle(2, ctx);
const ball = new Ball(ctx);

let winner = p2;
let hitter;
let speed = 20;

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.moveTo(ctx.canvas.width/2, 0);
    ctx.lineTo(ctx.canvas.width/2, ctx.canvas.height);
    ctx.stroke();  
    
    
    p1.draw(ball);
    p2.draw();    
    ball.draw();
    requestAnimationFrame(draw);
}

function game() {
    winner = ball.score(p1,p2);
    if (winner) {
        clearInterval(clock);        
        console.log('P', winner.player, 'win!');
        reset();
        return;
    }

    hitter = '';
    if (isPlaying) {
        hitter = ball.hit(p1,p2);
    }    
    if (hitter) {        
        speedUp();
    }
    
}

let isPlaying = true;
// function play() {
//     if (isPlaying) {        
//         isPlaying = false;
//         document.querySelector('#btnPlay').textContent = 'play';
//         return;
//     }    
//     isPlaying = true;
//     document.querySelector('#btnPlay').textContent = 'pause';
// }

// function step() {
//     ball.hit(p1,p2);
// }

function speedUp() {
    let reduceBy = Math.floor(speed*0.2);
    speed-=reduceBy;
    if (speed < 4) {
        speed = 4;
    }    
    clearInterval(clock);
    clock = setInterval(game, speed);
}

function reset() {
    speed = 20;
    setTimeout(function() {
        ball.server(winner);
        clock = setInterval(game, speed);
    }, 1500);
}

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let clock = setInterval(game, speed);
requestAnimationFrame(draw);
//setInterval(draw, 30);