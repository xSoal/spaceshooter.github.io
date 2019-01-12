

export default class Boom{
    constructor(canvas, gameObject, resources, coordinate, enemy){
        this.canvas = canvas;

        this.boom = {
            isDestroyStart: false,
            counter: 0,
            image: resources.boom.object,
            width: 64,
            height: 64,
            spriteSize: {
                width: 512,
                height: 64,
                spritesCount: 8,
            }
        }

        this.coordinate = coordinate;

        this.canvas.addHandlerToDraw((ctx)=>{
            this.drawBoom(ctx);
        });

    }


    drawBoom(ctx){
        let xSpritePosition = ++this.boom.counter;

        ctx.drawImage(
            this.boom.image,
            xSpritePosition * this.boom.width,
            0,
            this.boom.width,
            this.boom.height,
            this.coordinate.x - this.boom.width/2,
            this.coordinate.y - this.boom.height/2,
            this.boom.width,
            this.boom.height);
    }
}