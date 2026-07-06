/**
 * Certaines coordonnées de content/site.json sont encore des placeholders
 * « [TÉLÉPHONE : à renseigner] ». Tant qu'elles ne sont pas remplies, on ne
 * les affiche pas sur le site public (mauvais pour l'utilisateur et le SEO).
 */
export function isPlaceholder(value?: string | null): boolean {
  return !value || value.trim().startsWith('[');
}
