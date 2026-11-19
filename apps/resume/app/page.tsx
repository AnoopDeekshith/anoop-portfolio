import { profile, focusAreas } from "@anoop/content";
import Photo from "@/components/Photo";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import FadeWords from "@/components/FadeWords";
import { ButtonLink, SectionHeading, pad } from "@/components/ui";
import { aboutPhotos, heroVideo } from "@/site";

export default function Home() {
  // "Anoop Deekshith" / "Ravikumar" — the surname gets its own line
  const words = profile.name.split(" ");
  const nameLines = [words.slice(0, -1).join(" "), words.at(-1)];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      {/* Background is the opening of mainpagevideo.mp4, played by scrolling */}
      <ScrollVideoHero
        frameDir={heroVideo.frameDir}
        frameCount={heroVideo.frameCount}
        focusY={heroVideo.focusY}
      >
        {/* Legibility gradients: top for the menu button, bottom for the name */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-45% to-transparent" />

        <div className={`${pad} relative w-full pb-14 sm:pb-20`}>
          <h1 className="font-display text-[clamp(3rem,9vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            <FadeWords text={nameLines[0] ?? ""} delay={150} step={110} />
            <br />
            <FadeWords text={nameLines[1] ?? ""} delay={150 + 2 * 110} step={110} />
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl"
            style={{ "--d": "700ms" } as React.CSSProperties}
          >
            {profile.tagline}
          </p>
          <p
            className="rise-in mt-4 flex items-center gap-2 text-sm font-medium tracking-wide text-white/70 sm:text-base"
            style={{ "--d": "900ms" } as React.CSSProperties}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {profile.locationLong}
          </p>
        </div>
      </ScrollVideoHero>

      {/* ── About ────────────────────────────────────────── */}
      <section aria-labelledby="about-title" className={`${pad} grid gap-12 py-20 md:grid-cols-2 md:gap-14 md:py-24`}>
        <div className="md:sticky md:top-28 md:self-start md:pt-24">
          <SectionHeading id="about-title">
            {profile.introHeading.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </SectionHeading>
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.75] text-muted">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get in Touch</ButtonLink>
            <ButtonLink href={profile.resumePath} external>Resume (PDF)</ButtonLink>
          </div>
        </div>

        <div className="space-y-8">
          {aboutPhotos.map((slot) =>
            Array.isArray(slot) ? (
              // One slot split into equal parts, one below the other
              <div key={slot.map((p) => p.src).join("+")} className="space-y-3">
                {slot.map((photo) => (
                  <Photo key={photo.src} {...photo} sizes="(min-width: 768px) 50vw, 100vw" />
                ))}
              </div>
            ) : (
              <Photo key={slot.src} {...slot} sizes="(min-width: 768px) 50vw, 100vw" />
            )
          )}
        </div>
      </section>

      {/* ── What I Do ────────────────────────────────────── */}
      <section aria-labelledby="focus-title" className="border-t border-rule">
        <div className={`${pad} py-12`}>
          <SectionHeading id="focus-title">What I Do</SectionHeading>
        </div>
        <div className="border-t border-rule">
          <ol className={`${pad} grid sm:grid-cols-2 lg:grid-cols-3`}>
            {focusAreas.map((area, i) => (
              <li
                key={area.title}
                className={`border-b border-rule py-9 sm:px-6 ${i % 2 ? "sm:border-l" : ""} ${
                  i % 3 ? "lg:border-l" : "lg:border-l-0"
                }`}
              >
                <span className="text-xs font-bold tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-bold">{area.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-faint">{area.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
