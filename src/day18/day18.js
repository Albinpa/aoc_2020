import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


// parse and evaluate at same time..
function evalutateExpr(string) {
    if (isNumeric(string)) {
        return Number(string);
    }

    const split = [...string]; // list of characters

    // parenthesis
    for (let i = split.length -1 ; i >= 0; i--) {
        const c = split[i];
        if (c === ')') {
            const s = findStartParentheses(string.substring(0, i + 1));
            const newexpr = string.substring(0, s) + // left side
                            evalutateExpr(string.substring(s + 1, i)) + // parenthesis
                            string.substring(i + 1, split.length); // right side
            return evalutateExpr(newexpr);
        }
    }

    // multiplication
    for (let i = split.length -1 ; i >= 0; i--) {
        const c = split[i];
        if (c === '*') {
            return operate(evalutateExpr(string.substring(0, i)),
                            split[i],
                            evalutateExpr(string.substring(i + 1)));
        }
    }

    // addition
    for (let i = split.length -1 ; i >= 0; i--) {
        const c = split[i];
        if (c === '+') {
            return operate(evalutateExpr(string.substring(0, i)),
                            split[i],
                            evalutateExpr(string.substring(i + 1)));
        }
    }
    console.warn('not numeric and operator found... ?')
}

function findStartParentheses(charList) {
    let count = 0;

    for (let i = charList.length -1 ; i >= 0; i--) {
        const c = charList[i];
        if (c === ')') {
            count++;
        }
        else if (c === '(') {
            count--;
            if (count === 0) {
                return i;
            }
        }
    }
    console.warn('didnt find opening parenthesis...')
}

function operate(lhs, opString, rhs) {
    if (opString === '*') {
        return lhs * rhs;
    }
    else if (opString === '+') {
        return lhs + rhs;
    }
    return undefined;
}

function isNumeric(str) {
    return !isNaN(str) && 
           !isNaN(parseFloat(str))
}


strictEqual(evalutateExpr('1+2*3+4*5+6'), 231);
strictEqual(evalutateExpr('1+(2*3)+(4*(5+6))'), 51);
strictEqual(evalutateExpr('2*3+(4*5)'), 46);
strictEqual(evalutateExpr('5+(8*3+9+3*4*3)'), 1445);
strictEqual(evalutateExpr('5*9*(7*3*3+9*3+(8+6*4))'), 669060);

function sumFile(filename) {
    const lines = readFileSync(filename, 'utf-8')
                    .split('\r\n')
                    .map(string => string.replace(/\s/g, ""));
    let sum = 0;
    lines.forEach(line => {
        sum += evalutateExpr(line);
    })

    return sum;
}

console.log(sumFile('input.txt')); // part 2