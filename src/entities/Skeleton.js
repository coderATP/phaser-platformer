import { Enemy } from "./Enemy.js";

export class Skeleton extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        
        this.on("animationcomplete", (animation)=>{
            if(animation === "skeleton-base-death" || animation === "skeleton-mage-death" || animation === "skeleton-rogue-death" || animation === "skeleton-warrior-death"){
                this.destroy();
            }
        })
    }

    //ANIMATIONS

}

export class SkeletonBase extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-base");
    }
    handleAnimations() {
        if(!this.body) return;
        if (this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("skeleton-base-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("skeleton-base-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
        else{
            //this.play("skeleton-base-death", true);
        }
    }
}

export class SkeletonMage extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-mage");
    }

    handleAnimations() {
        if(!this.body) return; 
        if (this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("skeleton-mage-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("skeleton-mage-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
        else{
            //this.play("skeleton-mage-death", true);
        } 
    }
}

export class SkeletonRogue extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-rogue");
    }

    handleAnimations() {
        if(!this.body) return;
        if (this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("skeleton-rogue-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("skeleton-rogue-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
        else{
            //this.play("skeleton-rogue-death", true);
        } 
    }
}

export class SkeletonWarrior extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-warrior");
    }
    handleAnimations() {
        if(!this.body) return;
        if (this.health > 0) {
            if (this.body.velocity.x !== 0) {
                this.play("skeleton-warrior-run", true)
                this.flipX ? this.setOffset(this.width * 0.4, this.height * 0.58) :
                    this.setOffset(this.width * 0.45, this.height * 0.58);
            }
            else {
                this.play("skeleton-warrior-idle", true)
                this.setOffset(this.width * 0.35, this.height * 0.2);
            }
        }
        else {
            //this.play("skeleton-warrior-death", true);
        }
    }
}