

 export function createProjectileAnimKeys(scene){
        scene.anims.create({
            key: "fire",
            frames: scene.anims.generateFrameNumbers(
                "fireball",
                {start: 0, end: 2},
            ),
            frameRate: 3,
            repeat: 0 
        });
        scene.anims.create({
            key: "ice",
            frames: scene.anims.generateFrameNumbers(
                "iceball",
                {start: 0, end: 1},
            ),
            frameRate: 2,
            repeat: 0
        });
    }
    