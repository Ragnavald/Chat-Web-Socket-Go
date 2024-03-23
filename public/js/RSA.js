import { millerRabinTest } from "./lib/miller-rabin.js";

let PQ = [];


function gerarPQ() {
    while (PQ.length < 2) {
        do {
            let num = Math.floor(Math.random() * 7 ** 10);
            if (num % 2 === 0) {
                num++;
            }
            if (millerRabinTest(num, 10)) {
                PQ.push(num);
                break;
            }
        } while (true);
    }
    return PQ;
}

function calcularN() {
    return PQ[0] * PQ[1];
}

function calcularZ() {
    return (PQ[0] - 1) * (PQ[1] - 1);
}

function calcularE(z) {
    let e;
    do {
        e = getRandomNumber(2, z);
    } while (gcd(e, z) !== 1);
    return e;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

function extendedEuclideanAlgorithm(a, b) {
    let [old_r, r] = [a, b];
    let [old_s, s] = [1n, 0n];
    let [old_t, t] = [0n, 1n];

    while (r !== 0n) {
        const quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }

    return [old_s, old_t];
}

function calcularD(e, z) {
    const [d, _] = extendedEuclideanAlgorithm(BigInt(e), BigInt(z));
    return (d % BigInt(z) + BigInt(z)) % BigInt(z); // Garante que o resultado seja positivo
}

function encrypt(m, publicKey) {
    var result = []
    var arrMsg = textToAscii(m)
    for(let i = 0; i < arrMsg.length; i++){
        result[i] = modPow(BigInt(hexToInt(arrMsg[i])), BigInt(publicKey.e), BigInt(publicKey.n));
    }
    return result

}

function decrypt(c, privateKey) {
    var result = []
    var resultHex = []
    c = convertArrayStringToInt(c)
    for(let i=0; i < c.length; i++){
        result[i] = modPow(c[i], BigInt(privateKey.d), BigInt(privateKey.n))
    }

    for(let i=0; i< result.length; i++){
        resultHex[i] = intToHex(result[i])                                                                                                                                                         
    }

    return asciiToText(resultHex)
    
}

function convertArrayStringToInt(arr) {
    var numberArray = [];

    for (var i = 0; i < arr.length; i++){
        numberArray.push(BigInt(arr[i]));
    }
    return numberArray
}

function hexToInt(hex){
    return parseInt(hex,16)
}

function intToHex(int){
    return int.toString(16)
}

function modPow(base, exp, mod) {
    let result = 1n;
    base %= mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2n;
    }
    return result;
}

function textToAscii(message){
    var result = []

    for (let index = 0; index < message.length; index++) {
        result[index] = message.charCodeAt(index).toString(16)
    }
    return result
}

function asciiToText(codes){
    var sentence = ""

    for(let index = 0; index < codes.length; index++){
        const codePoint = parseInt(codes[index],16)
        sentence += String.fromCodePoint(codePoint)
    }
    return sentence
}

function keysGenerate(){
    gerarPQ();
    const n = calcularN();
    const z = calcularZ();
    const e = calcularE(z);
    const d = Number(calcularD(e,z));
    const publicKey = {e: e, n: n}
    const privateKey = {d: d, n: n}
    const keys = {
        publicKey: publicKey,
        privateKey: privateKey
    }
    return keys 
}

export { keysGenerate, encrypt, decrypt };
