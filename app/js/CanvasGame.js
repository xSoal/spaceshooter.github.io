
import gameConf from './gameConf';

export default class CanvasGame{
    constructor(canvasNode){
        this.isStopped = true;
        
        this.canvas = canvasNode;
        this.ctx    = this.canvas.getContext('2d');

        this.width  = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.canvas.width =  this.width;
        this.canvas.height = this.height;

        this.dataCanvas = gameConf.dataCanvas;

        this.idForHandlers   = 0;
        this.drawHandlers    = {};
        this.actionsHandlers = {};
        this.drawHandlersInStoppedMode = [];

        this.loop();

    }

    drawAll(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        Object.values(this.drawHandlers).forEach(( itemFn )=>{
            if( itemFn != undefined ){
                itemFn( this.ctx );
            }
        });
        this.dataCanvas.framesAll++;
    }

    checkActionsAll(){
        Object.values(this.actionsHandlers).forEach(( itemFn )=>{
            if( itemFn != undefined ){
                itemFn();
            }
        });
    }

    addActionHandler( actionHandlerFn ){
        let id = ++this.idForHandlers;
        this.actionsHandlers[id] = actionHandlerFn;
        return id;       
    }

    removeActionHandler( idOfHandler ){
        if(!this.actionsHandlers[idOfHandler]) return;
        delete this.actionsHandlers[idOfHandler];
    }

    addHandlerToDraw( drawHandlerFn ){
        let id = ++this.idForHandlers;
        this.drawHandlers[id] = drawHandlerFn;
        return id;
    }

    removeHandlerToDraw( idOfHandler ) {
        if(!this.drawHandlers[idOfHandler]) return;
        delete this.drawHandlers[idOfHandler];
    }

    drawAllInStoppedMode(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        Object.values(this.drawHandlersInStoppedMode).forEach(( itemFn )=>{
            if( itemFn != undefined ){
                itemFn( this.ctx );
            }
        });
        this.dataCanvas.framesAll++;
    }

    addHandlerToDrawInStoppedMode( drawHandlerFn ){
        let id = ++this.idForHandlers;
        this.drawHandlersInStoppedMode[id] = drawHandlerFn;
        return id;
    }
    removeHandlerToDrawInStoppedMode( idOfHandler ){
        if(!this.drawHandlersInStoppedMode[idOfHandler]) return;
        delete this.drawHandlersInStoppedMode[idOfHandler]; 
    }

    go(){
        this.isStopped = false;
    }

    stop(){
        this.isStopped = true;
    }

    loop(){
        let lastFullSeconds   = performance.now() < 1000 ? 0 : parseInt( performance.now() / 1000 );
        let lastTimeIteration = performance.now();
        let loop = () => {
            // it must check for max fps and do not draw canvas if it's too fast,
            // because the game drawing is oriented not for time and fps together
            // but only for fps ( without situation with sprites )
            if( !this.isStopped
                && (performance.now() - lastTimeIteration) > (1000 / gameConf.maxFramesInSecond) ){
                // check for fps
                let nowFullSeconds = performance.now() < 1000 ? 0 : parseInt( performance.now() / 1000 );

                if( lastFullSeconds < nowFullSeconds ){
                    this.dataCanvas.fps = this.dataCanvas.fpsInSecondNow;
                    this.dataCanvas.fpsInSecondNow = 0
                }else {
                    this.dataCanvas.fpsInSecondNow++;
                }
                
                lastFullSeconds = nowFullSeconds;

                lastTimeIteration  = performance.now();

                this.checkActionsAll();
                this.drawAll();
                
            } else if( performance.now() - lastTimeIteration > 1000 / gameConf.maxFramesInSecond ){
                // call to drawing preloadings and else that not need to await
                if(this.isStopped){
                    this.drawAllInStoppedMode();
                }
            }
            window.requestAnimationFrame( loop );
        };

        window.requestAnimationFrame( loop );
    }

}