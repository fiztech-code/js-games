const message = new Message();
const wheel = new Wheel();
const sun = new Sun();

let sceneBusy = false

function toggleScene(sceneOut, sceneIn, callback) {
    if (sceneBusy) return 
    sceneBusy = true

    const framesOut = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(25px)', opacity : '1' },
        { transform: 'translateY(-100vh)', opacity : '0' }
    ];

    const framesIn = [
        { opacity : '0' },
        { opacity : '1' }
    ];

    const timing = {
        duration: 1200,
        iteration: 1
    };    

    const animateOut = sceneOut.animate(framesOut, timing);
    animateOut.onfinish = () => {
        sceneOut.style.display = 'none';
        sceneIn.style.display = 'block';
        const animateIn = sceneIn.animate(framesIn, timing);
        animateIn.onfinish = () => {
            sceneBusy = false
            callback && callback();
        };
    }

}
const wizard = {
    'stage': -1,        
    'visual': {},
    'stages': [],
};
let currentItem;
let skipClick = 0;

const scene0 = document.querySelector('.scene-0');
const scene1 = document.querySelector('.scene-1');
const scene2 = document.querySelector('.scene-2');
scene0.addEventListener('click', () => {    
    wheel.populateSegments(visuals.map(x => x.image));
    toggleScene(scene0, scene1, () => {
        wheel.calculatePositions.bind(wheel);
        playInGame();
    });
    
});
scene2.querySelector('button#nextShape').addEventListener('click', () => {
    wheel.lock = false;    
    if (wizard.stage < wizard.visual.shapes.length) {
        wheel.populateSegments(wizard.visual.shapes[wizard.stage].options);
        setTimeout(() => {
            message.show(`Next, Lets draw ${wizard.visual.name}'s  ${wizard.visual.shapes[wizard.stage].name}!`);
        }, 600);
        toggleScene(scene2, scene1);
    } else {      
        wheel.populateSegments(visuals.map(x => x.image));
        toggleScene(scene2, scene1);
        setTimeout(() => {
            sun.show(wizard.visual.image);
            message.show(`Great Job!`);            
            setTimeout(() => {
                playYay();
            }, 500);
            wizard.stage = -1;            
        }, 600);
    }    
});

function playYay() {
    const audio = new Audio('sound/yay.mp3');
    audio.volume = 0.1;
    audio.play();
}

function playPing() {
    const audio = new Audio('sound/ping.mp3');
    audio.volume = 0.1;
    audio.play();
}

function playInGame() {    
    const audio = new Audio('sound/ingame.mp3');        
    audio.loop = true;
    audio.volume = 0.3;
    audio.play();
}

wheel.onRest((item) => {   
    //playPing();      
    currentItem = item;
    if (wizard.stage == -1) {
        wizard.stage = 0;
        const img = item.querySelector('image');
        sun.show(img.getAttribute('href'));   
        wizard.visual = visuals[item.dataset.id];
        message.show(`Lets draw a ${wizard.visual.name}!`);
    } else if (wizard.stage >= 0) {        
        wizard.stage++;
        const img = currentItem.querySelector('image');   
        scene2.querySelector('#shape').setAttribute('src', img.getAttribute('href'));  
        wheel.lock = true;
        setTimeout(() => {
            toggleScene(scene1, scene2);            
        }, 500);             
    }
});


sun.sun.addEventListener('click', (ev) => {
    sun.hide();

    if (wizard.stage == 0) {                
        wheel.populateSegments(wizard.visual.shapes[wizard.stage].options);
        message.show(`Lets begin with ${wizard.visual.name}'s  ${wizard.visual.shapes[wizard.stage].name}!`);
        skipClick++;
    }
});


document.querySelector('#game').addEventListener('click', (ev) => {    
    if (message.isVisible && !message.hasButton && !skipClick) {
        setTimeout(() => {
            message.hide();
        }, 200);
    }
    skipClick--;
    if (skipClick < 0) {
        skipClick = 0;
    }
});