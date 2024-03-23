function modExp(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

function millerRabinTest(n, k = 100) {
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0 || n === 1) return false;

    let r = 0;
    let d = n - 1;
    while (d % 2 === 0) {
        r++;
        d /= 2;
    }

    for (let i = 0; i < k; i++) {
        let a = 2 + Math.floor(Math.random() * (n - 3));
        let x = modExp(a, d, n);
        if (x === 1 || x === n - 1) continue;

        let continueLoop = false;
        for (let j = 0; j < r - 1; j++) {
            x = modExp(x, 2, n);
            if (x === n - 1) {
                continueLoop = true;
                break;
            }
        }

        if (continueLoop) continue;
        return false;
    }

    return true;
}

function isPrime(number) {
  if (number === "2") {
    return true;
  }
  if (number % 2 === 0) {
    return false;
  }
  var n = BigInt(number);
  var base = BigInt("2");
  var t = BigInt("1");
  var v = BigInt(n - 1) / BigInt(2);

  while (v % BigInt(2) == BigInt(0)) {
    v = v / BigInt(2);
    t++;
  }

  var s = BigInt(t);
  var i = BigInt(1);
  while (i <= BigInt("4")) {
    if (i === BigInt("4")) {
      return false;
    }
  }
}


export {millerRabinTest}
