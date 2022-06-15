const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    @property({type:cc.Prefab})
    pause: cc.Prefab = null;

    private audioID: number;
    private escapeDown: boolean = false;
    private counter: number = 0;
    private upCounter: number = 0;
    private downCounter: number = 0;
    private arrowPosition: number = 0;
    private enterCounter: number = 0;

    onKeyDown (event) {
        if(event.keyCode == cc.macro.KEY.escape) {
            this.escapeDown = true;
            this.counter++;
        } else if(event.keyCode == cc.macro.KEY.up) {
            this.upCounter++;
        } else if(event.keyCode == cc.macro.KEY.down) {
            this.downCounter++;
        } else if(event.keyCode == cc.macro.KEY.enter) {
            this.enterCounter++;
        }
    }

    onKeyUp (event) {
        if(event.keyCode == cc.macro.KEY.escape)  {
            //this.escapeDown = false;
            this.counter = 0;
        } else if(event.keyCode == cc.macro.KEY.up) {
            this.upCounter = 0;
        }else if(event.keyCode == cc.macro.KEY.down) {
            this.downCounter = 0;
        } else if(event.keyCode == cc.macro.KEY.enter) {
            this.enterCounter = 0;
        }
            
    }

    getPauseState () {
        return this.escapeDown;
    }

    Pause() {
        //cc.director.pause();
        cc.director.getScheduler().setTimeScale(0);
        cc.audioEngine.pauseMusic();
        //var pause = cc.instantiate(this.pause);
        //cc.find("Canvas").addChild(pause);
        var cam = cc.find("Canvas/Main Camera")
        var pause = cc.find("Canvas/pause");
        pause.active = true;
        pause.setPosition(cam.x, cam.y);
        this.arrowPosition = cc.find("Canvas/pause/arrow").y;
        //pause.destroy();
        //this.ContinueBtn();
        //this.QuitBtn();
    }

    Continue() {
        cc.director.getScheduler().setTimeScale(1);
        //cc.find("Canvas/pause").destroy();
        //cc.find("Canvas/pause").active = false;
        var pause = cc.find("Canvas/pause");
        pause.active = false;
        //cc.director.resume();
        cc.audioEngine.resumeMusic();
        this.escapeDown = false;
    }
    
    Quit() {
        cc.director.getScheduler().setTimeScale(1);
        //cc.find("Canvas/pause").active = false;
        var pause = cc.find("Canvas/pause");
        pause.active = false;
        var seq = cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            cc.director.loadScene('selectWorld');
        }));
        this.node.runAction(seq);
    }

    playBGM() {
        this.audioID = cc.audioEngine.playMusic(this.bgm, true); //repeat
        cc.audioEngine.setVolume(this.audioID, 0.5);
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        this.playBGM();
        
    }

    update (dt) {
        if(this.counter == 1) {
            this.Pause();
        }
        if(this.escapeDown) {
            if(this.upCounter == 1) {
                if(cc.find("Canvas/pause/arrow").y < this.arrowPosition) {
                    cc.find("Canvas/pause/arrow").y += 16;
                }
            } else if(this.downCounter == 1) {
                cc.log("Down");
                if(cc.find("Canvas/pause/arrow").y == this.arrowPosition) {
                    cc.find("Canvas/pause/arrow").y -= 16;
                }
            } else if(this.enterCounter == 1) {
                if(cc.find("Canvas/pause/arrow").y == this.arrowPosition) {
                    this.Continue();
                    //this.Quit();
                } else if(cc.find("Canvas/pause/arrow").y == (this.arrowPosition - 16)) {
                    this.Quit();
                }
            }
        }
        
    }
}
