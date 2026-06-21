import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ClientSections from "@/components/ClientSections";
import TopBanner from "@/components/TopBanner";
import ContactForm from "@/components/ContactForm";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    <>
      <CursorGlow />

      {/* Sticky top banner — 36px tall, above navbar */}
      <TopBanner />

      {/* Navbar sits below banner (top: 36px via its own style) */}
      <Navbar />

      <main style={{ paddingTop: "36px" }}>
        <HeroSection />
        <ClientSections />

        {/* Contact — form + info side by side */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
        </div>
        <div className="grid md:grid-cols-2 items-start">
          <ContactForm />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
