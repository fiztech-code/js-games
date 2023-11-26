class Paddle {
    constructor(player, ctx) {        
        this.player = player;
        this.ctx = ctx;
        
        this.width = 10;
        this.height = 80;

        this.direction = 0;

        this.x = player == 1 ? 2 : ctx.canvas.width - this.width - 2;
        this.y = (ctx.canvas.height / 2) - (this.height / 2);        

        document.addEventListener('keydown', this.keyDown.bind(null, this), false);
        document.addEventListener('keyup', this.keyUp.bind(null, this), false);
    }

    keyDown(paddle, event) {
        let key = event.keyCode;

        //if ([87,83,38,40].indexOf(key) == -1) {
        if ([38,40].indexOf(key) == -1) {            
            return;
        }

        //if (paddle.player == 2 && (key == 87 || key == 83)) { // w,s
        //    return;
        //}

        if (paddle.player == 1 && (key == 38 || key == 40)) { // up,down
            return;
        }

        paddle.direction = key == 87 || key == 38 ? -5 : 5;
       
    }

    keyUp(paddle, event) {
        let key = event.keyCode;

        //if ([87,83,38,40].indexOf(key) == -1) {
        if ([38,40].indexOf(key) == -1) {  
            return;
        }

        //if (paddle.player == 2 && (key == 87 || key == 83)) { // w,s
        //    return;
        //}

        if (paddle.player == 1 && (key == 38 || key == 40)) { // up,down
            return;
        }

        paddle.direction = 0;
    }

    draw(ball) {
        if (this.player == 1 && ball) {
            if (ball.x < this.ctx.canvas.width / 2 && ball.getDirection()) {
                if (this.y < ball.y) {
                    this.direction = 5;
                } else if (this.y + this.height > ball.y) {
                    this.direction = -5;
                } else {
                    this.direction = 0;
                }                
            } else {
                this.direction = 0;
            }
        }
        this.y += this.direction;
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > this.ctx.canvas.height) {
            this.y =  this.ctx.canvas.height - this.height;
        }

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}