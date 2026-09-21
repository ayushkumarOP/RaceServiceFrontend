import { useEffect, useRef, useState } from "react";
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
import { getSession, setSessionListener, signOut, type AuthSession } from "./services/auth";
import { ForumList, ForumPlaceholder } from "./components/Forums";
import Profile from "./components/Profile";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState<AuthSession | null>(() => getSession());
  const [sessionExpired, setSessionExpired] = useState(false);
  const userSigningOut = useRef(false);
  const [isGuest, setIsGuest] = useState(false);
  const isEmptyState = path === "/empty";
  const isLogin = path === "/";
  const isHome = path === "/home";
  const isForumList = path === "/forums";
  const isProfile = path === "/profile";
  const forumDetailMatch = path.match(/^\/forums\/([^/]+)$/);
  const forumId = forumDetailMatch?.[1] ?? null;
  const isForumDetail = Boolean(forumId);
  const isNotFound = !isLogin && !isHome && !isEmptyState && !isForumList && !isForumDetail && !isProfile;
  const requiresSession = isHome || isForumList || isForumDetail || isProfile;
  const requiresAuthenticatedForum = isForumList || isForumDetail;
  const needsSignIn = requiresSession && !session && (!isGuest || requiresAuthenticatedForum);

  const navigate = (destination: string) => {
    window.history.pushState({}, "", destination);
    setPath(destination);
  };

  useEffect(() => {
    setSessionListener((nextSession) => { if (!nextSession && !userSigningOut.current) setSessionExpired(true); setSession(nextSession); });
    return () => setSessionListener(null);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (needsSignIn) {
      window.history.replaceState({}, "", "/");
    }
  }, [needsSignIn]);

  useEffect(() => {
    document.title = isNotFound
      ? "Page Not Found | F1 Hub"
      : isEmptyState
        ? "No Results Yet | F1 Hub"
        : isLogin || needsSignIn
          ? "Sign in | F1 Hub"
          : isForumList
            ? "Forums | F1 Hub"
            : isForumDetail
              ? "Forum | F1 Hub"
              : "F1 Hub | Live Formula 1 Standings, Schedule & Telemetry";
  }, [isEmptyState, isForumDetail, isForumList, isLogin, isNotFound, needsSignIn]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (isEmptyState) {
    return <EmptyState />;
  }

  if (isLogin || needsSignIn) {
    return <><Login onAuthenticated={(nextSession) => { setSession(nextSession); setSessionExpired(false); setIsGuest(false); navigate("/home"); }} onSkip={() => { setIsGuest(true); navigate("/home"); }} />{sessionExpired && <p className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-amber-300/30 bg-[#1a1a26] px-4 py-3 text-sm text-amber-100 shadow-xl">Your session expired. Please sign in again.</p>}</>;
  }

  if (!session && !isGuest) {
    return <Login onAuthenticated={(nextSession) => { setSession(nextSession); setSessionExpired(false); navigate("/home"); }} onSkip={() => { setIsGuest(true); navigate("/home"); }} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white font-sans">
      <Navbar session={session} onSignIn={() => { setIsGuest(false); navigate("/"); }} onProfile={() => navigate("/profile")} onSignOut={() => { userSigningOut.current = true; void signOut().finally(() => { userSigningOut.current = false; }); setSession(null); setSessionExpired(false); setIsGuest(false); navigate("/"); }} />
      {isProfile ? <Profile /> : isForumList ? <ForumList onOpenForum={(nextForumId) => navigate(`/forums/${nextForumId}`)} /> : isForumDetail && forumId ? <ForumPlaceholder forumId={forumId} onBack={() => navigate("/forums")} /> : <><main>
        <Hero />
        {FEATURES.map((feature, index) => (
          <FeatureSection key={feature.id} feature={feature} index={index} />
        ))}
        <SupportSection />
        <CtaBand />
      </main>
      <Footer /></>}
    </div>
  );
}

export default App;
