import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "./GradientText";
import "./Resume.css";

interface ResumeItem {
  date: string;
  title: string;
  place: string;
  description: string;
  icon: string;
  category: "education" | "experience";
}

const timelineData: ResumeItem[] = [
  {
    date: "2021 – 2023",
    title: "High School",
    place: "SMAN 2 Denpasar",
    description:
      "Completed high school education with a focus on science and technology.",
    icon: "🎓",
    category: "education",
  },
  {
    date: "2023 – Present",
    title: "Freelance Photographer",
    place: "Freelance",
    description:
      "Capturing professional photography for events, portraits, and commercial projects.",
    icon: "📷",
    category: "experience",
  },
  {
    date: "2023 – Present",
    title: "Technology Information System",
    place: "ITB STIKOM Bali",
    description:
      "Pursuing a degree in Information Technology Systems, covering software engineering, databases, and web technologies.",
    icon: "🎓",
    category: "education",
  },
  {
    date: "2023 – Present",
    title: "Junior Web Developer",
    place: "Balica Travel",
    description:
      "Building and maintaining web applications for a travel company, handling frontend development and UI/UX improvements.",
    icon: "💼",
    category: "experience",
  },
  {
    date: "2025",
    title: "Full Stack Development",
    place: "Hacktiv8",
    description:
      "Intensive bootcamp covering full-stack JavaScript development with modern frameworks and best practices.",
    icon: "🎓",
    category: "education",
  },
  {
    date: "2025",
    title: "Web Development",
    place: "Purwadhika Bootcamp",
    description:
      "Hands-on training in modern web development workflows, deployment, and collaborative engineering.",
    icon: "🎓",
    category: "education",
  },
];

const cardVariants = {
  hiddenLeft: { opacity: 0, x: -60 },
  hiddenRight: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function TimelineCard({ item, index }: { item: ResumeItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const side = index % 2 === 0 ? "left" : "right";

  return (
    <div className={`timeline-entry timeline-${side}`} ref={ref}>
      <motion.div
        className={`timeline-card timeline-card--${item.category}`}
        variants={cardVariants}
        initial={side === "left" ? "hiddenLeft" : "hiddenRight"}
        animate={isInView ? "visible" : undefined}
      >
        <div className="timeline-card-header">
          <span className="timeline-date">{item.date}</span>
          <span className={`timeline-badge timeline-badge--${item.category}`}>
            {item.category === "education" ? "Education" : "Experience"}
          </span>
        </div>
        <h3 className="timeline-title">{item.title}</h3>
        <p className="timeline-place">{item.place}</p>
        <p className="timeline-desc">{item.description}</p>
      </motion.div>

      {/* Center dot */}
      <motion.div
        className={`timeline-dot timeline-dot--${item.category}`}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : undefined}
        transition={{
          duration: 0.35,
          delay: 0.15,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <span className="timeline-dot-icon">{item.icon}</span>
      </motion.div>
    </div>
  );
}

export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="resume-section" id="resume" ref={sectionRef}>
      <motion.div
        className="resume-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="resume-label">My Journey</p>
        <GradientText>Resume</GradientText>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="timeline-legend"
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="legend-item">
          <span className="legend-dot legend-dot--education" />
          Education
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--experience" />
          Experience
        </span>
      </motion.div>

      {/* Timeline */}
      <div className="timeline-wrapper">
        <div className="timeline-line" />
        {timelineData.map((item, i) => (
          <TimelineCard key={item.title + item.place} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
