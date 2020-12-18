import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function parse (filename) {
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    let part = 1;
    let rules = [];
    let myTicket = undefined;
    let nearby = [];

    lines.forEach((line) => {
        if (line.length === 0)
            part++

        if (part === 1) {
            const rule = line.match(new RegExp(/(.+): (\d+)-(\d+) or (\d+)-(\d+)/));
            if (rule.length > 5) {
                rules.push({name: rule[1], low1: Number(rule[2]),
                            low2: Number(rule[3]), high1: Number(rule[4]), high2: Number(rule[5])});
            }
        }
        else if (part === 2) {
            let res = line.split(',');
            if (res.length > 2) {
                myTicket = res.map((nr) => Number(nr));
            }   
        }
        else {
            let res = line.split(',');
            if (res.length > 2) {
                nearby.push(res.map((nr) => Number(nr)));
            }
        }
    });

    return [rules, myTicket, nearby];
}


function errorRate(rules, ticket) {
    let count = 0;
    let error = false;
    for (let i = 0; i < ticket.length; i++) {
        let foundValid = false;
        for (let j = 0; j < rules.length; j++) {
            if (valid(rules[j], ticket[i])) {
                foundValid = true;
                break;
            }
        }
        if (!foundValid) {
            count += ticket[i];
            error = true;
        }
    }
    return [error, count];
}

function valid(rule, value) {
    if (value >= rule.low1 && value <= rule.low2 ||
        value >= rule.high1 && value <= rule.high2) {
            return true;
        }
    //console.log('Value',value,' is not valid for rule', rule)
    return false;
}


strictEqual(valid({ name: 'class', low1: 1, low2: 3, high1: 5, high2: 7 }, 4), false);
strictEqual(valid({ name: 'class', low1: 1, low2: 3, high1: 5, high2: 7 }, 5), true);

const testRules = [
    { name: 'class', low1: 1, low2: 3, high1: 5, high2: 7 },
    { name: 'row', low1: 6, low2: 11, high1: 33, high2: 44 }];
deepStrictEqual(errorRate(testRules, [7, 45]), [true, 45]);
deepStrictEqual(errorRate(testRules, [7, 44, 5]), [false, 0]);

//console.log(parse('test.txt'))


function solvePart1 (filename) {
    const [rules, myTicket, nearby] = parse(filename);
    let error = 0;

    nearby.forEach((ticket) => {
        const [err, count] = errorRate(rules, ticket);
        error += count;
    })
    return error;
}

strictEqual(solvePart1('test.txt'), 71);
strictEqual(solvePart1('input.txt'), 23009);

function solvePart2 (filename) {
    const [rules, myTicket, nearby] = parse(filename);
    let workingSet = [];

    // discard invalid tickets
    nearby.forEach((ticket) => {
        const [err, count] = errorRate(rules, ticket);
        if (!err)
            workingSet.push(ticket);
    })

    // for each rule, make a list of which rows this rule is valid
    let test = []
    rules.forEach(rule => {
        let ok = []
        for (let i = 0; i < workingSet[0].length; i++) {
            let allOk = true
            workingSet.forEach((ticket) => {
                if (!valid(rule, ticket[i])) {
                    allOk = false;
                }
            });
            if (allOk) {
                ok.push(i);
            }
        }
        test.push(ok);
    });

    // next, for rules that can only by applied for 1 row, remove that row
    // from the valid set of other rules until every rule has 1 row assigned.
    let i = 0;
    while( i < 100) {
        for (let k = 0; k < test.length; k++) {
            if (test[k].length === 1) {
                for (let j = 0; j < test.length; j++) {
                    if (k === j)
                        continue
                    let exist = test[j].indexOf(test[k][0]);
                    if (exist !== -1) {
                        test[j].splice(exist,1);
                    }
                }
            }
        };
        i++;
    }

    // multiply toghether values from my ticket where rules/fields start with 'departure'
    let mul = 1;
    rules.forEach((rule, i) => {
        if (rule.name.startsWith('departure')) {
            const row = test[i][0];
            mul *= myTicket[row];
        }
    })
    return mul;
}


console.log(solvePart2('input.txt'));