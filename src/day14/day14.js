import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


const MAX31 = 2147483647;

function createMask(maskString) {
    let and = 2147483647;
    let or = 0;
    let topAnd = 31;
    let topOr = 0;
    for( let i = 0; i < maskString.length; i++) {
        let c = maskString.charAt(i);
        let bit = (maskString.length  - i);
        if (bit > 31) {
            bit = bit - 31
            const x = (1 << bit - 1);
            if (c === '1') {
                topOr = topOr | x;
            }
            else if (c === '0') {
                topAnd = topAnd - x;
            }
        }
        else {
            const x = (1 << bit - 1);
            if (c === '1') {
                or = or | x;
            }
            else if (c === '0') {
                and = and - x;
            }
        }   
    }
    return [and, topAnd, or, topOr];
}

function applyMask([and, topAnd, or, topOr], nr) {
    const low = ((nr & MAX31) | or) & and;
    const high = ((nr / 2147483648) | topOr) & topAnd;
    return low + high * 2147483648;
}

deepStrictEqual(createMask("10XX01XX"), [2147483575, 31, 132, 0]);

strictEqual(applyMask(createMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"), 11), 73);

strictEqual(applyMask(createMask("1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"), 0), 34359738368);

strictEqual(applyMask(createMask("0XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"), 34359738368), 0);

strictEqual(applyMask(createMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"), 101), 101);

strictEqual(applyMask(createMask("XXXX1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"), 0), 2147483648);

strictEqual(applyMask(createMask("XXX1XXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"), 0), 4294967360);

function initialize(filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    let mask = createMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    let memory = new Map();

    lines.forEach((line) => {
        if (line.startsWith('mem')) {
            const [uu, address, val] = line.match(new RegExp(/mem\[(\d+)\] = (\d+)/));
            
            memory.set(address, applyMask(mask, val));
        }
        else { // mask
            const [uu, newMask] = line.match(new RegExp(/mask = (\w+)/));
            mask = createMask(newMask);
        }
    });

    let sum = 0;
    memory.forEach((value) => sum += value);

    return sum;
}

strictEqual(initialize('test.txt'), 165);

strictEqual(initialize('test2.txt'), 597115178707);
strictEqual(initialize('input.txt'), 14862056079561); // part 1

function initializeV2(filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    let mask = [];
    let memory = new Map();

    lines.forEach((line) => {
        if (line.startsWith('mem')) {
            const [uu, address, val] = line.match(new RegExp(/mem\[(\d+)\] = (\d+)/));
            
            createMaskFloating(combineMask(mask, Number(address)))
                .forEach((add) => {
                    const actual = add[2] + add[3]*2147483648;
                    memory.set(actual, Number(val));
                });
        }
        else { // mask
            const [uu, newMask] = line.match(new RegExp(/mask = (\w+)/));
            mask = newMask;
        }
    });

    let sum = 0;
    memory.forEach((value) => sum += value);

    return sum;
}

function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function createMaskFloating(maskString) {
    let i = [...maskString].findIndex((c) => c === 'X');

    if (i === -1 ) {
        return [createMask(maskString)];
    }
    let part1 = createMaskFloating(setCharAt(maskString, i, '1'));
    let part2 = createMaskFloating(setCharAt(maskString, i, '0'));
    return part1.concat(part2);
}

function combineMask(maskString, address) {
    let res = address.toString(2);
    while (res.length < maskString.length)
        res = '0' + res;
    [...maskString].forEach((el, i) => {
        if(el === 'X') {
            res = setCharAt(res, i, 'X');
        }
        else if(el === '1') {
            res = setCharAt(res, i, '1');
        }
    })
    return res
}


strictEqual(initializeV2('test3.txt'), 208);

strictEqual(initializeV2('input.txt'), 3296185383161); // part 2