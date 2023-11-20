class Pipe {
    constructor(x) {               
        
        this.width = 20;     
        this.x = x || ctx.canvas.width;           
        this.gate = this.gateSize();
        
        this.y1 = 0;        
        this.h1 = this.getY1(); 

        this.y2 = this.h1 + this.gate;        
        this.h2 = ctx.canvas.height - this.y1;         
    }

    gateSize() {
        return Math.floor(Math.random() * (120 - 80 + 1) + 80);
    }

    getY1() {
        return Math.floor(Math.random() * ((ctx.canvas.height * 0.75) + 1));
    }

    move() {
        this.x -= 2;
    }  

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y1, this.width, this.h1);
        ctx.fillRect(this.x, this.y2, this.width, this.h2);
    }
}