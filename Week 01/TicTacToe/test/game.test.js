import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
    GamePattern, GameControl, MoveResult, PlayerResult
} from '../src/game';

describe('game test', function () {
    it('set & check value', function () {
        let pattern = new GamePattern;
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                for (let c = 0; c < 3; ++c) {
                    pattern.setColor(i, j, c);
                    assert.equal(pattern.getColor(i, j), c);
                }
            }
        }
    })
    it('clone pattern', function () {
        let pattern = new GamePattern;
        pattern.setColor(0, 0, 2);
        pattern.setColor(1, 1, 1);
        let copy = pattern.clone();
        assert.equal(copy.getColor(0, 0), pattern.getColor(0, 0));
        assert.equal(copy.getColor(1, 1), pattern.getColor(1, 1));
    })
    it('check col win', function () {
        let pattern = new GamePattern;
        pattern.setColor(0, 1, 2);
        pattern.setColor(1, 1, 2);
        pattern.setColor(2, 1, 2);
        assert.equal(pattern.check(2), true);
    })
    it('check row win', function () {
        let pattern = new GamePattern;
        pattern.setColor(2, 0, 1);
        pattern.setColor(2, 1, 1);
        pattern.setColor(2, 2, 1);
        assert.equal(pattern.check(1), true);
    })
    it('check cross win', function () {
        let pattern = new GamePattern;
        pattern.setColor(0, 0, 1);
        pattern.setColor(1, 1, 1);
        pattern.setColor(2, 2, 1);
        pattern.setColor(0, 2, 2);
        pattern.setColor(2, 0, 2);
        assert.equal(pattern.check(1), true);
        assert.equal(pattern.check(2), false);
        pattern.setColor(1, 1, 2);
        assert.equal(pattern.check(1), false);
        assert.equal(pattern.check(2), true);
    })
    it('check will win', function () {
        let pattern = new GamePattern;
        pattern.setColor(1, 0, 1);
        pattern.setColor(1, 1, 1);
        assert.deepEqual(pattern.willWin(1), [2, 1]);
        assert.equal(pattern.willWin(2), null);
        pattern.setColor(1, 2, 2);
        pattern.setColor(2, 2, 2);
        assert.equal(pattern.willWin(1), null);
        let p;
        assert.notEqual(p = pattern.willWin(2), null);
        let best = pattern.bestChice(2);
        assert.equal(best.result, PlayerResult.WIN);
        assert.deepEqual(best.point, p);
    })
    it('test best choice', function () {
        let pattern = new GamePattern;
        pattern.setColor(1, 0, 2);
        pattern.setColor(1, 1, 1);
        let result = pattern.bestChice(1);
        assert.equal(result.result, PlayerResult.WIN);
        pattern.setColor(1, 0, 0);
        pattern.setColor(0, 0, 2);
        result = pattern.bestChice(1);
        assert.equal(result.result, PlayerResult.DRAW);
    })
    it('test round of game', function () {
        let game = new GameControl;
        assert.equal(game.color, 1);
        assert.equal(game.move(1, 1), MoveResult.MOVE);
        assert.equal(game.isWillWin(), false);
        assert.equal(game.move(1, 1), MoveResult.CANTMOVE);
        assert.equal(game.color, 2);
        assert.equal(game.move(0, 0), MoveResult.MOVE);
        assert.equal(game.move(0, 1), MoveResult.MOVE);
        assert.equal(game.move(2, 2), MoveResult.MOVE);
        assert.equal(game.isWillWin(), true);
        assert.equal(game.color, 1);
        assert.equal(game.move(2, 1), MoveResult.WIN);
        assert.equal(game.move(0, 2), MoveResult.CANTMOVE);
    })
})