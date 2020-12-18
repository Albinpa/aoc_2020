
import { readFileSync } from "fs";
var file = readFileSync('input.txt', 'utf-8');
var list = file.split('\n');
list.forEach((item) => {
    list.forEach((i1) => {
        list.forEach((i2) => {
            if (Number(item) + Number(i2) + Number(i1)=== 2020){
                console.log(item, i2, Number(item) * Number(i2)*Number(i1));
                return;
            }
        })
    })
})
