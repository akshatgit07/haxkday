import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import AuditableSection from "@/components/landing/AuditableSection";
import TwoColumnFeatures from "@/components/landing/TwoColumnFeatures";
import CapabilitiesTabs from "@/components/landing/CapabilitiesTabs";
import DataSources from "@/components/landing/DataSources";
import SecuritySection from "@/components/landing/SecuritySection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { caprasimo, figtree } from "@/lib/fonts";
import "@/styles/organic-theme.css";

export default function LandingPage() {
  return (
    <div
      className={`organic-theme ${caprasimo.variable} ${figtree.variable}`}
      style={{ background: "var(--color-bg)", minHeight: "100vh" }}
    >
      <NavBar />
      <Hero />
      <AuditableSection />
      <TwoColumnFeatures />
      <CapabilitiesTabs />
      <DataSources />
      <SecuritySection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
