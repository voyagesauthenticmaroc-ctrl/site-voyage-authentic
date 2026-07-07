import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Fraunces, Inter, Mr_Dafoe } from 'next/font/google';
import '../globals.css';
import { routing } from '@/i18n/routing';
import { SITE_URL, SITE_NAME, OG_LOCALES } from '@/lib/seo';
import { NavBar } from '@/components/NavBar';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CommandPalette } from '@/components/CommandPalette';
import { getSite } from '@/lib/content';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: false,
});

const mrDafoe = Mr_Dafoe({
  variable: '--font-script-src',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: false,
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${t('siteTagline')}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: t('home.description'),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, telephone: false },
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[locale] ?? 'fr_FR',
      url: SITE_URL,
      siteName: SITE_NAME,
    },
    twitter: { card: 'summary_large_image' },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [site, t] = await Promise.all([
    getSite(),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${mrDafoe.variable}`}>
      <body className="antialiased">
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3HQF8YS1ZV" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              try {
                if (localStorage.getItem('cookie-consent') === 'granted') {
                  gtag('consent', 'update', {
                    analytics_storage: 'granted',
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                  });
                }
              } catch (e) {}
              gtag('js', new Date());
              gtag('config', 'G-3HQF8YS1ZV');
            `,
          }}
        />
        <NextIntlClientProvider>
          <SmoothScroll />
          <ScrollProgress />
          <CommandPalette />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-ink focus:rounded focus:font-medium"
          >
            {t('skipToContent')}
          </a>
          <NavBar
            agencyName={site.name}
            phoneDisplay={site.contact.phone}
            phoneRaw={site.contact.phoneRaw}
            whatsapp={site.contact.whatsapp}
          />
          <WhatsAppButton whatsapp={site.contact.whatsapp} />
          {children}
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
