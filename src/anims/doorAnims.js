export function createDoorAnimKeys(scene){
       scene.anims.create({
            key: "door-open",
            frames: scene.anims.generateFrameNumbers(
                "exitDoor",
                {start: 0, end: 6},
            ),
            frameRate: 12,
            repeat: 0 
        });
}