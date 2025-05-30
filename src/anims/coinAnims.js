
 export function createCoinAnimKeys(scene){
        scene.anims.create({
            key: "gold-coin",
            frames: scene.anims.generateFrameNumbers(
                "gold-coin",
                {start: 0, end: 4},
            ),
            frameRate: 4,
            repeat: -1 
        });
 
    }
    