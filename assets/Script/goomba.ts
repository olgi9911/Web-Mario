const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefab100: cc.Prefab = null;

    private anim: cc.Animation = null;
    private dead: boolean = false;
    private speed: number = -100;
    private started: boolean = false;

    onLoad () {
        //contact.director.getPhysicsManager().enabled = true;
    }

    start () {
        cc.log("Hi");
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {
        if(this.node.parent.getComponent("world1").getPauseState()) {
            return;
        }
        if(!this.dead && (this.node.x - cc.find("Canvas/Main Camera").x < 480 || this.started)) { // in camera
            this.started = true;
            this.node.x += this.speed * dt;
        }
        if(this.node.y - cc.find("Canvas/Main Camera").y < -500) {
            this.node.destroy();
        }
    }

    onBeginContact (contact, self, other) {
        if(other.node.name == "player") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == 1) {
                this.dead = true;
                contact.disabled = true;
                this.anim.play("goomba");
                this.scheduleOnce(function() {
                    this.node.destroy();
                }, 0.5);

                let action_100 = cc.sequence(cc.moveBy(0.5, 0, 96).easing(cc.easeOut(2)), cc.fadeOut(1));
                this.scheduleOnce(function () {
                    let node_100 = cc.instantiate(this.prefab100);
                    node_100.parent = cc.find("Canvas");
                    node_100.setPosition(this.node.x, this.node.y + 48); 
                    node_100.runAction(action_100);
                }, 0.1);
            } else {
                contact.disabled = true;
                other.node.getComponent("player").powerDown();
            }
        } else if(other.node.name == "block" || other.node.name == "pipe" || other.node.name == "gold" || other.node.name == "goomba" || other.node.name == "turtle") {
            this.speed *= -1;
            //cc.log("HIII");
            this.node.scaleX *= -1;
            //contact.disabled = true;
        }
    }
}
