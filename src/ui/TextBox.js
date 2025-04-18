export const texts = {
    intro: "Welcome to the tutorial section. I am Larry, your tour guide. Press < to move left and > to move right.",
}

export function createTextBox(scene, config){
    let textBox = scene.rexUI.add.textBox({
        width: config.width,
        height: config.height,
        typingMode: 'page',
        background: scene.rexUI.add.roundRectangle(
            { color: 0x4e342e, radius: 20, strokeColor: 0x7b5e57, strokeWidth: 2}),
        space: { top: 25, left: 25, right: 25, bottom: 25 },
        action: scene.rexUI.add.aioSpinner(
            { width: 20, height:20, animationMode: 'ball'}
        ).setVisible(false),
        title: (config.title) ? scene.add.text(0,0, config.title) : undefined, //
        text: scene.add.text(0, 0, '', { fontSize: '20px', fontFamily: "myOtherFont", wordWrap: { width: config.width }, maxLines: 3 })//
             .setFixedSize(config.width, config.height),
 
    }).setOrigin(0).layout()
            .setDepth(21)
            .setScrollFactor(0)
            .setScale(1/scene.config.zoomFactor)
            .setPosition(scene.config.topLeft.x + config.x, scene.config.topLeft.y + config.y) 
    return textBox;
}