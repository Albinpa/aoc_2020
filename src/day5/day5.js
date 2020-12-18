
import { readFileSync } from "fs";
import { strict as assert } from 'assert';
var file = readFileSync('input.txt', 'utf-8');
var list = file.split('\r\n');


function binSearch(code, min, max) {
    const bin = code.charAt(0);
    if (!bin) {
        if (min !== max)
            console.warn('didnt reach bottom of search')
        return max;
    }
    const distance = (max - min + 1) / 2;

    if (bin === "F" || bin === "L") {
        return binSearch(code.slice(1), min, max - distance);
    }
    else if (bin === "B" || bin === "R") {
        return binSearch(code.slice(1), min + distance, max);
    }
    else {
        console.warn('something is wrong ...')
    }
}

assert.strictEqual(binSearch("FBFBBFF", 0, 127), 44);
assert.strictEqual(binSearch("RLR", 0, 7), 5);


const findRow = (code) => binSearch(code, 0, 127);
const findColumn = (code) => binSearch(code, 0, 7);

let max = 0;
let min = 89000;
const seatIds = list.map((line) => {
    let row = findRow(line.slice(0,7));
    let column = findColumn(line.slice(7,10));
    const seatId = row * 8 + column;
    if (seatId > max)
        max = seatId;
    if (seatId < min)
        min = seatId;
    return seatId;
})

for( let counter = min; counter < max; counter++)
{
    let res = seatIds.find((seat) => seat === counter);
    if (!res)
        console.log('didnt find ', counter) // part 2 answer
}

console.log(max) // part 1 answer
