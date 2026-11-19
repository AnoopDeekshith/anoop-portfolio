import type { Metadata } from "next";
import { publishedArticles } from "@anoop/content";

export const metadata: Metadata = { title: "Blogs" };

/**
 * Lists articles marked `published: true` in packages/content/src/writing.ts.
 * Until there are any, shows a "yet to be updated" note.
 */
export default function BlogsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Blogs</h1>

      {publishedArticles.length === 0 ? (
        <div className="mt-12 border-y border-rule py-14 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.14em] text-accent">
            Yet to be updated
          </span>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
            I&apos;ll be adding write-ups on RTL design, FPGAs, and AI hardware here gradually.
            Check back soon.
          </p>
        </div>
      ) : (
        <ul className="mt-12 divide-y divide-rule border-y border-rule">
          {publishedArticles.map((a) => (
            <li key={a.href} className="py-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{a.tag}</p>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-display text-xl font-bold tracking-tight transition-colors hover:text-accent"
              >
                {a.title}
              </a>
              <p className="mt-2 leading-relaxed text-muted">{a.excerpt}</p>
              <p className="mt-3 text-sm text-faint">
                {a.date}
                {a.readTime ? ` · ${a.readTime} read` : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
