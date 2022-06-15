const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private anim: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {
        if(this.node.parent.getComponent("world1").getPauseState()) {
            return;
        }
        if(Math.abs(this.node.x - cc.find("Canvas/Main Camera").x) < 500) { // in camera
            if(this.node.name == "flower_high") {
                if(!this.anim.getAnimationState("flower_high_pipe").isPlaying) {
                    this.anim.play("flower_high_pipe");
                }
            } else {
                if(!this.anim.getAnimationState("flower_pipe").isPlaying) {
                    this.anim.play("flower_pipe");
                }
            }
            
        } else {
            this.anim.stop();
        }
    }

    onBeginContact (contact, self, other) {
        if(other.node.name == "player") {
            contact.disabled = true;
            other.node.getComponent("player").powerDown();
        }
    }
}