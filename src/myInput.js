class Input{
    constructor(){
        this.keys = [];
        this.lastKey = "";
        this.touchX = 0;
        this.touchY = 0;
        this.touchThreshold = 50;
        //developer
        
        //button
        this.keypressed = false;
        this.buttons = document.querySelectorAll("button");
        this.buttons.forEach(btn=>{
            btn.addEventListener('touchstart', (e)=>{
                if(this.keys.indexOf(e.target.id) === -1){
                    this.keys.unshift(e.target.id);
                    this.lastKey = e.target.id;
                    this.keypressed = true;
                }
            });
            btn.addEventListener ('touchend', (e)=>{
                if(this.keys.indexOf(e.target.id) > -1){
                    this.keys.splice(this.keys.indexOf(e.target.id), 1);
                    this.lastKey = "";
                    this.keypressed = false;
                }
            })
            
            btn.addEventListener('mousedown', (e)=>{
                if(this.keys.indexOf(e.target.id) === -1){
                    this.keys.unshift(e.target.id);
                    this.lastKey = e.target.id;
                    this.keypressed = true;
                }
            });
            btn.addEventListener ('mouseup', (e)=>{
                if(this.keys.indexOf(e.target.id) > -1){
                    this.keys.splice(this.keys.indexOf(e.target.id), 1);
                    this.lastKey = "";
                    this.keypressed = false;
                }
            })
        })

        //arrows
        window.addEventListener('keydown', (e)=>{
            if(this.keys.indexOf(e.key) === -1){
                this.keys.unshift(e.key);
                this.lastKey = e.key;
                this.keypressed = true;
            }
        })
        window.addEventListener('keyup', (e)=>{
            if(this.keys.indexOf(e.key) > -1){
                this.keys.splice(this.keys.indexOf(e.key), 1);
                this.lastKey = "";
                this.keypressed = false;
            }
        })
    }
}

export const myInput = new Input();