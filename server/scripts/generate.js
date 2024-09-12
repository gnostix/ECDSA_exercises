const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");
const {Buffer} = require('buffer');
const { keccak256 } = require("ethereum-cryptography/keccak.js");


var textEncoding = require('text-encoding');
var TextDecoder = textEncoding.TextDecoder;



const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);

const message = "lalalalllalalala";
const hashedTrx = keccak256(Buffer.from(message));

const hashedTampered = keccak256(Buffer.from(message+"tampered"));

const randoBytesSalt = Buffer.from((Math.random() + 1).toString(36).substring(7));
const signature = secp256k1.sign(toHex(hashedTrx), privateKey, randoBytesSalt);

//recover public key from msg
const recoveredPublicKey = signature.recoverPublicKey(toHex(hashedTrx)).toRawBytes();
console.log("recoveredPublicKey : ",recoveredPublicKey);
// const bfMsg = keccak256(Buffer.from(transaction));
console.log("------- ", typeof recoveredPublicKey);
console.log("Verification by recovery : ",secp256k1.verify(signature, toHex(hashedTrx), Buffer.from(recoveredPublicKey)));


console.log("private key: ", toHex(privateKey));
console.log("public key: ", toHex(publicKey));
console.log("signed transaction: ", signature);
console.log("Verification simple: ",secp256k1.verify(signature, toHex(hashedTrx), publicKey));
console.log("Verification simple: ",secp256k1.verify(signature, toHex(hashedTampered), publicKey));



let binary = '';
    const bytes = new Uint8Array(signature);
    const len = bytes.byteLength;
    console.log("---", len);
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(binary)));
    
console.log("---", signatureBase64);



