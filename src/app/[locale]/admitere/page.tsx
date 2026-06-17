import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Admitere 2026 — UNST Politehnica București",
  description: "Alege programul potrivit pentru viitorul tău.",
};

export default async function AdmiterePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="pt-28 pb-20">
      <Container>
        <h1 className="text-4xl font-black text-foreground md:text-5xl">
          Admitere 2026
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Alege programul potrivit pentru viitorul tău. Pagină placeholder —
          conectează aici fluxul oficial de admitere din CMS/API.
        </p>
        <a
          href="https://admitere.upb.ro"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-8 inline-flex")}
        >
          Mergi la admitere.upb.ro
        </a>
      </Container>
    </main>
  );
}
