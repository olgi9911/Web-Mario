// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;
    
    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true); //repeat
    }

    LoginBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "menu";
        clickEventHandler.handler = "handler_login";

        cc.find("Canvas/menu_bg/Login").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    SignUpBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "menu";
        clickEventHandler.handler = "handler_signup";

        cc.find("Canvas/menu_bg/SignUp").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    handler_login() {
        cc.log("Login");
        cc.director.loadScene("login");
    }

    handler_signup() {
        cc.log("Sign Up");
        cc.director.loadScene("signup");
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.playBGM();
        this.LoginBtn();
        this.SignUpBtn();
    }

    // update (dt) {}
}
