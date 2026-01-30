import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ChromaGrid from "./ChromaGrid";
import GradientText from "./GradientText";
import "./Portfolio.css";

const items = [
  {
    image: "/Screenshot 2025-10-08 at 22.09.57.png",
    title: "Photography Landing Page",
    subtitle: "React & Node.js",
    handle: "Full Stack Web App",
    borderColor: "#00d4ff",
    url: "https://dipotoinadip.netlify.app/",
  },
  {
    image: "/Screenshot 2025-10-08 at 22.12.40.png",
    title: "Crypto Dashboard",
    subtitle: "React & TypeScript",
    handle: "Real-time Data App",
    borderColor: "#64ffda",
    url: "https://dashboard-cypto-app.netlify.app/",
  },
  {
    image: "public/Screenshot 2026-01-30 at 16.56.36.png",
    title: "Personal Portfolio",
    subtitle: "React & TyperScript",
    handle: "Landing Page App",
    borderColor: "#ff00ff",
    isComingSoon: true,
  },
  {
    image: "",
    title: "Coming Soon",
    subtitle: "Coming Soon",
    handle: "Coming Soon",
    borderColor: "#ff00ff",
    isComingSoon: true,
  },
];

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="portfolio-section" ref={ref}>
      <div className="portfolio-container">
        {/* Header */}
        <motion.div
          className="portfolio-header"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h1 className="portfolio-title" variants={itemVariants}>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="custom-class"
            >
              My Projects
            </GradientText>
          </motion.h1>
          <motion.p className="portfolio-subtitle" variants={itemVariants}>
            A collection of my recent work and side projects
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="portfolio-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <ChromaGrid
            items={items}
            radius={10}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;
