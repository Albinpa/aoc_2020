import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';




class Tile {
    constructor(id, grid) {
        this.id = id;
        this.grid = grid;

        this.top = grid[0];
        this.bottom = grid[grid.length - 1];
        this.left = grid.map(line => line[0]);
        this.right = grid.map(line => line[line.length - 1]);
    }

    linesUp(border) {
        return bordersMatch(border, this.top) ||
               bordersMatch(border, this.bottom) ||
               bordersMatch(border, this.left) ||
               bordersMatch(border, this.right);
    }
}

function bordersMatch(b1, b2) {
    let allMatch = true;
    for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
            allMatch = false;
            break;
        }
    }
    if (allMatch)
        return true;
    
    // reverse direction
    allMatch = true;
    for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[b2.length - 1 - i]) {
            allMatch = false;
            break;
        }
    }
    return allMatch;
}

strictEqual(bordersMatch([1,1,1], [1,1,1]), true);
strictEqual(bordersMatch([1,2,3], [1,2,3]), true);
strictEqual(bordersMatch([3,2,1], [1,2,3]), true);
strictEqual(bordersMatch([3,2,1], [1,2,1]), false);


const idRegex = new RegExp(/Tile (\d+):/);

function parseTile(lines) {
    const id = Number(lines[0].match(idRegex)[1]);
    const grid = lines.slice(1).map(line => [...line]);
    return new Tile(id, grid);
}

function parseFile(filename) {
    
    let lines = readFileSync(filename, 'utf-8').split('\r\n');
    let found = lines.findIndex(line => line === '');
    let tiles = [];
    while (found !== -1) {
        tiles.push(parseTile(lines.splice(0, found)));
        lines.shift(); // blank
        found = lines.findIndex(line => line === '');
    }
    return tiles;

}

const testDataTiles = parseFile('test.txt');
strictEqual(testDataTiles[0].linesUp([
    '.', '.', '#', '#',
    '.', '#', '.', '.',
    '#', '.'
  ]), true);
strictEqual(testDataTiles[0].linesUp([
    '.', '.', '#', '#',
    '.', '#', '.', '.',
    '#', '#'
  ]), false);
strictEqual(testDataTiles[0].linesUp([
    '.', '#', '.', '.',
    '#', '#', '#', '#',
    '#', '.'
  ]), true);

function solvePart1(filename) {
    const tiles = parseFile(filename);
    let corners = [];
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        let unmatched = 0;
        [tile.bottom, tile.left, tile.top, tile.right]
            .forEach(border => {
                let matched = 0;
                for (let t = 0; t < tiles.length; t++) {
                    if (t === i)
                        continue
                    if (tiles[t].linesUp(border))
                        matched++;
                }
                if (matched === 0) {
                    unmatched++;
                }
            });
        if (unmatched > 1) {
            if (unmatched > 2)
                console.warn('somethings wrong..')
            corners.push(tile.id);
        }
    }
    let mult = 1;
    if (corners.length === 4) {
        corners.forEach(corner => mult *= corner);
    }
    console.log(mult);
    return mult;
}

strictEqual(solvePart1('test.txt'), 20899048083289);
strictEqual(solvePart1('input.txt'), 104831106565027);