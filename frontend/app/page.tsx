import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import AudienceStrip from "@/components/landing/AudienceStrip";
import ResearchSection from "@/components/landing/ResearchSection";
import InterfaceSection from "@/components/landing/InterfaceSection";
import DataSources from "@/components/landing/DataSources";
import TrustSection from "@/components/landing/TrustSection";
import EvidenceSection from "@/components/landing/EvidenceSection";
import MethodologySection from "@/components/landing/MethodologySection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { figtree, fraunces } from "@/lib/fonts";
import "@/styles/editorial-theme.css";

export default function LandingPage() {
  return (
    <div className={`editorial-theme ${fraunces.variable} ${figtree.variable}`}>
      <NavBar />
      <Hero />
      <AudienceStrip />
      <ResearchSection />
      <InterfaceSection />
      <DataSources />
      <TrustSection />
      <EvidenceSection />
      <MethodologySection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
