
import gameConf from '../gameConf';
import Fire from './Fire';
import resources from './resources';

export default class Ship {
    constructor( canvas, gameObjects, resources ){
        this.canvas      = canvas;
        this.gameObjects = gameObjects;
        this.resources   = resources;
        this.image  = {
            object: resources.shipImage.object,
            spriteSize: {
                width: 68,
                height: 128,
                spritePosition: 0,
                spritesCount: 4,
            },
        };

        this.sounds = {
            laser: {
                object: resources.fireSound.object,
            },
        };

        this.ship  = {
            width: 34,
            height: 64,
            position: {
                x: gameConf.mouse.x,
                y: gameConf.mouse.y,
            },
            lifes: gameConf.defaultLifes,
            lastFrameCountOfFireCreate: 0,
            canTouch: true,
            shieldEnable: false,
        };
        this.disableMoveTime = 500;

        this.init();
    }

    init(){
        this.moveHandlerId = this.canvas.addHandlerToDraw((ctx)=>{
            this.shipMove(ctx);
        });
        this.fireActionHandlerId = this.canvas.addActionHandler(()=>{
            gameConf.mouse.mouseDown.value ? this.shipFire( this.canvas.ctx ) : "";
        });
        this.moveActionHandlerId = this.canvas.addActionHandler(()=>{
            this.ship.position.x = gameConf.mouse.x;
            this.ship.position.y = gameConf.mouse.y;
        });
    }

    shipMove( ctx ){

        let xSpritePosition =
            this.image.spriteSize.spritePosition < this.image.spriteSize.spritesCount - 1
            ? ++this.image.spriteSize.spritePosition
            : this.image.spriteSize.spritePosition = 0;

            ctx.drawImage(
                this.image.object,
                xSpritePosition * this.image.spriteSize.width,
                0,
                this.ship.width * 2,
                this.ship.height * 2,
                this.ship.position.x - this.ship.width / 2,
                this.ship.position.y - this.ship.height / 2,
                this.ship.width,
                this.ship.height,
            );
    }


    shipFire( ctx ){
        
        if( Math.abs( gameConf.dataCanvas.framesAll - this.ship.lastFrameCountOfFireCreate ) < 4 ){
            return false;
        }
        this.ship.lastFrameCountOfFireCreate = gameConf.dataCanvas.framesAll;
        let id = ++this.gameObjects.idCounter;
        this.gameObjects.fires[id] = new Fire(this.canvas, this.gameObjects, this.resources, {
            id: id,
            position: {
                x: this.ship.position.x,
                y: this.ship.position.y - this.ship.height / 2,
            },
            sound: () => {
                let sound = new Audio;
                sound.src = this.sounds.laser.object.src;
                return sound;
            }
        });

    }


    collisionWidthEnemy(){
       
        if(!this.ship.canTouch) return;
        // this.ship.canTouch = false;.kkkll


        

        this.startDestroying();
    }

    startDestroying(){
        console.log(this.ship.shieldEnable)
        if(this.ship.shieldEnable){
            this.moveStopped();
        } else {
            this.shieldEnable();
            // if(--this.ship.lifes > 0){
            //     // this.looseLvl();
            //     console.log('qwe2')
            //     this.moveStopped();
            //     this.shieldEnable();
            // } else {
            //     console.log('qwe1234')
            // }
            
        }

    }

    moveStopped(){
        this.canvas.removeActionHandler(this.moveActionHandlerId);
        setTimeout(()=>{
            this.moveActionHandlerId = this.canvas.addActionHandler(()=>{
                this.ship.position.x = gameConf.mouse.x;
                this.ship.position.y = gameConf.mouse.y;
            });
        },this.disableMoveTime);
    }

    shieldEnable(){
       
        this.ship.shieldEnable = true;
        this.shieldDrawId = this.canvas.addHandlerToDraw(ctx=>{
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(
                this.ship.position.x,
                this.ship.position.y,
                this.ship.height > this.ship.width ?
                    this.ship.height + 1
                    : this.ship.width + 1,
                0,
                2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        });
        setTimeout(()=>{
            this.canvas.removeHandlerToDraw(this.shieldDrawId);
            this.ship.shieldEnable = false;
        },2000);
    }

    looseLvl(){
        this.canvas.stop();
    }


}