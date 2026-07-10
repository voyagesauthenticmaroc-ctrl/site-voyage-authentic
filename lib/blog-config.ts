export const BLOG_CATEGORIES = ['Tous', 'Destinations', 'Conseils pratiques', 'Itinéraires', 'Comparatifs', 'Culture'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
