import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function memoryGame (input, stop) {
    let memory = new Map();
    
    for (let i = 0; i < input.length - 1; i++)
    {
        memory.set(input[i], i+1);
    }
    let prev = [input[input.length-1], input.length];
    let i = input.length + 1;

    while (i <= stop) {
        const find = memory.get(prev[0]);

        // update memory
        memory.set(prev[0], prev[1]);

        // update prev
        if (find) {
            prev = [i - 1 - find, i];
        }
        else {
            prev = [0, i];
        }

        i++;
    }
    console.log(prev, memory.size);
    return prev[0];
}

strictEqual(memoryGame([0, 3, 6], 2020), 436);

strictEqual(memoryGame([18,8,0,5,4,1,20], 2020), 253); // part 1

const start = Date.now();
strictEqual(memoryGame([18,8,0,5,4,1,20], 30000000), 13710); // part 2
const end = Date.now();
console.log('Time elapsed for part 2: ', (end - start) / 1000, 's');