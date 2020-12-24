import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function hashFunc(p1, p2) {
    const value = {x:p1, y:p2};
    return [JSON.stringify(value), value];
}

function parse(filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    const res = [];
    lines.forEach(line => {
        let dirs = [];
        let pointer = 0;
        while (pointer < line.length) {
            const current = line.charAt(pointer);
            const next = line.charAt(pointer + 1);
            if (current === 's' ||
                current === 'n') {
                dirs.push(current + next);
                pointer += 2;
            }
            else {
                dirs.push(current);
                pointer++;
            }
        }
        res.push(dirs);
    });
    return res;
}


function solve(filename) {
    const input = parse(filename);
    let map = new Map();
    input.forEach(dirs => {
        let x = 0;
        let y = 0;
        dirs.forEach(dir => {
            switch(dir) {
                case 'e':
                    x++;
                    break;
                case 'se':
                    y++;
                    break;
                case 'sw':
                    y++;
                    x--;
                    break;
                case 'w':
                    x--
                    break;
                case 'nw':
                    y--;
                    break;
                case 'ne':
                    y--;
                    x++;
                    break;
            }
        });
        const [hash, val] = hashFunc(x,y);
        if (map.get(hash)) {
            map.delete(hash);
        }
        else {
            map.set(hash, val);
        }
    });
    return map;
}


strictEqual(solve('input.txt').size, 436); // part 1


function update(tiles, times) {

    for (let i = 0; i < times; i++) {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        tiles.forEach(tile => {
            minX = Math.min(tile.x - 1, minX);
            maxX = Math.max(tile.x + 1, maxX);
            minY = Math.min(tile.y - 1, minY);
            maxY = Math.max(tile.y + 1, maxY);
        });

        let del = [];
        let add = [];

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {

                const [hash, value] = hashFunc(x, y);
                const black = tiles.get(hash) !== undefined;
                if (black) {
                    if (needsUpdate(tiles, x, y, black)) {
                        del.push(hash)
                    }
                }
                else {
                    if (needsUpdate(tiles, x, y, black)) {
                        add.push([hash, value]);
                    }
                }
            }
        }

        del.forEach(d => {
            tiles.delete(d);
        });
        add.forEach(([hash, value]) => {
            tiles.set(hash, value);
        });
    }
    return tiles;
}

const neighbours = [[-1,0], [-1,1], [0,1], [1,0], [1,-1], [0,-1]];

function needsUpdate(memory, x, y, black) {
    let count = 0;

    for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];
        const [hash, value] = hashFunc(x + neighbour[0],
                                        y + neighbour[1]);
        if (memory.get(hash)) {
            count++;
        }
        if (black) {
            if (count > 2) {
                return true;
            }
        }
    }
    if (black && count === 0) {
            return true;
    }
    if (!black && count === 2) {
            return true;
    }
    return false;
}

function solvepart2(filename) {
    const input = solve(filename);
    const res = update(input, 100);
    return res.size;

}

strictEqual(solvepart2('test.txt'), 2208);
console.log(solvepart2('input.txt')); // part 2, answer 4133