import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { profile } from "@anoop/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SocialLinks from "@/components/SocialLinks";
import { themeInitScript } from "@/lib/theme";
import { coverImage } from "@/site";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anoopdeekshith.com"),
  title: {
    default: `${profile.name} — ${profile.roles.join(", ")}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: "profile",
    images: [coverImage.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={grotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg font-sans text-fg">
        <SiteHeader name={profile.name} resumePath={profile.resumePath} social={<SocialLinks />} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
