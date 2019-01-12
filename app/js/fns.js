

export default {
    randomFloat: function(min,max){
        return Math.random() * (max - min) + min;
    },
    randomInt: function(min,max){
        return Math.floor(Math.random() * (max - min)) + min;
    },
    checkCollisionRectangles: function( objA, objB ){
        // it's need for one type of object structure: 
        // must to use obj.position = {x: value, y: value} && ( obj.width && obj.height )
        let { x:ax , y:ay } = objA.position;
        let { x:bx , y:by } = objB.position;
        let { width:aw , height:ah } = objA;
        let { width:bw , height:bh } = objB;
        
        let axLeft   = ax - aw/2;
        let axRight  = ax + aw/2;
        let ayTop    = ay - ah/2;
        let ayBottom = ay + ah/2;

        let bxLeft   = bx - bw/2;
        let bxRight  = bx + bw/2;
        let byTop    = by - bh/2;
        let byBottom = by + bh/2;

        // for collision of 2 rectangles need 4 conditions:
        // 1) axRight  > bxLeft     : right side X coordinate of 1-st rect more than left size X coordinate 2-nd
        // 2) axLeft   < bxRight    : ...
        // 3) ayBottom > byTop      
        // 4) ayTop    < byBottom
        
        return (
            axRight  > bxLeft   &&
            axLeft   < bxRight  &&
            ayBottom > byTop    &&
            ayTop    < byBottom ? true : false
        );
    },



};