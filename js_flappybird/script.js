const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const screen = 800;
const block = screen / 20
ctx.canvas.width = screen;
ctx.canvas.height = screen / 2;

let pipes = [new Pipe(screen - 230), new Pipe(0)];
const bird = new Bird();


function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function draw() {
    if (bird.hitGround() || bird.hitPipe(pipes[0])) {
        console.log('bird dead');
        reset();    
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.move();
        pipe.draw();
        
        if ((pipe.x + pipe.width) < 0) {
            pipes.splice(0,1);
        }
    }    
    let lastPipe = pipes[pipes.length-1];
    if (pipes.length < 4 && lastPipe.x < (ctx.canvas.width - 230)) {
        pipes.push(new Pipe());
    }
    bird.fly();
    bird.draw();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

function reset() {   
    bird.reset();
    pipes = [new Pipe(screen - 230), new Pipe(0)];     
}