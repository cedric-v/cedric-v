const textEncoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function createConfirmationToken(payload, secret) {
  if (!secret) throw new Error('NEWSLETTER_CONFIRM_SECRET_MISSING');
  const encodedPayload = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await signingKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(encodedPayload));
  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function readConfirmationToken(token, secret, maxAgeMs) {
  if (!secret || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, encodedSignature] = parts;
  try {
    const key = await signingKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC', key, fromBase64Url(encodedSignature), textEncoder.encode(encodedPayload),
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload)));
    if (!payload.created_at || Date.now() - Number(payload.created_at) > maxAgeMs) return null;
    return payload;
  } catch {
    return null;
  }
}
