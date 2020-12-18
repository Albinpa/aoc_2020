import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function createGrid(filename, dimension) {
    let lines = readFileSync(filename, 'utf-8').split('\r\n');
    
    lines.forEach((line, i) => {
        [...line].forEach((c, j) => {    
            if (c === '#') {
                const [key, value] = hashValue(i,j);
                dimension.set(key, value);
            }
        });
    })
    return dimension;
}

function hashValue(i, j) {
    const value = {i:i, j:j};
    return [JSON.stringify(value), value];
}

const surrounding = [
    [ -1, -1 ], [ -1, 0 ],
    [ -1, 1 ],  [ 0, -1 ],
    [ 0, 1 ],
    [ 1, -1 ],  [ 1, 0 ],
    [ 1, 1 ]
  ];

function simulate(filename, cycles) {
    const size = 1 + cycles * 2;
    let space = [];

    for( let i = 0; i < size; i++) {
        let subspace = []
        for( let j = 0; j < size; j++) {
            subspace.push(new Map());
        }
        space.push(subspace);
    }

    let start = cycles - 1;
    let end = cycles + 1;

    // initialize middle dimension from file
    createGrid(filename, space[cycles][cycles]);

    for(let cycle = 0; cycle < cycles; cycle++) {

        let smallestI = 0;
        let smallestJ = 0;
        let largestI = 0;
        let largestJ = 0;

        // setup boundries for dimension loops
        space.forEach((subspace) => {
            subspace.forEach((dim) => {
                dim.forEach((value) => {
                    smallestI = Math.min(value.i - 1, smallestI);
                    smallestJ = Math.min(value.j - 1, smallestJ);
                    largestI = Math.max(value.i + 1, largestI);
                    largestJ = Math.max(value.j + 1, largestJ);
                });
            });
        });

        let add = [];
        let remove = [];
        for( let i = 0; i < size; i++) {
            let subadd = [];
            let subremove = [];
            for( let j = 0; j < size; j++) {
                subadd.push([]);
                subremove.push([]);
            }
            add.push(subadd);
            remove.push(subremove);
        }

        const middle = start + (end - start) / 2;

        // for each relevant dimension, simulate changes in evolution
        for (let dimensionI = start; dimensionI <= end; dimensionI++) {
            for (let dimensionJ = start; dimensionJ <= end; dimensionJ++) {
                
                // if we already know the answer, copy it. Solution is symmetric
                if (dimensionJ > middle) {
                    const diff = dimensionJ - middle;
                    remove[dimensionI][dimensionJ] = remove[dimensionI][middle - diff];
                    add[dimensionI][dimensionJ] = add[dimensionI][middle - diff];
                    continue;
                }
                if (dimensionI > middle) {
                    const diff = dimensionI - middle;
                    remove[dimensionI][dimensionJ] = remove[middle - diff][dimensionJ];
                    add[dimensionI][dimensionJ] = add[middle - diff][dimensionJ];
                    continue;
                }

                const slice = space[dimensionI][dimensionJ];
                const neighbours = surrounding.map(([i, j]) => {
                    if (space[dimensionI + i]) {
                        return space[dimensionI + i][dimensionJ + j];
                    }
                    else {
                        return undefined;
                    }
                });

                for(let i = smallestI; i <= largestI; i++) {
                    for(let j = smallestJ; j <= largestJ; j++) {
                        const [hash, hval] = hashValue(i,j);
                        const active = slice.get(hash);

                        if (active) {
                            if (updateActive(slice, neighbours, i, j)) {
                                remove[dimensionI][dimensionJ].push(hash);
                            }
                        }
                        else {
                            if (updateInActive(slice, neighbours, i, j)) {
                                add[dimensionI][dimensionJ].push([hash, hval]);
                            }
                        }
                    }
                }
            }
        }
    
        // updating dimensions after cycle
        for (let dimensionI = start; dimensionI <= end; dimensionI++) {
            for (let dimensionJ = start; dimensionJ <= end; dimensionJ++) {
                add[dimensionI][dimensionJ].forEach(([hash, hval]) => {
                    space[dimensionI][dimensionJ].set(hash, hval);
                });
                remove[dimensionI][dimensionJ].forEach(hash => {
                    space[dimensionI][dimensionJ].delete(hash);
                });
            }
        }

        // expand relevant dimensions for next cycle 
        start--;
        end++;
    }

    let answer = 0;
    space.forEach(subdim => {
        subdim.forEach(dim => {
            answer += dim.size;
        })
    })
    console.log(answer)
}

const surroundingWithMe = [
    [ -1, -1 ], [ -1, 0 ],
    [ -1, 1 ],  [ 0, -1 ],
    [ 0 , 0 ], [ 0, 1 ],
    [ 1, -1 ],  [ 1, 0 ],
    [ 1, 1 ]
  ];

function updateActive(slice, neighbours, i, j) {
    let count = countActive(slice, neighbours, i, j);
    if (count === 2 || count === 3)
    {
        return false;
    }
    return true;
}

function updateInActive(slice, neighbours, i, j) {
    if (countActive(slice, neighbours, i, j) === 3)
    {
        return true;
    }
    return false;
}

function countActive(slice, neighbours, i, j) {
    let count = 0;

    for (let s = 0; s < surroundingWithMe.length; s++) {
        const [diffI, diffJ] = surroundingWithMe[s];
        // count from this level
        if (diffI !== 0 || diffJ !== 0) {    
            if (slice.get(hashValue(i+diffI, j+diffJ)[0]) !== undefined) {
                count++;
            }
        }
        // neighbours
        for (let neighbourI = 0; neighbourI < neighbours.length; neighbourI++) {
            let neighbour = neighbours[neighbourI] 
            if (neighbour && neighbour.get(hashValue(i+diffI, j+diffJ)[0]) !== undefined) {
                count++;
                if (count > 3) {
                    return count;
                }
            }
        }
    };
    return count;
}

simulate('test.txt', 6); // part 2. Answer 848

const start = Date.now();
simulate('input.txt', 6); // part 2. Answer 2136
const end = Date.now();
console.log('Time elapsed for part 2:', (end - start) / 1000, 's');