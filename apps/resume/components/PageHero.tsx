import Image from "next/image";
import { publicFileExists } from "@/lib/public-file";
import { coverImage } from "@/site";
import AmbientGlow from "@/components/AmbientGlow";

/**
 * Image banner with the page title bottom-left. Uses `image` if that file
 * exists in /public, otherwise falls back to the site cover image.
 */
export default function PageHero({
  title,
  kicker,
  image,
}: {
  title: string;
  kicker?: string;
  image?: { src: string; alt: string; position?: string };
}) {
  const useOwn = !!image && publicFileExists(image.src);
  const src = useOwn ? image.src : coverImage.src;
  const objectPosition = useOwn ? (image.position ?? "center") : coverImage.position;

  return (
    <>
    <section
      id="top"
      className="relative flex h-[58svh] min-h-[22rem] items-end overflow-hidden bg-black text-white"
    >
      <Image
        src={src}
        alt={useOwn ? image.alt : coverImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 via-50% to-black/10" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 sm:pb-16">
        {kicker ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/75">{kicker}</p>
        ) : null}
        <h1 className="font-display text-5xl font-bold tracking-[-0.03em] sm:text-6xl">{title}</h1>
      </div>
    </section>
    {/* Ambient glow: the banner's colours spread softly into the page below */}
    <AmbientGlow>
      <Image src={src} alt="" fill sizes="160px" className="object-cover" style={{ objectPosition: "50% 100%" }} />
    </AmbientGlow>
    </>
  );
}
