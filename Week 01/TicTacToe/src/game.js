export const PlayerResult = {
    WIN: 1, DRAW: 0, FAIL: -1,
}

export class GamePattern {
    constructor() {
        this.board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ];
    }

    getColor(x, y) {
        return this.board[y * 3 + x];
    }

    getIdColor(id) {
        return this.board[id];
    }

    setColor(x, y, color) {
        this.board[y * 3 + x] = color;
    }

    setIdColor(id, color) {
        this.board[id] = color;
    }

    clone() {
        let res = Object.create(GamePattern.prototype);
        res.board = Object.create(this.board);
        return res;
    }

    check(color) {
        for (let i = 0; i < 3; ++i) {
            let win = true;
            for (let j = 0; j < 3; ++j) {
                if (this.getColor(j, i) !== color) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
        }
        for (let j = 0; j < 3; ++j) {
            let win = true;
            for (let i = 0; i < 3; ++i) {
                if (this.getColor(j, i) !== color) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
        }
        {
            let win = true;
            for (let j = 0; j < 3; ++j) {
                if (this.getColor(j, j) !== color) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
        }
        {
            let win = true;
            for (let j = 0; j < 3; ++j) {
                if (this.getColor(2 - j, j) !== color) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
        }
        return false;
    }

    willWin(color) {
        for (let i = 0; i < 9; ++i) {
            if (this.getIdColor(i)) {
                continue;
            }

            let tmp = this.clone();
            tmp.setIdColor(i, color);
            if (tmp.check(color)) {
                let x = i % 3, y = (i - x) / 3;
                return [x, y];
            }
        }
        return null;
    }

    bestChoice(color) {
        let point;
        if (point = this.willWin(color)) {
            return { point, result: 1 }
        }
        let result = -2;
        for (let i = 0; i < 9; ++i) {
            if (this.getIdColor(i)) {
                continue;
            }
            let tmp = this.clone();
            tmp.setIdColor(i, color);
            let r = tmp.bestChoice(3 - color).result;

            if (- r > result) {
                result = -r;
                let x = i % 3, y = (i - x) / 3;
                point = [x, y];
            }
            if (result == 1) {
                break;
            }
        }
        return { point, result: point ? result : 0 };
    }
}

export const MoveResult = {
    MOVE: 0, WIN: 1, CANT_MOVE: 2
}

export class GameControl {
    constructor() {
        this.pattern = new GamePattern;
        this.color = 1;
        this.haveWin = false;
    }

    move(x, y) {
        if (this.haveWin) {
            return MoveResult.CANT_MOVE;
        }
        if (this.pattern.getColor(x, y)) {
            return MoveResult.CANT_MOVE;
        }
        this.pattern.setColor(x, y, this.color);
        if (this.pattern.check(this.color)) {
            this.haveWin = true;
            return MoveResult.WIN;
        }
        this.color = 3 - this.color;
        return MoveResult.MOVE;
    }

    isWillWin() {
        return this.pattern.willWin(this.color) != null;
    }

    bestChoice() {
        return this.pattern.bestChoice(this.color);
    }
}