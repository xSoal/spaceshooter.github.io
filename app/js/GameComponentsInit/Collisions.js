import { isArray } from "util";
import fns from '../fns';
import gameConf from "../gameConf";
import Boom from './Boom';

export default class Collisions {
    constructor(canvas, gameObjects, resources, ship){
        this.canvas      = canvas;
        this.gameObjects = gameObjects;
        this.resources   = resources;
        this.ship        = ship;

        this.actionLoopHandlerId = this.canvas.addActionHandler(()=>{
            this.loop();
        });
    }

    loop(){
        if(this.canvas.isStopped) return false;

        this.checkCollisionsFiresAndEnemies();
        this.checkCollisionsShipAndEnemies();
    }

    checkCollisionsFiresAndEnemies(){
        let fires      = this.gameObjects.fires;
        let enemyShips = this.gameObjects.enemyShips;

        Object.values(fires).forEach(fire=>{
            Object.values(enemyShips).forEach(enemy=>{
                if(fns.checkCollisionRectangles(enemy.ship,fire.fire)){
                    fire.delete();
                    enemy.startDestroy();
                    new Boom(this.canvas, this.gameObjects, this.resources, {
                        x: fire.fire.position.x,
                        y: fire.fire.position.y,
                    },enemy);
                }
            });
        });
    }

    checkCollisionsShipAndEnemies(){
        Object.values(this.gameObjects.enemyShips).forEach(enemy=>{
            if(fns.checkCollisionRectangles(enemy.ship, this.ship.ship, true)){
                new Boom(this.canvas, this.gameObjects, this.resources, {
                    x: this.ship.ship.position.x,
                    y: this.ship.ship.position.y,
                },enemy);     
                new Boom(this.canvas, this.gameObjects, this.resources, {
                    x: enemy.ship.position.x,
                    y: enemy.ship.position.y,
                },enemy); 
            }
        });
    }

}
