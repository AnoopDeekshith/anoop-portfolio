import type { Metadata } from "next";
import { experience, education, skills } from "@anoop/content";
import PageHero from "@/components/PageHero";
import { ButtonLink, Label, SectionHeading } from "@/components/ui";
import { pageBanners } from "@/site";

export const metadata: Metadata = { title: "Experience" };

const column = "mx-auto max-w-3xl px-5 sm:px-8";

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        title="Experience"
        kicker="RTL · FPGA · Post-Silicon Validation"
        image={pageBanners.experience}
      />

      {/* Work experience */}
      <section aria-labelledby="work-title" className={`${column} py-20`}>
        <SectionHeading id="work-title">Work Experience</SectionHeading>
        <div className="mt-10 space-y-16">
          {experience.map((job) => (
            <article key={`${job.company}-${job.role}`} className="border-t border-rule pt-8">
              <h3 className="text-xl font-bold tracking-tight">{job.role}</h3>
              <p className="mt-1 italic text-faint">
                {job.company}
                {job.period ? ` — ${job.period}` : null}
                {job.location ? ` · ${job.location}` : null}
              </p>
              <ul className="mt-6 space-y-3.5">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-4 leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {job.tools?.length ? (
                <div className="mt-8">
                  <Label>Tools &amp; Methods</Label>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {job.tools.map((t) => (
                      <li key={t} className="border border-rule px-2.5 py-1 text-sm text-muted">{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* Education */}
      <section aria-labelledby="education-title" className="border-t border-rule">
        <div className={`${column} py-20`}>
          <SectionHeading id="education-title">Education</SectionHeading>
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {education.map((e) => (
              <li key={e.school} className="flex flex-col justify-between gap-x-6 gap-y-1 py-6 sm:flex-row sm:items-baseline">
                <div>
                  <h3 className="font-bold">{e.degree}</h3>
                  <p className="mt-1 text-muted">
                    {e.school}
                    {e.location ? ` · ${e.location}` : null}
                  </p>
                  {e.notes?.map((n) => (
                    <p key={n} className="mt-2 text-sm leading-relaxed text-faint">{n}</p>
                  ))}
                </div>
                <p className="shrink-0 text-sm tabular-nums text-faint">{e.period}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-title" className="border-t border-rule">
        <div className={`${column} py-20`}>
          <SectionHeading id="skills-title">Technical Skills</SectionHeading>
          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.category} className="border-t border-rule py-6">
                <dt className="text-xs font-bold uppercase tracking-wider text-accent">{g.category}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/projects">See Projects</ButtonLink>
            <ButtonLink href="/resume">View Resume</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
