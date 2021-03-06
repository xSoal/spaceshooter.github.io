import showFps from './devFns';


// it will newer be 'prod'
const gameMode = 'dev';

let obj = {
    maxFramesInSecond: 60,
    mouse: {
        x: 0,
        y: 0,
        mouseDown: {
            value: false,
            event: null,
        },
    },
    defaultLifes: 4,
    boomSpritesCount: 8,
    dataCanvas : {
        // iteration of frames in each second 
        // from each new second will = 0
        fpsInSecondNow: 0, 

        // max frames count on each second
        _fps:0,
        set fps(value){
            this._fps = value;
            gameMode == 'dev' ? showFps(value) : ''; 
            return this._fps;
        },
        get fps(){
            return this._fps;
        },
        // all frames from start drawing
        // will used like time counter
        framesAll: 0, 
    },
    sound: {
        enable: true,
    }
}

// window.obj  = obj;

window.addEventListener('mousemove', (event)=>{
    let e = event || window.event;
    obj.mouse.x = e.x;
    obj.mouse.y = e.y;
});

window.addEventListener('mousedown', (event)=>{

    let e = event || window.event;
    e.preventDefault();
    obj.mouse.mouseDown.value = true;
    obj.mouse.mouseDown.event = e;

    window.addEventListener('mouseup', listenerForMouseUp);
    function listenerForMouseUp () {
        obj.mouse.mouseDown.value = false;
        obj.mouse.mouseDown.event = null;
        window.removeEventListener('mouseup', listenerForMouseUp);
    };

})




export default obj;