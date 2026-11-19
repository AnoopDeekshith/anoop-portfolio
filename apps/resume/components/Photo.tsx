import Image from "next/image";
import { publicFileExists } from "@/lib/public-file";

/**
 * Fixed-aspect image frame. Renders the image if it exists in /public,
 * otherwise a placeholder that says where to put the file.
 */
export default function Photo({
  src,
  alt,
  aspect,
  sizes,
  caption,
  position,
}: {
  src: string;
  alt: string;
  aspect: string;
  sizes: string;
  caption?: string;
  position?: string;
}) {
  const exists = publicFileExists(src);

  return (
    <figure>
      <div className="relative w-full overflow-hidden bg-placeholder" style={{ aspectRatio: aspect }}>
        {exists ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        ) : (
          <div className="placeholder-stripes absolute inset-0 flex items-center justify-center p-6 text-center">
            <span className="text-xs leading-relaxed text-faint">
              Add image
              <br />
              <code className="text-muted">public{src}</code>
            </span>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm italic text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
