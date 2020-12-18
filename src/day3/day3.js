import { readFileSync } from "fs";
var file = readFileSync('input.txt', 'utf-8');
var list = file.split('\r\n');

function countTrees(list, right_steps, down_steps) {
    let row = 0;
    let column = 0
    let count = 0
    let size = list[0].length;
    list.forEach((line) => {
        const skip_row = row % down_steps !== 0;
        row++;
        if (skip_row)
            return
        if (line.charAt(column) === '#')
        {
            count++;
        }
        column = (column + right_steps) % size;
    })
    console.log(count)
    return count;
}

let trees = countTrees(list, 3, 1);
trees *= countTrees(list, 1, 1);
trees *= countTrees(list, 5, 1);
trees *= countTrees(list, 7, 1);
trees *= countTrees(list, 1, 2);

console.log(trees);