import { readFileSync } from "fs";
var file = readFileSync('input.txt', 'utf-8');
var list = file.split('\n');

let counter = 0;

let test = "1-3 a: abcde";
let test2 = "13-18 g: ggggggggnggggggggggp"
let test3 = "1-3 b: cdefg"
let test4 = "2-9 c: ccccccccc"

function validatePassword(string) {
    // for part 1
    const regex = /(\d+)-(\d+) (\w): (\w+)/;
    const rule = string.match(regex);
    const ruleRegex = new RegExp(rule[3], 'g');
    const matched = rule[4].match(ruleRegex);
    if (!matched) return false;
    const min = Number(rule[1]);
    const max = Number(rule[2]);
    return matched.length >= min && matched.length <= max;
}

list.forEach((entry) => {
    let valid = validatePassword(entry);
    if (valid) {
        counter += 1;
    }
})

let counter2 = 0;

function validatePassword2(string) {
    // part 2 changed rules
    const regex = /(\d+)-(\d+) (\w): (\w+)/;
    const rule = string.match(regex);
    const char = rule[3];
    const i = Number(rule[1]) - 1; // not zero indexed
    const i2 = Number(rule[2]) - 1;
    const password = rule[4];
    return (password.charAt(i) === char) != (password.charAt(i2) === char);
}

list.forEach((entry) => {
    let valid = validatePassword2(entry);
    console.log(valid, entry)
    if (valid) {
        counter2 += 1;
    }
})

console.log(counter2);