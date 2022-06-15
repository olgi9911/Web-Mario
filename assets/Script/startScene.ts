// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    text: string = '1';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start () {
        this.scheduleOnce(function() {
            if(cc.director.getScene().name == "startScene_1") {
                cc.director.loadScene("world_1");
            } else {
                cc.director.loadScene("world_2");
            }
            
        }, 2);
    }
    // update (dt) {}
}
