"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Container } from "@/components/ui/container";
import { FadeInView } from "@/components/animations/fade-in-view";
import { GraduationCapHero } from "@/components/3d/graduation-cap-hero";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

const heroStats = [
  { value: "30K+", labelKey: "students" as const },
  { value: "15", labelKey: "faculties" as const },
  { value: "200+", labelKey: "years" as const },
  { value: "500+", labelKey: "research" as const },
];

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero" aria-hidden="true" />
      <div className="absolute inset-0 millimetric-paper opacity-70" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 animate-pulse-glow rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 animate-pulse-glow rounded-full bg-accent-cyan/15 blur-3xl" style={{ animationDelay: "2s" }} aria-hidden="true" />

      <Container className="relative z-10 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeInView delay={0.1}>
              <Badge variant="accent" className="mb-6">
                {t("badge")}
              </Badge>
            </FadeInView>

            <FadeInView delay={0.2}>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {t("title")}{" "}
                <span className="text-gradient">{t("titleHighlight")}</span>
              </h1>
            </FadeInView>

            <FadeInView delay={0.3}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
                {t("subtitle")}
              </p>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div className="mt-8 flex flex-nowrap items-center gap-2 sm:gap-3">
                <Link
                  href="/centre-universitar/bucuresti"
                  className={cn(
                    buttonVariants({ variant: "primary", size: "sm" }),
                    "shrink px-3 text-xs sm:px-4 sm:text-sm",
                  )}
                >
                  {t("ctaBucharest")}
                </Link>
                <Link
                  href="/centre-universitar/pitesti"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "shrink px-3 text-xs text-white hover:text-white sm:px-4 sm:text-sm",
                  )}
                >
                  {t("ctaPitesti")}
                </Link>
              </div>
            </FadeInView>

            <FadeInView delay={0.5}>
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {heroStats.map((stat) => (
                  <GlassCard key={stat.labelKey} padding="sm" className="text-center">
                    <p className="text-2xl font-black text-white md:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      {t(`stats.${stat.labelKey}`)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </FadeInView>
          </div>

          <FadeInView delay={0.3} direction="left">
            <GraduationCapHero />
          </FadeInView>
        </div>
      </Container>
    </section>
  );
}
