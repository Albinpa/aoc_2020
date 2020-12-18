import { readFileSync } from "fs";
import { deepStrictEqual } from 'assert';

const file = readFileSync('input.txt', 'utf-8');

const solve = (instructions) => runProgram(instructions, true, 0); 

function runProgram(instructions, allowedToChange, start) {
    let instructionPointer = start;
    let accumulator = 0;
    let alreadyrun = new Map();

    const regex = /(\w+) ([+-])(\d+)/;

    while ( instructionPointer < instructions.length)
    {
        if ( instructionPointer < 0) {
            return [false, accumulator];
        }

        const [x, ins, sign, n] = instructions[instructionPointer].match(regex);
        const digit = sign === "-" ? -1 * Number(n) : Number(n);

        if (alreadyrun.get(instructionPointer)) {
            return [false, accumulator];
        }
        alreadyrun.set(instructionPointer, 1);

        let step = 1;
        if (ins === "jmp") {
            if (allowedToChange) {
                const insCopy = instructions.slice(0);
                insCopy[instructionPointer] = insCopy[instructionPointer].replace("jmp", "nop");
                const [success, acc] = runProgram(insCopy, false, instructionPointer);
                if (success) {
                    return [true, accumulator + acc];
                }
            }
            step = digit;
        }
        else if (ins === "acc") {
            accumulator += digit;
        }
        else { // nop
            if (allowedToChange) {
                const insCopy = instructions.slice(0);
                insCopy[instructionPointer] = insCopy[instructionPointer].replace("nop", "jmp");
                const [success, acc] = runProgram(insCopy, false, instructionPointer);
                if (success) {
                    return [true, accumulator + acc];
                }
            }
        }
        instructionPointer += step;
    }

    return [true, accumulator];
}

deepStrictEqual(solve(readFileSync('test.txt', 'utf-8').split('\r\n')), [true, 8]);

console.log('Part 2: ', solve(file.split('\r\n')));