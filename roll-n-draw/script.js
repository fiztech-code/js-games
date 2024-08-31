const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const screen = 800;

ctx.canvas.width = screen;
ctx.canvas.height = 446;//screen / (4/3);

var i = 0;
var d = 2;

var img = new Image();
img.onload = function() {
    //console.log('img loaded');
}
//img.src = "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg";
img.src = 'https://bellard.org/bpg/2.png';



function deg(degrees) {
    return degrees * Math.PI / 180;
}
let prevDelta = 0;
let rotate = 0;
//console.log('test1');
//ctx.rotate(-Math.PI/2);
function draw(deltaTime) {
    if (!play.checked) {
        return;
    }
    //console.log(deltaTime);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
   /*
    
    
    let step = deltaTime - prevDelta;    
    prevDelta = deltaTime;
    //i = step*i || 1;
    i += step * d;
    //console.log(step, i);
    //
    //rotate += step*0.00022;

    ctx.save(); 
    ctx.translate(0, 0);
    ctx.rotate(rotate);
    //ctx.fillStyle = 'white';
    //ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, i, 0);
    ctx.restore(); 
   
    //i += d;
    if (i > 280) {
        d = -0.05;
    } else if (i < 0) {
        d = 0.05;   
    }
    */
    
    requestAnimationFrame(draw);
}

//requestAnimationFrame(draw);
let playButton = document.querySelector('#play');
playButton.addEventListener('click', (e) => {
    if (play.checked) {
        //requestAnimationFrame(draw);
    }
});

let speedRange = document.querySelector('#speed');

//'use strict'

let toRadians = (deg) => deg * Math.PI / 180;
let toDegrees = (rad) => rad * 180 / Math.PI;
let map = (val, a1, a2, b1, b2) => b1 + (val - a1) * (b2 - b1) / (a2 - a1);

let rotateZ = 0;
let rotateSpeed = 0;

let rotateTimeout = 0;

let resetRotateTimeout = false;
function startRotate() {
  resetRotateTimeout = true;
  requestRotate = true;
}

let requestRotate = false;

class Pizza {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');

    this.sliceCount = 6;
    this.sliceSize = 160;

    this.width = this.height = this.canvas.height = this.canvas.width = this.sliceSize * 2 + 50;
    this.center = this.height / 2 | 0;

    this.sliceDegree = 360 / this.sliceCount;
    this.sliceRadians = toRadians(this.sliceDegree);
    this.progress = 0;
    this.cooldown = 10;

    this.acceleration = 0;
    this.velocity = 0;
    this.displacement = 0;
    this.rotateInterval = 3000; // ms
    this.positon = 0;
    
    this.posX = 0;
    this.posY = 0;
    this.distance = 0;

    this.result = [];
  }
  
  update(deltaTime) { 
    if (!playButton.checked) {
      return;
    }
    let ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //ctx.clearRect(0, 0, this.width, this.height);

    ctx.save()
    ctx.translate(this.center, this.center);

      

    rotateZ += rotateSpeed;//parseFloat(speedRange.value);
    //this.distance += this.velocity;

    //rotateSpeed -= 0.01;
    if (resetRotateTimeout) {
      resetRotateTimeout = false;
      rotateTimeout = deltaTime;
    }

    if (this.velocity != 0) {
    //if (deltaTime - rotateTimeout < 3000 && requestRotate) {
      let millis = deltaTime - rotateTimeout;
      //let _millis = (rotateTimeout + 3000) - deltaTime;
      let t = map(millis,0,3000,0,1); //millis / 1000;
      //let a = 0.125; 
      //rotateSpeed = (0*t) + (0.5 * a * (t*t));

      //console.log(t);
      //console.log(i, 0.5-i);
      
      //console.log(rotateSpeed, a);  
      //rotateTimeout = deltaTime;

      //console.log('3sec', deltaTime, (new Date()).toISOString().split('T')[1]);

      let speed = this.velocity;
      let maxSpeed = 30;
      if (speed >= maxSpeed) {
          speed = maxSpeed;
      } else if (speed <= -maxSpeed) {
          speed = -maxSpeed;
      }

      if (speed >= 0.1) {
        speed -= 0.1;          
      } else if (speed <= -0.1) {
        speed += 0.1;
      } else {
        speed = 0;
      }

      this.velocity = speed;
      this.distance += speed;
      console.log(this.velocity, this.distance);







      // if (millis < (this.rotateInterval / 2)) {
      //   this.acceleration = 120 * t;
      // } else {
      //   this.acceleration = -120 * t + 360;
      // }

      // this.acceleration = 200;

      // console.log('this.velocity',this.velocity);
      //  //this.velocity = this.acceleration * t;
      //  if (this.velocity > 0) {
      //   this.velocity -= 10; 
      //  } else if  (this.velocity < 0) {
      //   this.velocity += 10; 
      //  }

      //  this.displacement = (this.velocity * t) + (0.5 * this.acceleration * (t * t));
      //  this.distance = this.displacement;

      //console.log(this.acceleration, this.velocity, this.displacement, t);
      
      //this.displacement %= 360;
      //console.log(Math.floor(this.displacement), toRadians(this.displacement));
      
      // let p1 = [0, 0];
      // let p2 = [0.2, 0];
      // let p3 = [0.4, 1];
      // let p4 = [1, 1];
      // //let x = (1-t)*3*p1[0] + 3*((1-t)*(1-t)) * t * p2[0] + 3 * (1-t) * (t*t) * p3[0] + (t*t*t) * p4[0];
      // let y = (1-t)*3*p1[1] + 3*((1-t)*(1-t)) * t * p2[1] + 3 * (1-t) * (t*t) * p3[1] + (t*t*t) * p4[1]; // bezier curve formula **magic
      
      // //this.position = y*(4*360);
      // //this.distance = (y-this.posY) / (x-this.posX);
      // //this.posX = x;
      // //this.posY = y;
      // this.distance = y*(4*360);
      // //console.log(this.distance);
      // // this.result.push({
      // //   x: x,
      // //   y: y,
      // //   t: t,
      // //   d: this.distance
      // // });


    } else {
      
      //rotateSpeed = 0;
      //this.acceleration = 0;
      //this.position = 0;
      // if (this.result.length) {
      //   console.table(this.result);
      //   this.result = [];
      // }

    }

    // if (rotateZ >= (2*Math.PI)) {
    //   //console.log('lap');
    //   rotateZ = 0;
    //   //rotateSpeed = (Math.random() * 0.1) + 0.0001;
    // }

   
    //console.log(rotateZ);
    for (let i = this.sliceCount - 1; i >= 0; i--) {

        //let rad = this.sliceRadians * i + ((deltaTime * speedRange.value) % Math.PI*2);
        //let rad = this.sliceRadians * i + rotateZ;
        //let rad = this.sliceRadians * i + toRadians(this.displacement);
        let rad = this.sliceRadians * i + toRadians(this.distance);
        


        // border
        ctx.beginPath();
        ctx.lineCap = 'butt';
        ctx.lineWidth = 11;
        ctx.arc(0, 0, this.sliceSize, rad, rad + this.sliceRadians);
        ctx.strokeStyle = '#F57F17';
        ctx.stroke();

        // slice
        let startX = this.sliceSize * Math.cos(rad);
        let startY = this.sliceSize * Math.sin(rad);
        //let endX = this.sliceSize * Math.cos(rad + this.sliceRadians)
        //let endY = this.sliceSize * Math.sin(rad + this.sliceRadians)
        //let varriation = [0.9,0.7,1.1,1.2]
        ctx.fillStyle = i === this.sliceCount - 1 ? '#FBC0FF' : '#FBC02D';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(startX, startY);
        ctx.arc(0, 0, this.sliceSize, rad, rad + this.sliceRadians);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = .3;
        ctx.stroke();

        // meat
        //   let x = this.sliceSize * .65 * Math.cos(rad + this.sliceRadians / 2)
        //   let y = this.sliceSize * .65 * Math.sin(rad + this.sliceRadians / 2)
        //   ctx.beginPath()
        //   ctx.arc(x, y, this.sliceDegree / 6, 0, 2 * Math.PI)
        //   ctx.fillStyle = '#D84315'
        //   ctx.fill()

    }

    ctx.restore();
  }
}

function cheese(ctx, rad, multi, ii, sliceSize, sliceDegree) {
  let x1 = sliceSize * multi * Math.cos(toRadians(ii * sliceDegree) - .2)
  let y1 = sliceSize * multi * Math.sin(toRadians(ii * sliceDegree) - .2)
  let x2 = sliceSize * multi * Math.cos(rad + .2)
  let y2 = sliceSize * multi * Math.sin(rad + .2)

  let csx = sliceSize * Math.cos(rad)
  let csy = sliceSize * Math.sin(rad)

  var d = Math.sqrt((x1 - csx) * (x1 - csx) + (y1 - csy) * (y1 - csy))
  ctx.beginPath()
  ctx.lineCap = 'round'

  let percentage = map(d, 15, 70, 1.2, 0.2)

  let tx = x1 + (x2 - x1) * percentage
  let ty = y1 + (y2 - y1) * percentage
  ctx.moveTo(x1, y1)
  ctx.lineTo(tx, ty)

  tx = x2 + (x1 - x2) * percentage
  ty = y2 + (y1 - y2) * percentage
  ctx.moveTo(x2, y2)
  ctx.lineTo(tx, ty)

  ctx.lineWidth = map(d, 0, 100, 20, 2)
  ctx.stroke()
}

let pizza = new Pizza('canvas');

(function update(deltaTime) {
  requestAnimationFrame(update);
  pizza.update(deltaTime);
}())


canvas.addEventListener('touchstart', (e) => {
  console.log('touchstart');
  e.x = e.targetTouches[0].clientX;
  e.y = e.targetTouches[0].clientY;

  degreeOffset = getMouseDegrees(e);
  wheelDistance = pizza.distance;
});
canvas.addEventListener('touchmove', (e) => {
  console.log('touchmove');
  e.x = e.targetTouches[0].clientX;
  e.y = e.targetTouches[0].clientY;

  let degrees = getMouseDegrees(e) - degreeOffset;
  wheelSpeed = (pizza.distance - (wheelDistance + degrees)) / ((new Date() - prevTime) / 1000);
  prevTime = new Date();

  //console.log(Math.round(wheelSpeed));
  pizza.distance = wheelDistance + degrees;
});
canvas.addEventListener('touchend', (e) => {
  console.log('touchend');
});


function getMouseDegrees(event) {
  let wheelCenterX = canvas.offsetLeft + (canvas.width / 2);
  let wheelCenterY = canvas.offsetTop + (canvas.height / 2);

  let r = Math.atan2(event.y - wheelCenterY, event.x - wheelCenterX);
  if (r < 0) {
    r = (2 * Math.PI) - (r * -1);
  }

  return toDegrees(r);
}

let isMouseDown = false;
let degreeOffset = 0;
let wheelDistance = 0;

let wheelSpeed = 0;
let prevTime = 0;

canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;  
  
  degreeOffset = getMouseDegrees(e);
  wheelDistance = pizza.distance;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return;  
    
  let degrees = getMouseDegrees(e) - degreeOffset;
  wheelSpeed = ((pizza.distance % 360) - degrees);// / ((new Date() - prevTime) / 1000);
  prevTime = new Date();

  //console.log(Math.round(wheelSpeed));
  pizza.distance = wheelDistance + degrees;
});


canvas.addEventListener('mouseup', (e) => {  
  isMouseDown = false;  
  //console.log(Math.round(wheelSpeed))
  //if (Math.abs(wheelSpeed) > 400) {
    //wheelSpeed = wheelSpeed > 0 ? Math.min(wheelSpeed, 1800) : Math.max(wheelSpeed, -1800);
    //console.log('wheelSpeed', wheelSpeed);
    pizza.velocity = wheelSpeed;
    //wheelSpeed = 0;    
    //startRotate();
  //}
});

canvas.addEventListener('mouseleave', (e) => {
  isMouseDown = false;  
  //console.log(Math.round(wheelSpeed))
});