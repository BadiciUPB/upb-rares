import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Home3Experience } from "@/components/home3/home3-experience";
import { getContentService } from "@/services/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Home3 - Tunnel Experience | UNST Politehnica București",
  description: "Homepage concept with tunnel-video depth transitions and scroll-scrubbed storytelling.",
};

export default async function Home3Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contentService = getContentService();
  const [events, announcements, stats] = await Promise.all([
    contentService.getEvents({ limit: 6 }),
    contentService.getAnnouncements({ limit: 6 }),
    contentService.getStats(),
  ]);

  return (
    <Home3Experience
      events={events}
      announcements={announcements}
      stats={stats}
    />
  );
}
