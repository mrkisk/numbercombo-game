const WIDTH = 20; // 横のマスの数
const HEIGHT = 4; // 縦のマスの数
const WIDTHG = 14; // ゲーム画面の横のマスの数
const SPEED = [3, 2]; // 落ちるスピード
const SPEEDUPNUM = 8; // この数値以上の数値ができるとスピードが速くなる
const TWONUM = 5; // この数値以上の数値ができると2個になる

const dx4 = [1, 0, -1, 0];
const dy4 = [0, -1, 0, 1];

let gameWidth, gameHeight;

let stack = new Array(WIDTH).fill(0).map(() => new Array(HEIGHT).fill(0)); // 既に落ちている数字
let lcd = new Array(WIDTH).fill(0).map(() => new Array(HEIGHT).fill(' ')); // lcdに出力する文字
let priority = new Array(WIDTH).fill(0).map(() => new Array(HEIGHT).fill(0)); // 合成した先の優先度
let nextPriority = new Array(WIDTH).fill(0).map(() => new Array(HEIGHT).fill(0)); // 優先度を更新するための記憶
let speed; // 何フレームおきに落ちるか
let x, y, rot, num, num2; // 自身のx座標、y座標、回転方向、数字
let canMove; // 自身を動かせるか
let doFall; // 落とす処理を行うかどうか
let didSynth; // 合成をしたかどうか
let maxNum; // 最大の数値-1
let timer; // タイマー
let score; // スコア
let isTwo; // 2個かどうか
let scene; // 0でスタート画面、1でゲーム画面、2でスコア表示
let hiscore = [0, 0]; // ハイスコア、こいつだけ初期化しない
let difficulty; // 0はeasy、1はhard
let spaceKey = false; // スペースキーが押されてるときにtrue、押されてないときにfalse
let combo;

function setup() {
    setGameSize();
    createCanvas(gameWidth, gameHeight);
    frameRate(10);
    initialize();
}

function windowResized() {
    setGameSize();
    resizeCanvas(gameWidth, gameHeight);
}

function setGameSize() {
    if (windowWidth * 500 > windowHeight * 1100) {
        gameHeight = windowHeight;
        gameWidth = gameHeight * 1100 / 500;
    } else {
        gameWidth = windowWidth;
        gameHeight = gameWidth * 500 / 1100;
    }
}

function draw() { // 0.1秒おき
    if (scene == 0) {
        // スタート画面の処理
    } else if (scene == 1) {
        timer++;
        if (spaceKey && canMove) { // 落とすスピードを上げる
            while (canFall()) x--;
            timer = int(timer / speed) * speed;
        }
        if (timer % speed == 0) {
            if (canMove) { // 動けるときの処理
                if (canFall()) { // 落とす
                    x--;
                } else { // 確定する
                    canMove = false;
                    combo = 0;
                    stack[x][y] = num;
                    priority[x][y] = 2; // 吸収されるように落ちた数字の優先度を上げる
                    if (isTwo) {
                        doFall = true; // 2個の場合は先に落とす
                        stack[x + dx4[rot]][y + dy4[rot]] = num2;
                        priority[x + dx4[rot]][y + dy4[rot]] = 2;
                    }
                }
            } else { // 吸収したり落としたりする処理
                if (!doFall) { // 落とさないなら
                    synth();
                    updatePriority();
                    if (!didSynth) { // 合成が無かったら
                        initializeMove();
                        if (stack[WIDTHG - 2][1] > 0) { // ゲームオーバー判定
                            scene = 2;
                            timer = 0;
                        }
                    }
                } else { // 落とすなら
                    fall();
                }
            }
        }
        apply();
        scene1Apply();
    } else if (scene == 2) {
        timer++;
        changeToScene2();
    }
    display();
}
