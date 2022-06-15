const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefab1000: cc.Prefab = null;

    private ready: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {
        this.scheduleOnce(function () {
            this.ready = true;
        }, 1);
    }

    update (dt) {
        if(this.node.parent.getComponent("world1").getPauseState()) {
            return;
        }
        if(this.ready) {
            this.node.x -= 100 * dt;
        }
        if(this.node.y - cc.find("Canvas/Main Camera").y < -500) {
            this.node.destroy();
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "player") {
            contact.disabled = true;
            this.scheduleOnce(function() {
                this.node.destroy();
            }, 0.06);

            let action_1000 = cc.sequence(cc.moveBy(0.5, 0, 96).easing(cc.easeOut(2)), cc.fadeOut(1));
                this.scheduleOnce(function () {
                    let node_1000 = cc.instantiate(this.prefab1000);
                    node_1000.parent = cc.find("Canvas");
                    node_1000.setPosition(this.node.x, this.node.y + 48); 
                    node_1000.runAction(action_1000);
                }, 0.05);
        }
    }
}
