import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function crabCup(input, moves, part2) {
    let list = [...input].map(char => Number(char));
    const min = Math.min(...list);
    let max = Math.max(...list);

    if (part2) {
        max = 1000000;
        for (let i = 10; i <= max; i++) {
            list.push(i);
        }
    }

    let startT = Date.now();
    let endT = undefined;

    const length = list.length;
    let pointer = 0;

    let counter = 0;
    while (counter < moves) {
        counter++;
        if (counter % 100000 === 0) {
            endT = Date.now();
            console.log('Time elapsed:', (endT - startT) / 1000, 's');
            console.log(counter);
            startT = Date.now();
        }

        const three = [list[(pointer + 1) % length],
                     list[(pointer + 2) % length],
                     list[(pointer + 3) % length]];

        let dest = list[pointer] - 1;
        if (dest < min) {
            dest = max;
        }
        while (three.findIndex(nr => nr === dest) !== -1) {
            dest--;
            if (dest < min) {
                dest = max;
            }
        }

        let destI = (list.findIndex(nr => nr === dest) + 1) % length;

        if (length - pointer <= 3 ) {
            // this seems complicated, use crappy solution. shouldnt happen that often..
            let newList = [];
            let newDestI = list.findIndex(nr => nr === dest);

            newList.push(list[newDestI]);
            newList.push(...three);

            for (let i = 1; i < length; i++) {
                const nr = list[(newDestI + i) % length];
                if (three.findIndex(v => v === nr) === -1) {
                    newList.push(nr);
                }
            }
            const current = list[pointer];
            list = newList;
            pointer = (list.findIndex(nr => nr === current) + 1) % length;
        }
        else if (destI <= pointer) {
            const copylength = pointer - destI;
            for (let i = copylength ; i >= 0; i--) {
                list[destI + 3 + i] = list[destI + i];
            }
            for (let i = 0; i < 3; i++) {
                list[destI + i] = three[i];
            }
            pointer = (pointer + 4) % length;
        }
        else { // destI > pointer
            const copylength = destI - pointer - 3;
            for (let i = 1; i < copylength; i ++) {
                list[pointer + i] = list[pointer + i + 3];
            }

            list[destI - 3] = three[0];
            list[destI - 2] = three[1];
            list[destI - 1] = three[2];

            pointer = (pointer + 1) % length;
        }
    }

    const start = list.findIndex(v => v === 1);
    if (part2) {
        const res = list[(start + 1) % length] *
                    list[(start + 2) % length];
        console.log(res);
        return res;
    }


    let result = '';
    for (let i = 1; i < length; i++) {
        result += list[(start + i) % length]
    }
    console.log(result)
    return result;

}


crabCup('389125467', 10);
strictEqual(crabCup('389125467', 100), '67384529');

strictEqual(crabCup('916438275', 100), '39564287');

crabCup('916438275', 10000000, true); // final answer 404431096944.
// Takes about 2h to complete. Probably good to use linked list instead. 
