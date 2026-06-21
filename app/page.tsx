import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ClientSections from "@/components/ClientSections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ClientSections />

        {/* Contact */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
        </div>
        <ContactSection />
      </main>
    </>
  );
}
