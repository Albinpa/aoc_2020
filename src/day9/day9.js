import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';

const lines = (file) => readFileSync(file, 'utf-8').split('\r\n').map((val) => Number(val));


function combinations(arr) {
    let res = [];
    for (let i= 0; i < arr.length; i++) {
        for (let j= i+1; j < arr.length; j++) {
            res.push(arr[i] + arr[j]);
        }
    }
    return res;
}

deepStrictEqual(combinations([2, 6, 4]), [8, 6, 10])

function findInvalidNumber(sequence, preamble) {
    let prevN = []

    for (let i = 0; i < sequence.length; i++) {
        let element = sequence[i];
        if (i >= preamble) {
            const comb = combinations(prevN);
            if (!comb.find((c) => c === element)) {
                return element;
            }
            prevN.shift();
        }
        prevN.push(element);
    };
    return invalid;
}


strictEqual(findInvalidNumber(lines('test.txt'), 5), 127);

strictEqual(findInvalidNumber(lines('input.txt'), 25), 1309761972); // part 1 answer


const reducer = (accumulator, currentValue) => accumulator + currentValue;

function findEncWeakness(sequence, correct) {

    for (let i = 0; i < sequence.length; i++) {
        let set = [sequence[i]];
        
        for (let j = i+1; j < sequence.length; j++) {
            set.push(sequence[j]);
            const sum = set.reduce(reducer);
            if (sum === correct) {
                return Math.min(...set) + Math.max(...set);
            }
            else if (sum > correct) {
                break;
            }
        }
    };
    return 0;
}


strictEqual(findEncWeakness(lines('test.txt'), 127), 62);

console.log(findEncWeakness(lines('input.txt'), 1309761972)); // part 2