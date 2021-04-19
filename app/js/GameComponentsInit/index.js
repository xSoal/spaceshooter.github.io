

import Ship from './Ship';
import gameConf from "../gameConf";
import Bg from './Bg';
import Enemy from './Enemy';
import Collisions from './Collisions';
import resources from './resources';

export default class GameComponentsInit{
    constructor( canvas ){
        this.canvas = canvas;
        this.gameObjects = {
            idCounter: -1,
            fires: {},
            enemyShips: {},
        };

        this.resources = resources();

        this.Bg   = new Bg( canvas, this.gameObjects, this.resources );
        this.ship = new Ship( canvas, this.gameObjects, this.resources );

        this.preLoader();
        this.loadResources();
        this.createEnemies();

        this.collisionChecker = new Collisions(canvas, this.gameObjects, this.resources, this.ship);
    }

    createEnemies(){
        const enemyMap = [
            {
                fromFrame: 30,
                enemyType: "easy",
                enemyCount: 555,
                enemyDelay: 35,
            },
        ];

        this.enemiesCreateActionHandlerId = this.canvas.addActionHandler(()=>{

            enemyMap.forEach(enemyMapPart=>{
               let frameNow = gameConf.dataCanvas.framesAll;
               if(frameNow >= enemyMapPart.fromFrame
                && enemyMapPart.enemyCount > 0
                && frameNow % enemyMapPart.enemyDelay === 0){
                    let id = "";
                    this.gameObjects.enemyShips[++this.gameObjects.idCounter] = new Enemy(
                        this.canvas,
                        this.gameObjects,
                        this.resources,
                        enemyMapPart.enemyType,
                        this.gameObjects.idCounter);
                    enemyMapPart.enemyCount--;
               }
            });
        });
    }

    destroy(){

    }

    preLoader(){
        let preLoaderHandler = ( ctx ) => {

            let allCounter = Object.keys(this.resources).length;
            let isLoadCounter = Object.values(this.resources).filter(item=>{
                return item.isReady;
            }).length;

            ctx.fillStyle = "red";
            let preLoaderLineHeight = 3;
            ctx.fillRect(
                this.canvas.width / 10,
                (this.canvas.height / 2) - preLoaderLineHeight / 2,
                (this.canvas.width / 10) * 8 * (isLoadCounter / allCounter),
                preLoaderLineHeight
            );
        };

        this.preLoaderDrawHandlerId = this.canvas.addHandlerToDrawInStoppedMode(ctx => {
            preLoaderHandler(ctx);
        });
    }

    loadResources(){
        Object.values(this.resources).forEach(item=>{
            item.isReady = false;
            switch (item.type) {
                case "image":
                    item.object.onload = () => {
                        item.isReady = true;
                    };
                    break;
                case "sound":
                    item.object.oncanplaythrough = () => {
                        item.isReady = true;
                    };
                default:
                    break;
            }
        });
        let t = setInterval(()=>{
            let isReady = Object.values(this.resources).every(item=>{
                return item.isReady
                    && ( item.object.complete != 0 ||  item.object.naturalHeight != 0)
                    && item.object.width != 0
            });
            if(isReady){
                this.canvas.removeHandlerToDrawInStoppedMode(this.preLoaderDrawHandlerId);
                setTimeout(()=>{
                    this.canvas.go();
                    clearInterval(t);
                }, 255);
            }
        });
    }
}
