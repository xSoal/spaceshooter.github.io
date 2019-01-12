
import gameConf from '../gameConf';
import { isArray } from 'util';
import resources from './resources';


export default class Fire {
    constructor( canvas, gameObjects, resources, dataObj ){
        this.canvas      = canvas;
        this.gameObjects = gameObjects;
        this.resources   = resources;
        this.fireMoveHandlerId;

        this.fire = {
            id: dataObj.id,
            width: 5,
            height: 10,
            color: "#FF0000",
            speed: 37,
            position: {
                x: dataObj.position.x,
                y: dataObj.position.y,
            },
            sound: dataObj.sound(),
            image: {
                object: resources.fireImage.object,
            }
        };


         // this attr is different friendly and not shoot's
        // -1 : friendly,  1 : is not
        this.isEnemies = -1;       
        this.init();
        this.fire.sound.play();
    }

    init(){
        this.fireMoveHandlerId = this.canvas.addHandlerToDraw((ctx)=>{
            this.fireMove(ctx);
        });
    }

    fireMove( ctx ){
        ctx.fillStyle = this.fire.color;
        let newY = this.fire.position.y += this.fire.speed * this.isEnemies;

        ctx.drawImage(
            this.fire.image.object,
            0,
            0,
            this.fire.width,
            this.fire.height,
            this.fire.position.x - this.fire.width / 2,
            this.fire.position.y - this.fire.height / 2,
            this.fire.width,
            this.fire.height,
        );

        this.checkForOutScreen();
    }

    checkForOutScreen(){
        if( this.fire.position.y < 0 ) {
            this.delete();
        }
    }

    delete(){
        delete this.gameObjects.fires[this.fire.id];
        this.canvas.removeHandlerToDraw( this.fireMoveHandlerId );
    }
}