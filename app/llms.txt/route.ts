import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { getSite, getExcursions, getDestinations } from '@/lib/content';

/**
 * llms.txt — résumé structuré du site à destination des agents et moteurs IA
 * (ChatGPT, Claude, Perplexity, Gemini…), suivant la convention llmstxt.org.
 * Généré dynamiquement pour rester synchronisé avec le contenu réel.
 */
export const revalidate = 3600;

function esc(s: string): string {
  return s.replace(/\r?\n/g, ' ').trim();
}

export async function GET() {
  const [site, excursions, destinations] = await Promise.all([
    getSite(),
    getExcursions(),
    getDestinations(),
  ]);

  const agency = site.agency ?? site.guide;

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push('');
  lines.push(`> ${esc(site.description)}`);
  lines.push('');
  if (agency?.bio) {
    lines.push(esc(agency.bio));
    lines.push('');
  }
  lines.push(
    'Opérateur touristique marocain agréé, spécialisé dans les circuits privés sur mesure ' +
      'à travers le Maroc : désert du Sahara (Merzouga), villes impériales (Marrakech, Fès, ' +
      'Meknès, Rabat), Chefchaouen, Essaouira, Aït Ben Haddou. Site disponible en français, ' +
      'anglais et espagnol.'
  );
  lines.push('');

  lines.push('## Pages principales');
  lines.push('');
  lines.push(`- [Accueil](${SITE_URL}/)`);
  lines.push(`- [Tous les circuits](${SITE_URL}/circuits) : ${excursions.length} circuits privés au Maroc, de 1 à 10 jours`);
  lines.push(`- [Toutes les destinations](${SITE_URL}/destinations) : ${destinations.length} destinations phares du Maroc`);
  lines.push(`- [À propos](${SITE_URL}/a-propos) : présentation de l'agence`);
  lines.push(`- [Avis clients](${SITE_URL}/avis)`);
  lines.push(`- [FAQ](${SITE_URL}/faq) : réservation, prix, désert, hébergements, transport`);
  lines.push(`- [Contact & devis](${SITE_URL}/contact) : devis gratuit sous 24h`);
  lines.push(`- [Blog](${SITE_URL}/blog)`);
  lines.push('');

  lines.push('## Circuits');
  lines.push('');
  for (const exc of excursions) {
    const price = exc.priceFrom ? ` — ${esc(exc.priceFrom)}` : '';
    lines.push(`- [${esc(exc.name)}](${SITE_URL}/circuits/${exc.slug})${price}`);
  }
  lines.push('');

  lines.push('## Destinations');
  lines.push('');
  for (const dest of destinations) {
    lines.push(`- [${esc(dest.name)}](${SITE_URL}/destinations/${dest.slug}) — ${esc(dest.seo.description)}`);
  }
  lines.push('');

  lines.push('## Langues disponibles');
  lines.push('');
  lines.push(`- Français (par défaut) : ${SITE_URL}/`);
  lines.push(`- English : ${SITE_URL}/en`);
  lines.push(`- Español : ${SITE_URL}/es`);
  lines.push('');

  lines.push('## Informations pratiques');
  lines.push('');
  lines.push(`- Contact : ${site.contact.email !== '[EMAIL : à renseigner]' ? site.contact.email : 'voir page contact'}`);
  lines.push(`- Adresse : ${esc(site.contact.address)}`);
  lines.push(`- Langues de service : ${site.languages.join(', ')}`);
  lines.push(`- ${esc(site.pricingNote)}`);
  lines.push('');
  lines.push(`Sitemap complet : ${SITE_URL}/sitemap.xml`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
