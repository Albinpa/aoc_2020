import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';

var list = readFileSync('input.txt', 'utf-8').split('\r\n');

function parseLine(line) {
    const info = line.match(new RegExp(/(.+) bags contain (.+)/));
    const parent = info[1];
    let kids = [];
    if (info[2] !== "no other bags.") {
        kids = info[2].split(',').map((bag) => {
            const res = bag.match(new RegExp(/(\d+) (.+) bag/));
            let kid = res[2].replace('.', '');
            return {kid: kid, nr: res[1]};
        })
    }
    return [parent, kids];
}


deepStrictEqual(parseLine("light red bags contain 1 bright white bag, 2 muted yellow bags."),
['light red', [{ kid: 'bright white', nr: '1' },{ kid: 'muted yellow', nr: '2' }]]);

deepStrictEqual(parseLine("faded blue bags contain no other bags."), 
                ['faded blue', [] ]);

function createRules(lines) {
    let tree = [];
    // parse rules
    lines.forEach((line) => {
        const [parent, kids] = parseLine(line);
        updateNode(tree, parent, undefined, kids);
        kids.forEach((kid) => {
            updateNode(tree, kid.kid, parent, []);
        })
    })
    return tree;
}

// part 1
function findColorsContain(color, lines) {
    let tree = createRules(lines);

    // find how many bag colors can contain at least one 'color' bag
    return searchUp(tree, color).length -1; // -1 because contains itself also
}

// part 2
function countBagsInside(color, lines) {
    let tree = createRules(lines);

    // find how many bags needs to be inside one of 'color'
    return countDown(tree, color) - 1; // -1 for itself
}

function searchUp(tree, color) {
    const i = tree.findIndex((node) => node.name === color);
    if (i === -1)
        console.warn('something wrong, color doesnt exist. ', color);

    const name = tree[i].name;
    let list = [name];
    
    tree[i].parents.forEach((parent) => {
        searchUp(tree, parent).forEach((res) => list.push(res));
    })
    
    return [...new Set(list)]
}

function countDown(tree, color) {
    const i = tree.findIndex((node) => node.name === color);
    if (i === -1)
        console.warn('something wrong, color doesnt exist. ', color);

    let count = 1;
    
    tree[i].kids.forEach((kid) => {
        const nrOfKid = Number(kid.nr);
        const nrInThatKid = countDown(tree, kid.kid);
        count += nrOfKid * nrInThatKid;
    })
    
    return count
}

function updateNode(nodes, name, parent, kids) {
    const i = nodes.findIndex((node) => node.name === name);
    let obj = {};
    if (i !== -1) {
        obj = nodes[i];
    }
    else {
        obj = { name: name, kids: [], parents: [] };
        nodes.push(obj);
    }
    kids.forEach((kid) => obj.kids.push(kid));
    if (parent)
        obj.parents.push(parent);
}

strictEqual(findColorsContain("shiny gold", readFileSync('test.txt', 'utf-8').split('\r\n')),
             4);


console.log('Part 1:', findColorsContain("shiny gold", list));

strictEqual(countBagsInside("shiny gold", readFileSync('test2.txt', 'utf-8').split('\r\n')),
            126);

console.log('Part 2:', countBagsInside("shiny gold", list));