class Bullet {    
    constructor(x,y,r) {   
        this.x = x;
        this.y = y;

        this.r = r;

        this.speedX = Math.cos(this.r) * 10;
        this.speedY = (Math.sin(this.r) * 10) * -1;
    }

    draw() {
        this.x += this.speedX;
        this.y += this.speedY;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.beginPath();        
        ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    isOnscreen() {
        let onscreen = false;
        if (this.x > 0 && this.x < ctx.canvas.width) {
            if (this.y > 0 && this.y < ctx.canvas.height) {            
                onscreen = true;
            }            
        }
        return onscreen;
    }
}