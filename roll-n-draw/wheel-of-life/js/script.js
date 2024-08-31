const message = new Message();
const wheel = new Wheel();

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
            callback();
        };
    }

}
const scene0 = document.querySelector('.scene-0');
const scene1 = document.querySelector('.scene-1');
scene0.addEventListener('click', () => {
    toggleScene(scene0, scene1,  wheel.calculatePositions.bind(wheel));
});

