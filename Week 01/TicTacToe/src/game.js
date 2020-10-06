export class GamePattern {
    constructor() {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    }

    getColor(x, y) {
        return this.board[y][x];
    }

    setColor(x, y, color) {
        this.board[y][x] = color;
    }

    clone() {
        let res = Object.create(GamePattern.prototype);
        res.board = JSON.parse(JSON.stringify(this.board));
        return res;
    }

    check(color) {
        for (let i = 0; i < 3; ++i) {
            let win = true;
            for (let j = 0; j < 3; ++j) {
                if (this.board[i][j] !== color) {
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
                if (this.board[i][j] !== color) {
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
                if (this.board[j][j] !== color) {
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
                if (this.board[j][2 - j] !== color) {
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
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                if (this.board[j][i]) {
                    continue;
                }

                let tmp = this.clone();
                tmp.setColor(i, j, color);
                if (tmp.check(color)) {
                    return [j, i];
                }
            }
        }
        return null;
    }
}

export const MoveResult = {
    MOVE: 0, WIN: 1, CANTMOVE: 2
}

export class GameControl {
    constructor() {
        this.pattern = new GamePattern;
        this.color = 1;
        this.haveWin = false;
    }

    move(x, y) {
        if (this.haveWin) {
            return MoveResult.CANTMOVE;
        }
        if (this.pattern.getColor(x, y)) {
            return MoveResult.CANTMOVE;
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
}