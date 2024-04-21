import AesCtr from './lib/AES/aes-ctr.js'



function generateRandomKey(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[]\;,./';
    var key = '';
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        key += characters.charAt(randomIndex);
    }
    return key;
}

function decryptAES(txt, key){
    const origtext = AesCtr.decrypt(txt, key, 256);
    return origtext
}

function encryptAES(txt, key){
    const ciphertext = AesCtr.encrypt(txt, key, 256);
    return ciphertext
}


export {generateRandomKey, decryptAES, encryptAES}