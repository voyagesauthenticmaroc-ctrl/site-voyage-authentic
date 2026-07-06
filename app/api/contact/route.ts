import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  nom: string;
  email: string;
  telephone?: string;
  dates?: string;
  personnes?: string;
  typeVoyage?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { nom, email, telephone, dates, personnes, typeVoyage, message } = body;

  if (!nom?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    // Pas encore configuré — on logue et on simule le succès en dev
    console.warn('[contact] RESEND_API_KEY absent — email non envoyé. Configurez .env.local.');
    return NextResponse.json({ ok: true });
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = [
    ['Nom', nom],
    ['Email', email],
    ...(telephone ? [['Téléphone', telephone]] : []),
    ...(dates ? [['Dates prévues', dates]] : []),
    ...(personnes ? [['Nb personnes', personnes]] : []),
    ...(typeVoyage ? [['Type de voyage', typeVoyage]] : []),
  ] as [string, string][];

  const tableHtml = rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#1A3A52">${k}</td><td style="padding:4px 0">${v}</td></tr>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="fr"><body style="font-family:sans-serif;color:#222;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1A3A52;border-bottom:2px solid #C9A961;padding-bottom:8px">Nouvelle demande de devis</h2>
  <table style="margin:16px 0">${tableHtml}</table>
  <h3 style="color:#1A3A52;margin-top:20px">Message</h3>
  <p style="background:#f9f6f0;padding:12px 16px;border-left:3px solid #C9A961;white-space:pre-wrap">${message}</p>
  <p style="font-size:12px;color:#888;margin-top:24px">Envoyé depuis le formulaire de contact du site.</p>
</body></html>`;

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'Formulaire Contact <onboarding@resend.dev>';
  const toEmail = process.env.CONTACT_EMAIL ?? '[EMAIL_CONTACT : à configurer dans .env.local]';

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `Demande de devis — ${nom}`,
    html,
  });

  if (error) {
    console.error('[contact] Erreur Resend:', error);
    return NextResponse.json(
      { error: 'Envoi échoué. Réessayez ou contactez-nous par WhatsApp.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
