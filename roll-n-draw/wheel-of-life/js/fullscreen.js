
(function() {
    let oldScreenHeight = screen.height;
    let oldWindowHeight = window.innerHeight;

    let html = document.querySelector('html');
    let body = document.querySelector('body');
    let spinner = document.querySelector('#spinner');

    let isFullscreen = false;
    let btn = document.querySelector('#toggleFullscreen');
    
    function toggleFullscreen() {
        if (!isFullscreen) {
            html.requestFullscreen();
            return;
        }
        document.exitFullscreen();
    }
    btn.addEventListener('click', toggleFullscreen);
    
    function fullscreenHandler(e) {
        if (document.fullscreenElement) {        
            isFullscreen = true;
            btn.children[0].classList.replace('fa-expand','fa-compress');
            body.classList.add('full-screen');
            //body.style.height = `${oldScreenHeight}px`;
            //document.querySelector('#game').style.height = `${oldScreenHeight}px`;
            //body.style.position = 'relative';
        } else {
            isFullscreen = false;
            btn.children[0].classList.replace('fa-compress','fa-expand');
            body.classList.remove('full-screen');
            //body.style.height = `${oldWindowHeight}px`;
            //document.querySelector('#game').style.height = `${oldWindowHeight}px`;
            //body.style.position = 'relative';        
        }    
    }
    document.addEventListener('fullscreenchange', fullscreenHandler);
    fullscreenHandler();
    
    
    if (readCookie('fullscreen') != 'false') {        
        setTimeout(() => {
            const message = new Message();
            message.show('Try "Fullscreen" for better expirence 🙂', [
                { text: 'Sure', callback: () => { html.requestFullscreen(); message.hide(); } },
                { text: 'No, thanks', callback: () => { 
                    message.hide(); 
                    createCookie('fullscreen', 'false', 60);
                } }
            ]);
        }, 1200);
    }
})();
