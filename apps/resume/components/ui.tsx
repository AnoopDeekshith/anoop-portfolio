import Link from "next/link";

export const pad = "mx-auto max-w-6xl px-5 sm:px-8";

const outline =
  "inline-block border border-fg px-5 py-3 text-sm font-medium transition-colors hover:bg-fg hover:text-bg";

export function ButtonLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={outline}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={outline}>
      {children}
    </Link>
  );
}

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
      {children}
    </h2>
  );
}

/** Small uppercase label used above lists (e.g. "Tools", "Education") */
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-fg">{children}</h3>
  );
}
