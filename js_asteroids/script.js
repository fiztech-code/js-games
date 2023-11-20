const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const width = 800;
const height = 600;

ctx.canvas.width = width;
ctx.canvas.height = height;

let ship;
let bullets;
let asteroids;
let crash;

function newGame() {
    crash = false;
    ship = new Ship();
    bullets = [];
    asteroids = [
        new Asteroid(200,100,0,3),new Asteroid(350,100,0,2),new Asteroid(500,100,0,2),
        new Asteroid(200,500,0,3),new Asteroid(350,500,0,2),new Asteroid(500,500,0,3)
    ];
}

newGame();

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let buttons = {
    'ArrowLeft': false,
    'ArrowUp': false,
    'ArrowRight': false,
    'Space': false
};

let drawTime = 0;
let timeOut = 0;


document.addEventListener('keydown', (event) => {
    let key = event.code;
    if (Object.keys(buttons).indexOf(key) == -1 || buttons[key]) {
        return;
    }

    buttons[key] = true;  
    if (key == 'ArrowUp') {
        ship.thrust = true;
    }
    else if (key == 'ArrowLeft') {
        ship.rotate = 1;        
    }
    else if (key == 'ArrowRight') {
        ship.rotate = -1;        
    }
    else if (key == 'Space') {
        ship.fire = true;    
    }

});

document.addEventListener('keyup', (event) => {
    let key = event.code;
    if (Object.keys(buttons).indexOf(key) == -1) {
        return;
    }

    buttons[key] = false;

    if (key == 'ArrowUp') {
        ship.thrust = false;
    }
    else if (key == 'ArrowLeft') {
        ship.rotate = 0;        
    }
    else if (key == 'ArrowRight') {
        ship.rotate = 0;        
    }
    else if (key == 'Space') {
        ship.fire = false;    
    }
});

function deg(degrees) {
    return degrees * Math.PI / 180;
}

function draw(time) {   
    drawTime = time;
    

    if (time - timeOut > 1000) {
        newGame();
    }   
    if (crash) {
        requestAnimationFrame(draw);
        return;
    }
    timeOut = time;        
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    if (asteroids.length < 6) {
        let x = Math.floor(Math.random() * ctx.canvas.width) + 1;
        let y = Math.floor(Math.random() * ctx.canvas.height) + 1;
        asteroids.push(new Asteroid(x,y,0,3));
    }
     
    ship.draw();

    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        if (!bullet.isOnscreen()) {
            bullets.splice(i, 1);
            continue;
        }
        bullet.draw();

        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            if (asteroid.shot(bullet)) {                
                asteroids.splice(j, 1);
                if (asteroid.sz > 1) {
                    asteroids.push(new Asteroid(asteroid.x-asteroid.size,asteroid.y-asteroid.size,0,asteroid.sz-1));
                    asteroids.push(new Asteroid(asteroid.x+asteroid.size,asteroid.y+asteroid.size,0,asteroid.sz-1));
                }
            }            
        }    
    }    

    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];  
        if (ship.crash(asteroid)) {        
            crash = true;
        }   
        asteroid.draw();
    }    

    requestAnimationFrame(draw);
}

draw();

