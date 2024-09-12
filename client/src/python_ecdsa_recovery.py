#!/usr/bin/env python3

# Example from https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-examples
# updated to latest pycoin & OpenSSL APIs (2020-09)
#   pip install --user pycoin
#   pip install --user secrets
  
from pycoin import intbytes
from pycoin.ecdsa.secp256k1 import secp256k1_generator
import hashlib, secrets

def sha3_256Hash(msg):
  hashBytes = hashlib.sha3_256(msg.encode("utf8")).digest()
  return int.from_bytes(hashBytes, byteorder="big")

def signECDSAsecp256k1(msg, privKey):
  msgHash = sha3_256Hash(msg)
  signature = secp256k1_generator.sign(privKey, msgHash)
  return signature

def verifyECDSAsecp256k1(msg, signature, pubKey):
  msgHash = sha3_256Hash(msg)
  valid = secp256k1_generator.verify(pubKey, msgHash, signature)
  return valid

# ECDSA sign message (using the curve secp256k1 + SHA3-256)
msg = "Message for ECDSA signing"
privKey = secrets.randbelow(secp256k1_generator.order())
signature = signECDSAsecp256k1(msg, privKey)
print("Private key:", hex(privKey))
print("Signature: r=" + hex(signature[0]) + ", s=" + hex(signature[1]))

# ECDSA verify signature (using the curve secp256k1 + SHA3-256)
from pycoin.encoding.sec import sec_to_public_pair
pubKey = secp256k1_generator * privKey
valid = verifyECDSAsecp256k1(msg, signature, pubKey)
print("\nMessage:", msg)
print("Public key: (" + hex(pubKey[0]) + ", " + hex(pubKey[1]) + ")")
print("Signature valid?", valid)

# ECDSA verify tampered signature (using the curve secp256k1 + SHA3-256)
msg = "Tampered message"
valid = verifyECDSAsecp256k1(msg, signature, pubKey)
print("\nMessage:", msg)
print("Signature (tampered msg) valid?", valid)

def recoverPubKeyFromSignature(msg, signature):
  msgHash = sha3_256Hash(msg)
  recoveredPubKeys = secp256k1_generator.possible_public_pairs_for_signature(msgHash, signature)
  return recoveredPubKeys

msg = "Message for ECDSA signing"
recoveredPubKeys = recoverPubKeyFromSignature(msg, signature)
print("\nMessage:", msg)
print("Signature: r=" + hex(signature[0]) + ", s=" + hex(signature[1]))
for pk in recoveredPubKeys:
  print("Recovered public key from signature: (" +
  hex(pk[0]) + ", " + hex(pk[1]) + ")")