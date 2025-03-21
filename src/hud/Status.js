export function drawStatus(entity){
        const x = entity.scene.config.topLeft.x;
        const y = entity.scene.config.topLeft.y;

        let statusText;
        
           statusText =entity.scene.add.text(0, 0, "", {
                font: "15px myOtherFont"
            })
            .setOrigin(0)
                .setDepth(20)
                .setScrollFactor(0)
                .setStyle({ fill: "white" })
                .setPosition(x, y)
        
        statusText.setText("state: "+entity.currentState.name)
}