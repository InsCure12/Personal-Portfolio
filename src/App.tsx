import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./components/Home.tsx";
import LineWaves from "./components/LineWaves.jsx";
import GradualBlur from "./components/GradualBlur.jsx";
import "./App.css";

const About = lazy(() => import("./components/About.tsx"));
const Skills = lazy(() => import("./components/Skills.tsx"));
const Resume = lazy(() => import("./components/Resume.tsx"));
const Portfolio = lazy(() => import("./components/Portfolio.tsx"));
const Testimonials = lazy(() => import("./components/Testimonials.tsx"));
const Contact = lazy(() => import("./components/Contact.tsx"));

function App() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      <motion.div
        style={{ height: "100%", overflowY: "auto", padding: "0 1rem" }}
        className="main-scroll-container"
      >
        {!prefersReducedMotion && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: isMobile ? "none" : "auto",
            }}
          >
            <LineWaves
              speed={0.3}
              innerLineCount={32}
              outerLineCount={36}
              warpIntensity={1}
              rotation={-45}
              edgeFadeWidth={0}
              colorCycleSpeed={1}
              brightness={0.1}
              color1="#00d4ff"
              color2="#00ffaa"
              color3="#a855f7"
              enableMouseInteraction={!isMobile}
              mouseInfluence={2}
            />
          </div>
        )}

        <Header />

        <main className="relative" id="main-content">
          <section id="home">
            <Home />
          </section>

          <Suspense fallback={<div className="min-h-screen" />}>
            <section id="about">
              <About />
            </section>

            <section id="skills">
              <Skills />
            </section>

            <section id="portfolio">
              <Portfolio />
            </section>

            <section id="resume">
              <Resume />
            </section>

            <section id="testimonials">
              <Testimonials />
            </section>

            <section id="contact">
              <Contact />
            </section>
          </Suspense>
          <Footer />
        </main>
      </motion.div>
      <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </section>
  );
}

export default App;
