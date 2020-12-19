import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function createRegex(string, memory, part2) {
    if (!string)
        return;

    const [uu, ruleNr, rest] = string.match(new RegExp(/(\d+): (.+)/));

    let res = rest.match(new RegExp(/"(\w)"/));
    if (res) {
        memory.set(ruleNr, res[1]);
        return true;
    }
    
    res = rest.match(new RegExp(/(\d+) (\d+) . (\d+) (\d+)/));
    if (res) {
        const f = memory.get(res[1]);
        const s = memory.get(res[2]);
        const t = memory.get(res[3]);
        const fo = memory.get(res[4]);
        if (!f || !s || !t || !fo)
            return false;
        const build = '('+ f + s + '|' + t + fo + ')';
        memory.set(ruleNr, build);
        return true;
    }

    res = rest.match(new RegExp(/(\d+) . (\d+)/));
    if (res) {
        const f = memory.get(res[1]);
        const s = memory.get(res[2]);
        if (!f || !s)
            return false;
        const build = '('+ f + '|' + s + ')';
        memory.set(ruleNr, build);
        return true;
    }

    res = rest.split(' ');
    let s = "";
    let allOk = true
    res.forEach(rule => {
        let r = memory.get(rule);
        if (!r)
            allOk = false; 
        s += r;
    });

    if (allOk) {
        if (part2 && ruleNr === '8') {
            memory.set(ruleNr, recurse8(s, 10));
        }
        else if (part2 && ruleNr === '11') {
            let parts = [];
            res.forEach(rule => {
                const r = memory.get(rule);
                parts.push(r);
            });

            const newRule = recurse11(parts[0], parts[1], 5);
            memory.set(ruleNr, newRule);
        }
        else {
            memory.set(ruleNr, s);
        }
        return true;
    }
    return false;
}


function solve(filename, part2) {
    let lines = readFileSync(filename, 'utf-8').split('\r\n');
    let firstPart = true;
    let rules = [];
    let messages = [];
    
    lines.forEach((line) => {
        if (firstPart) {
            if (line === '') {
                firstPart = false;
            }
            else {
                rules.push(line);
            }
        }
        else {
            messages.push(line);
        }
    })

    let memory = new Map();
    let prev = 0;
    // loop through and resolve rules where possible... :/
    while(prev !== rules.length) {
        prev = rules.length;
        for (let i = rules.length -1; i >= 0; i--) {
            if (createRegex(rules[i], memory, part2)) {
                rules.splice(i, 1);
                break;
            }
        }
    }
    
    const finalRegexp = new RegExp(memory.get('0'));

    let count = 0;
    messages.forEach((message) => {
        const mat = message.match(finalRegexp);
        if (mat && mat[0] === message) {
            count++;
        }
    })
    console.log(count)
    return count;
}

solve('input.txt', false); // part 1 - 144

strictEqual(solve('test3-part2.txt', true), 12);
strictEqual(solve('test4-part2.txt', true), 4);
solve('input.txt', true); // part 2 - 260


function recurse8(part1, count) {
    if (count === 0)
        return part1;

    return '(' + part1 + '|' + part1 + recurse8(part1, count - 1) + ')';
}

function recurse11(part1, part2, count) {
    if (count === 0)
        return part1 + part2;

    return '(' + part1 + part2 + '|' + part1 + recurse11(part1, part2, count - 1) + part2 + ')';
}