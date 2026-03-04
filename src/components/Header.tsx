import { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";

const SECTIONS = ["home", "about", "skills", "resume", "portfolio"] as const;

const NAV_ITEMS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Skills", href: "skills" },
  { label: "Resume", href: "resume" },
  { label: "Portfolio", href: "portfolio" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isManualScroll = useRef(false);

  // Move sliding indicator to the active button
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

  // Scroll-spy: find the section closest to the top of the viewport
  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".main-scroll-container",
    ) as HTMLElement | null;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 50);

      // Skip scroll-spy while we're smooth-scrolling from a click
      if (isManualScroll.current) return;

      const containerTop = scrollContainer.getBoundingClientRect().top;
      const viewportH = scrollContainer.clientHeight;
      let current = "home";

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section is "active" when its top is within the upper 40% of the viewport
        if (rect.top - containerTop <= viewportH * 0.4) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const scrollContainer = document.querySelector(".main-scroll-container");

    setActiveSection(sectionId);
    isManualScroll.current = true;

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Re-enable scroll spy after the smooth scroll settles
    setTimeout(() => {
      isManualScroll.current = false;
    }, 800);

    setIsMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* Floating pill — desktop */}
      <nav ref={navRef} className="nav-pill">
        <div ref={indicatorRef} className="nav-pill-indicator" />
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            data-section={item.href}
            className={`nav-link ${activeSection === item.href ? "active" : ""}`}
            onClick={() => handleNavigation(item.href)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        className={`mobile-menu-button ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className={`mobile-nav-link ${activeSection === item.href ? "active" : ""}`}
              onClick={() => handleNavigation(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
