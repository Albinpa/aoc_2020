import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function countDiffs(filename) {
    let nrs = readFileSync(filename, 'utf-8').split('\r\n').map((val) => Number(val));
    
    nrs.sort((a, b) => a - b);
    nrs.push(nrs[nrs.length-1] + 3); // built-in thing

    let diffCount = new Map();
    let prevNr = 0;


    nrs.forEach((nr) => {
        const diff = nr - prevNr;
        let o = diffCount.get(diff);
        if (!o) {
            diffCount.set(diff, 1);
        }
        else {
            diffCount.set(diff, o+1);
        }
        prevNr = nr;
    })
    const threes = diffCount.get(3) || 0;
    const ones = diffCount.get(1) || 0;
    return threes * ones;
}


strictEqual(countDiffs('test1.txt'), 35);
strictEqual(countDiffs('test2.txt'), 220);

strictEqual(countDiffs('input.txt'), 2176); // part 1


function countArrangeMents(list, pointer, memory) {
    if (pointer === 0)
        return 1;

    let possiblePaths = []
    for (let i = pointer - 3; i < pointer; i++) {
        if (i < 0)
            continue;

        const diff = list[i] - list[pointer];
        if (diff <= 3) {
            possiblePaths.push(i);
        }
    }

    // add together nr of combinations we get from taking the different paths.
    let count = 0;
    possiblePaths.forEach((path) => {count += memory.get(path)});
    return count;
}

strictEqual(countArrangeMents([3], 0, new Map()), 1);


function solve(filename) {
    let nrs = readFileSync(filename, 'utf-8').split('\r\n').map((val) => Number(val));
    
    nrs.sort((a, b) => b - a); // descending
    nrs.push(0); // starting point, charging outlet
    let memory = new Map();

    for (let i = 0; i < nrs.length; i++) {
        const count = countArrangeMents(nrs, i, memory);
        memory.set(i, count);
    }
    console.log(memory)
    return memory.get(nrs.length-1);
}


strictEqual(solve('test1.txt'), 8);
strictEqual(solve('test2.txt'), 19208);

strictEqual(solve('input.txt'), 18512297918464); // part 2