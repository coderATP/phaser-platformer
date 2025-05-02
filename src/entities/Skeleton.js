import { Enemy } from "./Enemy.js";

export class Skeleton extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        
    }
}

export class SkeletonBase extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-base");
    }
}

export class SkeletonMage extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-mage");
    }
}

export class SkeletonRogue extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-rogue");
    }
}

export class SkeletonWarrior extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton-warrior");
    }
}