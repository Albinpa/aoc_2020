import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


class Tile {
    constructor(id, grid) {
        this.id = id;
        this.grid = grid;
        this.calcBorders();
    }

    calcBorders() {
        this.top = this.grid[0];
        this.bottom = this.grid[this.grid.length - 1];
        this.left = this.grid.map(line => line[0]);
        this.right = this.grid.map(line => line[line.length - 1]);
    }

    linesUp(border) {
        return bordersMatch(border, this.top) ||
               bordersMatch(border, this.bottom) ||
               bordersMatch(border, this.left) ||
               bordersMatch(border, this.right);
    }

    rotate(times) {
        for (let i = 0; i < times; i++) {
            let newGrid = createEmptyGrid(this.grid.length);
            this.grid.forEach((row, i) => {
                row.forEach((element, j) => {
                    newGrid[i][j] = this.grid[j][this.grid.length - 1 - i];
                });
            });
            this.grid = newGrid;
            this.calcBorders();
        }
        return this;
    }

    flip(sideways) {
        let newGrid = createEmptyGrid(this.grid.length);
        if (sideways) {
            this.grid.forEach((row, i) => {
                row.forEach((pos, j) => {
                    newGrid[i][row.length -1 -j] = this.grid[i][j];
                })
            });
        }
        else {
            this.grid.forEach((row, i) => {
                newGrid[i] = this.grid[this.grid.length -1 -i];
            })
        }
        this.grid = newGrid;
        this.calcBorders();
        return this;
    }

    gridWithoutBorders() {
        let g = this.grid.slice(1, this.grid.length -1);
        for(let i = 0; i < g.length; i++) {
            g[i] = g[i].slice(1, g.length +1);
        }
        return g;
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

function bordersExactMatch(b1, b2) {
    for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
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

function createEmptyGrid(sideLength) {
    let grid = [];
    for (let i = 0; i < sideLength; i++) {
        grid.push(new Array(sideLength));
    }
    return grid;
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
    let corners = findCorners(tiles);
    let mult = 1;
    if (corners.length === 4) {
        corners.forEach(corner => mult *= corner);
    }
    console.log(mult);
    return mult;
}

function findCorners(tiles) {
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
    return corners;
}

strictEqual(solvePart1('test.txt'), 20899048083289);
strictEqual(solvePart1('input.txt'), 104831106565027);

function reassemble(filename) {
    let tiles = parseFile(filename);
    const sideLength = Math.sqrt(tiles.length);
    let reassembled = createEmptyGrid(sideLength);

    // find a corner and rotate/flip to be placed in 0,0..
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        let unmatched = [];
        [tile.bottom, tile.left, tile.top, tile.right]
            .forEach((border, ind) => {
                let matched = 0;
                for (let t = 0; t < tiles.length; t++) {
                    if (t === i)
                        continue
                    if (tiles[t].linesUp(border))
                        matched++;
                }
                if (matched === 0) {
                    unmatched.push(ind);
                }
            });
        if (unmatched.length > 1) {
            unmatched.forEach(el => {
                if (el === 0)
                    tile.flip(false)
                if (el === 3)
                    tile.flip(true)
            })
            tiles.splice(i, 1); // remove
            reassembled[0][0] = tile;
            break;
        }
    }

    // we have the first corner priece, lets try put the others in place...
    for (let i = 0; i < sideLength; i++) {
        for (let j = 0; j < sideLength; j++) {
            if (i === 0 && j === 0)
                continue;

            let leftNeighbour = undefined;
            if (reassembled[i] && reassembled[i][j-1]) {
                leftNeighbour = reassembled[i][j-1].right;
            }
            let topNeighbour = undefined;
            if (reassembled[i-1] && reassembled[i-1][j]) {
                topNeighbour = reassembled[i-1][j].bottom;
            }
            reassembled[i][j] = findMatch(tiles, leftNeighbour, topNeighbour);
        }
    }

    // remove borders
    let image = [];
    reassembled.forEach((row, i) => {
        row.forEach((tile , j) => {
            let grid = tile.gridWithoutBorders();
            grid.forEach((gridRow, gri) => {
                let imagerow = image[i*grid.length + gri];
                if (imagerow) {
                    image[i*grid.length + gri] = imagerow.concat(gridRow);
                }
                else {
                    image.push(gridRow);
                }
            })
        });
    })

    // time to find sea monsters
    const monsterCoordinates = [[0,18], [1,0],
        [1,5],[1,6],[1,11],[1,12],[1,17],[1,18],
        [1,19],[2,1],[2,4],[2,7],[2,10],[2,13],
        [2,16]];

    // create all combinations of flips and rotations for image
    // maybe these
    let imageCombinations = [];
    [0,1,2,3].forEach(nr => {
        [[0,0], [0,1], [1,0], [1,1]].map(([nr1,nr2]) => {
            let imageTile = new Tile(0, image);
            imageTile.rotate(nr);
            if (nr1 === 1) {
                imageTile.flip(true);
            }
            if (nr2 === 1) {
                imageTile.flip(false);
            }
            imageCombinations.push(imageTile.grid);
        }) 
    })
    
    let monsterCount = 0;
    for (let icms = 0; icms < imageCombinations.length; icms++) {
        let img = imageCombinations[icms];
        img.forEach((row, i) => {
            row.forEach((pos, j) => {
                    let allOk = true;
                    monsterCoordinates.forEach(([mi,mj]) => {
                        if (img[i+mi] && img[i+mi][j+mj]) {
                            if (img[i+mi][j+mj] !== '#') {
                                allOk = false;
                            }
                        }
                        else {
                            allOk = false;
                        }
                    });
                    if (allOk) {
                        monsterCount++;
                    }
            });
        });
        if (monsterCount > 0) {
            break;
        }
    }
    let totalcount = 0; // total number of '#' in image
    image.forEach((row) => {
        row.forEach((pos) => {
            if (pos === '#') {
                totalcount++;
            }
        });
    });
    const answer = totalcount - monsterCount * 15; // lets hope the monsters dont overlap
    console.log('part 2:', answer);
    return answer;
}


function findMatch(tiles, leftN, topN) {
    let usingLeft = true;
    if (!leftN)
        usingLeft = false;
    let neighbour = leftN || topN;
    
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const borderList = [tile.left, tile.top, tile.right, tile.bottom];
        for(let j = 0; j <borderList.length; j++) {
            const border = borderList[j];
            
            if (bordersMatch(neighbour, border)) {
                if (usingLeft) {
                    tile.rotate(j);
                    if (!bordersExactMatch(tile.left, neighbour)) {
                        tile.flip(false);
                    }
                }
                else {
                    let rotation = j-1;
                    if (rotation < 0) {
                        rotation = 3;
                    }
                    tile.rotate(rotation);
                    if (!bordersExactMatch(tile.top, neighbour)) {
                        tile.flip(true);
                    }
                }
                tiles.splice(i, 1); // remove from list
                return tile;
            }
            
        }
    }
}

const testTile = parseTile([
'Tile 2473:',
'#....####.',
'#..#.##...',
'#.##..#...',
'######.#.#',
'.#...#.#.#',
'.#########',
'.###.#..#.',
'########.#',
'##...##.#.',
'..###.#.#.']);

deepStrictEqual(testTile.rotate(1).flip(true).top, [
    '.', '.', '#', '.',
    '#', '#', '#', '.',
    '.', '.'
  ]);

deepStrictEqual(testTile.gridWithoutBorders(), [
    ['#', '.', '#', '#', '.', '.','.', '.'],
    ['.', '#', '.', '#', '#', '#', '.', '.'],
    ['#', '#', '.', '#', '.', '.', '#', '#'],
    ['#', '#', '#', '#', '#', '#','.', '#'],
    ['.', '#', '.','#', '.', '#','.', '.'],
    ['.', '#', '#','#', '.', '#','#', '#'],
    ['.', '#', '#','#', '.', '#','#', '.'],
    ['#', '#', '#','#', '#', '#','.', '.'] ]);


reassemble('test.txt') // 273
reassemble('input.txt') // part 2, correct answer is 2093