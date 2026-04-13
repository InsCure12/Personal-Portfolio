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
