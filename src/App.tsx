import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import { FEATURES } from "./components/features";

function App() {
  return (
    <div className="min-h-screen bg-[#0c0c14] text-white font-sans">
      <Navbar />
      <main>
        <Hero />
        {FEATURES.map((feature, index) => (
          <FeatureSection key={feature.id} feature={feature} index={index} />
        ))}
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}

export default App;