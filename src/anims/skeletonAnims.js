export function createSkeletonAnimKeys(scene){
    //skeleton-base
       scene.anims.create({
            key: "skeleton-base-death",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-base-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        scene.anims.create({
            key: "skeleton-base-idle",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-base",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "skeleton-base-run",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-base-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
       //skeleton-rogue 
       scene.anims.create({
            key: "skeleton-rogue-death",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-rogue-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        scene.anims.create({
            key: "skeleton-rogue-idle",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-rogue",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "skeleton-rogue-run",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-rogue-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
       //skeleton-mage
       scene.anims.create({
            key: "skeleton-mage-death",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-mage-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        scene.anims.create({
            key: "skeleton-mage-idle",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-mage",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "skeleton-mage-run",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-mage-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
       //skeleton-warrior 
       scene.anims.create({
            key: "skeleton-warrior-death",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-warrior-death",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        });
        scene.anims.create({
            key: "skeleton-warrior-idle",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-warrior",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        scene.anims.create({
            key: "skeleton-warrior-run",
            frames: scene.anims.generateFrameNumbers(
                "skeleton-warrior-run",
                {start: 0, end: 5},
            ),
            frameRate: 8,
            repeat: -1 
        }); 
    }
    