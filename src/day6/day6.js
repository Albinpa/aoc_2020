
import { readFileSync } from "fs";
import { strict as assert } from 'assert';

var file = readFileSync('input.txt', 'utf-8');
var list = file.split('\r\n');

var example  = readFileSync('test.txt', 'utf8').split('\r\n');


function createGroups(list) {
    let count = 0;
    let current = new Map();
    let pplInGroup = 0;
    list.forEach(( line ) => {

        [...line].forEach((char) => {
            const v = current.get(char) || 0;
            current.set(char, v+1);
        });

        if (line.length === 0) {
            //complete
            const allYes = Array.from(current.values())
                            .filter((n) => n === pplInGroup);
            count += allYes.length;
            //reset
            current = new Map();
            pplInGroup = 0;
        }
        else {
            pplInGroup++;
        }
        
    });
    return count;
}

assert.strictEqual(createGroups(example), 6);

console.log(createGroups(list))