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
        <motion.div className="skills-grid" layout>
          <AnimatePresence mode="popLayout">
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
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
