import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


const digit = new RegExp(/^\d+/);

function parseFile(filename) {

    let player1 = [];
    let player2 = [];
    let deal = 1;

    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    lines.forEach(line => {
        if (line === 'Player 2:') {
            deal = 2;
        }
        const res = line.match(digit);
        if (!res)
            return;

        if (deal === 1) {
            player1.push(Number(res[0]));
        }
        else {
            player2.push(Number(res[0]));
        }
    })
    return [player1, player2]
}


deepStrictEqual(parseFile('test.txt'),
[ [ 9, 2, 6, 3, 1 ], [ 5, 8, 4, 7, 10 ] ]);


function play(filename) {
    let [player1, player2] = parseFile(filename);
    let [p1Wins, winner] = game(player1, player2);
    const score = calcScore(winner);
    console.log(score)
    return score;
}

function game(player1, player2) {
    let memory = new Map();
    // this loop is for each round of a game
    while (player1.length !== 0 && player2.length !== 0) {

        const hash = hashFunc(player1, player2);
        if (memory.get(hash)) {
            return [true, player1];
        }
        memory.set(hash, 1);

        const c1 = player1.shift();
        const c2 = player2.shift();

        const p1enough = c1 <= player1.length;
        const p2enough = c2 <= player2.length;

        let p1Wins = true;

        if (!p1enough || !p2enough) {
             p1Wins = c1 >= c2;
        }
        else {
            p1Wins = game(player1.slice(0, c1),
                          player2.slice(0, c2))[0];
        }

        if (p1Wins) {
            player1.push(c1);
            player1.push(c2);
        }
        else {
            player2.push(c2);
            player2.push(c1);
        }
    }

    if (player1.length === 0) {
        return [false, player2]
    }
    else {
        return [true, player1];
    }
}

function calcScore(winner) {
    let count = 0;
    winner.forEach((card, i) => {
        count += card * (winner.length - i);
    })
    return count;
}

function hashFunc(p1, p2) {
    const value = {p1:p1, p2:p2};
    return JSON.stringify(value);
}


strictEqual(play('test2.txt'), 105);
strictEqual(play('test.txt'), 291);

play('input.txt'); // part 2, answer 35436