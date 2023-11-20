class Ship {    
    constructor() {                        
        this.rotate = 0;
        this.r = 0;
        this.size = 20;

        this.speed = 0;        
        this.speedX = 0;
        this.speedY = 0;

        this.thrust = false;
        this.fire = false;

        this.center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2
        };
        this.left = {
            x: 0,
            y: 0
        };        
        this.nose = {
            x: 0,
            y: 0        
        };
        this.right = {
            x: 0,
            y: 0        
        };
    }

    draw() {        

        if (this.rotate == 1) {
            this.r += Math.PI/60;    
        } else if (this.rotate == -1) {
            this.r -= Math.PI/60;
        } 

        this.center.x += this.speedX;
        this.center.y += this.speedY;

        if ((this.center.x - this.size) > ctx.canvas.width) {
            this.center.x = -this.size;
        } else if ((this.center.x + this.size) < 0) {
            this.center.x = ctx.canvas.width+this.size;
        } else if ((this.center.y - this.size) > ctx.canvas.height) {
            this.center.y = -this.size;
        } else if ((this.center.y + this.size) < 0) {
            this.center.y = ctx.canvas.height+this.size;
        }
        //let radius = 100;

        // ctx.strokeStyle = 'blue';
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();        
        // ctx.arc(this.center.x,this.center.y,this.size,0,2*Math.PI);
        // ctx.stroke();

        // ctx.beginPath();        
        // ctx.arc(this.center.x,this.center.y,3,0,2*Math.PI);
        // ctx.stroke();       
        // ctx.fill();

        // ctx.beginPath();        
        // ctx.moveTo(this.center.x-this.size, this.center.y);  
        // ctx.lineTo(this.center.x+this.size, this.center.y);  
        // ctx.stroke();


        // ctx.beginPath();        
        // ctx.moveTo(this.center.x, this.center.y-this.size);  
        // ctx.lineTo(this.center.x, this.center.y+this.size);  
        // ctx.stroke();


        this.left.x = this.center.x-(this.size * Math.cos(this.r-(Math.PI/4)));
        this.left.y = this.center.y+(this.size * Math.sin(this.r-(Math.PI/4)));

        this.nose.x = this.center.x+(this.size * Math.cos(this.r));
        this.nose.y = this.center.y-(this.size * Math.sin(this.r));

        this.right.x = this.center.x-(this.size * Math.cos(this.r+(Math.PI/4)));
        this.right.y = this.center.y+(this.size * Math.sin(this.r+(Math.PI/4)));

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.left.x, this.left.y);        
        ctx.lineTo(this.nose.x, this.nose.y);
        ctx.lineTo(this.right.x, this.right.y);
        ctx.closePath();  
        ctx.stroke();

        
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();        
        // ctx.arc(this.left.x - this.nose.x,this.left.y - this.nose.y,3,0,2*Math.PI);
        // ctx.stroke();       
        // ctx.fill();

        // console.log(Math.abs(this.left.x - this.nose.x) + Math.abs(this.left.y - this.nose.y));

        if (this.thrust) {            
            this.speedX += Math.cos(this.r) * 0.1;
            this.speedY += (Math.sin(this.r) * 0.1) * -1;

            // max speed
            this.speedX = Math.min(this.speedX, 6);
            this.speedX = Math.max(this.speedX, -6);
            this.speedY = Math.min(this.speedY, 6);
            this.speedY = Math.max(this.speedY, -6);
            

            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';

            // left engine
            ctx.beginPath();
            ctx.moveTo(this.left.x, this.left.y);      

            let f = Math.sqrt(Math.pow((ship.center.x - ship.left.x), 2) + Math.pow((ship.center.y - ship.left.y), 2));
            //let b1 = Math.sin(Math.PI/4) * f;
            // let b2 = Math.sqrt(Math.pow((ship.nose.x - ship.center.x), 2) + Math.pow((ship.nose.y - ship.center.y), 2));
            // let b = b1 + b2;
            // let c =  Math.sqrt(Math.pow((ship.nose.x - ship.left.x), 2) + Math.pow((ship.nose.y - ship.left.y), 2));
            // let A = Math.acos(b/c);
            // let a = c * Math.sin(A);
            let a = Math.sin(Math.PI/4) * f;

            //console.log('b1',b1,'a',a, b1 == a);
            //console.log('f',f,'b1',b1,'b2',b2,'b', b,'c', c, 'A', A, 'a', a);
            
            ctx.lineTo(this.left.x-(a * Math.cos(this.r+deg(90))), this.left.y + (a * Math.sin(this.r+deg(90))));            
            ctx.lineTo(this.left.x-(a * Math.cos(this.r+deg(30))), this.left.y + (a * Math.sin(this.r+deg(30))));            
            ctx.closePath();
            ctx.fill();  
            ctx.stroke();

           

            // right engine
            //ctx.strokeStyle = 'green';
            ctx.beginPath();           
            ctx.moveTo(this.right.x, this.right.y);               
            ctx.lineTo(this.right.x-(a * Math.cos(this.r+deg(270))), this.right.y + (a * Math.sin(this.r+deg(270))));     
            ctx.lineTo(this.right.x-(a * Math.cos(this.r+deg(330))), this.right.y + (a * Math.sin(this.r+deg(330))));                   
            ctx.closePath();  
            ctx.fill();  
            ctx.stroke();

            // ctx.strokeStyle = 'orange';
            // ctx.fillStyle = 'orange';
            // ctx.beginPath();           
            // ctx.moveTo(this.right.x, this.right.y);               
            // ctx.lineTo(this.right.x-(a * Math.cos(this.r+deg(270))), this.right.y + (a * Math.sin(this.r+deg(270))));     

            // //sideC * Math.cos(DegreesToRadians(angleA))
            // //ctx.lineTo(this.right.x-(tempVal2 * Math.cos(this.r+deg(60))), this.right.y + (tempVal2 * Math.sin(this.r+deg(60))));                   
            // //ctx.closePath();  
            // //ctx.fill();  
            // ctx.stroke();

        }

        if (this.fire) { 
            bullets.push(new Bullet(this.nose.x, this.nose.y, this.r));
        }

        // for (var n = 0; n < 80; n++) {
        //     // Second path
        //     var k = n * 10;
        //     ctx.beginPath();
        //     ctx.strokeStyle = 'green';
        //     var y = Math.sin((n * 10) * Math.PI / 360) * 100+200;
        //     var x = Math.cos((n * 10) * Math.PI / 360) * 100;
        //     //alert(y);
        //     ctx.moveTo(200, 200);
        //     ctx.lineTo(x, y);
        //     ctx.stroke();
        // }
    }

    crash(asteroid) {
        let crash = false;

        let left = ship.center.x - ship.size/2;
        let right = ship.center.x + ship.size/2;
        let top = ship.center.y - ship.size/2;
        let bottom = ship.center.y + ship.size/2;

        let sidesX = [left, right];
        let sidesY = [top, bottom];
        
        sidesX.forEach(sideX => {
            if (sideX > asteroid.x - asteroid.size && sideX < asteroid.x + asteroid.size) {
                sidesY.forEach(sideY => {
                    if (sideY > asteroid.y - asteroid.size && sideY < asteroid.y + asteroid.size) {
                        crash = true;
                    }
                });                
            }
        });

        return crash;
    }   
}