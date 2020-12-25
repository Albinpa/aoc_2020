import { deepStrictEqual, strictEqual } from 'assert';


function crabCup(input, moves, part2) {
    let list = [...input].map((char, i) => {
        return {val: Number(char), next: i + 1}
    });
    const min = 1;
    let max = 9;

    if (part2) {
        max = 1000000;
        for (let i = 10; i <= max; i++) {
            list.push({val: i, next: i});
        }
    }
    list[list.length - 1].next = 0;

    let current = list[0];
    let counter = 0;
    while (counter < moves) {
        counter++;

        let three = [list[current.next]];
        three.push(list[three[0].next]);
        three.push(list[three[1].next]);

        let dest = current.val - 1;
        if (dest < min) {
            dest = max;
        }
        while (three.findIndex(nr => nr.val === dest) !== -1) {
            dest--;
            if (dest < min) {
                dest = max;
            }
        }

        let destI = undefined;
        if (dest >= 10) {
            destI = dest - 1;
        }
        else {
            destI = list.findIndex(nr => nr.val === dest);
        }

        const newCurr = three[2].next;
        three[2].next = list[destI].next;
        list[destI].next = current.next;
        current.next = newCurr;
        current = list[newCurr];
    }

    const start = list.findIndex(v => v.val === 1);
    if (part2) {
        const first = list[list[start].next];
        const res = first.val * list[first.next].val;
        console.log(res);
        return res;
    }

    let result = '';
    let prev = start;
    for (let i = 1; i < list.length; i++) {
        prev = list[prev].next;
        result += list[prev].val;
    }
    console.log(result)
    return result;
}


strictEqual(crabCup('389125467', 10), '92658374');
strictEqual(crabCup('389125467', 100), '67384529');

strictEqual(crabCup('916438275', 100), '39564287'); // part 1

const startT = Date.now();
crabCup('916438275', 10000000, true); // part 2, answer 404431096944.
const endT = Date.now();
console.log('Time elapsed:', (endT - startT) / 1000, 's');
