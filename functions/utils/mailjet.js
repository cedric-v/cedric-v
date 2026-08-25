const API_BASE = 'https://api.mailjet.com/v3/REST';

function authHeader(env) {
  if (!env.MAILJET_API_KEY || !env.MAILJET_API_SECRET) {
    throw new Error('MAILJET_CONFIGURATION_MISSING');
  }
  return `Basic ${btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_API_SECRET}`)}`;
}

export async function mailjetRequest(env, path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: authHeader(env),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) {
    const error = new Error(data.ErrorMessage || data.message || `Mailjet HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function ensureContact(env, email, name = '') {
  try {
    await mailjetRequest(env, '/contact', {
      method: 'POST',
      body: JSON.stringify({ Email: email, ...(name ? { Name: name } : {}) }),
    });
  } catch (error) {
    // Mailjet returns 400 when the contact already exists. It is safe to continue.
    if (error.status !== 400) throw error;
  }
}

async function getContactId(env, email) {
  const result = await mailjetRequest(env, `/contact/${encodeURIComponent(email)}`, { method: 'GET' });
  const id = result.Data?.[0]?.ID;
  if (!id) throw new Error('MAILJET_CONTACT_NOT_FOUND');
  return id;
}

export async function updateContactData(env, email, properties) {
  const contactId = await getContactId(env, email);
  return mailjetRequest(env, `/contactdata/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify({
      Data: Object.entries(properties).map(([Name, Value]) => ({ Name, Value })),
    }),
  });
}

export async function getContactData(env, email) {
  try {
    const contactId = await getContactId(env, email);
    const result = await mailjetRequest(env, `/contactdata/${contactId}`, { method: 'GET' });
    const rows = result.Data?.[0]?.Data || [];
    return Array.isArray(rows)
      ? Object.fromEntries(rows.map((row) => [row.Name, row.Value]))
      : rows;
  } catch (error) {
    if (error.status === 404) return {};
    throw error;
  }
}

export async function addToList(env, email) {
  const listId = Number(env.MAILJET_LIST_ID);
  if (!Number.isInteger(listId) || listId <= 0) throw new Error('MAILJET_CONFIGURATION_MISSING');
  return mailjetRequest(env, '/listrecipient', {
    method: 'POST',
    body: JSON.stringify({ ContactAlt: email, ListID: listId, IsUnsubscribed: false }),
  }).catch((error) => {
    // A repeated confirmation should remain idempotent, but do not hide
    // configuration or permission errors returned with another 400 status.
    if (error.status === 400 && /already|duplicate|exist/i.test(error.message)) return {};
    throw error;
  });
}

export async function sendEmail(env, { to, subject, html, text, replyTo }) {
  if (!env.MAILJET_SENDER_EMAIL || !env.MAILJET_SENDER_NAME) {
    throw new Error('MAILJET_CONFIGURATION_MISSING');
  }
  const message = {
    From: { Email: env.MAILJET_SENDER_EMAIL, Name: env.MAILJET_SENDER_NAME },
    To: [{ Email: to }],
    Subject: subject,
    HTMLPart: html,
    TextPart: text,
  };
  if (replyTo) {
    message.Headers = { 'Reply-To': replyTo };
  }
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: authHeader(env),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Messages: [message] }),
  });
  const textResponse = await response.text();
  let data = {};
  try { data = textResponse ? JSON.parse(textResponse) : {}; } catch { data = { message: textResponse }; }
  if (!response.ok) {
    const error = new Error(data.ErrorMessage || data.message || `Mailjet HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
}
