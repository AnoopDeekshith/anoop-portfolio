import type { Metadata } from "next";
import { profile, experience, education, skills, featuredProjects, publications, teaching } from "@anoop/content";
import { ButtonLink, Label } from "@/components/ui";

export const metadata: Metadata = { title: "Resume" };

function Row({
  title,
  sub,
  date,
  notes,
}: {
  title: string;
  sub?: string;
  date?: string;
  notes?: string[];
}) {
  return (
    <li className="flex flex-col justify-between gap-x-6 gap-y-0.5 border-b border-rule py-3.5 sm:flex-row sm:items-baseline">
      <div>
        <p className="font-bold">{title}</p>
        {sub ? <p className="text-sm text-faint">{sub}</p> : null}
        {notes?.map((n) => (
          <p key={n} className="mt-1 text-sm text-faint">{n}</p>
        ))}
      </div>
      {date ? <p className="shrink-0 text-sm tabular-nums text-faint">{date}</p> : null}
    </li>
  );
}

const withPlace = (name: string, place?: string) => (place ? `${name} · ${place}` : name);

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Resume</h1>
        <p className="mt-4 text-muted">
          {profile.location}
          {profile.availability ? ` · ${profile.availability}` : null}
        </p>
        <div className="no-print mt-8 flex justify-center">
          <ButtonLink href={profile.resumePath} external>Download PDF</ButtonLink>
        </div>
      </header>

      <div className="mt-16 space-y-14">
        <section>
          <Label>Education</Label>
          <ul className="mt-3 border-t border-rule">
            {education.map((e) => (
              <Row key={e.school} title={e.degree} sub={withPlace(e.school, e.location)} date={e.period} notes={e.notes} />
            ))}
          </ul>
        </section>

        <section>
          <Label>Work Experience</Label>
          <ul className="mt-3 border-t border-rule">
            {experience.map((j) => (
              <Row key={`${j.company}-${j.role}`} title={j.role} sub={withPlace(j.company, j.location)} date={j.period} />
            ))}
          </ul>
        </section>

        {teaching.length > 0 && (
          <section>
            <Label>Teaching</Label>
            <ul className="mt-3 border-t border-rule">
              {teaching.map((t) => (
                <Row key={`${t.course}-${t.term}`} title={t.course} sub={`${t.role} · UC Santa Cruz`} date={t.term} />
              ))}
            </ul>
          </section>
        )}

        <section>
          <Label>Publications &amp; Research</Label>
          <ul className="mt-3 border-t border-rule">
            {publications.map((p) => (
              <Row key={p.title} title={p.title} sub={`${p.venue} — ${p.status}`} />
            ))}
          </ul>
        </section>

        <section>
          <Label>Projects</Label>
          <ul className="mt-3 border-t border-rule">
            {featuredProjects.map((p) => (
              <Row key={p.slug} title={p.title} sub={p.subtitle} date={p.period} />
            ))}
          </ul>
        </section>

        <section>
          <Label>Skills</Label>
          <ul className="mt-3 border-t border-rule">
            {skills.map((g) => (
              <li key={g.category} className="grid gap-x-6 gap-y-0.5 border-b border-rule py-3.5 sm:grid-cols-[12rem_1fr]">
                <p className="font-bold">{g.category}</p>
                <p className="text-muted">{g.items.join(", ")}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
