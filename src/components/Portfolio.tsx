import { useRef, useState, useCallback, useEffect } from "react";
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
    category: "Web App",
    description:
      "Full-stack photography portfolio with dynamic galleries and contact system.",
    url: "https://photography-portfolio-ten-gamma.vercel.app",
    color: "#00d4ff",
  },
  {
    image: imgCrypto,
    title: "Crypto Dashboard",
    tech: "React & TypeScript",
    category: "Web App",
    description:
      "Real-time cryptocurrency dashboard with live data feeds and interactive charts.",
    url: "https://dashboard-cypto-app.netlify.app",
    color: "#64ffda",
  },
  {
    image: imgPortfolio,
    title: "Personal Portfolio",
    tech: "React & TypeScript",
    category: "Landing Page",
    description:
      "Modern personal portfolio with animations, particles, and glassmorphism design.",
    url: "https://mahadiputra-portfolio.vercel.app",
    color: "#a855f7",
  },
  {
    image: imgPcBuilder,
    title: "PC Builder Simulation",
    tech: "TypeScript",
    category: "Web App",
    description:
      "Interactive PC building simulator for choosing and comparing components.",
    url: "https://pc-builder-simulation.vercel.app",
    color: "#f59e0b",
  },
  {
    image: imgBalanceUp,
    title: "BalanceUp",
    tech: "TypeScript & Firebase",
    category: "Web App",
    description:
      "Expense tracking application with Firebase backend and real-time sync.",
    url: "https://balanceup-tracker.vercel.app",
    color: "#ff6b6b",
  },
];

/* ── Carousel Card ── */
function CarouselCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      className="carousel-card"
      ref={ref}
      style={{ "--accent": project.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="carousel-card-image" onClick={() => onSelect(project)}>
        <img src={project.image} alt={project.title} loading="lazy" />
      </div>
      <div className="carousel-card-info">
        <div className="carousel-card-text">
          <h3 className="carousel-card-title">{project.title}</h3>
          <p className="carousel-card-tech">{project.tech}</p>
        </div>
        <button
          className="carousel-card-arrow"
          onClick={() => onSelect(project)}
          aria-label={`View ${project.title}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
        className="modal-content"
        style={{ "--accent": project.color } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-image">
          <img src={project.image} alt={project.title} />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
const CARDS_PER_PAGE = 3;

const Portfolio = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE);

  /* Scroll to current page */
  const scrollToPage = useCallback(
    (page: number) => {
      if (!trackRef.current) return;
      const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
      setCurrentPage(clampedPage);
      const card = trackRef.current.children[clampedPage * CARDS_PER_PAGE] as
        | HTMLElement
        | undefined;
      if (card) {
        trackRef.current.scrollTo({
          left: card.offsetLeft - trackRef.current.offsetLeft,
          behavior: "smooth",
        });
      }
    },
    [totalPages],
  );

  /* Sync dots on manual scroll */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollLeft = track.scrollLeft;
        const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
        const gap = 24;
        const page = Math.round(
          scrollLeft / ((cardWidth + gap) * CARDS_PER_PAGE),
        );
        setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
        ticking = false;
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [totalPages]);

  return (
    <div className="portfolio-section" id="portfolio">
      <div className="portfolio-container">
        {/* Header — left aligned like reference */}
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

        {/* Carousel */}
        <div className="carousel-wrapper">
          <div className="carousel-track" ref={trackRef}>
            {projects.map((project, i) => (
              <CarouselCard
                key={project.title}
                project={project}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </div>

          {/* Dots */}
          <div className="carousel-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${currentPage === i ? "active" : ""}`}
                onClick={() => scrollToPage(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
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
