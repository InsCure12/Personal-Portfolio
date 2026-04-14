# Portfolio Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize Adip Portfolio with visual polish, performance fixes, accessibility, UX improvements, and four new sections (Services, Testimonials, Contact, Footer).

**Architecture:** Surgical fixes to existing components + new section components. Keep current React/Vite/Tailwind stack, dark neon/glassmorphism aesthetic. Replace carousel with filterable grid, add Inter font, fix skills categorization, add accessibility throughout.

**Tech Stack:** React 19, Vite (rolldown), Tailwind CSS 4, Framer Motion, Lucide React, react-icons

---

### Task 1: Typography & Font Setup

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

- [ ] **Step 1: Add Inter font preload and import to index.html**

Add inside `<head>`, before the closing `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
```

- [ ] **Step 2: Update CSS variables and base styles in index.css**

In `src/index.css`, add font-family to the `@layer base` body rule. Update the body selector inside `@layer base`:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-feature-settings: "rlig" 1, "calt" 1;
    overflow-x: hidden !important;
    overflow-y: auto;
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    position: relative;
  }
}
```

- [ ] **Step 3: Add glassmorphism and spacing utility variables to :root**

Add these to the existing `:root` block in `src/index.css`:

```css
/* Glassmorphism tokens */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-blur: 12px;
--radius-card: 12px;
--radius-inner: 8px;

/* Secondary text color */
--text-secondary: #94a3b8;
```

- [ ] **Step 4: Verify dev server loads Inter font**

Run: `cd "/Users/inscure/Documents/Project/Website Portfolio/Adip-Portfolio/Personal-Portfolio" && npm run dev`

Open browser, inspect body element — font-family should show "Inter". Check Network tab for font file loading.

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css
git commit -m "feat: add Inter font and glassmorphism design tokens"
```

---

### Task 2: Remove Unused Dependencies & Clean Bundle

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Uninstall unused Three.js packages**

Run:
```bash
cd "/Users/inscure/Documents/Project/Website Portfolio/Adip-Portfolio/Personal-Portfolio"
npm uninstall three @react-three/fiber @react-three/drei @types/three meshline
```

- [ ] **Step 2: Rename vendor-three chunk to vendor-ogl in vite.config.ts**

In `vite.config.ts`, update the manualChunks function. Replace:

```typescript
if (id.includes("node_modules/ogl")) {
  return "vendor-three";
}
```

With:

```typescript
if (id.includes("node_modules/ogl")) {
  return "vendor-ogl";
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`

Expected: Build succeeds with no errors. No `vendor-three` chunk in output.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.ts
git commit -m "chore: remove unused Three.js dependencies, rename OGL chunk"
```

---

### Task 3: Particles Performance — Mobile & Reduced Motion

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Particles.jsx`

- [ ] **Step 1: Add mobile detection and reduced-motion check in App.tsx**

In `src/App.tsx`, add a hook to detect mobile viewport and pass reduced particle count:

```tsx
import { lazy, Suspense, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
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
          <Particles
            particleColors={["#00d4ff", "#00ffee"]}
            particleCount={isMobile ? 80 : 200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={300}
            moveParticlesOnHover={!isMobile}
            particleHoverFactor={2}
            alphaParticles={false}
            disableRotation={false}
            showLogos={true}
          />
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

            <section id="services">
              {/* Services component added in Task 8 */}
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
              {/* Testimonials component added in Task 9 */}
            </section>

            <section id="contact">
              {/* Contact component added in Task 10 */}
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
```

Key changes:
- `isMobile` state reduces particles to 80 on mobile
- `prefersReducedMotion` hides particles entirely
- Disables `moveParticlesOnHover` on mobile
- Added `id="main-content"` to `<main>` for skip link
- Added placeholder sections for new components (Services, Testimonials, Contact)

- [ ] **Step 2: Verify particles render on desktop, reduced on mobile**

Run dev server, test at full width (200 particles visible), then resize to < 768px (fewer particles). Toggle reduced motion in OS settings — particles should disappear.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "perf: reduce particles on mobile, respect prefers-reduced-motion"
```

---

### Task 4: Header — Navigation Update & Accessibility

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Header.css`

- [ ] **Step 1: Update nav items and add accessibility in Header.tsx**

Replace the entire `Header.tsx` content:

```tsx
import { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";

const SECTIONS = [
  "home", "about", "services", "skills", "portfolio", "resume", "testimonials", "contact"
] as const;

const NAV_ITEMS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Services", href: "services" },
  { label: "Skills", href: "skills" },
  { label: "Portfolio", href: "portfolio" },
  { label: "Resume", href: "resume" },
  { label: "Testimonials", href: "testimonials" },
  { label: "Contact", href: "contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isManualScroll = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const moveIndicator = useCallback(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeBtn = navRef.current.querySelector(
      `.nav-link[data-section="${activeSection}"]`,
    ) as HTMLElement | null;
    if (activeBtn) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicatorRef.current.style.width = `${btnRect.width}px`;
      indicatorRef.current.style.transform = `translateX(${btnRect.left - navRect.left}px)`;
      indicatorRef.current.style.opacity = "1";
    }
  }, [activeSection]);

  useEffect(() => {
    moveIndicator();
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [moveIndicator]);

  // Scroll-spy
  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".main-scroll-container",
    ) as HTMLElement | null;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 50);
      if (isManualScroll.current) return;

      const containerTop = scrollContainer.getBoundingClientRect().top;
      const viewportH = scrollContainer.clientHeight;
      let current = "home";

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= viewportH * 0.4) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus trap and Escape key for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    setActiveSection(sectionId);
    isManualScroll.current = true;

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
      isManualScroll.current = false;
    }, 800);

    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        {/* Floating pill — desktop */}
        <nav ref={navRef} className="nav-pill" aria-label="Main navigation">
          <div ref={indicatorRef} className="nav-pill-indicator" />
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              data-section={item.href}
              className={`nav-link ${activeSection === item.href ? "active" : ""}`}
              onClick={() => handleNavigation(item.href)}
              aria-current={activeSection === item.href ? "true" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          className={`mobile-menu-button ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Mobile drawer */}
        <div
          ref={menuRef}
          id="mobile-nav-menu"
          className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
          role="dialog"
          aria-modal={isMenuOpen ? "true" : undefined}
          aria-label="Navigation menu"
        >
          <nav className="mobile-menu-content" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                className={`mobile-nav-link ${activeSection === item.href ? "active" : ""}`}
                onClick={() => handleNavigation(item.href)}
                aria-current={activeSection === item.href ? "true" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
```

- [ ] **Step 2: Add skip-link and focus-visible styles to Header.css**

Add at the top of `Header.css`:

```css
/* ─── Skip Link ─── */
.skip-link {
  position: fixed;
  top: -100%;
  left: 1rem;
  z-index: 10000;
  padding: 0.75rem 1.5rem;
  background: var(--neon-cyan);
  color: #000;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}
```

Also add to `.nav-link` styles:

```css
.nav-link:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}
```

And add to `.mobile-nav-link`:

```css
.mobile-nav-link:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Add compact mode for desktop nav with 8 items**

Add to `Header.css`, inside the existing styles (before the `@media (max-width: 768px)` block):

```css
/* Compact nav for smaller desktops */
@media (max-width: 1024px) and (min-width: 769px) {
  .nav-link {
    padding: 0.5rem 0.85rem;
    font-size: 0.8rem;
  }
}
```

- [ ] **Step 4: Verify navigation works with new sections**

Run dev server. Check:
- Desktop: 8 items fit in pill, indicator slides correctly
- Mobile: hamburger opens drawer with all 8 items
- Escape closes mobile menu
- Tab key cycles through menu items (focus trap)
- Skip-link visible on Tab press

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Header.css
git commit -m "feat: update nav with new sections, add skip-link and a11y"
```

---

### Task 5: Skills Section — Categories & Qualitative Labels

**Files:**
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Skills.css`

- [ ] **Step 1: Rewrite Skills.tsx with categories and filter tabs**

Replace `src/components/Skills.tsx`:

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiNodedotjs,
  SiMysql,
  SiMongodb,
  SiPhp,
  SiLaravel,
  SiPython,
  SiGit,
  SiFigma,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import GradientText from "./GradientText";
import "./Skills.css";

type SkillLevel = "Proficient" | "Experienced" | "Familiar";

interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  level: SkillLevel;
  category: "Frontend" | "Backend" | "Tools";
}

const skills: Skill[] = [
  { name: "React", icon: SiReact, color: "#61DAFB", level: "Proficient", category: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", level: "Proficient", category: "Frontend" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", level: "Proficient", category: "Frontend" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26", level: "Proficient", category: "Frontend" },
  { name: "CSS3", icon: SiCss3, color: "#1572B6", level: "Proficient", category: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", level: "Proficient", category: "Frontend" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff", level: "Experienced", category: "Frontend" },
  { name: "Vite", icon: SiVite, color: "#646CFF", level: "Experienced", category: "Frontend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", level: "Familiar", category: "Backend" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1", level: "Familiar", category: "Backend" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", level: "Familiar", category: "Backend" },
  { name: "PHP", icon: SiPhp, color: "#777BB4", level: "Familiar", category: "Backend" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20", level: "Familiar", category: "Backend" },
  { name: "Python", icon: SiPython, color: "#3776AB", level: "Familiar", category: "Backend" },
  { name: "Git", icon: SiGit, color: "#F05032", level: "Proficient", category: "Tools" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E", level: "Experienced", category: "Tools" },
  { name: "VS Code", icon: VscVscode, color: "#007ACC", level: "Proficient", category: "Tools" },
];

const categories = ["All", "Frontend", "Backend", "Tools"] as const;

const levelColors: Record<SkillLevel, string> = {
  Proficient: "var(--neon-cyan)",
  Experienced: "var(--neon-green)",
  Familiar: "var(--neon-purple)",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const filtered = activeCategory === "All"
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="skills-section" ref={ref}>
      <div className="skills-container">
        <motion.div
          className="skills-header"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 className="skills-title" variants={itemVariants}>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="custom-class"
            >
              Skills & Technologies
            </GradientText>
          </motion.h2>
          <motion.p className="skills-subtitle" variants={itemVariants}>
            Technologies I work with to bring ideas to life
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="skills-filter-tabs"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skills-filter-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="skills-category"
          layout
        >
          <AnimatePresence mode="popLayout">
            <motion.div className="skills-grid" layout>
              {filtered.map((skill) => (
                <motion.div
                  key={skill.name}
                  className="skill-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div
                    className="skill-icon-wrapper"
                    style={{
                      boxShadow: `0 0 20px ${skill.color}30, 0 0 40px ${skill.color}15`,
                    }}
                  >
                    <skill.icon
                      className="skill-icon"
                      style={{ color: skill.color }}
                    />
                  </div>
                  <span className="skill-name">{skill.name}</span>
                  <span
                    className="skill-level-label"
                    style={{ color: levelColors[skill.level] }}
                  >
                    {skill.level}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
```

- [ ] **Step 2: Update Skills.css — remove progress bars, add filter tabs and level label**

In `src/components/Skills.css`, replace the progress bar and level text styles. Remove these blocks:

```css
/* Progress Bar */
.skill-bar-container { ... }
.skill-bar { ... }

/* Level Text */
.skill-level { ... }
```

And add:

```css
/* Filter Tabs */
.skills-filter-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.skills-filter-tab {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.skills-filter-tab:hover {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 212, 255, 0.2);
}

.skills-filter-tab.active {
  color: #fff;
  background: rgba(0, 212, 255, 0.15);
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);
}

.skills-filter-tab:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

/* Level Label */
.skill-level-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

- [ ] **Step 3: Verify filter tabs work**

Run dev server. Click each filter tab — cards should animate in/out. Check labels show "Proficient", "Experienced", or "Familiar" instead of percentages.

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.tsx src/components/Skills.css
git commit -m "feat: reorganize skills into categories with filter tabs and qualitative labels"
```

---

### Task 6: Portfolio Section — Filterable Grid with Accessible Modal

**Files:**
- Modify: `src/components/Portfolio.tsx`
- Modify: `src/components/Portfolio.css`

- [ ] **Step 1: Rewrite Portfolio.tsx with filterable grid and accessible modal**

Replace `src/components/Portfolio.tsx`:

```tsx
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import GradientText from "./GradientText";
import "./Portfolio.css";

import imgPhotography from "../assets/img/photography-web.png";
import imgCrypto from "../assets/img/dashboard-crypto.png";
import imgPortfolio from "../assets/img/personal-portfolio.png";
import imgPcBuilder from "../assets/img/pc-builder.png";
import imgBalanceUp from "../assets/img/balanceup.png";

interface Project {
  image: string;
  title: string;
  tech: string;
  category: string;
  description: string;
  url: string;
  color: string;
}

const projects: Project[] = [
  {
    image: imgPhotography,
    title: "Photography Landing Page",
    tech: "React & Node.js",
    category: "Web",
    description: "Full-stack photography portfolio with dynamic galleries and contact system.",
    url: "https://photography-portfolio-ten-gamma.vercel.app",
    color: "#00d4ff",
  },
  {
    image: imgCrypto,
    title: "Crypto Dashboard",
    tech: "React & TypeScript",
    category: "Web",
    description: "Real-time cryptocurrency dashboard with live data feeds and interactive charts.",
    url: "https://dashboard-cypto-app.netlify.app",
    color: "#64ffda",
  },
  {
    image: imgPortfolio,
    title: "Personal Portfolio",
    tech: "React & TypeScript",
    category: "Design",
    description: "Modern personal portfolio with animations, particles, and glassmorphism design.",
    url: "https://mahadiputra-portfolio.vercel.app",
    color: "#a855f7",
  },
  {
    image: imgPcBuilder,
    title: "PC Builder Simulation",
    tech: "TypeScript",
    category: "Web",
    description: "Interactive PC building simulator for choosing and comparing components.",
    url: "https://pc-builder-simulation.vercel.app",
    color: "#f59e0b",
  },
  {
    image: imgBalanceUp,
    title: "BalanceUp",
    tech: "TypeScript & Firebase",
    category: "Web",
    description: "Expense tracking application with Firebase backend and real-time sync.",
    url: "https://balanceup-tracker.vercel.app",
    color: "#ff6b6b",
  },
];

const filterCategories = ["All", "Web", "Design"] as const;

/* ── Grid Card ── */
function GridCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      className="portfolio-grid-card"
      ref={ref}
      layout
      style={{ "--accent": project.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        className="portfolio-grid-card-image"
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${project.title}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(project); } }}
      >
        <img
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          width={600}
          height={375}
        />
        <div className="portfolio-grid-card-overlay">
          <p className="portfolio-grid-card-overlay-text">{project.description}</p>
        </div>
      </div>
      <div className="portfolio-grid-card-info">
        <div className="portfolio-grid-card-text">
          <h3 className="portfolio-grid-card-title">{project.title}</h3>
          <p className="portfolio-grid-card-tech">{project.tech}</p>
        </div>
        <button
          className="portfolio-grid-card-arrow"
          onClick={() => onSelect(project)}
          aria-label={`View ${project.title}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ── Project Modal ── */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;

    // Focus the modal
    const closeBtn = modalRef.current?.querySelector<HTMLElement>(".modal-close");
    closeBtn?.focus();

    // Lock body scroll
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="modal-content"
        style={{ "--accent": project.color } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-image">
          <img src={project.image} alt={`Screenshot of ${project.title}`} />
        </div>

        <div className="modal-body">
          <div className="modal-meta">
            <span className="modal-category">{project.category}</span>
            <span className="modal-tech">{project.tech}</span>
          </div>
          <h2 className="modal-title">{project.title}</h2>
          <p className="modal-desc">{project.description}</p>
          <a
            className="modal-cta"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ── */
const Portfolio = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="portfolio-section" id="portfolio">
      <div className="portfolio-container">
        <motion.div
          className="portfolio-header"
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="portfolio-label">My Work</span>
          <GradientText>Recent Projects</GradientText>
        </motion.div>

        {/* Filter Tabs */}
        <div className="portfolio-filter-tabs">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              className={`portfolio-filter-tab ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div className="portfolio-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <GridCard
                key={project.title}
                project={project}
                onSelect={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
```

- [ ] **Step 2: Rewrite Portfolio.css — grid layout, hover overlay, filter tabs**

Replace `src/components/Portfolio.css`:

```css
/* ── Portfolio Section ── */
.portfolio-section {
  min-height: 100vh;
  padding: 5rem 2rem 4rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.portfolio-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Header ── */
.portfolio-header {
  text-align: left;
}

.portfolio-header .animated-gradient-text {
  font-size: 3.5rem;
  font-weight: 700;
  justify-content: flex-start;
}

.portfolio-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--neon-cyan);
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.15);
  padding: 0.35rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

/* ── Filter Tabs ── */
.portfolio-filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.portfolio-filter-tab {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.portfolio-filter-tab:hover {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 212, 255, 0.2);
}

.portfolio-filter-tab.active {
  color: #fff;
  background: rgba(0, 212, 255, 0.15);
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);
}

.portfolio-filter-tab:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

/* ── Grid ── */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ── Grid Card ── */
.portfolio-grid-card {
  border-radius: var(--radius-card, 12px);
  background: var(--glass-bg, rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(var(--glass-blur, 12px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
  overflow: hidden;
  transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
}

.portfolio-grid-card:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 0 24px color-mix(in srgb, var(--accent) 10%, transparent);
  transform: translateY(-4px);
}

/* Card Image */
.portfolio-grid-card-image {
  position: relative;
  width: calc(100% - 1.3rem);
  aspect-ratio: 16 / 11;
  overflow: hidden;
  cursor: pointer;
  border-radius: var(--radius-inner, 8px);
  margin: 0.65rem;
  margin-bottom: 0;
}

.portfolio-grid-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  border-radius: var(--radius-inner, 8px);
  transition: transform 0.5s ease;
}

.portfolio-grid-card:hover .portfolio-grid-card-image img {
  transform: scale(1.04);
}

/* Hover Overlay */
.portfolio-grid-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: var(--radius-inner, 8px);
}

.portfolio-grid-card:hover .portfolio-grid-card-overlay {
  opacity: 1;
}

.portfolio-grid-card-overlay-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

/* Card Info */
.portfolio-grid-card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.1rem 1.15rem;
  gap: 0.75rem;
}

.portfolio-grid-card-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.portfolio-grid-card-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portfolio-grid-card-tech {
  font-size: 0.9rem;
  color: var(--text-secondary, #94a3b8);
  margin: 0;
}

/* Arrow Button */
.portfolio-grid-card-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent, var(--neon-cyan));
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.portfolio-grid-card-arrow:hover {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  transform: scale(1.08);
  box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 18%, transparent);
}

.portfolio-grid-card-arrow:focus-visible {
  outline: 2px solid var(--accent, var(--neon-cyan));
  outline-offset: 2px;
}

/* ── Modal (kept from original, accessibility added) ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 20px;
  background: rgba(15, 15, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.modal-close:hover {
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}

.modal-close:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

.modal-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.modal-body {
  padding: 1.5rem 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.modal-category {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent, var(--neon-cyan));
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

.modal-tech {
  font-size: 1rem;
  color: var(--text-secondary, #94a3b8);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.3;
}

.modal-desc {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-secondary, #94a3b8);
  margin: 0;
}

.modal-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.5rem;
  padding: 0.65rem 1.3rem;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  text-decoration: none;
  width: fit-content;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.modal-cta:hover {
  background: color-mix(in srgb, var(--accent) 22%, transparent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  transform: translateY(-1px);
}

.modal-cta:focus-visible {
  outline: 2px solid var(--accent, var(--neon-cyan));
  outline-offset: 2px;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .portfolio-section {
    padding: 4rem 1rem 3rem;
  }

  .portfolio-header .animated-gradient-text {
    font-size: 2.8rem;
  }

  .modal-content {
    max-width: 100%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 1.25rem 1.4rem 1.75rem;
  }
}

@media (max-width: 480px) {
  .portfolio-section {
    padding: 3rem 0.75rem 2rem;
  }

  .portfolio-header .animated-gradient-text {
    font-size: 2.2rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .modal-backdrop {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.4rem;
  }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .portfolio-grid-card,
  .portfolio-grid-card-image img,
  .portfolio-grid-card-arrow,
  .portfolio-grid-card-overlay,
  .modal-cta {
    transition: none;
  }
}
```

- [ ] **Step 3: Verify grid renders, filters work, modal has focus trap**

Run dev server. Check:
- Grid shows 3 columns on desktop, 2 on tablet, 1 on mobile
- Filter tabs animate cards in/out
- Hover shows description overlay
- Click opens modal, Escape closes it, Tab cycles within modal
- Focus returns to trigger element after close

- [ ] **Step 4: Commit**

```bash
git add src/components/Portfolio.tsx src/components/Portfolio.css
git commit -m "feat: replace carousel with filterable grid, add accessible modal"
```

---

### Task 7: Resume — Replace Emoji Icons with SVGs

**Files:**
- Modify: `src/components/Resume.tsx`
- Modify: `src/components/Resume.css`

- [ ] **Step 1: Replace emoji icons with Lucide icons in Resume.tsx**

In `src/components/Resume.tsx`, add Lucide imports and update the icon field:

Add import at top:
```tsx
import { GraduationCap, Briefcase, Camera } from "lucide-react";
```

Change the `icon` field type in the interface from `string` to `React.ReactNode`, and update `timelineData` icon values:

```tsx
interface ResumeItem {
  date: string;
  title: string;
  place: string;
  description: string;
  icon: React.ReactNode;
  category: "education" | "experience";
}

const timelineData: ResumeItem[] = [
  {
    date: "2021 – 2023",
    title: "High School",
    place: "SMAN 2 Denpasar",
    description: "Completed high school education with a focus on science and technology.",
    icon: <GraduationCap size={18} aria-hidden="true" />,
    category: "education",
  },
  {
    date: "2023 – Present",
    title: "Freelance Photographer",
    place: "Freelance",
    description: "Capturing professional photography for events, portraits, and commercial projects.",
    icon: <Camera size={18} aria-hidden="true" />,
    category: "experience",
  },
  {
    date: "2023 – Present",
    title: "Technology Information System",
    place: "ITB STIKOM Bali",
    description: "Pursuing a degree in Information Technology Systems, covering software engineering, databases, and web technologies.",
    icon: <GraduationCap size={18} aria-hidden="true" />,
    category: "education",
  },
  {
    date: "2023 – Present",
    title: "Junior Web Developer",
    place: "Balica Travel",
    description: "Building and maintaining web applications for a travel company, handling frontend development and UI/UX improvements.",
    icon: <Briefcase size={18} aria-hidden="true" />,
    category: "experience",
  },
  {
    date: "2025",
    title: "Full Stack Development",
    place: "Hacktiv8",
    description: "Intensive bootcamp covering full-stack JavaScript development with modern frameworks and best practices.",
    icon: <GraduationCap size={18} aria-hidden="true" />,
    category: "education",
  },
  {
    date: "2025",
    title: "Web Development",
    place: "Purwadhika Bootcamp",
    description: "Hands-on training in modern web development workflows, deployment, and collaborative engineering.",
    icon: <GraduationCap size={18} aria-hidden="true" />,
    category: "education",
  },
];
```

In the `TimelineCard` component, update the icon rendering:

Replace:
```tsx
<span className="timeline-dot-icon">{item.icon}</span>
```

With:
```tsx
<span className="timeline-dot-icon" aria-label={item.category === "education" ? "Education" : "Experience"}>
  {item.icon}
</span>
```

- [ ] **Step 2: Update timeline dot icon styles in Resume.css**

Find the `.timeline-dot-icon` rule in `Resume.css` and ensure it displays SVGs properly. If it has `font-size` for emojis, update it:

```css
.timeline-dot-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
```

- [ ] **Step 3: Verify SVG icons render in timeline**

Run dev server. Check that graduation caps, briefcase, and camera icons appear instead of emojis. Verify they look crisp and aligned in the center dots.

- [ ] **Step 4: Commit**

```bash
git add src/components/Resume.tsx src/components/Resume.css
git commit -m "a11y: replace emoji icons with Lucide SVGs in resume timeline"
```

---

### Task 8: New Section — Services

**Files:**
- Create: `src/components/Services.tsx`
- Create: `src/components/Services.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Services.tsx**

Create `src/components/Services.tsx`:

```tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code, PenTool } from "lucide-react";
import GradientText from "./GradientText";
import "./Services.css";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Building responsive, performant web applications with modern frameworks and clean code.",
    color: "var(--neon-cyan)",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description:
      "Crafting intuitive interfaces and user experiences that are beautiful, accessible, and functional.",
    color: "var(--neon-purple)",
  },
];

const Services = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="services-section" ref={ref}>
      <motion.div
        className="services-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="services-label">What I Do</span>
        <GradientText>Services</GradientText>
      </motion.div>

      <div className="services-grid">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            className="service-card"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
          >
            <div
              className="service-icon-wrapper"
              style={{ "--service-color": service.color } as React.CSSProperties}
            >
              <service.icon size={28} aria-hidden="true" />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
```

- [ ] **Step 2: Create Services.css**

Create `src/components/Services.css`:

```css
.services-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.services-header {
  text-align: center;
  margin-bottom: 3rem;
}

.services-header .animated-gradient-text {
  font-size: 3.5rem;
  font-weight: 700;
}

.services-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--neon-cyan);
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.15);
  padding: 0.35rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.services-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.service-card {
  flex: 1;
  max-width: 380px;
  min-width: 280px;
  padding: 2rem;
  border-radius: var(--radius-card, 12px);
  background: var(--glass-bg, rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(var(--glass-blur, 12px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
  text-align: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.service-card:hover {
  border-color: rgba(0, 212, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.06);
  transform: translateY(-4px);
}

.service-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-inner, 8px);
  background: color-mix(in srgb, var(--service-color) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: var(--service-color);
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem;
}

.service-description {
  font-size: 0.95rem;
  color: var(--text-secondary, #94a3b8);
  line-height: 1.65;
  margin: 0;
}

@media (max-width: 768px) {
  .services-section {
    padding: 3rem 1rem;
  }

  .services-header .animated-gradient-text {
    font-size: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }
}
```

- [ ] **Step 3: Import Services in App.tsx**

In `src/App.tsx`, add the lazy import and render it in the services section:

Add near top with other lazy imports:
```tsx
const Services = lazy(() => import("./components/Services.tsx"));
```

Replace the services section placeholder:
```tsx
<section id="services">
  <Services />
</section>
```

- [ ] **Step 4: Verify Services renders**

Run dev server. Services section should appear between About and Skills with two glassmorphism cards.

- [ ] **Step 5: Commit**

```bash
git add src/components/Services.tsx src/components/Services.css src/App.tsx
git commit -m "feat: add Services section with Web Development and UI/UX Design"
```

---

### Task 9: New Section — Testimonials

**Files:**
- Create: `src/components/Testimonials.tsx`
- Create: `src/components/Testimonials.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Testimonials.tsx**

Create `src/components/Testimonials.tsx`:

```tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "./GradientText";
import "./Testimonials.css";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Placeholder testimonial text. Replace with a real quote from a colleague or client about your work.",
    name: "John Doe",
    role: "Role at Company",
    color: "var(--neon-cyan)",
  },
  {
    quote: "Another placeholder. Add real feedback you've received about your development or design work.",
    name: "Jane Smith",
    role: "Role at Company",
    color: "var(--neon-purple)",
  },
  {
    quote: "Third placeholder testimonial for layout balance. Replace with genuine feedback.",
    name: "Alex Johnson",
    role: "Role at Company",
    color: "var(--neon-green)",
  },
];

const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="testimonials-section" ref={ref}>
      <motion.div
        className="testimonials-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="testimonials-label">Feedback</span>
        <GradientText>Testimonials</GradientText>
      </motion.div>

      <div className="testimonials-track">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <span className="testimonial-quote" style={{ color: t.color }}>"</span>
            <p className="testimonial-text">{t.quote}</p>
            <div className="testimonial-author">
              <div
                className="testimonial-avatar"
                style={{ background: `color-mix(in srgb, ${t.color} 15%, transparent)` }}
                aria-hidden="true"
              />
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
```

- [ ] **Step 2: Create Testimonials.css**

Create `src/components/Testimonials.css`:

```css
.testimonials-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 3rem;
}

.testimonials-header .animated-gradient-text {
  font-size: 3.5rem;
  font-weight: 700;
}

.testimonials-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--neon-cyan);
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.15);
  padding: 0.35rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.testimonials-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.testimonials-track::-webkit-scrollbar {
  display: none;
}

.testimonial-card {
  flex: 0 0 320px;
  scroll-snap-align: start;
  padding: 1.5rem;
  border-radius: var(--radius-card, 12px);
  background: var(--glass-bg, rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(var(--glass-blur, 12px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.testimonial-quote {
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
}

.testimonial-text {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--text-secondary, #94a3b8);
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.testimonial-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.testimonial-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 3rem 1rem;
  }

  .testimonials-header .animated-gradient-text {
    font-size: 2.5rem;
  }

  .testimonial-card {
    flex: 0 0 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .testimonials-track {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Import Testimonials in App.tsx**

In `src/App.tsx`, add lazy import:
```tsx
const Testimonials = lazy(() => import("./components/Testimonials.tsx"));
```

Replace the testimonials section placeholder:
```tsx
<section id="testimonials">
  <Testimonials />
</section>
```

- [ ] **Step 4: Verify Testimonials renders**

Run dev server. Testimonials section should appear after Resume with 3 scrollable cards.

- [ ] **Step 5: Commit**

```bash
git add src/components/Testimonials.tsx src/components/Testimonials.css src/App.tsx
git commit -m "feat: add Testimonials section with placeholder content"
```

---

### Task 10: New Section — Contact (WhatsApp)

**Files:**
- Create: `src/components/Contact.tsx`
- Create: `src/components/Contact.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Contact.tsx**

Create `src/components/Contact.tsx`:

```tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import GradientText from "./GradientText";
import "./Contact.css";

const WHATSAPP_NUMBER = "6281234567890"; // User: replace with your number
const WHATSAPP_TEMPLATE = encodeURIComponent(
  "Hi Adip! I came across your portfolio and would love to discuss a project. Let's connect!"
);

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/InsCure12", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://www.instagram.com/adip.jpeg/", label: "Instagram" },
];

const Contact = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="contact-section" ref={ref}>
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="contact-label">Get In Touch</span>
        <h2 className="contact-heading">
          <GradientText>Let's Work Together</GradientText>
        </h2>
        <p className="contact-subtext">
          Have a project in mind? Let's chat and bring your ideas to life.
        </p>

        <a
          className="contact-whatsapp-btn"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEMPLATE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={22} aria-hidden="true" />
          Chat on WhatsApp
        </a>

        <div className="contact-social-row">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              aria-label={label}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
```

- [ ] **Step 2: Create Contact.css**

Create `src/components/Contact.css`:

```css
.contact-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.contact-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--neon-cyan);
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.15);
  padding: 0.35rem 1rem;
  border-radius: 6px;
}

.contact-heading .animated-gradient-text {
  font-size: 3rem;
  font-weight: 700;
}

.contact-subtext {
  font-size: 1.05rem;
  color: var(--text-secondary, #94a3b8);
  max-width: 450px;
  line-height: 1.6;
  margin: 0;
}

.contact-whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  border-radius: var(--radius-card, 12px);
  background: #25D366;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.contact-whatsapp-btn:hover {
  background: #1ebe57;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.25);
}

.contact-whatsapp-btn:focus-visible {
  outline: 2px solid #25D366;
  outline-offset: 2px;
}

.contact-social-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.contact-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--glass-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
  color: var(--text-secondary, #94a3b8);
  text-decoration: none;
  transition: color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.contact-social-link:hover {
  color: var(--neon-cyan);
  border-color: rgba(0, 212, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.15);
}

.contact-social-link:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 3rem 1rem;
  }

  .contact-heading .animated-gradient-text {
    font-size: 2.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-whatsapp-btn,
  .contact-social-link {
    transition: none;
  }
}
```

- [ ] **Step 3: Import Contact in App.tsx**

In `src/App.tsx`, add lazy import:
```tsx
const Contact = lazy(() => import("./components/Contact.tsx"));
```

Replace the contact section placeholder:
```tsx
<section id="contact">
  <Contact />
</section>
```

- [ ] **Step 4: Verify Contact renders and WhatsApp link works**

Run dev server. Contact section should appear after Testimonials. Click WhatsApp button — should open `wa.me` link with pre-filled template.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.css src/App.tsx
git commit -m "feat: add Contact section with WhatsApp CTA and social links"
```

---

### Task 11: New Section — Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Create: `src/components/Footer.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Footer.tsx**

Create `src/components/Footer.tsx`:

```tsx
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import "./Footer.css";

const quickLinks = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Portfolio", href: "portfolio" },
  { label: "Contact", href: "contact" },
];

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/InsCure12", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://www.instagram.com/adip.jpeg/", label: "Instagram" },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <p className="footer-name">Adip</p>
            <p className="footer-tagline">Web Developer & UI/UX Designer</p>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <button
                key={link.href}
                className="footer-link"
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="footer-social">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Adip. All rights reserved.
          </p>
          <button
            className="footer-back-to-top"
            onClick={() => scrollToSection("home")}
            aria-label="Back to top"
          >
            <ArrowUp size={16} aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Create Footer.css**

Create `src/components/Footer.css`:

```css
.site-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2.5rem 2rem 1.5rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.footer-tagline {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  background: none;
  border: none;
  color: var(--text-secondary, #94a3b8);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--neon-cyan);
}

.footer-link:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.footer-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
}

.footer-social-link:hover {
  color: var(--neon-cyan);
  background: rgba(0, 212, 255, 0.08);
}

.footer-social-link:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.footer-copyright {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
}

.footer-back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s ease;
}

.footer-back-to-top:hover {
  color: var(--neon-cyan);
}

.footer-back-to-top:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
```

- [ ] **Step 3: Import Footer in App.tsx and place after Suspense**

In `src/App.tsx`, import Footer (not lazy — it's always visible):

```tsx
import Footer from "./components/Footer.tsx";
```

Place it after the closing `</Suspense>` and before the closing `</main>`:

```tsx
          </Suspense>

          <Footer />
        </main>
```

- [ ] **Step 4: Verify Footer renders**

Run dev server. Footer should appear at the bottom with three columns, quick links, social icons, copyright, and back-to-top button. Back-to-top should smooth scroll to hero.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.css src/App.tsx
git commit -m "feat: add Footer with quick links, social icons, and back-to-top"
```

---

### Task 12: About Section — UX Fixes

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/About.css`
- Modify: `src/components/Home.tsx`

- [ ] **Step 1: Fix About photo dimensions**

In `src/components/About.css`, find the `.about-photo` rule and replace fixed dimensions with responsive `aspect-ratio`:

Replace any `width: 380px; height: 480px;` or similar with:

```css
.about-photo {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--radius-card, 12px);
}
```

- [ ] **Step 2: Add alt text to About photo and improve social icon sizes in Home.tsx**

In `src/components/Home.tsx`, add `aria-label` to social links that lack them:

Find the social icon `motion.a` element and add `aria-label`:
```tsx
<motion.a
  key={index}
  href={href}
  className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-white/20 hover:scale-110"
  aria-label={Icon.displayName || "Social link"}
```

Also update the `socialIcons` array to include labels:
```tsx
const socialIcons = [
  { Icon: Github, href: "https://github.com/InsCure12", delay: 0, label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/", delay: 0.1, label: "LinkedIn" },
  { Icon: Mail, href: "mailto:mahadiputra09@gmail.com", delay: 0.2, label: "Email" },
  { Icon: Instagram, href: "https://www.instagram.com/adip.jpeg/", delay: 0.4, label: "Instagram" },
];
```

Remove the unused Twitter entry (it pointed to `#`).

Update the render to use the label:
```tsx
{socialIcons.map(({ Icon, href, delay, label }) => (
  <motion.a
    key={label}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-white/20 hover:scale-110"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.8 + delay, duration: 0.5 }}
    aria-label={label}
  >
    <Icon className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors duration-300" />
  </motion.a>
))}
```

- [ ] **Step 3: Verify changes**

Run dev server. About photo should scale responsively. Social icons should have proper aria-labels (inspect with dev tools). Twitter icon should be removed.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.css src/components/Home.tsx
git commit -m "fix: responsive About photo, add social icon aria-labels, remove dead Twitter link"
```

---

### Task 13: Global Accessibility — Focus Styles & Semantic HTML

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add global focus-visible styles to index.css**

Add to `src/index.css` inside the `@layer base` block:

```css
/* Global focus-visible */
:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

/* Remove default outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

- [ ] **Step 2: Add global reduced-motion for Framer Motion**

Add at the end of `src/index.css`:

```css
/* Global reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify the entire App.tsx has correct section order**

Final `src/App.tsx` should have this section order in the JSX (verify from earlier tasks):
1. `#home` — Home
2. `#about` — About
3. `#services` — Services
4. `#skills` — Skills
5. `#portfolio` — Portfolio
6. `#resume` — Resume
7. `#testimonials` — Testimonials
8. `#contact` — Contact
9. Footer (no section id, it's a `<footer>`)

- [ ] **Step 4: Verify focus styles and keyboard navigation**

Run dev server. Tab through the entire page — every interactive element should show a cyan focus ring. Check:
- Skip link appears on first Tab
- Nav items focusable
- Portfolio grid cards focusable via keyboard
- Modal focus trap works
- Footer links focusable

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/App.tsx
git commit -m "a11y: add global focus-visible styles and reduced-motion support"
```

---

### Task 14: Final Verification & Build

**Files:**
- All modified files

- [ ] **Step 1: Run build to verify no errors**

Run:
```bash
cd "/Users/inscure/Documents/Project/Website Portfolio/Adip-Portfolio/Personal-Portfolio"
npm run build
```

Expected: Build succeeds with no TypeScript or import errors.

- [ ] **Step 2: Run preview to test production build**

Run: `npm run preview`

Open in browser. Walk through every section:
- Home → About → Services → Skills → Portfolio → Resume → Testimonials → Contact → Footer
- Test filter tabs in Skills and Portfolio
- Test modal open/close with keyboard
- Test WhatsApp button
- Test back-to-top
- Test mobile hamburger menu
- Test at 375px, 768px, 1024px, 1440px widths

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "chore: final build verification — portfolio optimization complete"
```
