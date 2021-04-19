
import fns from '../fns';
import gameConf from "../gameConf";
import resources from './resources';

export default class Enemy{
    constructor(canvas, gameObjects, resources, type, id){
        this.canvas      = canvas;
        this.gameObjects = gameObjects;
        this.resources   = resources;
        this.id          = id;

        this.ship;
        this.isDestroyStart = false;
        this.destroyFrames  = {
            counter: 0,
            all: gameConf.boomSpritesCount
        }

        const easySpriteSize = {
            width: 234,
            height: 150,
            spritePosition: 0,
            spritesCount: 4,
        };
        const randSize  = fns.randomInt(25,100);

        this.easy = {
            width: randSize  * easySpriteSize.width / easySpriteSize.height,
            height: randSize * easySpriteSize.height / easySpriteSize.width,
            speed: 1,
            position: {
                x: fns.randomInt(170 , this.canvas.width),
                y: -40,
            },
            image: {
                object: resources.enemyEasyImage.object,
                spriteSize: easySpriteSize,
            },
            // sound: {
            //     object: resources.boomEnemySound.object
            // }
        };
 
        switch (type) {
            case "easy":
                this.ship = this.easy;
                this.init();
                break;
        
            default:
                break;
        };
    }

    init(){

        this.drawHandler = this.canvas.addHandlerToDraw((ctx)=>{
            this.moveDraw(ctx);
        });

        this.actionMoveHandler = this.canvas.addActionHandler(()=>{
            this.ship.position.y += this.ship.speed;
        });
    }

    moveDraw( ctx ){
        let xSpritePosition =
            this.ship.image.spriteSize.spritePosition < this.ship.image.spriteSize.spritesCount - 1
            ? ++this.ship.image.spriteSize.spritePosition
            : this.ship.image.spriteSize.spritePosition = 0;

        ctx.drawImage(
            this.ship.image.object,
            xSpritePosition * this.ship.image.spriteSize.width,
            0,
            this.ship.image.spriteSize.width,
            this.ship.image.spriteSize.height,
            this.ship.position.x - this.ship.width / 2,
            this.ship.position.y - this.ship.height / 2,
            this.ship.width,
            this.ship.height);
        this.checkForOutScreen();
    }

    startDestroy(){
        if(this.isDestroyStart) return;
        this.isDestroyStart = true;
        this.playSoundDestroying();
        this.actionDestroyHandler = this.canvas.addActionHandler(()=>{
            this.ship.speed = this.ship.speed * 0.5 + 1;
            if(++this.destroyFrames.counter >= this.destroyFrames.all){
                this.delete();
            }
        });
    }

    playSoundDestroying(){
        // let soundDestroyToPlay = new Audio();
        // soundDestroyToPlay.src = this.ship.sound.object.src;
        // soundDestroyToPlay.play();
    }

    checkForOutScreen(){
        if( this.ship.position.y > this.canvas.height ) {
            this.delete();
        }
    }

    delete(){
        delete this.gameObjects.enemyShips[this.id];
        this.canvas.removeActionHandler(this.actionMoveHandler);
        this.canvas.removeHandlerToDraw( this.drawHandler );
        this.canvas.removeHandlerToDraw( this.drawDestroyHandler );
        this.canvas.removeActionHandler( this.actionMoveHandler );
        this.canvas.removeActionHandler( this.actionDestroyHandler );
    }
}