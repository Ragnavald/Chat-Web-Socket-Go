class RSAKeyAttributes {
    constructor(e, bits) {
        var rsa = new RSAKey();
        rsa.generate(parseInt(bits), e);
        this.e = e;
        this.n = linebrk(rsa.n.toString(16), 64);
        this.d = linebrk(rsa.d.toString(16), 64);
        this.p = linebrk(rsa.p.toString(16), 64);
        this.q = linebrk(rsa.q.toString(16), 64);
        this.dmp1 = linebrk(rsa.dmp1.toString(16), 64);
        this.dmq1 = linebrk(rsa.dmq1.toString(16), 64);
        this.coeff = linebrk(rsa.coeff.toString(16), 64);
    }
}


function do_encrypt(publicKey, message) {
    var rsa = new RSAKey();
    rsa.setPublic(publicKey.n.toString(), publicKey.e.toString());
    var res = rsa.encrypt(message);
    if(res) {
      return linebrk(res, 64);
    }
  }

  function do_decrypt(privateKey, message) {
    var rsa = new RSAKey();
    rsa.setPrivateEx(privateKey.n, '3', privateKey.d, privateKey.p,privateKey.q, privateKey.dmp1, privateKey.dmq1,privateKey.coeff);
    if(message.length == 0) {
      return;
    }
    var res = rsa.decrypt(message);   
    return res;
  }

function do_genrsa() {
    var rsaKeyAttributes = new RSAKeyAttributes('3',1024);

    const publicKey = {
        e: rsaKeyAttributes.e,
        n: rsaKeyAttributes.n
    }
    const privateKey = {
        d: rsaKeyAttributes.d,
        n: rsaKeyAttributes.n,
        p: rsaKeyAttributes.p,
        q: rsaKeyAttributes.q,
        dmp1: rsaKeyAttributes.dmp1,
        dmq1: rsaKeyAttributes.dmq1,
        coeff: rsaKeyAttributes.coeff
    }
    const keys = {
        publicKey: publicKey,
        privateKey: privateKey
    }   
    return keys 
  }

export { do_genrsa, do_encrypt, do_decrypt }
