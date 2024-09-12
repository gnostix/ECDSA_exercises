import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";



function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, wallet, setWallet }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = secp256k1.getPublicKey(privateKey, true);   
    console.log('public key - comp  :', toHex(address));
    setAddress('0x' + toHex(address));

    const publicKeyUncomp = secp256k1.getPublicKey(privateKey, false);  
    console.log('public key - uncomp:', toHex(publicKeyUncomp));

    const wallet1 = keccak256(publicKeyUncomp.slice(1)).slice(-20);
    console.log('address2 :', '0x' + toHex(wallet1)); 

    wallet = '0x' + toHex(wallet1);
    setWallet(wallet);
    
    console.log("-----", wallet);
    if (wallet) {
      const {
        data: { balance },
      } = await server.get(`balance/${wallet}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Input here the Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address}
      </div>
      <div>
        Ethereum Wallet: {wallet}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
