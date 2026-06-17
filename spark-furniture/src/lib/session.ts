import crypto from 'crypto';
import { cookies } from 'next/headers';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ADMIN_PASSWORD || 'default_fallback_secret_key_long_enough_32';

// Deriving keys from password/secret
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
const iv = crypto.createHash('md5').update(SECRET_KEY).digest(); // 16 bytes IV

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(text: string): string | null {
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
}

export async function setSession() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionData = JSON.stringify({ admin: true, expires: expiresAt.toISOString() });
  const encryptedSession = encrypt(sessionData);
  
  const cookieStore = await cookies();
  cookieStore.set('admin_session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  if (!sessionCookie) return null;
  
  const decrypted = decrypt(sessionCookie);
  if (!decrypted) return null;
  
  try {
    const data = JSON.parse(decrypted);
    const expires = new Date(data.expires);
    if (expires < new Date()) {
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
