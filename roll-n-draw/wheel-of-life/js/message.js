class Message {
    constructor() {
        this.bee = document.querySelector('#bee');
        this.msg = document.querySelector('#msg');
        this.hasButton = false;
        this.isVisible = false;
        
        this.timing =  {
            duration: 300,
            iterations: 1
        };       
    }    

    beeFlyin() {
        const flyin = [
            { transform: "translateX(110px)" },
            { transform: "translateX(0)" }
        ]; 
            
        let animate = this.bee.animate(flyin, this.timing);
        animate.onfinish = () => {        
            this.bee.style.animationName = 'beeHover';
            this.msgFadein();
        };
    }

    beeFlyout() {
        const flyout = [
            { transform: "translateY(0)" },
            { transform: "translateY(-100px)" }
        ];     
    
        this.bee.style.animationName = 'none';    
        let animate = this.bee.animate(flyout, this.timing);
        animate.onfinish = () => {        
            this.bee.style.transform = 'translate(110px,0)';
            this.isVisible = false;
        };
    }

    msgFadein() {
        const fadein = [
            { opacity: '0' },
            { opacity: '1' }
        ];
        
        this.msg.style.display = 'flex';
        let animate = this.msg.animate(fadein, this.timing);
        animate.onfinish = () => {    
            this.isVisible = true;
        };
    }

    msgFadeout() {
        const fadeout = [
            { opacity: '1' },
            { opacity: '0' }
        ];
         
        let animate = this.msg.animate(fadeout, this.timing);
        animate.onfinish = () => {    
            this.msg.style.display = 'none';
            this.beeFlyout();
        };
    }

    show(text, buttons) {
        this.msg.querySelector('.msg-body').textContent = text;
        this.msg.querySelector('.msg-footer').innerHTML = '';
        this.hasButton = typeof(buttons) != 'undefined';
        if (this.hasButton) {
            buttons.forEach((btn) => {
                let el = document.createElement('BUTTON');
                el.classList.add('btn');
                el.textContent = btn.text;
                el.addEventListener('click', btn.callback);
                this.msg.querySelector('.msg-footer').appendChild(el);
            });
        }    
        if (!this.isVisible) {
            this.beeFlyin();
        }
    }

    hide() {
        this.msgFadeout();
    }
};