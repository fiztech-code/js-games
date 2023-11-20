class Bird {
    constructor() {
        this.size = 20
        this.radius = this.size / 2;
        
        this.x = this.radius;
        this.y = ctx.canvas.height / 2 - this.radius;
        
        this.isKeyDown = false;

        this.gravity = 0.1;        

        document.addEventListener('keydown', this.keyDown.bind(null, this), false);
        document.addEventListener('keyup', this.keyUp.bind(null, this), false);
    }

    reset() {
        this.y = ctx.canvas.height / 2 - this.radius;
        this.gravity = 0.1;   
    }

    keyDown(bird, event) {
        let key = event.keyCode;
        if (key != 38 || bird.isKeyDown) {
            return;
        }

        bird.isKeyDown = true;

        if (bird.gravity > 0) {
            bird.gravity = 0;    
        }
        bird.gravity -= 1.5;
    }

    keyUp(bird, event) {
        let key = event.keyCode;
        if (key != 38) {
            return;
        }
        bird.isKeyDown = false;        
    }

    
    fly() {
        this.gravity += 0.1;
        this.y += this.gravity;
    }

    hitGround() {
        return this.y + (this.radius * 2) >= ctx.canvas.height;
    }

    hitPipe(pipe) {
        if (this.x >= pipe.x && this.x < (pipe.x + pipe.width)) {
            if ((this.y - this.radius) < pipe.h1 || (this.y + this.radius) >= pipe.y2) {
                return true;
            }
        }
        return false;
    }

    draw() {
        //this.ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.size,this.size);

        ctx.lineWidth = 1;
        ctx.beginPath();        
        ctx.strokeStyle = 'red';
        ctx.arc(this.x+this.radius, this.y+this.radius, this.radius, 0, Math.PI * 2);    
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }      
}