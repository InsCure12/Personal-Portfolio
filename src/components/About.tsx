import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Download, Briefcase } from "lucide-react";
import GradientText from "./GradientText";
import CountUp from "./CountUp";
import "./About.css";

const About = () => {
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
    <div className="about-section" ref={ref}>
      <div className="about-container">
        {/* Header */}
        <motion.div
          className="about-header"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h1 className="about-title" variants={itemVariants}>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="custom-class"
            >
              Why Hire Me for your project?
            </GradientText>
          </motion.h1>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left Column - Profile Picture */}
          <motion.div className="about-profile" variants={itemVariants}>
            <div className="profile-image-container">
              <img
                src="./public/img-3440.jpg"
                alt="Putu Adip - Frontend Developer"
                className="profile-image"
              />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div className="about-info" variants={itemVariants}>
            <div className="about-description">
              <p>
                Hi, I'm I PUTU MAHADIPUTRA UDAYANA, a passionate and curious
                learner with a strong interest in information technology, and
                photography. I’m currently exploring programming, particularly
                how technology can solve real-world problems, and I enjoy
                breaking down complex ideas into simple, actionable solutions.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="about-buttons">
              <Button
                className="portfolio-btn"
                onClick={() => {
                  document.getElementById("portfolio")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
              <Button variant="outline" className="download-btn">
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>

            {/* Statistics */}
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">
                  <CountUp
                    from={0}
                    to={3}
                    direction="up"
                    duration={2}
                    delay={0.5}
                    className="count-up-text"
                  />
                  <span className="stat-unit"> years</span>
                </span>
                <span className="stat-label">Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <span className="stat-plus">+</span>
                  <CountUp
                    from={0}
                    to={50}
                    direction="up"
                    duration={2}
                    delay={0.8}
                    className="count-up-text"
                  />
                  <span className="stat-unit"> Projects</span>
                </span>
                <span className="stat-label">Github</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
