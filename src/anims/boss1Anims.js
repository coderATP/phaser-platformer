export function createBoss1AnimKeys(scene){
    
       scene.anims.create({
            key: "boss1-blue-head-strike",
            frames: scene.anims.generateFrameNumbers(
                "boss1-blue-head-strike",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0 
        });
        
       scene.anims.create({
            key: "boss1-purple-head-strike",
            frames: scene.anims.generateFrameNumbers(
                "boss1-purple-head-strike",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0
        });

       scene.anims.create({
            key: "boss1-run",
            frames: scene.anims.generateFrameNumbers(
                "boss1-run",
                {start: 0, end: 5},
            ),
            frameRate: 16,
            repeat: -1 
        });

       scene.anims.create({
            key: "boss1-running-strike",
            frames: scene.anims.generateFrameNumbers(
                "boss1-running-strike",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0 
        });
        
       scene.anims.create({
            key: "boss1-death",
            frames: scene.anims.generateFrameNumbers(
                "boss1-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: 0
        });
        
       scene.anims.create({
            key: "boss1-hurt",
            frames: scene.anims.generateFrameNumbers(
                "boss1-hurt",
                {start: 0, end: 3},
            ),
            frameRate: 8,
            repeat: 0
        });
        
       scene.anims.create({
            key: "boss1-idle",
            frames: scene.anims.generateFrameNumbers(
                "boss1-idle",
                {start: 0, end: 3},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
       scene.anims.create({
            key: "boss1-bite",
            frames: scene.anims.generateFrameNumbers(
                "boss1-bite",
                {start: 0, end: 3},
            ),
            frameRate: 8,
            repeat: 0
        });

       scene.anims.create({
            key: "boss1-walk",
            frames: scene.anims.generateFrameNumbers(
                "boss1-walk",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        

    }
    