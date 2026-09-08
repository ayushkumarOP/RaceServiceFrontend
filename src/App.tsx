import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import { FEATURES } from "./components/features";
import EmptyState from "./components/EmptyState";
import NotFound from "./components/NotFound";
import SupportSection from "./components/SupportSection";

function App() {
  const path = window.location.pathname;
  const isEmptyState = path === "/empty";
  const isNotFound = path !== "/" && !isEmptyState;

  useEffect(() => {
    document.title = isNotFound
      ? "Page Not Found | F1 Hub"
      : isEmptyState
        ? "No Results Yet | F1 Hub"
        : "F1 Hub | Live Formula 1 Standings, Schedule & Telemetry";
  }, [isEmptyState, isNotFound]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (isEmptyState) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white font-sans">
      <Navbar />
      <main>
        <Hero />
        {FEATURES.map((feature, index) => (
          <FeatureSection key={feature.id} feature={feature} index={index} />
        ))}
        <SupportSection />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}

export default App;
