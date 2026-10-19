import crypto from 'crypto';

const CUSTOMER_AUTH_SECRET = process.env.CUSTOMER_AUTH_SECRET || 'prakriti_customer_secret_key_2026';
const CUSTOMER_COOKIE_NAME = 'customer_session';

export function signCustomerToken(data) {
  const payload = JSON.stringify({
    ...data,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days session
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', CUSTOMER_AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifyCustomerToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', CUSTOMER_AUTH_SECRET)
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

export function getCustomerFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies[CUSTOMER_COOKIE_NAME];
  return verifyCustomerToken(token);
}

export { CUSTOMER_COOKIE_NAME };
