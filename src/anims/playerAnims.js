

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
            key: "player-climb",
            frames: scene.anims.generateFrameNumbers(
                "player-climb",
                {start: 0, end: 6},
            ),
            frameRate: 25,
            repeat: 0
        });
        
        scene.anims.create({
            key: "player-idle",
            frames: scene.anims.generateFrameNumbers(
                "player",
                {start: 0, end: 9},
            ),
            frameRate: 12,
            repeat: -1 
        });
        scene.anims.create({
            key: "player-run",
            frames: scene.anims.generateFrameNumbers(
                "player-run",
                {start: 0, end: 9},
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
                {start: 0, end: 2},
            ),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "player-fall",
            frames: scene.anims.generateFrameNumbers(
                "player-fall",
                {start: 0, end: 2},
            ),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "player-crouch",
            frames: scene.anims.generateFrameNumbers(
                "player-crouch",
                {start: 2, end: 2},
            ),
            frameRate: 5,
            repeat: 0
        }); 
        scene.anims.create({
            key: "player-crouch-walk",
            frames: scene.anims.generateFrameNumbers(
                "player-crouch-walk",
                {start: 0, end: 7},
            ),
            frameRate: 5,
            repeat: 0
        });
        scene.anims.create({
            key: "player-roll",
            frames: scene.anims.generateFrameNumbers(
                "player-roll",
                {start: 0, end: 11},
            ),
            frameRate: 25,
            repeat: 0
        });
        scene.anims.create({
            key: "player-slide",
            frames: scene.anims.generateFrameNumbers(
                "player-slide",
                {start: 0, end: 3},
            ),
            frameRate: 8,
            repeat: 0
        }); 
    }
    