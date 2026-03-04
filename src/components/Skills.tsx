import { motion } from "framer-motion";
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
} from "react-icons/si";
import GradientText from "./GradientText";
import "./Skills.css";

interface Skill {
  name: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  level: number; // 0-100
  category: string;
}

const skills: Skill[] = [
  // Frontend
  {
    name: "React",
    icon: SiReact,
    color: "#61DAFB",
    level: 90,
    category: "Frontend",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
    level: 85,
    category: "Frontend",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
    level: 90,
    category: "Frontend",
  },
  {
    name: "HTML5",
    icon: SiHtml5,
    color: "#E34F26",
    level: 95,
    category: "Frontend",
  },
  {
    name: "CSS3",
    icon: SiCss3,
    color: "#1572B6",
    level: 90,
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
    level: 85,
    category: "Frontend",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#ffffff",
    level: 75,
    category: "Frontend",
  },
  {
    name: "Vite",
    icon: SiVite,
    color: "#646CFF",
    level: 80,
    category: "Frontend",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
    level: 35,
    category: "Frontend",
  },
  {
    name: "MySQL",
    icon: SiMysql,
    color: "#4479A1",
    level: 30,
    category: "Frontend",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    level: 25,
    category: "Frontend",
  },
  {
    name: "PHP",
    icon: SiPhp,
    color: "#777BB4",
    level: 30,
    category: "Frontend",
  },
  {
    name: "Laravel",
    icon: SiLaravel,
    color: "#FF2D20",
    level: 30,
    category: "Frontend",
  },
  {
    name: "Python",
    icon: SiPython,
    color: "#3776AB",
    level: 25,
    category: "Frontend",
  },
];

const categories = ["Frontend"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <div className="skills-section" ref={ref}>
      <div className="skills-container">
        {/* Header */}
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

        {/* Skills Grid */}
        <motion.div
          className="skills-category"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="skills-grid">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="skill-card"
                variants={itemVariants}
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
                <div className="skill-bar-container">
                  <motion.div
                    className="skill-bar"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`,
                      boxShadow: `0 0 8px ${skill.color}50`,
                    }}
                    initial={{ width: 0 }}
                    animate={
                      inView ? { width: `${skill.level}%` } : { width: 0 }
                    }
                    transition={{
                      duration: 1,
                      delay: 0.3,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <span className="skill-level">{skill.level}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
