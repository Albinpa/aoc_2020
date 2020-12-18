import { readFileSync } from "fs";
var file = readFileSync('input.txt', 'utf-8');


const searchFields = ["ecl", "pid", "eyr", "hcl", "byr", "iyr", "hgt"];



function addInfo(object, line) {
    const regex = new RegExp(/\w+:\S+/, 'g');
    const res = line.match(regex);

    if(!res) {
        return false;
    }

    res.forEach(match => {
        let splitted = match.split(':');
        object[splitted[0]] = splitted[1];
    });
    return true;
}

function isValidPartOne(object) {
    const failed = searchFields.some((field) => {
        return !(field in object);
    })
    return !failed;
}

function isValidPartTwo(object) {
    const byr = Number(object['byr']);
    if (byr < 1920 || byr > 2002)
        return false;
    
    const iyr = Number(object['iyr']);
    if (iyr < 2010 || iyr > 2020)
        return false;

    const eyr = Number(object['eyr']);
    if (eyr < 2020 || eyr > 2030)
        return false;

    // ******* height ***************
    const hgt = object['hgt'];
    const hgtInfo = hgt.match(new RegExp(/(\d+)(\w+)/));
    if (hgtInfo < 3)
        return false;
    const height = Number(hgtInfo[1]); 
    if (hgtInfo[2] === 'cm') {

        if (height < 150 || height > 193)
            return false;
    }
    else if (hgtInfo[2] === 'in') {
        if (height < 59 || height > 76)
            return false;
    }
    else {
        return false
    }

    // ******hcl ************************
    const hcl = object['hcl'];
    if (hcl.length !== 7)
        return false;
    const hclInfo = hcl.match(new RegExp(/#[0-9a-f]{6}$/));
    if (!hclInfo) {
        return false;
    }

    // ********ecl **************************
    const ecl = object['ecl'];
    const validEcl = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].some((ok) => ecl === ok);
    if (!validEcl)
        return false;


    // ******** pid ***********************
    const pid = object['pid'];
    if (pid.length !== 9)
        return false;
    const pidExist = pid.match(new RegExp(/[\d]{9}$/));
    if (!pidExist)
        return false;
    
    return true;
}

let o = {};
addInfo(o, "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd byr:1937 iyr:2017 hgt:183cm");
if (!isValidPartOne(o)) {
    console.warn('simple test failed')
}

function countValidInFile(file) {
    var list = file.split('\r\n');
    let count = 0;
    let currentObject = {};
    list.forEach(( line ) => {
        const res = addInfo(currentObject, line);
        if (!res) {
            //complete passport parsed, validate
            if (isValidPartOne(currentObject) && isValidPartTwo(currentObject)){
                count++;
            }
            //reset
            currentObject = {};
        }
    });
    return count;
}

const example = countValidInFile(readFileSync('testdata.txt', 'utf-8'));

o = {};
addInfo(o, "iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719");
if (!isValidPartTwo(o)) {
    console.warn('simple test for part two failed')
}

const example2 = countValidInFile(readFileSync('test2.txt', 'utf-8'));
if (!(example2 === 4)) {
    console.warn('example2 data test failed')
}

console.log('Final answer: ', countValidInFile(file));