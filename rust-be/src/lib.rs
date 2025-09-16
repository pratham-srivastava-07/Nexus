// this is the same as crypto.rs but the only thing changed here is 
// it has webassembly bindings to js

use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::to_value;

mod crypto;
mod utils;


// binding to js generate keypair
#[wasm_bindgen]
pub fn generate_keypair() -> JsValue {
    let (secret, public) = crypto::generate_keypair();
    to_value(&(utils::to_hex(&secret.to_bytes()), utils::to_hex(public.as_bytes()))).unwrap()
}

#[wasm_bindgen]
pub fn derive_shared_secret(secret_hex: &str, peer_public_hex: &str) -> String {
    let secret = utils::from_hex(secret_hex).expect("Invalid secret hex");
    let peer_public = utils::from_hex(peer_public_hex).expect("Invalid public hex");
    let shared = crypto::derive_shared_secret(&secret, &peer_public);
    utils::to_hex(&shared)
}

#[wasm_bindgen]
pub fn encrypt(shared_secret_hex: &str, plaintext: &str) -> JsValue {
    let shared_secret = utils::from_hex(shared_secret_hex).expect("Invalid shared secret hex");
    let (ciphertext, nonce) = crypto::encrypt(&shared_secret, plaintext.as_bytes());
    to_value(&(utils::to_hex(&ciphertext), utils::to_hex(&nonce))).unwrap()
}

#[wasm_bindgen]
pub fn decrypt(shared_secret_hex: &str, ciphertext_hex: &str, nonce_hex: &str) -> String {
    let shared_secret = utils::from_hex(shared_secret_hex).expect("Invalid shared secret hex");
    let ciphertext = utils::from_hex(ciphertext_hex).expect("Invalid ciphertext hex");
    let nonce = utils::from_hex(nonce_hex).expect("Invalid nonce hex");

    let decrypted = crypto::decrypt(&shared_secret, &ciphertext, &nonce);
    String::from_utf8(decrypted).expect("Invalid UTF-8")
}
