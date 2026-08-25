const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendResendEmail(env, { to, subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    throw new Error('RESEND_CONFIGURATION_MISSING');
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const responseText = await response.text();
  let data = {};
  try { data = responseText ? JSON.parse(responseText) : {}; } catch { data = { message: responseText }; }
  if (!response.ok) {
    const error = new Error(data.message || data.name || `Resend HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function sendContactNotification(env, { name, email, company, topic, message, locale }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    throw new Error('RESEND_CONFIGURATION_MISSING');
  }

  const safe = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
  const topicLabels = locale === 'en' ? {
    independent: 'Independent / entrepreneur',
    sme: 'SME',
    question: 'General question',
  } : {
    independant: 'Indépendant·e / entrepreneur·e',
    pme: 'TPE / PME',
    question: 'Question générale',
  };
  const topicLabel = topicLabels[topic] || (locale === 'en' ? 'General question' : 'Question générale');
  const subject = locale === 'en' ? `New contact request — ${name}` : `Nouveau message de contact — ${name}`;
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a"><h1>${safe(subject)}</h1><p><strong>Name:</strong> ${safe(name)}<br><strong>Email:</strong> ${safe(email)}<br><strong>Business:</strong> ${safe(company) || '—'}<br><strong>Situation:</strong> ${safe(topicLabel)}</p><hr><p style="white-space:pre-wrap">${safe(message)}</p></body></html>`;
  const text = `${subject}\n\nNom: ${name}\nEmail: ${email}\nActivité: ${company || '—'}\nBesoin: ${topicLabel}\n\n${message}`;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject,
      html,
      text,
    }),
  });
  const responseText = await response.text();
  let data = {};
  try { data = responseText ? JSON.parse(responseText) : {}; } catch { data = { message: responseText }; }
  if (!response.ok) {
    const error = new Error(data.message || data.name || `Resend HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}
