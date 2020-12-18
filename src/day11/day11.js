import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function createGrid(filename) {
    let lines = readFileSync(filename, 'utf-8').split('\r\n');
    let grid = lines.map((line) => [...line]);
    return grid;
}

function calculateNextState(grid) {
    let next = [];
    grid.forEach((line, i) => {
        let nextL = [];
        line.forEach((row, j) => {
            const occ = grid[i][j] === '#' ? 1 : 0;;
            const seat = isSeat(grid, i, j);
            // count surrounding
            let count = 0;
            count += occupied(grid, i - 1, j - 1, -1, -1);
            count += occupied(grid, i - 1, j    , -1, 0);
            count += occupied(grid, i - 1, j + 1, -1, 1);
            count += occupied(grid, i    , j - 1, 0, -1);
            count += occupied(grid, i    , j + 1, 0, 1);
            count += occupied(grid, i + 1, j - 1, 1, -1);
            count += occupied(grid, i + 1, j    , 1, 0);
            count += occupied(grid, i + 1, j + 1, 1, 1);
            if (!occ && seat && count === 0) {
                nextL.push('#'); // occupied
            }
            else if (occ && seat && count >= 5) {
                nextL.push('L');
            }
            else {
                nextL.push(grid[i][j]);
            }
        });
        next.push(nextL);
    });
    return next;
}

// return 1 or 0
function occupied(grid, i, j, stepI, stepJ) {
    if (i < 0 || j < 0)
        return 0;
    if (grid.length <= i || grid[i].length <= j) 
        return 0;
        
    let occ = 0;

    if (grid[i][j] === '.') {
        occ = occupied(grid, i + stepI, j + stepJ, stepI, stepJ);
    }
    else {
        occ = grid[i][j] === '#' ? 1 : 0;
    }
    return occ;
}

function isSeat(grid, i, j) {
    if (i < 0 || j < 0)
        return 0;
    if (grid.length <= i || grid[i].length < j) 
        return 0;
    return grid[i][j] === '.' ? 0 : 1;
}

function solve(filename) {
    const grid = createGrid(filename);
    let currentGrid = grid;
    let prevGrid = undefined;
    while (!gridEquals(currentGrid, prevGrid)) {
        prevGrid = currentGrid;
        currentGrid = calculateNextState(currentGrid);
    }

    return countOccupied(currentGrid);
}


deepStrictEqual(calculateNextState([['L', '.'], ['L', 'L']]),
    [['#', '.'], ['#', '#']]);

deepStrictEqual(calculateNextState([['#', '.'], ['#', '#']]),
    [['#', '.'], ['#', '#']]);


function gridEquals(grid1, grid2) {
    if (!grid1 || !grid2)
        return false;
    // assume same size
    for (let i = 0; i < grid1.length; i++) {
        for (let j = 0; j < grid1[0].length; j++) {
            if (grid1[i][j] !== grid2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function countOccupied(grid) {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '#') {
                count++;;
            }
        }
    }
    return count;
}


strictEqual(solve('test.txt'), 26);

strictEqual(solve('input.txt'), 2064); // part 2