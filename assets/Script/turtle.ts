const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefab100: cc.Prefab = null;

    @property({type:cc.AudioClip})
    kickSound: cc.AudioClip = null;

    private anim: cc.Animation = null;
    private dead: boolean = false;
    private speed: number = -100;
    private started: boolean = false;
    private stop: boolean = false;
    private state: string = "normal";
    private kicked: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {
        if(this.node.parent.getComponent("world1").getPauseState()) {
            return;
        }
        if(!this.dead && !this.stop && (this.node.x - cc.find("Canvas/Main Camera").x < 480 || this.started)) { // in camera
            this.started = true;
            this.node.x += this.speed * dt;
        }
        if(this.node.y - cc.find("Canvas/Main Camera").y < -500) {
            this.node.destroy();
        }   
    }

    onBeginContact (contact, self, other) {
        if(other.node.name == "player") {
            if(this.state == "normal") {
                if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == 1) {
                    //this.dead = true;
                    //contact.disabled = true;
                    other.scheduleOnce(function() {other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 800);}
                     ,0.05);
                    this.anim.play("turtle_recede");
                    this.state = "recede";
                    this.stop = true;
                    this.getComponent(cc.PhysicsBoxCollider).size.height = 16;
                    this.getComponent(cc.PhysicsBoxCollider).size.width = 16;
                    this.getComponent(cc.PhysicsBoxCollider).offset.y = -5.5;
                    this.getComponent(cc.PhysicsBoxCollider).apply(); 
                } else {
                    other.node.getComponent("player").powerDown();
                    contact.disabled = true;
                }
            } else if(this.state == "recede") {
                cc.audioEngine.playEffect(this.kickSound, false);
                let action_100 = cc.sequence(cc.moveBy(0.5, 0, 96).easing(cc.easeOut(2)), cc.fadeOut(1));
                this.scheduleOnce(function () {
                    let node_100 = cc.instantiate(this.prefab100);
                    node_100.parent = cc.find("Canvas");
                    node_100.setPosition(this.node.x, this.node.y + 48); 
                    node_100.runAction(action_100);
                    other.node.getComponent("player").add_100();
                }, 0.1);
                if(contact.getWorldManifold().normal.x == 1 && contact.getWorldManifold().normal.y == 0) { // right kick
                    this.state = "spin";
                    this.anim.play("turtle_spin");
                    this.speed = -300;
                    this.stop = false;
                } else if(contact.getWorldManifold().normal.x == -1 && contact.getWorldManifold().normal.y == 0) { // left kick
                    contact.disabled = true;
                    //this.scheduleOnce(function () {
                        this.state = "spin";
                    //}, 0.02);
                    //this.state = "spin";
                    this.anim.play("turtle_spin").wrapMode = cc.WrapMode.Reverse;
                    //this.node.scaleX *= -1;
                    this.speed = 300;
                    this.stop = false;
                }
            } else if(this.state == "spin") {
                if(contact.getWorldManifold().normal.x == 1 || contact.getWorldManifold().normal.x == -1) {
                    other.node.getComponent("player").powerDown();
                    contact.disabled = true;
                }
            }
        } else if(other.node.name == "block" || other.node.name == "pipe") {
            if(contact.getWorldManifold().normal.y != -1) {
                this.speed *= -1;
                //cc.log("HIII");
                this.node.scaleX *= -1;
                //contact.disabled = true;
            }
        }  else if(other.node.name == "gold") {
            this.speed *= -1;
            //cc.log("HIII");
            this.node.scaleX *= -1;
            
        } else if(other.node.name == "goomba" || other.node.name == "turtle") {
            if(contact.getWorldManifold().normal.y == -1) {
                contact.disabled = true;
            }
            if(this.state == "normal" || this.state == "recede") {
                this.speed *= -1;
                this.node.scaleX *= -1;
            } else if(this.state == "spin") {
                other.scheduleOnce(function() {
                    other.node.destroy();
                }, 0.1);
            }
        }
    }
}
