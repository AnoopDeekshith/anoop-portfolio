import { profile } from "@anoop/content";
import { linkIcons } from "@/components/Icons";

export default function SocialLinks({ size = 18 }: { size?: number }) {
  return (
    <>
      {profile.links.map((l) => {
        const Icon = linkIcons[l.label];
        return Icon ? (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            className="transition-colors hover:text-fg"
          >
            <Icon size={size} />
          </a>
        ) : null;
      })}
    </>
  );
}
