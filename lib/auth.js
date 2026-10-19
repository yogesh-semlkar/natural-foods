import crypto from 'crypto';

const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'prakriti_super_secret_auth_key_2026';
const COOKIE_NAME = 'admin_session';

export const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@prakriti.com',
  username: 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'Store Founder'
};

// Sign a session token
export function signToken(data) {
  const payload = JSON.stringify({
    ...data,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

// Verify a session token
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Check admin from incoming Next.js Request
export function getAdminFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies[COOKIE_NAME];
  return verifyToken(token);
}

export { COOKIE_NAME };
