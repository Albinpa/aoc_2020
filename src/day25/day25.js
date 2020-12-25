

function findLoopSize(pubkey) {
    const subjNr = 7;
    let value = 1;
    let loops = 0;
    while (value !== pubkey) {
        value = subjNr * value;
        value = value % 20201227;
        loops++;
    }
    console.log(loops)
    return loops;
}

findLoopSize(5764801)
findLoopSize(17807724)


function transform(input, loops) {
    let subjNr = input;
    let value = 1;
    for (let i = 0; i < loops; i++) {
        value = subjNr * value;
        value = value % 20201227;
    }
    console.log(value)
    return value;
}

transform(5764801, 11)

// part 1 input:
// 2069194
// 16426071

transform(16426071, findLoopSize(2069194));