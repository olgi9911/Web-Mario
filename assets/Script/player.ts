const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class player extends cc.Component {

    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    stompSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    coinSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    mushroomSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    playerDownSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    courseClearSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    powerDownSound: cc.AudioClip = null;
    @property({type:cc.SpriteFrame})
    bigMario: cc.SpriteFrame = null;

    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private upDown: boolean = false;
    private onGround: boolean = false;
    private big: boolean = false;
    private powerUpProcess: boolean = false;
    private dead: boolean = false;

    private timer: number = 300;
    private score: number = 0;
    private coin: number = 0;
    private moveTime: number = 0;
    private life: number = 5;

    private idleFrame: cc.SpriteFrame = null;
    private smallFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;

    onKeyDown (event) {
        if(event.keyCode == cc.macro.KEY.left) {
            this.leftDown = true;
            this.rightDown = false;
        } else if(event.keyCode == cc.macro.KEY.right) {
            this.rightDown = true;
            this.leftDown = false;
        } else if(event.keyCode == cc.macro.KEY.up) {
            this.upDown = true;
        }
    }

    onKeyUp (event) {
        if(event.keyCode == cc.macro.KEY.left) {
            this.leftDown = false;
        } else if(event.keyCode == cc.macro.KEY.right) {
            this.rightDown = false;
        } else if(event.keyCode == cc.macro.KEY.up) {
            this.upDown = false;
        }
    }

    read_info() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = firebase.auth().currentUser.uid;
                firebase.database().ref('userData/' + uid).once('value').then(snapshot => {
                    //this.name = snapshot.val().name;
                    this.life = Number(snapshot.val().life);
                    this.coin = Number(snapshot.val().coin);
                    this.score = Number(snapshot.val().score);
                });
            }
            else { // No user is signed in.
                //cc.director.loadScene("menu");
            }
        });
    }

    write_info() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = firebase.auth().currentUser.uid;
                firebase.database().ref('leaderBoard/' + uid).once('value').then(snapshot => {
                    if(this.score > snapshot.val().score) {
                        firebase.database().ref('leaderBoard/' + uid).update({
                            score: this.score
                        })
                    }
                });

                if(this.life <= 0) { // reset information
                    firebase.database().ref('userData/' + uid).update({
                        life: 5,
                        coin: 0,
                        score: 0
                    })
                } else {
                    firebase.database().ref('userData/' + uid).update({
                        life: this.life,
                        coin: this.coin,
                        score: this.score
                    })
                }
            }
            else { // No user is signed in.
                //cc.director.loadScene("menu");
            }
        });
    }

    playerMove (dt) {
        let playerSpeed = 0;
        if(this.dead) return;
        if(this.upDown && this.onGround) {
            this.jump(1200);
            //cc.log("Hello");
        }

        if(this.leftDown) {
            playerSpeed = -300;
            this.node.scaleX = (this.node.scaleX > 0) ? this.node.scaleX * -1 : this.node.scaleX;
            if(!this.big && this.onGround && !this.anim.getAnimationState("player_move").isPlaying && !this.anim.getAnimationState("player_powerup").isPlaying && !this.anim.getAnimationState("player_down").isPlaying) {
                this.anim.play("player_move");
            }
            if(this.big && this.onGround && !this.anim.getAnimationState("big_move").isPlaying && !this.anim.getAnimationState("player_powerup").isPlaying) {
                this.anim.play("big_move");
            }
            this.moveTime -= dt;
        } else if(this.rightDown && this.node.x < (2784 * 3 - 480 - 16 - 4)) {
            playerSpeed = 300;
            this.node.scaleX = (this.node.scaleX < 0) ? this.node.scaleX * -1 : this.node.scaleX;
            if(!this.big && this.onGround && !this.anim.getAnimationState("player_move").isPlaying && !this.anim.getAnimationState("player_powerup").isPlaying && !this.anim.getAnimationState("player_down").isPlaying) {
                this.anim.play("player_move");
            }
            if(this.big && this.onGround && !this.anim.getAnimationState("big_move").isPlaying && !this.anim.getAnimationState("player_powerup").isPlaying) {
                this.anim.play("big_move");
            }
            this.moveTime = 12;
        } else if(this.onGround && !this.powerUpProcess) {
            
            this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
            this.anim.stop();
            //this.moveTime = 0;
        }

        this.node.x += playerSpeed * dt;
        //this.node.x = cc.misc.lerp(this.node.x, this.node.x + playerSpeed, dt * 1.7);
    }

    jump (velocity) {
        if(this.dead) return;
        this.onGround = false;
        if(!this.big && !this.anim.getAnimationState("player_jump").isPlaying && !this.anim.getAnimationState("player_down").isPlaying) {
                this.anim.play("player_jump");
        }
        if(this.big && !this.anim.getAnimationState("big_jump").isPlaying) {
                this.anim.play("big_jump");
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, velocity);
        cc.audioEngine.playEffect(this.jumpSound, false);
    }

    camera(dt) {
        var cam = cc.find("Canvas/Main Camera");
        //cc.log(cam.x);
        if(this.node.scaleX > 0) {
            if(Math.floor(this.node.x - cam.x) > 0 && cam.x < (2784 * 3 - 960 - 4 - 4)) {
                //cam.x += 300 * dt; // playerSpeed
                cam.x = cc.misc.lerp(cam.x, this.node.x, dt * 10);
            }
        } else if(this.node.scaleX < 0 && cam.x > 0) {
            if(Math.floor(cam.x - this.node.x) > 0) {
                cam.x = cc.misc.lerp(cam.x, this.node.x, dt * 10);
            }
        } 
        //cc.log(this.node.y);
        let y_distance = Math.abs(this.node.y - cam.y);
        if(y_distance > 320 && this.node.y > -300) {
            cam.y = cc.misc.lerp(cam.y, this.node.y, dt * 10);
        }  
        if(y_distance < 320 && cam.y > -128) {
            cam.y = cc.misc.lerp(cam.y, this.node.y, dt * 10);
        }
    }

    powerUp() {
        //this.idleFrame = this.bigMario;
        this.big = true;
        cc.log("PowerUp");
        cc.log("Hi");
        this.powerUpProcess = true;
        this.anim.play("player_powerup");
        cc.audioEngine.playEffect(this.mushroomSound, false);
        this.scheduleOnce(function () {
            this.getComponent(cc.PhysicsBoxCollider).size.height = 25;
            this.getComponent(cc.PhysicsBoxCollider).size.width = 14;
            this.getComponent(cc.PhysicsBoxCollider).apply();
            this.idleFrame = this.bigMario;
            this.powerUpProcess = false;
        }, 0.9);
    }

    powerDown() {
        if(!this.big) { 
            this.playerDown();
            return;
        }
        cc.log("PowerDown");
        this.big = false;
        this.powerUpProcess = true;
        this.anim.play("player_powerup").wrapMode = cc.WrapMode.Reverse;
        cc.audioEngine.playEffect(this.powerDownSound, false);
        this.scheduleOnce(function () {
            this.getComponent(cc.PhysicsBoxCollider).size.height = 15;
            this.getComponent(cc.PhysicsBoxCollider).size.width = 11;
            this.getComponent(cc.PhysicsBoxCollider).apply();
            this.idleFrame = this.smallFrame;
            this.powerUpProcess = false;
        }, 0.9);
    }

    playerDown() {
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.playerDownSound, false);
        this.life -= 1;
        this.onGround = false;
        this.dead = true;
        this.anim.play("player_down");
        this.write_info();
        cc.log("Dead");
        cc.director.getPhysicsManager().enabled = false;
        let action = cc.sequence(cc.moveBy(0.5, 0, 140).easing(cc.easeInOut(2)), cc.moveBy(1.5, 0, -420).easing(cc.easeIn(2)));
        this.scheduleOnce(function () {
            this.node.runAction(action);
        }, 0.5);
        if(this.life > 0) {
            if(cc.director.getScene().name == "world_1") { 
                this.scheduleOnce(function () {cc.director.loadScene("startScene_1");}, 2.5);
            } else {
                this.scheduleOnce(function () {cc.director.loadScene("startScene_2");}, 2.5);
            }
            
        } else {
            this.scheduleOnce(function () {cc.director.loadScene("gameOver");}, 2.5);
        }
        
    }

    add_mystery() {
        this.score += 100;
        this.coin += 1;
    }

    add_100() {
        this.score += 100;
    }

    courseClear() {
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.courseClearSound, false);
        this.score += Math.floor(this.timer) * 50;
        cc.find("Canvas/COURSE").active = true;
        cc.find("Canvas/CLEAR").active = true;
        cc.log(this.score);
        this.write_info();
        this.scheduleOnce(function() {cc.director.loadScene("selectWorld");}, 5);    
    }

    onBeginContact (contact, self, other) {
        if(other.node.name == "ground") {
            this.onGround = true;
        } else if(other.node.name == "collider") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.onGround = true;
            }
            else {
                contact.disabled = true;
            }
        } else if(other.node.name == "pipe") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.onGround = true;
            }
        } else if(other.node.name == "block" || other.node.name == "gold") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.onGround = true;
            }
        } else if(other.node.name == "mystery") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.onGround = true;
            } else if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == 1) {
                 
                //this.score += 100;
                //this.coin += 1;
            }
        } else if(other.node.name == "mystery_mushroom") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.onGround = true;
            } else if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == 1) {
                //this.score += 1000;
            }
        } else if(other.node.name == "star") {
            this.courseClear();
            other.node.destroy();
        } else if(other.node.name == "goomba") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                this.scheduleOnce(function() {this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 900);}
                , 0.05);
                this.scheduleOnce(function() {this.score += 100;}, 0.05);
                cc.audioEngine.playEffect(this.stompSound, false);
            }
        } else if(other.node.name == "mushroom") {
            this.score += 1000;
            if(!this.big) {
                this.powerUp();
            }
        } else if(other.node.name == "turtle") {
            if(contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == -1) {
                //this.scheduleOnce(function() {this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 900);}
                //, 0.05);
                //this.scheduleOnce(function() {this.score += 100;}, 0.05);
                this.onGround = true;
                cc.audioEngine.playEffect(this.stompSound, false);
            }
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.smallFrame = this.idleFrame;
        this.anim = this.getComponent(cc.Animation);
        this.read_info();
    }

    update (dt) {
        if(this.node.parent.getComponent("world1").getPauseState()) {
            return;
        }
        this.playerMove(dt);
        if(this.timer > 0) {
            this.timer -= dt;
        }
        if(this.node.y - cc.find("Canvas/Main Camera").y < -500) {
            cc.audioEngine.stopAll();
            this.life -= 1;
            this.write_info();
            if(cc.director.getScene().name == "world_1") {
                this.scheduleOnce(function () {cc.director.loadScene("startScene_1");}, 1.5);
            } else {
                this.scheduleOnce(function () {cc.director.loadScene("startScene_2");}, 1.5);
            }
            
        }

        cc.find("Canvas/Main Camera/timer_num").getComponent(cc.Label).string = String(Math.floor(this.timer));
        cc.find("Canvas/Main Camera/coin_num").getComponent(cc.Label).string = String(this.coin);
        cc.find("Canvas/Main Camera/life_num").getComponent(cc.Label).string = String(this.life);
        cc.find("Canvas/Main Camera/score").getComponent(cc.Label).string = String(this.score).padStart(7, '0');

    }

    lateUpdate (dt) {
        this.camera(dt);
    }
}
