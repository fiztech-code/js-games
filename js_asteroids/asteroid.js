class Asteroid {
    constructor(x,y,r,s) {
        this.x = x;
        this.y = y;
        this.r = r;

        // 38, 24, 13.5  
        this.sz = s;
        this.sizeRatio = s == 3 ? 1.25 : (s == 2 ? 0.75 : 0.45);
        this.size = this.sizeRatio * 30;

        if (this.r == 0) {
            this.r = Math.random() * (2*Math.PI);
        }
        this.speedX = Math.cos(this.r) * 1;
        this.speedY = (Math.sin(this.r) * 1) * -1;
    }

    draw() {
        this.x += this.speedX;
        this.y += this.speedY;

        if ((this.x - this.size) > ctx.canvas.width) {
            this.x = -this.size;
        } else if ((this.x + this.size) < 0) {
            this.x = ctx.canvas.width+this.size;
        } else if ((this.y - this.size) > ctx.canvas.height) {
            this.y = -this.size;
        } else if ((this.y + this.size) < 0) {
            this.y = ctx.canvas.height+this.size;
        }

    
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.beginPath();        
        //ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.moveTo(this.x-10*this.sizeRatio, this.y-26*this.sizeRatio);
        ctx.lineTo(this.x+10*this.sizeRatio, this.y-22*this.sizeRatio);
        ctx.lineTo(this.x+12*this.sizeRatio, this.y-11*this.sizeRatio);
        ctx.lineTo(this.x+28*this.sizeRatio, this.y-8*this.sizeRatio);
        ctx.lineTo(this.x+30*this.sizeRatio, this.y+8*this.sizeRatio);
        ctx.lineTo(this.x+18*this.sizeRatio, this.y+7*this.sizeRatio);
        ctx.lineTo(this.x+18*this.sizeRatio, this.y+22*this.sizeRatio);
        ctx.lineTo(this.x-4*this.sizeRatio, this.y+28*this.sizeRatio);
        ctx.lineTo(this.x-12*this.sizeRatio, this.y+10*this.sizeRatio);
        ctx.lineTo(this.x-28*this.sizeRatio, this.y+12*this.sizeRatio);
        ctx.lineTo(this.x-26*this.sizeRatio, this.y-4*this.sizeRatio);
        ctx.lineTo(this.x-12*this.sizeRatio, this.y-6*this.sizeRatio);
        ctx.closePath();
        ctx.stroke();
    }

    shot(bullet) {
        let shot = false;
        if (bullet.x > this.x - this.size && bullet.x < this.x + this.size){
            if (bullet.y > this.y - this.size && bullet.y < this.y + this.size){
                shot = true;
            }   
        }
        return shot;
    }
}