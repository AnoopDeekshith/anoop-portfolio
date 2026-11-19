import type { Metadata } from "next";
import { projects, publications } from "@anoop/content";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { Label, SectionHeading } from "@/components/ui";
import { pageBanners, projectImage } from "@/site";

export const metadata: Metadata = { title: "Projects" };

// Featured projects first, then the rest — order otherwise as in the content file
const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="Projects" kicker="RTL · FPGA · AI Hardware · Architecture" image={pageBanners.projects} />

      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        {/* Publications & research */}
        <section aria-labelledby="pubs-title">
          <SectionHeading id="pubs-title">Publications &amp; Research</SectionHeading>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {publications.map((pub) => (
              <li key={pub.title} className="py-4">
                <p className="font-medium">
                  {pub.href ? (
                    <a href={pub.href} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-4 hover:decoration-fg">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </p>
                <p className="mt-1 text-sm text-faint">
                  {pub.venue} — {pub.status}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Index */}
        <nav aria-label="Projects on this page" className="mt-20">
          <Label>Projects on this page</Label>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {ordered.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent">
                  <span>{p.title}</span>
                  <span className="shrink-0 text-sm text-faint">
                    {p.status === "complete" ? "Complete" : "In progress"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Write-ups */}
        <div className="mt-20 space-y-24">
          {ordered.map((p) => {
            const repo = p.links?.find((l) => l.label === "GitHub");
            return (
              <article key={p.slug} id={p.slug} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{p.title}</h2>
                <p className="mt-1 italic text-faint">
                  {p.subtitle}
                  {p.period ? ` — ${p.period}` : null}
                </p>

                <div className="mt-8">
                  <Photo src={projectImage(p.slug)} alt={p.title} aspect="16 / 9" sizes="(min-width: 768px) 48rem, 100vw" />
                </div>

                <p className="mt-8 text-[1.0625rem] leading-[1.75] text-muted">{p.summary}</p>

                {p.metrics.length > 0 && (
                  <blockquote className="mt-8 border-l-4 border-fg py-1 pl-5">
                    <dl className="flex flex-wrap gap-x-8 gap-y-3">
                      {p.metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="text-xs text-faint">{m.label}</dt>
                          <dd className="mt-0.5 text-lg font-bold tabular-nums">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </blockquote>
                )}

                {p.highlights?.length ? (
                  <ul className="mt-8 space-y-3">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-4 leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8">
                  <Label>Tools</Label>
                  <p className="mt-3 text-muted">{p.stack.join(" · ")}</p>
                </div>

                {repo && (
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm font-medium underline decoration-rule underline-offset-4 transition-colors hover:decoration-fg"
                  >
                    → View on GitHub
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
