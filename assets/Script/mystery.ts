const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefabCoin: cc.Prefab = null;
    @property(cc.Prefab)
    prefabMushroom: cc.Prefab = null;
    @property(cc.Prefab)
    prefab100: cc.Prefab = null;
    @property(cc.Prefab)
    prefab1000: cc.Prefab = null; 
    @property({type:cc.AudioClip})
    coinSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    mushroomAppearSound: cc.AudioClip = null;

    private idleFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;
    private touched: boolean = false;

    onBeginContact (contact, self, other) {
        if(other.node.name == "player") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                this.anim.stop();

                if(this.node.name == "mystery" && !this.touched) {
                    cc.audioEngine.playEffect(this.coinSound, false);
                    other.node.getComponent("player").add_mystery();
                    this.touched = true;
                    let coin = cc.instantiate(this.prefabCoin);
                    //let node_100 = cc.instantiate(this.prefab100);
                    coin.parent = cc.find("Canvas");
                    
                    coin.setPosition(this.node.x, this.node.y + 48);

                    let coinAnim = coin.getComponent(cc.Animation);
                    let playAnim = cc.callFunc(function() {
                        
                        coinAnim.play("coin");
                    }, this);

                    let destroy = cc.callFunc(function() {
                        this.scheduleOnce(function() {coin.destroy();}, 0.15);  
                    }, this);

                    let action_coin = cc.sequence(cc.moveBy(0.2, 0, 96).easing(cc.easeOut(2)), cc.moveBy(0.2, 0, -96).easing(cc.easeInOut(2)), 
                    playAnim, destroy);
                    coin.runAction(action_coin);

                    let action_100 = cc.sequence(cc.moveBy(0.5, 0, 96).easing(cc.easeOut(2)), cc.fadeOut(1));
                    this.scheduleOnce(function () {
                        let node_100 = cc.instantiate(this.prefab100);
                        node_100.parent = cc.find("Canvas");
                        node_100.setPosition(this.node.x, this.node.y + 48); 
                        node_100.runAction(action_100);
                    }, 0.4);
                } else if(this.node.name == "mystery_mushroom" && !this.touched) {
                    cc.audioEngine.playEffect(this.mushroomAppearSound, false);
                    //other.node.getComponent("player").add_mystery_mushroom();
                    this.touched = true;
                    let mushroom = cc.instantiate(this.prefabMushroom);
                    mushroom.parent = cc.find("Canvas");
                    mushroom.setPosition(this.node.x, this.node.y + 48);
                    mushroom.opacity = 0;
                    let action_mushroom = cc.fadeIn(1.0);
                    mushroom.runAction(action_mushroom);
                }
            } 
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.getComponent(cc.Animation);
    }

    // update (dt) {}
}
