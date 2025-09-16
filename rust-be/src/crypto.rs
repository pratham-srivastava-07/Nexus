// rust cryptography implementation here 
// will have core  cryto logic 

use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit};
use rand::RngCore;
use rand_core::OsRng;
use x25519_dalek::{PublicKey, StaticSecret};

// generate keypair func to return a pair of pub + pvt key
pub fn generate_keypair() -> (StaticSecret, PublicKey) {
    let secret = StaticSecret::random_from_rng(OsRng);
    let public = PublicKey::from(&secret);
    (secret, public)
}

// diffie hellman key exchange=> one's pvt key and second's pub key
pub fn derive_shared_secret(secret_bytes: &[u8], peer_public_bytes: &[u8]) -> [u8; 32] {
    let secret = StaticSecret::from(<[u8; 32]>::try_from(secret_bytes).unwrap());
    let peer_public = PublicKey::from(<[u8; 32]>::try_from(peer_public_bytes).unwrap());
    secret.diffie_hellman(&peer_public).to_bytes()
}

// the shared encryption key is used here 
pub fn encrypt(shared_secret: &[u8], plaintext: &[u8]) -> (Vec<u8>, [u8; 12]) {
    //get key
    let key = Key::<Aes256Gcm>::from_slice(shared_secret);
    let cipher = Aes256Gcm::new(key);

    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    // nonce and ciphertext extraction
    let nonce = Nonce::from_slice(&nonce_bytes);
    let ciphertext = cipher.encrypt(nonce, plaintext).expect("encryption failure!");
    (ciphertext, nonce_bytes)
}

// decrypting the message using AES256 gcm
pub fn decrypt(shared_secret: &[u8], ciphertext: &[u8], nonce_bytes: &[u8]) -> Vec<u8> {
    let key = Key::<Aes256Gcm>::from_slice(shared_secret);
    let cipher = Aes256Gcm::new(key);
    let nonce = Nonce::from_slice(nonce_bytes);

    cipher.decrypt(nonce, ciphertext).expect("decryption failure!")
}
