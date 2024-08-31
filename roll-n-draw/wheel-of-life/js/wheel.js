class Wheel {
  constructor() {
    this.spinner = document.getElementById('spinner');
    this.wheelElm = document.getElementById('wheel');
    this.wheelElm.addEventListener('mousedown', (e) => {
      this.onGrab(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      if (e.which == 1)
        this.onMove(e.clientX, e.clientY);
      else if (!this.isDragging)
        this.onRelease()

    });
    window.addEventListener('mouseup', (e) => {
      this.onRelease.bind(this)();
    });

    this.wheelElm.addEventListener('touchstart', (e) => {
      this.onGrab(e.touches[0].clientX, e.touches[0].clientY);
    });
    window.addEventListener('touchmove', (e) => {
      this.onMove(e.touches[0].clientX, e.touches[0].clientY);
    });
    window.addEventListener('touchend', (e) => {
      this.onRelease.bind(this)();
    });

    this.calculatePositions();
    window.addEventListener('resize', (e) => {
      this.calculatePositions.bind(this)();
    });

    this.currentAngle = 0;
    this.oldAngle = 0;
    this.lastAngles = [0, 0, 0];
    this.isDragging = false;
    this.startX = null;
    this.startY = null;

    this.acceleration = -8
    this.distance = 0
    this.speed = 0
    this.spinClockwise = true;
    this.startTime = 0;
    this.totalTime = 0;
    this.previousDistances = []

    this.positionCallbacks = [];
  }

  calculatePositions() {
    this.wheelWidth = this.wheelElm.getBoundingClientRect()['width'];
    this.wheelHeight = this.wheelElm.getBoundingClientRect()['height']
    this.wheelX = this.wheelElm.getBoundingClientRect()['x'] + this.wheelWidth / 2;
    this.wheelY = this.wheelElm.getBoundingClientRect()['y'] + this.wheelHeight / 2;

    this.spinner.style.width = `${Math.min(window.innerWidth, 600)}px`;
    this.spinner.style.height = `${Math.min(window.innerWidth, 600)}px`;

    // let difference = Math.max(0, body.clientHeight - html.clientHeight);  
    // if (isFullscreen) {
    //     difference = Math.max(0, screen.height - oldScreenHeight);                    
    // } 
    // spinner.style.marginTop = `-${difference}px`;        
  }

  onPositionChange(callback) {
    this.positionCallbacks.push(callback);
  }

  onGrab(x, y) {
    if (!this.isSpinning) {
      this.isDragging = true;
      this.startAngle = this.calculateAngle(x, y);
    }
  }

  onMove(x, y) {
    if (!this.isDragging) {
      return;
    }


    this.lastAngles.shift();
    this.lastAngles.push(this.currentAngle);

    let deltaAngle = this.calculateAngle(x, y) - this.startAngle;
    this.currentAngle = deltaAngle + this.oldAngle;

    this.render(this.currentAngle);
  }

  calculateAngle(currentX, currentY) {
    let xLength = currentX - this.wheelX;
    let yLength = currentY - this.wheelY;
    let angle = Math.atan2(xLength, yLength) * (180 / Math.PI);
    return 365 - angle;
  }

  onRelease() {
    if (this.isDragging) {
      this.isDragging = false;
      this.oldAngle = this.currentAngle;

      let speed = this.lastAngles[0] - this.lastAngles[2];
      const maxSpeed = 30;

      speed = Math.min(Math.max(speed, -maxSpeed), maxSpeed);
            
      if (speed == maxSpeed || speed == -maxSpeed) {
        let salt =  Math.random() * (3 - 1 + 1)
        speed += Math.random() + 0.5 > 1 ? salt : -salt
      }

      this.spinClockwise = speed < 0
      speed = Math.abs(speed)
      let time = Math.abs((0 - speed) / this.acceleration) // spin time
      let distance = (speed * time) + (0.5 * this.acceleration * Math.pow(time, 2)) // spin distance

      // calculate wheel misalignment angle
      let alignAngle = 0
      if (this.spinClockwise) {
        alignAngle = 60 - (((distance * 60) + this.currentAngle) % 60)
      } else {
        alignAngle = (this.currentAngle - (distance * 60)) % 60
      }

      // convert misalignment angle into distance, time, and speed
      distance += alignAngle / 60
      time = Math.sqrt(Math.abs((2 * distance) / this.acceleration)) // adjusted spin time
      speed = Math.sqrt(Math.abs(2 * this.acceleration * distance)) // adjusted speed

      this.distance = Math.abs(distance)
      this.speed = speed
      this.totalTime = time

      if (this.distance < 20) {
        this.previousDistances.push(this.distance)
      } else {
        this.previousDistances.length = 0
      }

      if (this.previousDistances.length >= 3) {
        this.previousDistances.length = 0
        message.show('Spin a little harder! 💪', [
          { text: 'Ok', callback: () => {  message.hide(); } },                
        ]);
      }

      window.requestAnimationFrame(this.giveMoment.bind(this))
    }
  }

  giveMoment(timeStamp) {
    // spin version 2

    if (!this.isSpinning) {
      this.startTime = timeStamp;
    }

    let time = (timeStamp - this.startTime) / 1000;

    if (this.totalTime - time >= 0) {
      let distance = (0 + Math.abs(this.speed)) * time + (0.5 * this.acceleration * Math.pow(time, 2));
      let angle = distance * 60;
      this.oldAngle = this.currentAngle + (this.spinClockwise ? angle : -angle)

      this.isSpinning = true;
      window.requestAnimationFrame(this.giveMoment.bind(this));
    } else {
      this.isSpinning = false;
    }

    this.render(this.oldAngle);
  }

  render(deg) {
    this.wheelElm.style.transform = `rotate(${deg}deg)`;
    for (let callback of this.positionCallbacks) {
      callback(deg);
    }
  }
}