import { Enemy } from "./Enemy.js";

export class Orc extends Enemy{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
    }
    
    //ANIMATIONS

}

export class OrcBase extends Orc{
    constructor(scene, x, y){
        super(scene, x, y, "orc-base");
    }
    handleAnimations() {
        if (this.body && this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("orc-base-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("orc-base-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
    }
}

export class OrcRogue extends Orc{
    constructor(scene, x, y){
        super(scene, x, y, "orc-rogue");
    }
    
    handleAnimations() {
        if (this.body && this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("orc-rogue-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("orc-rogue-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
    }
}

export class OrcShaman extends Orc {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-shaman");
    }

    handleAnimations() {
        if (this.body && this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("orc-shaman-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("orc-shaman-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
    }
}

export class OrcWarrior extends Orc {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-warrior");
    }
    handleAnimations() {
        if (this.body && this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("orc-warrior-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("orc-warrior-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
    }
}