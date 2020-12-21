import { readFileSync } from "fs";
import { deepStrictEqual, strictEqual } from 'assert';


function parseFile(filename) {
    
    const lines = readFileSync(filename, 'utf-8').split('\r\n');
    
    let foods = [];
    let allergenMap = new Map();
    let ingredientMap = new Map();

    lines.forEach((line) => {
        const i = line.indexOf('(');
        const ingredients = line.substring(0, i - 1).split(' ');
        const allergens = line.substring(i+10, line.length - 1).split(', ');

        foods.push({ingredients: ingredients, allergens: allergens});
        allergens.forEach((allergen) => {
                allergenMap.set(allergen, undefined);
        });
        ingredients.forEach((ingredient) => {
            ingredientMap.set(ingredient, undefined);
        });
    });
    return [foods, allergenMap, ingredientMap];
}


function solve(filename) {
    let [foods, allergenMap, ingredientMap] = parseFile(filename);

    const allergens = Array.from(allergenMap.keys());
    allergens.forEach(allergen => {
        let potentials = [];
        foods.forEach(food => {
            if (food.allergens.find((el) => el === allergen)) {
                if (potentials.length === 0) {
                    potentials = food.ingredients;
                }
                else {
                    let newPot = []
                    // combine arrays of potentials, only keep the common ones
                    potentials.forEach((pot, i) => {
                        if (food.ingredients.findIndex((name) => name === pot) !== -1){
                            newPot.push(pot);
                        }
                    })
                    potentials = newPot;
                }
            }
        })
        allergenMap.set(allergen, potentials);
    })

    // allergenmap now maps all potential ingredients for each allergen
    let ingredientsWithoutAllergens = [];
    const ingredients = Array.from(ingredientMap.keys());
    ingredients.forEach(ingredient => {
        let allergens = Array.from(allergenMap.values());
        let nowhere = true;
        allergens.forEach(potentials => {
            if (potentials.findIndex((pot) => pot === ingredient) !== -1) {
                nowhere = false;
            }
        });
        if (nowhere) {
            ingredientsWithoutAllergens.push(ingredient);
        }
            
    });

    // part 1, count ingredients without any allergens
    let count = 0;
    ingredientsWithoutAllergens.forEach(ingredient => {
        foods.forEach(food => {
            if (food.ingredients.findIndex(i => i === ingredient) !== -1) {
                count++
            }
        })
    })
    console.log('Part 1: ',count)

    // reduce potential allergens by excluding the ones that are bound to an ingredient alone
    let stale = false;
    while (!stale) {
        stale = true;
        allergenMap.forEach((potentials, allergen) => {
            if (potentials.length === 1) {
                allergenMap.forEach((pot2, aller2) => {
                    if (allergen === aller2)
                        return; //break
                    let i = pot2.findIndex((pot) => pot === potentials[0]);
                    if (i === -1)
                        return;
                    let newPot = pot2;
                    newPot.splice(i, 1);
                    allergenMap.set(aller2, newPot);
                    stale = false;
                });
            }
        });
    }

    // sort names of allergens
    let names = Array.from(allergenMap.keys());
    names.sort((a1,a2) => {
        if (a1 < a2) return -1;
        else return 1;
    })

    // create canonical dangerous ingredient list 
    let cdil = '';
    names.forEach(name => {
        cdil += allergenMap.get(name) + ',';
    })
    cdil = cdil.substring(0,cdil.length - 1);
    console.log('Part 2: ',cdil)
}


solve('test.txt');
solve('input.txt');