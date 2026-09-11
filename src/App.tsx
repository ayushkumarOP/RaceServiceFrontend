import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import { FEATURES } from "./components/features";
import EmptyState from "./components/EmptyState";
import NotFound from "./components/NotFound";
import SupportSection from "./components/SupportSection";
import Login from "./components/Login";
import { clearSession, getStoredSession, saveSession, type AuthSession } from "./services/auth";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [isGuest, setIsGuest] = useState(false);
  const isEmptyState = path === "/empty";
  const isLogin = path === "/";
  const isHome = path === "/home";
  const isNotFound = !isLogin && !isHome && !isEmptyState;

  const navigate = (destination: string) => {
    window.history.pushState({}, "", destination);
    setPath(destination);
  };

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isHome && !session && !isGuest) {
      window.history.replaceState({}, "", "/");
      setPath("/");
    }
  }, [isGuest, isHome, session]);

  useEffect(() => {
    document.title = isNotFound
      ? "Page Not Found | F1 Hub"
      : isEmptyState
        ? "No Results Yet | F1 Hub"
        : isLogin
          ? "Sign in | F1 Hub"
          : "F1 Hub | Live Formula 1 Standings, Schedule & Telemetry";
  }, [isEmptyState, isLogin, isNotFound]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (isEmptyState) {
    return <EmptyState />;
  }

  if (isLogin) {
    return <Login onAuthenticated={(nextSession) => { saveSession(nextSession); setSession(nextSession); setIsGuest(false); navigate("/home"); }} onSkip={() => { setIsGuest(true); navigate("/home"); }} />;
  }

  if (!session && !isGuest) {
    return <Login onAuthenticated={(nextSession) => { saveSession(nextSession); setSession(nextSession); navigate("/home"); }} onSkip={() => { setIsGuest(true); navigate("/home"); }} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white font-sans">
      <Navbar session={session} onSignIn={() => { setIsGuest(false); navigate("/"); }} onSignOut={() => { clearSession(); setSession(null); setIsGuest(false); navigate("/"); }} />
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
