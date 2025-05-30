export function createOrcAnimKeys(scene){
    //orc-base
       scene.anims.create({
            key: "orc-base-fall",
            frames: scene.anims.generateFrameNumbers(
                "orc-base-fall",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0 
        });
        
        scene.anims.create({
            key: "orc-base-idle",
            frames: scene.anims.generateFrameNumbers(
                "orc-base",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "orc-base-run",
            frames: scene.anims.generateFrameNumbers(
                "orc-base-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
       //orc-rogue 
       scene.anims.create({
            key: "orc-rogue-fall",
            frames: scene.anims.generateFrameNumbers(
                "orc-rogue-fall",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0 
        });
        
        scene.anims.create({
            key: "orc-rogue-idle",
            frames: scene.anims.generateFrameNumbers(
                "orc-rogue",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "orc-rogue-run",
            frames: scene.anims.generateFrameNumbers(
                "orc-rogue-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
       //orc-shaman
       scene.anims.create({
            key: "orc-shaman-fall",
            frames: scene.anims.generateFrameNumbers(
                "orc-shaman-fall",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0 
        });
        
        scene.anims.create({
            key: "orc-shaman-idle",
            frames: scene.anims.generateFrameNumbers(
                "orc-shaman",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "orc-shaman-run",
            frames: scene.anims.generateFrameNumbers(
                "orc-shaman-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
       //orc-warrior 
       scene.anims.create({
            key: "orc-warrior-fall",
            frames: scene.anims.generateFrameNumbers(
                "orc-warrior-fall",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0
        });
        
        scene.anims.create({
            key: "orc-warrior-idle",
            frames: scene.anims.generateFrameNumbers(
                "orc-warrior",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "orc-warrior-run",
            frames: scene.anims.generateFrameNumbers(
                "orc-warrior-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        }); 
    }
    