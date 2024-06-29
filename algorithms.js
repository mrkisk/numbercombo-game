function getStack(x, y) {
    return (x >= 0 && x < WIDTHG && y >= 0 && y < HEIGHT) ? stack[x][y] : -1;
}

function isStackEmpty(x, y) {
    return getStack(x, y) == 0;
}

function canFall() { // 左隣にブロックがなければfalse、あればtrue
    return isStackEmpty(x - 1, y) && (!isTwo || isStackEmpty(x - 1 + dx4[rot], y + dy4[rot]));
}

function synth() { // 合成処理
    didSynth = false;
    const dx4Priority = [-1, 0, 0, 1];
    const dy4Priority = [0, -1, 1, 0];
    for (let k = 2; k > 0; k--) {
        for (let j = 0; j < HEIGHT; j++) {
            for (let i = 0; i < WIDTH; i++) {
                if (priority[i][j] == k) {
                    // 隣接する同じ数字の中で最も優先度の高い物を合成する
                    let maxPriority = -1;
                    let dir = -1;
                    for (let l = 0; l < 4; l++) {
                        let nx = i + dx4Priority[l];
                        let ny = j + dy4Priority[l];
                        if (getStack(nx, ny) == stack[i][j] && priority[nx][ny] > maxPriority) {
                            dir = l;
                            maxPriority = priority[nx][ny];
                        }
                    }
                    if (dir >= 0) { // 消すやつがあったとき
                        didSynth = true;
                        combo++;
                        if (stack[i][j] == 9) { // 消すやつが9のとき
                            score += Math.pow(2, stack[i][j]);
                            stack[i][j] = 0;
                            priority[i][j] = 0;
                            if (!doFall && stack[i + 1][j] > 0) doFall = true;
                        } else { //消すやつが8以下のとき
                            score += stack[i][j] * combo;
                            stack[i][j]++;
                            priority[i][j] = -1;
                            nextPriority[i][j] = 2;
                            maxNum = Math.max(stack[i][j], maxNum);
                            if (maxNum >= TWONUM) isTwo = true;
                            if (maxNum >= SPEEDUPNUM) speed = SPEED[difficulty] - 1;
                        }
                        // 数字を消し、落とすかを判定
                        let nx = i + dx4Priority[dir];
                        let ny = j + dy4Priority[dir];
                        stack[nx][ny] = 0;
                        priority[nx][ny] = 0;
                        if (!doFall && stack[nx + 1][ny] > 0) {
                            doFall = true;
                        }
                    }
                }
            }
        }
    }
}

function updatePriority() { // 優先度の更新
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            priority[i][j] = nextPriority[i][j];
            nextPriority[i][j] = 0;
        }
    }
}

function fall() { // 落とす処理
    let countZero;
    for (let j = 0; j < HEIGHT; j++) {
        countZero = 0;
        for (let i = 0; i < WIDTH; i++) {
            if (stack[i][j] == 0) countZero++;
            else if (countZero != 0) {
                stack[i - countZero][j] = stack[i][j];
                stack[i][j] = 0;
                // 落とす数字の優先度を2ならば維持し、そうでなければ1にする
                if (priority[i][j] == 2) {
                    priority[i - countZero][j] = 2;
                    priority[i][j] = 0;
                } else {
                    priority[i - countZero][j] = 1;
                }
            }
        }
    }
    doFall = false;
}

function initializeMove() { // 次の数字が落ち始める直前の初期化
    canMove = true;
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            priority[i][j] = 0;
            nextPriority[i][j] = 0;
        }
    }
    x = WIDTHG - 2;
    y = 1;
    rot = 0;
    changeNum();
    doFall = false;
    didSynth = false;
    // combo = 0;
}

function changeNum() { // 落ちる数字の乱数調整
    let sum = 0;
    maxNum--;
    if (isTwo) maxNum--;
    for (let i = 1; i <= maxNum; i++) sum += Math.pow(2, i);
    let rand = random(sum);
    for (let i = maxNum; i > 0; i--) {
        if (rand < Math.pow(2, i)) {
            num = maxNum + 1 - i;
            break;
        }
        rand -= Math.pow(2, i);
    }
    if (isTwo) {
        maxNum++;
        num++;
        num2 = Math.floor(random(1, num));
    }
    maxNum--;
}
