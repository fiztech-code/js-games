const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let padding = document.querySelector('nav').offsetHeight;
padding += document.querySelector('.title').offsetHeight;
padding += document.querySelector('.description').offsetHeight;
padding += document.querySelector('.source-link').offsetHeight;

let maxCanvasHeight = window.outerHeight - padding - 100;

const height = maxCanvasHeight - (maxCanvasHeight % 90); //900;
const width = height / 1.8; //500;
const offset = height / 18; //50;
const block = height / 22.5; //40;

ctx.canvas.width = width;
ctx.canvas.height = height;

const gridWidth = 10;
const gridHeight = 20;
let grid = new Array(gridHeight);
for (let i = 0; i < gridHeight; i++) {
    grid[i] = new Array(gridWidth).fill(0);
}

let moveX = 0;
let moveY = 0;

let shape = new Shape();

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let buttons = {
    'ArrowLeft': false,
    'ArrowDown': false,
    'ArrowRight': false,
    'Space': false
};

let drawTime = 0;
let prev = 0;
let movePrev = 0;

document.addEventListener('keydown', (event) => {
    let key = event.code;
    if (Object.keys(buttons).indexOf(key) == -1 || buttons[key]) {
        return;
    }

    buttons[key] = true;    

    if (key == 'ArrowLeft') {
        shape.moveX(-1);             
    } else if (key == 'ArrowRight') {
        shape.moveX(1);      
    } else if (key == 'ArrowDown') {                
        shape.moveY(1);               
    } else if (key == 'Space') {
        shape.rotate();
    }

    movePrev = drawTime;
});

document.addEventListener('keyup', (event) => {
    let key = event.code;
    if (Object.keys(buttons).indexOf(key) == -1) {
        return;
    }

    buttons[key] = false;
});


function draw(time) {   
    drawTime = time;

    if (buttons.ArrowLeft || buttons.ArrowRight || buttons.ArrowDown) {
        if (time - movePrev > 100) {
            movePrev = time;
            if (buttons.ArrowLeft) {
                shape.moveX(-1); 
            } 
            if (buttons.ArrowRight) {
                shape.moveX(1); 
            } 
            if (buttons.ArrowDown) {
                shape.moveY(1); 
            } 
        }
    }

    if (time - prev > 500) {        
        prev = time; 
        
        shape.moveY(1);  
        
        if (grid[0].some(g => g)) {            
            newGame();
        }
    }
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
   
    ctx.beginPath();
    ctx.strokeStyle = 'white';    
    ctx.moveTo(offset, offset);    
    ctx.lineTo(offset, height-offset);    
    ctx.lineTo(width-offset, height-offset);    
    ctx.lineTo(width-offset, offset);
    ctx.stroke();    
  
    shape.draw();

    
    for (let col = grid.length - 1; col >= 0; col--) {
        for (let row = grid[col].length - 1; row >= 0; row--) {
            if (!grid[col][row]) {
                continue;
            }

            let x = offset + (row * block);
            let y = offset + (col * block);

            ctx.fillStyle = shapeColors[grid[col][row]];
            ctx.fillRect(x, y, block, block);
        }
    }

    ctx.strokeStyle = '#333';    
    for (let j = offset; j <= (height-offset-block); j+=block) {
        ctx.beginPath();               
        ctx.moveTo(offset, j);
        ctx.lineTo(width-offset, j);
        ctx.stroke();    
    }    
    for (let j = (offset + block); j <= (width-offset); j+=block) {
        ctx.beginPath();        
        ctx.moveTo(j, offset);
        ctx.lineTo(j, height-offset);
        ctx.stroke();    
    }

    requestAnimationFrame(draw);
}

draw();

function newGame() {
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(gridWidth).fill(0);
    }
}