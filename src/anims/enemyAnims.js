export function createEnemyAnimKeys(scene){
       scene.anims.create({
            key: "orc-death",
            frames: scene.anims.generateFrameNumbers(
                "orc-base-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        scene.anims.create({
            key: "orc-idle",
            frames: scene.anims.generateFrameNumbers(
                "orc-base",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "orc-run",
            frames: scene.anims.generateFrameNumbers(
                "orc-base-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
    }
    