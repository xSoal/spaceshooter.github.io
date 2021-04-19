



export default function(){
    let resources = {
        shipImage: {
            type: "image",
            object: new Image(),
            src: "images/ship.png",
        },
        enemyEasyImage: {
            type: "image",
            object: new Image(),
            src: "images/enemy_easy_ship.png",
        },
        fireImage: {
            type: "image",
            object: new Image(),
            src: "images/shoot_laser.png"
        },
        fireSound: {
            type: "sound",
            object: new Audio,
            src: "sounds/ship_own_laser.mp3"
        },
        planetImage: {
            type: "image",
            object: new Image(),
            src: "images/planet.png",
        },
        bgImage: {
            type: "image",
            object: new Image(),
            src: "images/bg2.jpg"
        },
        boomImage: {
            type: "image",
            object: new Image(),
            src: "images/boom.png",
        },
        // boomEnemySound: {
        //     type: "sound",
        //     object: new Audio(),
        //     src: "sounds/enemy_boom.mp3",
        // }
    }

    Object.values(resources).forEach((obj)=>{
        obj.object.src = obj.src;
    });

    return resources;
};