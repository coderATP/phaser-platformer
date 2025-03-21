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
        //swipe
        window.addEventListener("touchstart", (e)=>{
            this.touchX = e.touches[0].clientX;
            this.touchY = e.touches[0].clientY;
        })
        window.addEventListener("touchmove", (e)=>{
            const dx = e.touches[0].clientX - this.touchX;
            const dy = e.touches[0].clientY - this.touchY;
            if(dx < -this.touchThreshold){
                this.lastKey = "swipe left";
                if(this.keys.indexOf(this.lastKey) === -1){
                    this.keys.unshift(this.lastKey);
                    this.keypressed = true;
                }
            }
            else if(dx > this.touchThreshold){
                this.lastKey = "swipe right";
                if(this.keys.indexOf(this.lastKey) === -1){
                   this.keys.unshift(this.lastKey);
                    this.keypressed = true;
                }  
            }
            else if(dy < -this.touchThreshold){
                this.lastKey = "swipe up";
                if (this.keys.indexOf(this.lastKey) === -1) {
                    this.keys.unshift(this.lastKey);
                    this.keypressed = true;
                }
            }
            else if(dy > this.touchThreshold){
                this.lastKey = "swipe down";
                if (this.keys.indexOf(this.lastKey) === -1) {
                    this.keys.unshift(this.lastKey);
                    this.keypressed = true;  
                }

            }
        })
        window.addEventListener("touchend", (e) => {
            if(this.keys.indexOf(this.lastKey) > -1){
                this.keys.splice(this.keys.indexOf(this.lastKey), 1);
                this.lastKey = "";
                this.keypressed = false;
            } 
        })
    }
        
}

export const myInput = new Input();