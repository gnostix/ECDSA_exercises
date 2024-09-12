import { useState } from "react";
import server from "./server";
import {Buffer} from 'buffer';
import {toHex, utf8ToBytes}  from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import {secp256k1} from "ethereum-cryptography/secp256k1";

function Transfer({ wallet, balance, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
 
  const setValue = (setter) => (evt) => setter(evt.target.value);
  privateKey = "77924ac6e1acde45b5cb72261c4e28a066bc9004b3e996d30e41401dc0a1c540";
  console.log("prv key : ", privateKey);

   
  const trx = {
    sender: wallet,
    amount: parseInt(sendAmount),
    recipient,
  };
  const transaction = JSON.stringify(trx);
  // const transaction = "12alex paqwsdppsssas";
  console.log("trx :", transaction);
  // sign transaction
  const bfTrx = keccak256(Buffer.from(transaction));
  console.log("data hash: ", toHex(bfTrx), "private key :", privateKey);
  const randoBytesSalt = Buffer.from((Math.random() + 1).toString(36).substring(7));  

  // const hashedMgs = keccak256(transaction);
  const signature = secp256k1.sign(bfTrx, privateKey, randoBytesSalt);
  console.log("signature: ", signature);

  
    // Verify the signature (optional step for testing)
    // const isValid = verifySignature(publicKey, signature, message);
    // console.log("Signature is valid:", isValid);
  
  // const bfTrx2 = Buffer.from("kokoko");
  // const signature2 = secp256k1.sign(bfTrx2, privateKey, randoBytesSalt);
  // console.log("signature2: ", signature2);

  // const address = secp256k1.getPublicKey(privateKey, true);   
  // console.log('public key - comp  :', toHex(address), address);
  // setAddress('0x' + toHex(address));

  const publicKeyUncomp = secp256k1.getPublicKey(privateKey, false); 
  console.log("public key uncomp",toHex(publicKeyUncomp));
  // console.log("------",toHex(keccak256(Buffer.from('hello'))));
  // Vallidate transaction
  // const bfSign = Buffer.from(signature.toString()); ////problemmmmm

  // const bfMsg = Buffer.from(transaction.toString());
  // const messageBytes = utf8ToBytes(transaction);
  // const messageHash = keccak256(messageBytes);

  const bfMsg = keccak256(Buffer.from(transaction));
  console.log("Verification : ",secp256k1.verify(signature, bfMsg, publicKeyUncomp));

  // Prepare the POST request payload
  const payload = {
    message: transaction,
    signature: signature
};

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, JSON.stringify(payload));
      setBalance(balance);
    } catch (ex) {
      console.log("----->", ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

function signMessage(privateKey, message) {
  // Convert the message to bytes
  const messageBytes = utf8ToBytes(message);

  // Hash the message (Ethereum uses Keccak-256)
  const messageHash = keccak256(messageBytes);

  // Sign the message hash using the private key
  const signature  = secp256k1.sign(messageHash, privateKey); //, { recovered: true }

  return signature;
}

// Step 2: Verify the signature using the public key
function verifySignature(publicKey, signature, message) {
  // Convert the message to bytes
  const messageBytes = utf8ToBytes(message);

  // Hash the message (Ethereum uses Keccak-256)
  const messageHash = keccak256(messageBytes);

  // Verify the signature
  return secp256k1.verify(signature, messageHash, publicKey);
}
export default Transfer;
