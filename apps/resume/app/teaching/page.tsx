import type { Metadata } from "next";
import { teaching, teachingSkills, teachingTraining } from "@anoop/content";
import PageHero from "@/components/PageHero";
import { ButtonLink, Label, SectionHeading } from "@/components/ui";
import { pageBanners } from "@/site";

export const metadata: Metadata = { title: "Teaching Experience" };

const column = "mx-auto max-w-3xl px-5 sm:px-8";

// "5 TA appointments across 4 courses" — counted from the content so it stays accurate
const courseCodes = new Set(teaching.map((t) => t.course.split(" — ")[0]));

export default function TeachingPage() {
  return (
    <>
      <PageHero title="Teaching" kicker="Teaching Assistant · UC Santa Cruz" image={pageBanners.teaching} />

      <section aria-labelledby="teaching-title" className={`${column} py-20`}>
        <SectionHeading id="teaching-title">Teaching Experience</SectionHeading>

        {teaching.length === 0 ? (
          <p className="mt-10 border-y border-rule py-10 text-center text-muted">Details coming soon.</p>
        ) : (
          <>
            <p className="mt-5 text-muted">
              {teaching.length} TA appointments across {courseCodes.size} courses in engineering management,
              physics, and astronomy — from lab instruction to industry-facing seminars.
            </p>

            <div className="mt-12 space-y-16">
              {teaching.map((t) => (
                <article key={`${t.course}-${t.term}`} className="border-t border-rule pt-8">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-xl font-bold tracking-tight">{t.course}</h3>
                    {t.current && (
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">Current</span>
                    )}
                  </div>
                  <p className="mt-1 italic text-faint">
                    {t.role} — {t.department ? `${t.department}, ` : null}
                    {t.institution} · {t.term}
                  </p>
                  {t.instructor || t.scope ? (
                    <p className="mt-2 text-sm text-faint">
                      {[t.instructor ? `Instructor: ${t.instructor}` : null, t.scope].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  <ul className="mt-6 space-y-3.5">
                    {t.highlights.map((h) => (
                      <li key={h} className="flex gap-4 leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {t.topics?.length ? (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {t.topics.map((topic) => (
                        <li key={topic} className="border border-rule px-2.5 py-1 text-sm text-muted">{topic}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Training & skills */}
      <section aria-labelledby="teaching-skills-title" className="border-t border-rule">
        <div className={`${column} py-20`}>
          <SectionHeading id="teaching-skills-title">Training &amp; Skills</SectionHeading>
          <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
            <div className="border-t border-rule py-6">
              <Label>TA Training</Label>
              <ul className="mt-3 space-y-1 leading-relaxed text-muted">
                {teachingTraining.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-rule py-6">
              <Label>Teaching &amp; Mentoring</Label>
              <p className="mt-3 leading-relaxed text-muted">{teachingSkills.join(", ")}</p>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/experience">Work Experience</ButtonLink>
            <ButtonLink href="/resume">View Resume</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
