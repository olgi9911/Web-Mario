declare const firebase: any;
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    World1Btn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "selectWorld";
        clickEventHandler.handler = "handler_1";

        cc.find("Canvas/menu_bg/World_1").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    World2Btn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "selectWorld";
        clickEventHandler.handler = "handler_2";

        cc.find("Canvas/menu_bg/World_2").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    LeaderBoardBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "selectWorld";
        clickEventHandler.handler = "show_leaderboard";

        cc.find("Canvas/menu_bg/Leaderboard").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    returnBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "selectWorld";
        clickEventHandler.handler = "return";

        cc.find("Canvas/leaderboard/return").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    returnMenuBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "selectWorld";
        clickEventHandler.handler = "returnMenu";

        cc.find("Canvas/menu_bg/return").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    handler_1() {
        cc.audioEngine.stopAll();
        var seq = cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            cc.director.loadScene('world_1');
        }));
        this.node.runAction(seq);
    }

    handler_2() {
        cc.audioEngine.stopAll();
        var seq = cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            cc.director.loadScene('world_2');
        }));
        this.node.runAction(seq);
    }

    show_leaderboard() {
        cc.find("Canvas/menu_bg/World_1").active = false;
        cc.find("Canvas/menu_bg/World_2").active = false;
        cc.find("Canvas/menu_bg/Leaderboard").active = false;
        cc.find("Canvas/menu_bg/return").active = false;
        cc.find("Canvas/leaderboard").active = true;
        for(let i = 1; i <= 5; i++) {
            cc.find("Canvas/leaderboard/No." + String(i)).active = false;
        }
        this.readInfo();
    }

    return() {
        cc.find("Canvas/menu_bg/World_1").active = true;
        cc.find("Canvas/menu_bg/World_2").active = true;
        cc.find("Canvas/menu_bg/Leaderboard").active = true;
        cc.find("Canvas/menu_bg/return").active = true;
        cc.find("Canvas/leaderboard").active = false;
    }

    returnMenu() {
        var seq = cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            cc.director.loadScene('menu');
        }));
        cc.audioEngine.stopAll();
        this.node.runAction(seq);
    }

    readInfo() {
        firebase.database().ref('leaderBoard/').orderByChild("score").once("value", function (snapshot) {
            var name = []
            var score = []

            snapshot.forEach(function (key) {
                name.push(key.val().name);
                score.push(key.val().score);
            })

            score.reverse(); 
            name.reverse();

            for (let i = 1; i <= score.length; i++) {
                cc.find("Canvas/leaderboard/No." + String(i)).active = true;
                cc.find("Canvas/leaderboard/No." + String(i) + "/name").getComponent(cc.Label).string = name[i - 1];
                cc.find("Canvas/leaderboard/No." + String(i) + "/score").getComponent(cc.Label).string = score[i - 1];
            }
        });
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.find("Canvas/leaderboard").active = false;
    }

    start () {
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.bgm, true, 0.5);
        this.World1Btn();
        this.World2Btn(); 
        this.LeaderBoardBtn();
        this.returnBtn();
        this.returnMenuBtn();
    }

    // update (dt) {}
}
