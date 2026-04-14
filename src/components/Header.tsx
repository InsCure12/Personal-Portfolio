import { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";

const SECTIONS = [
  "home",
  "about",
  "skills",
  "portfolio",
  "resume",
  "testimonials",
  "contact",
] as const;

const NAV_ITEMS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
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
  const manualScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const activeSectionRef = useRef(activeSection);

  const moveIndicator = useCallback(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeBtn = navRef.current.querySelector(
      `.nav-link[data-section="${activeSectionRef.current}"]`,
    ) as HTMLElement | null;
    if (activeBtn) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicatorRef.current.style.width = `${btnRect.width}px`;
      indicatorRef.current.style.transform = `translateX(${btnRect.left - navRect.left}px)`;
      indicatorRef.current.style.opacity = "1";
    }
  }, []);

  // Register resize listener once
  useEffect(() => {
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [moveIndicator]);

  // Update ref and call moveIndicator when section changes
  useEffect(() => {
    activeSectionRef.current = activeSection;
    moveIndicator();
  }, [activeSection, moveIndicator]);

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
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
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

    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
    manualScrollTimer.current = setTimeout(() => {
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
          aria-modal="true"
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
