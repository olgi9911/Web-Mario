// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
declare const firebase: any;

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    SignUpBtn() {
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "signup";
        eventHandler.handler = "signup";
        cc.find("Canvas/menu_bg/SignUp").getComponent(cc.Button).clickEvents.push(eventHandler);
    }

    signup () {
        let name = cc.find("Canvas/menu_bg/Name").getComponent(cc.EditBox).string;
        let email = cc.find("Canvas/menu_bg/Email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/menu_bg/Password").getComponent(cc.EditBox).string;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            const uid = firebase.auth().currentUser.uid;
            firebase.database().ref('leaderBoard/' + uid).set({
                name: name,
                score: 0
            });
            firebase.database().ref("userData/" + uid).set({
                name: name,
                email: email,
                //password: password
                life: 5,
                score: 0,
                coin: 0
            }).then(function () {
                alert("Success!");
                cc.director.loadScene("selectWorld");
            }).catch(function (error) {
                alert(error.message);
            });
        }).catch(function (error) {
            alert(error.message);
        });
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.SignUpBtn();
    }

    // update (dt) {}
}
