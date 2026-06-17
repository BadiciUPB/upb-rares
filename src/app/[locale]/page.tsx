import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { HomeExperience } from "@/components/home/HomeExperience";
import { getContentService } from "@/services/content";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
      siteName: siteConfig.shortName,
      locale: locale === "ro" ? "ro_RO" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`]),
      ),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contentService = getContentService();
  const [announcements, events] = await Promise.all([
    contentService.getAnnouncements(),
    contentService.getEvents({ limit: 6 }),
  ]);

  return (
    <main id="main-content">
      <HomeExperience events={events} announcements={announcements} />
    </main>
  );
}
