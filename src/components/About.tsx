import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import GradientText from "./GradientText";
import CountUp from "./CountUp";
import "./About.css";
import imgProfile from "../assets/img/img-3440.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="about-section" ref={ref}>
      <motion.div
        className="about-split"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Left: Photo with decorative arcs */}
        <motion.div className="about-photo-col" variants={itemVariants}>
          <div className="about-photo-wrapper">
            <img
              src={imgProfile}
              alt="Putu Adip"
              className="about-photo"
              loading="lazy"
            />
            <div className="about-photo-border" />
            {/* Decorative arc elements */}
            <div className="about-decor about-decor-tl" />
            <div className="about-decor about-decor-br" />
          </div>
        </motion.div>

        {/* Right: Text content */}
        <motion.div className="about-text-col" variants={itemVariants}>
          <span className="about-label">About Me</span>

          <h2 className="about-heading">
            Available for Freelance{" "}
            <GradientText
              colors={["#00d4ff", "#64ffda", "#00d4ff", "#64ffda", "#00d4ff"]}
              animationSpeed={10}
              showBorder={false}
              className="custom-class"
            >
              Web Development
            </GradientText>
          </h2>

          <p className="about-bio">
            Hi, I&apos;m <strong>I Putu Mahadiputra Udayana</strong> &mdash; a
            Frontend Developer from Bali with 2+ years of hands-on experience
            building web applications that are fast, accessible, and a pleasure
            to use. I specialise in React &amp; TypeScript, and I care deeply
            about turning complex requirements into clean, maintainable code.
            When I&apos;m not writing code, I&apos;m behind a camera.
          </p>

          {/* Stats cards */}
          <div className="about-stats-row">
            <div className="about-stat-card">
              <span className="about-stat-value">
                <CountUp
                  from={0}
                  to={2}
                  direction="up"
                  duration={2}
                  delay={0.4}
                  className="count-up-text"
                />
                <span className="about-stat-suffix">+</span>
              </span>
              <span className="about-stat-label">Years Experience</span>
            </div>

            <div className="about-stat-card">
              <span className="about-stat-value">
                <CountUp
                  from={0}
                  to={20}
                  direction="up"
                  duration={2}
                  delay={0.6}
                  className="count-up-text"
                />
                <span className="about-stat-suffix">+</span>
              </span>
              <span className="about-stat-label">Projects finished</span>
            </div>

            <div className="about-stat-card">
              <span className="about-stat-value">
                <CountUp
                  from={0}
                  to={5}
                  direction="up"
                  duration={2}
                  delay={0.8}
                  className="count-up-text"
                />
                <span className="about-stat-suffix">+</span>
              </span>
              <span className="about-stat-label">Certifications</span>
            </div>
          </div>

          {/* CTA button */}
          <div className="about-actions">
            <button
              className="about-btn about-btn-primary"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get In Touch
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
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
