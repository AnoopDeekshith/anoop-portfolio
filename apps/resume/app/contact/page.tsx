import type { Metadata } from "next";
import { profile } from "@anoop/content";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import Photo from "@/components/Photo";
import { contactPhoto } from "@/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid min-h-[80svh] max-w-6xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 md:grid-cols-2">
      {/* Photo, heading and text share one column width so they line up */}
      <div className="max-w-md">
        <Photo {...contactPhoto} sizes="(min-width: 640px) 28rem, 100vw" />
        <h1 className="mt-10 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s Work Together
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          I&apos;m looking for roles in RTL design, FPGA, and AI hardware.
          Send a note, or email me directly at{" "}
          <a href={`mailto:${profile.email}`} className="text-fg underline decoration-rule underline-offset-4 hover:decoration-fg">
            {profile.email}
          </a>
          .
        </p>
        <div className="mt-8 flex gap-4 text-muted">
          <SocialLinks size={20} />
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
