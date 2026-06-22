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
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1E2A3A]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#1E2A3A]" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1E2A3A]" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 items-start">
          <ContactForm />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
