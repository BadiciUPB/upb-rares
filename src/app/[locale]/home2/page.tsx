import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Home2Experience } from "@/components/home2/home2-experience";
import { getContentService } from "@/services/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Home2 - Circuit Experience | UNST Politehnica București",
  description: "Homepage concept with electronic circuit slideshow interactions.",
};

export default async function Home2Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contentService = getContentService();
  const [events, announcements, stats] = await Promise.all([
    contentService.getEvents({ limit: 6 }),
    contentService.getAnnouncements({ limit: 6 }),
    contentService.getStats(),
  ]);

  return (
    <Home2Experience
      events={events}
      announcements={announcements}
      stats={stats}
    />
  );
}
