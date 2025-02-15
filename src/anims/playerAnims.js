

 export function createPlayerAnimKeys(scene){
        scene.anims.create({
            key: "player-death",
            frames: scene.anims.generateFrameNumbers(
                "player-death",
                {start: 0, end: 7},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "player-idle",
            frames: scene.anims.generateFrameNumbers(
                "player",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "player-run",
            frames: scene.anims.generateFrameNumbers(
                "player-run",
                {start: 0, end: 7},
            ),
            frameRate: 12,
            repeat: -1 
        });
        scene.anims.create({
            key: "player-attack",
            frames: scene.anims.generateFrameNumbers(
                "player-attack",
                {start: 0, end: 7},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        scene.anims.create({
            key: "player-jump",
            frames: scene.anims.generateFrameNumbers(
                "player-jump",
                {start: 0, end: 3},
            ),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: "player-fall",
            frames: scene.anims.generateFrameNumbers(
                "player-run",
                {start: 0, end: 3},
            ),
            frameRate: 3,
            repeat: -1
        });
    }
    