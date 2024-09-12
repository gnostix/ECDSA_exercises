const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const {secp256k1} = require("ethereum-cryptography/secp256k1");


app.use(cors());
app.use(express.json());

const balances = {
  "0x00792411203b88494ad5d820957ab1bafcf237f6": 100,
  "0xf4e2019d5c8c2437e7f36462ed17ac37acbe6fb6": 50,
  "0x93759fd8f7075e7886be5b76d6c9a2b86c063751": 75,
};

app.get("/balance/:wallet", (req, res) => {
  const { wallet } = req.params;
  const balance = balances[wallet] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // const { sender, recipient, amount } = req.body;
  console.log("-----server ", req);
  const { transaction, signature } = req.body;
  const { sender, recipient, amount } = transaction;
  // const { r, s, recovery } = signature;

  console.log("------------- server -----------");
  // console.log("Verification server : ",secp256k1.verify(signature, bfMsg, publicKeyUncomp));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log("-----");
});

function setInitialBalance(wallet) {
  if (!balances[wallet]) {
    balances[wallet] = 0;
  }
}
