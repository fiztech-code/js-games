class Sun {
    constructor() {
        this.sun = document.querySelector('#sun')
        this.img = this.sun.querySelector('img')
        
        this.timing =  {
            duration: 500,
            iterations: 1
        }

        this.fadein = [
            { opacity: '0' },
            { opacity: '1' }
        ]   
    } 

    show(imgUrl) {  
        this.img.src = imgUrl
        this.sun.style.display = 'block'
        let animate = this.sun.animate(this.fadein, this.timing)        
    }  

    hide() {        
        let animate = this.sun.animate(this.fadein.toReversed(), this.timing)
        animate.onfinish = () => { 
            this.sun.style.display = ''
        }
    }
}