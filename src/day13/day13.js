import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function readfile(filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    const earliestDep = Number(lines[0]);
    const buses = lines[1].split(',').filter((i) => i !== 'x').map((nr) => Number(nr));
    return [earliestDep, buses];
}

function readfileWithX(filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    const earliestDep = Number(lines[0]);
    const buses = lines[1].split(',').map((nr) => {
        if (nr === 'x') {
            return -1;
        }
        return Number(nr);
    });
    return [earliestDep, buses];
}


deepStrictEqual(readfile('test.txt'), [939, [7, 13, 59, 31, 19]]);


function multiplyUntilBigger(nr, target) {
    const r = target / nr;
    return Math.ceil(r) * nr;
}


strictEqual(multiplyUntilBigger(7, 939), 945);
strictEqual(multiplyUntilBigger(59, 939), 944);


function findEarliestPossible(filename) {
    const [earliestDep, buses] = readfile(filename);
    const earliestOfEach = buses.map((bus) => multiplyUntilBigger(bus, earliestDep));
    let minval = 99999999;
    let minBusI = undefined;
    earliestOfEach.forEach((val, i) => {
        if (val < minval) {
            minval = val;
            minBusI = i;
        }
    });

    return (minval - earliestDep) * buses[minBusI];
}


strictEqual(findEarliestPossible('test.txt'), 295);

strictEqual(findEarliestPossible('input.txt'), 153); // part 1


function leastCommonMultiplier(nr1, step1, nr2, step2, extra) {
    let curr1 = nr1;
    let curr2 = nr2;

    let cms = [];

    while(cms.length < 2) {
        if (curr1 === curr2 - extra) {
            cms.push(curr1);
            curr1 += step1;
        }

        if (curr1 < curr2 - extra) {
            curr1 = makeBigger(curr1, step1, curr2 - extra);
        }
        else {
            curr2 = makeBigger(curr2, step2, curr1 + extra);
        }
    }

    return [cms[0], cms[1] - cms[0]];
}


deepStrictEqual(leastCommonMultiplier(2,2, 5,5, 1), [4, 10]);
deepStrictEqual(leastCommonMultiplier(4,10,9,9,3), [24, 90]);


function solve (list) {
    const original = list.map((bus, i) => [bus, i]).filter((val) => val[0] !== -1);
    let current = [original[0][0], original[0][0]];

    original.forEach((element, i) => {
        if ( i === 0)
            return
        current = leastCommonMultiplier(current[0], current[1], element[0], element[0], element[1]);
    })
    return current[0];
}

function wrapper(filename) {
    const [earliestDep, buses] = readfileWithX(filename);
    return solve(buses);
}

function makeBigger(nr, step, target) {
    const r = (target - nr) / step;
    return Math.ceil(r) * step + nr;
}

strictEqual(solve([17,-1,13,19]), 3417);
strictEqual(solve([67,7,-1,59,61]), 1261476);
strictEqual(solve([1789,37,47,1889]), 1202161486);

console.log(wrapper('input.txt')); // part 2