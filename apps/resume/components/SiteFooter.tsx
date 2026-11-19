import Link from "next/link";
import { profile } from "@anoop/content";
import SocialLinks from "@/components/SocialLinks";
import { nav } from "@/site";

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-rule py-10 text-center">
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-y-2 px-5 text-sm">
        {nav.map((item, i) => (
          <span key={item.href} className="flex items-center">
            {i > 0 && <span aria-hidden="true" className="px-2.5 text-rule">|</span>}
            <Link href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
      <p className="mt-4 text-xs text-faint">
        © {new Date().getFullYear()} — {profile.name}
      </p>
      <div className="mt-4 flex justify-center gap-4 text-muted">
        <SocialLinks />
      </div>
    </footer>
  );
}
