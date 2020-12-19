import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';




function addRule(string, memory) {
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
        memory.set(ruleNr, s);
        return true;
    }
    return false;
}


// let memory = new Map();
// addRule('5: "b"', memory);
// addRule('4: "a"', memory);
// addRule('3: 4 5 | 5 4', memory);
// addRule('2: 4 4 | 5 5', memory);
// addRule('1: 2 3 | 3 2', memory)
// addRule('0: 4 1 5', memory)
// //console.log(memory)

// let regexp = new RegExp(memory.get('0'));
// //console.log('ababbb'.match(regexp));
// //console.log('bababa'.match(regexp));
// //console.log('aaabbb'.match(regexp));
// //console.log('abbbab'.match(regexp));
// //console.log('aaaabbb'.match(regexp));


function solve(filename) {
    let lines = readFileSync(filename, 'utf-8').split('\r\n');
    let firstPart = true;

    let rules = [Array(Number(lines.length))];
    let messages = [];
    
    lines.forEach((line) => {
        if (firstPart) {
            if (line === '') {
                firstPart = false;
            }
            else {
                const res = line.match(new RegExp(/(\d+): (.+)/));
                rules[Number(res[1])] = line;
            }
        }
        else {
            messages.push(line);
        }
    })

    console.log(rules)
    console.log(messages)

    let memory = new Map();
    let prev = 0;
    while(prev !== rules.length) {
        prev = rules.length;
        for (let i = rules.length -1; i >= 0; i--) {
            if (addRule(rules[i], memory)) {
                console.log('removing', rules[i], 'length: ',rules.length)
                rules.splice(i, 1);
                break;
            }
        }
    }
    console.log(memory)
    console.log(rules)
    
    let regexp = new RegExp(memory.get('0'));

    let count = 0;
    messages.forEach((message) => {
        const mat = message.match(regexp);
        if (mat && mat[0] === message) {
            count++;
        }
    })
    console.log(count)

}

solve('input.txt')