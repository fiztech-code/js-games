class Ball {
    constructor(ctx) {
        this.ctx = ctx;
        
        this.size = 20
        this.radius = this.size / 2;
        
        this.x = ctx.canvas.width / 2 - this.radius;
        this.y = ctx.canvas.height / 2 - this.radius;
    }

    #dx = 3;
    #dy = 1;

    getDirection() {
        return this.#dx < 0;
    }

    draw() {
        //this.ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.size,this.size);

        this.ctx.lineWidth = 1;
        this.ctx.beginPath();        
        this.ctx.strokeStyle = 'red';
        this.ctx.arc(this.x+this.radius, this.y+this.radius, this.radius, 0, Math.PI * 2);    
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    server(paddle) {
        this.x = this.ctx.canvas.width / 2 - this.radius;
        this.y = this.ctx.canvas.height / 2 - this.radius;

        if (paddle.player == 1) {
            this.#dx = -3;
            let deg = Math.random() * ((Math.PI*1.25) - (Math.PI*0.75)) + (Math.PI*0.75);
            
            //map(deg,-(2*Math.PI),2*Math.PI,-360,360)
            this.#dy = Math.sin(deg);
            return;
        } 
        
        this.#dx = 3;
        let deg = Math.random()* (Math.PI/2) - (Math.PI/4);
        this.#dy = Math.sin(deg);
    }

    hit(p1, p2) {
        this.#move();

        let paddle;
        if ((this.x) < (p1.x + p1.width) && this.#dx < 0) {
            paddle = p1;
        }
        if ((this.x + this.size) > (p2.x) && this.#dx > 0) {
            paddle = p2;
        }

        if (!paddle) {
            return '';
        }

        if ((this.y + (this.size * 0.75)) >= paddle.y && (this.y + (this.size * 0.25)) < (paddle.y + paddle.height)) {
            this.#dx = this.#dx > 0 ? this.#dx*-1 : Math.abs(this.#dx);
            if (this.#dx > 0) {                
                let offset = this.y - (p1.y - this.size * 0.75);
                let deg = map(offset,0, p1.height + (this.size * 0.25), 0, Math.PI*0.7)-(Math.PI*0.35);
                this.#dy = Math.sin(deg);                
            } else {                
                let offset = this.y - (p2.y - this.size * 0.75);
                let deg = map(offset,p2.height + (this.size * 0.25), 0, Math.PI*0.55, Math.PI*1.45);
                this.#dy = Math.sin(deg);    
                //console.log('p2', offset, Math.floor(map(deg,0,2*Math.PI,0,360)));            
            }
        }        

        return paddle;
    }

    score(p1, p2) {
        if (this.x + this.size > this.ctx.canvas.width) {            
            return p1;
        } else if (this.x < 0) {            
            return p2;
        }
        return '';
    }  

    #move() {
        this.x += this.#dx;
        this.y += this.#dy;

        if (this.y < 0) {
            this.#dy = Math.abs(this.#dy);
        } else if (this.y + this.size > this.ctx.canvas.height) {
            this.#dy *= -1;
        }
    }
}