
import gameConf from '../gameConf';
import fns from '../fns.js';
import resources from './resources';

export default class Bg {
    constructor(canvas, gameObjects, resources){
        this.canvas      = canvas;
        this.gameObjects = gameObjects;
        this.resources   = resources;

        this.starsBgDrawHandler = canvas.addHandlerToDraw((ctx)=>{
            this.drawBg(ctx);
        });

        this.planetDrawHandler = canvas.addHandlerToDraw(ctx=>{
            this.drawPlanet(ctx);
        });

        this.starsLoopActions = canvas.addActionHandler(()=>{
            this.loop();
        });
        
        this.image  = resources.bgImage.object;
        this.planet = resources.planetImage.object;

        this.planetDegree = 0;
        this.pos = {
            y1: null,
            y2: null,
            y3: null,
            slides: 3,
        }

    }

    
    drawBg( ctx ){
        if( this.image.width == 0 ) return false;
        
        if( this.pos.y1 === null ){
            this.pos.y1 = -this.image.height + this.canvas.height;
        }
        if( this.pos.y2 === null ){
            this.pos.y2 = -this.image.height * 2  + this.canvas.height;
        }
        if( this.pos.y3 === null ){
            this.pos.y3 = -this.image.height * 3  + this.canvas.height;
        }

        let speed = 1.5;
        let yPos1 = this.pos.y1;
        let yPos2 = this.pos.y2;
        let yPos3 = this.pos.y3;

        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            0,
            yPos1,
            this.canvas.width,
            this.image.height,
        );
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            0,
            yPos2,
            this.canvas.width,
            this.image.height,
        );
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            0,
            yPos3,
            this.canvas.width,
            this.image.height,
        );

    
        // see end of first screen image
        if( this.pos.y1 >= 0 + this.canvas.height && this.pos.slides % 3 === 0){
            this.pos.slides++
            this.pos.y1 = this.pos.y3 - this.image.height;
        }
        
        if( this.pos.y2 >= 0 + this.canvas.height && this.pos.slides % 3 === 1) {
            this.pos.slides++
            this.pos.y2 = this.pos.y1 - this.image.height;
        }

        if( this.pos.y3 >= 0 + this.canvas.height && this.pos.slides % 3 === 2) {
            this.pos.slides++
            this.pos.y3 = this.pos.y2 - this.image.height;
        }

        yPos1 = this.pos.y1 += speed;
        yPos2 = this.pos.y2 += speed; 
        yPos3 = this.pos.y3 += speed;

    }


    drawPlanet( ctx ){
        if(this.planet.width === 0) return false;
        let image = this.planet;

        ctx.save();
        ctx.translate(-this.canvas.width/2 + image.width / 2, this.canvas.height/2 + image.height / 2);
        ctx.rotate( this.planetDegree += 0.00075 );
        ctx.translate(-(-this.canvas.width/2 + image.width / 2), -(this.canvas.height/2 + image.height / 2));
        ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            -this.canvas.width/2,
            this.canvas.height/2,
            image.width,
            image.height
        );
        ctx.restore();

    }



    loop(){
        
    }
}