import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);

const PBKDF_ITER = 120000;
const KEYLEN = 32; // for AES-256
const DIGEST = 'sha512';

export async function generateSalt(bytes = 16) {
  const b = await randomBytes(bytes);
  return b.toString('hex');
}

export async function hashPassword(password: string, salt?: string) {
  const s = salt ?? (await generateSalt());
  const derived = await pbkdf2(password, s, PBKDF_ITER, KEYLEN, DIGEST);
  return `${s}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split('$');
  if (!salt || !hash) return false;
  const derived = await pbkdf2(password, salt, PBKDF_ITER, KEYLEN, DIGEST);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derived);
}

// Symmetric encryption using AES-256-GCM. The 'secret' is used to derive a 32-byte key.
function deriveKey(secret: string) {
  return crypto.createHash('sha256').update(secret).digest();
}

export function encrypt(text: string, secret: string) {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(12); // 96-bit recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  // return iv:tag:cipher
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decrypt(payload: string, secret: string) {
  const buff = Buffer.from(payload, 'base64');
  const iv = buff.slice(0, 12);
  const tag = buff.slice(12, 28); // 16 bytes tag
  const cipherText = buff.slice(28);
  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return plain.toString('utf8');
}
