import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header.tsx";
import Home from "./components/Home.tsx";
import Particles from "./components/Particles.jsx";
import GradualBlur from "./components/GradualBlur.jsx";
import "./App.css";

const About = lazy(() => import("./components/About.tsx"));
const Skills = lazy(() => import("./components/Skills.tsx"));
const Resume = lazy(() => import("./components/Resume.tsx"));
const Portfolio = lazy(() => import("./components/Portfolio.tsx"));

function App() {
  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      <motion.div
        style={{ height: "100%", overflowY: "auto", padding: "0 1rem" }}
        className="main-scroll-container"
      >
        <Particles
          particleColors={["#00d4ff", "#00ffee"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={300}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={false}
          disableRotation={false}
          showLogos={true}
        />

        <Header />

        {/* Single Page Layout */}
        <main className="relative">
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

            <section id="resume">
              <Resume />
            </section>

            <section id="portfolio">
              <Portfolio />
            </section>
          </Suspense>
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
