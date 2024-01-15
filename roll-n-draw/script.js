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
let map = (val, a1, a2, b1, b2) => b1 + (val - a1) * (b2 - b1) / (a2 - a1);

let rotateZ = 0;
let rotateSpeed = 0;

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

  }
  
  update(deltaTime) { 
    let ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save()
    ctx.translate(this.center, this.center)
    //rotateZ += rotateSpeed;
    rotateSpeed -= 0.01;

    //if (rotateSpeed <= 0) {
      //rotateSpeed = (Math.random() * 0.1) + 0.0001;
    //}
    //console.log(rotateZ);
    for (let i = this.sliceCount - 1; i >= 0; i--) {

        //let rad = this.sliceRadians * i + ((deltaTime * speedRange.value) % Math.PI*2);
        let rad = this.sliceRadians * i + rotateZ;
        


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
  //requestAnimationFrame(update);
  //pizza.update(deltaTime);
}())