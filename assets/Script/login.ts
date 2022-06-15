// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    LoginBtn() {
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "login";
        eventHandler.handler = "login";
        cc.find("Canvas/menu_bg/Login").getComponent(cc.Button).clickEvents.push(eventHandler);
    }

    login () {
        let email = cc.find("Canvas/menu_bg/Email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/menu_bg/Password").getComponent(cc.EditBox).string;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            alert("Success!");
            cc.director.loadScene("selectWorld");
        }).catch(function (error) {
            alert(error.message);
        });
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.LoginBtn();
    }

    // update (dt) {}
}