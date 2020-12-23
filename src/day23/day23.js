import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function crabCup(input, moves) {
    let list = [...input].map(char => Number(char));
    const min = Math.min(...list);
    const max = Math.max(...list);
    const length = list.length;
    let pointer = 0;

    let counter = 0;
    while (counter < moves) {
        counter++;
        const three = [list[(pointer + 1) % length],
                     list[(pointer + 2) % length],
                     list[(pointer + 3) % length]];
        const current = list[pointer];
        let newList = [];
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

        const destI = list.findIndex(nr => nr === dest);
        newList.push(list[destI]);
        newList.push(...three);

        for (let i = 1; i < length; i++) {
            const nr = list[(destI + i) % length];
            if (three.findIndex(v => v === nr) === -1) {
                newList.push(nr);
            }
        }
        list = newList;
        pointer = (list.findIndex(v => v === current) + 1) % length;
    }

    let start = list.findIndex(v => v === 1);
    let result = '';
    for (let i = 1; i < length; i++) {
        result += list[(start + i) % length]
    }
    console.log(result)
    return result;
}


strictEqual(crabCup('389125467', 10), '92658374');
strictEqual(crabCup('389125467', 100), '67384529');


strictEqual(crabCup('916438275', 100), '39564287');
