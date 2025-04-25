import { texts } from "../utils/Texts.js";


export class Container extends Phaser.GameObjects.Container{
    constructor(scene, x, y){
        super(scene, x, y);
        
        this.scene = scene;
        this.config = scene.config;
        this.init();
        scene.add.existing(this);
    }
    
    init(){
        this
            .setDepth(20)
            .setScale(1/this.config.zoomFactor)
            .setPosition(this.config.topLeft.x, this.config.topLeft.y)
        this.addObjects();
    }
    
    addObjects(){
        const textBox = this.createTextBox().start(texts.intro, 50);
        
        this.add(textBox)
        
    }
    
    createTextBox(){
        const boxWidth = 320;
        const boxHeight = 200;

        const textBox = this.scene.rexUI.add.textBox(
            {width: boxWidth,
             height: boxHeight,
             x: this.config.width/2 - boxWidth/2,
             y: 10 || this.config.height - boxHeight,
             background: this.scene.rexUI.add.roundRectangle(
                 {color: 0x808000, strokeColor: 0x00ff00, strokeWidth: 2, radius: 20}
             ),
             text: this.scene.add.text(0,0,"",
                 {fontSize: "25px",
                  fontFamily: "myOtherFont",
                  wordWrap: {width: boxWidth},
                  fixedWidth: boxWidth,
                  fixedHeight: 120,
                  maxLines: 4
                 }
             ),
           //  page:{maxLines: 3},
             title: undefined,
             separator: undefined,
             typingMode: 'page',
             align: {title: 'center', action: 'bottom', icon: 'left'},
             space: {top: 10, left: 10, bottom: 10, right: 0, icon: 10, text: 10},
             action: this.scene.rexUI.add.aioSpinner(
                 {width: 20, height: 20, animationMode: 'ball', duration: 1000}
             ).setVisible(false),
             icon: this.scene.add.image(0,0,'tour-guide')
                .setOrigin(0)
             
            }
        ).setOrigin(0)
            .setScrollFactor(0)
            .layout();
       
        //events
        const spinner = textBox.getElement('action'); 
        textBox.setInteractive()
        .on('pointerdown', function(){
            if(this.isTyping){
                this.stop(true);
            }
            else{
                this.typeNextPage();
            }
        }, textBox)
        
        .on('type', function(){
            spinner.stop().setVisible(false)
        }, textBox)
        
        .on('pageend', function(){
            spinner.setVisible(true).start()
            if(this.isLastPage){
                spinner.stop().setVisible(false)
            }
        }, textBox)
        
        return textBox
    }
}