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

    const closeBtn = modalRef.current?.querySelector<HTMLElement>(".modal-close");
    closeBtn?.focus();

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
        if (focusable.length === 0) { e.preventDefault(); return; }
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
