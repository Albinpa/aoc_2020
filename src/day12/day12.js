import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';



function moveWaypoint(action, value, pos) {
    let newPos = {...pos};
    let dir = 1;
    switch(action) {
        case 'N':
            newPos.y = pos.y + value;
            break;
        case 'S':
            newPos.y = pos.y - value;
            break;
        case 'E':
            newPos.x = pos.x + value;
            break;
        case 'W':
            newPos.x = pos.x - value;
            break;
        case 'R':
            dir = -1;
        case 'L':
            const currentAngle = Math.atan2(pos.y, pos.x);
            const newAng =  currentAngle + degToRad(value) * dir;
            const x = Math.cos(newAng);
            const y = Math.sin(newAng);
            const dist = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
            newPos.x = x * dist;
            newPos.y = y * dist;
            break;
        default:
          break;
      }
      return newPos;
}

function degToRad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

deepStrictEqual(moveWaypoint('R', 90, {x: 10, y: 4}), {x: 4, y: -10});


function move(pos, mult, waypoint) {
    let newPos = {...pos};
    newPos.x = pos.x + mult * waypoint.x;
    newPos.y = pos.y + mult * waypoint.y;
    return newPos;
}

deepStrictEqual(move({x:0, y:0}, 10, {x:10, y:1}), {x:100, y:10});

function getManhattanDist(filename) {
    const list = readFileSync(filename, 'utf-8').split('\r\n');
    let waypoint = {x: 10, y: 1};
    const startPos = {x: 0, y: 0};
    let currentPos = startPos;

    list.forEach((line) => {
        const info = line.match(new RegExp(/(\w)(\d+)/));
        if (info[1] !== 'F') {
            waypoint = moveWaypoint(info[1], Number(info[2]), waypoint);
        }
        else {
            currentPos = move(currentPos, Number(info[2]), waypoint);
        }
    })
    
    return Math.abs(currentPos.x) + Math.abs(currentPos.y);
}

strictEqual(getManhattanDist('test.txt'), 286);

console.log(getManhattanDist('input.txt')); // part 2