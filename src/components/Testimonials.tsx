import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "./GradientText";
import "./Testimonials.css";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  color: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder testimonial text. Replace with a real quote from a colleague or client about your work. Even after working together on multiple projects, I can confidently say this developer is one of the most well-versed engineers I've worked with.",
    name: "John Doe",
    role: "Senior Engineer at Company",
    color: "var(--neon-cyan)",
    initials: "JD",
  },
  {
    quote:
      "A special talent: someone whose inner constitution drives them to personalize business problems and solve them, regardless of the scope or circumstances. Always determined to turn ambitious visions into reality.",
    name: "Jane Smith",
    role: "Product Designer at Company",
    color: "var(--neon-purple)",
    initials: "JS",
  },
  {
    quote:
      "I've worked with this developer for over a year, and they easily have a rare ability to turn complex business requirements into elegant, feature-rich software that makes it look easy.",
    name: "Alex Johnson",
    role: "CTO at Company",
    color: "var(--neon-green)",
    initials: "AJ",
  },
  {
    quote:
      "An exceptional engineering collaborator with rare full-stack depth. Architected complex solutions across frontend and backend while building high-quality products with remarkable speed and precision. A standout talent in every sense.",
    name: "Emily Davis",
    role: "Engineering Lead at Company",
    color: "var(--neon-cyan)",
    initials: "ED",
  },
  {
    quote:
      "Working together has been a game changer. Their mentorship not only improved my confidence in tackling complex projects but also elevated the quality of everything we shipped. Highly recommend.",
    name: "Michael Brown",
    role: "Frontend Developer at Company",
    color: "var(--neon-purple)",
    initials: "MB",
  },
  {
    quote:
      "This developer's ability to understand and solve complex problems is truly impressive. They consistently deliver high-quality work and are a pleasure to collaborate with.",
    name: "Sarah Wilson",
    role: "Project Manager at Company",
    color: "var(--neon-green)",
    initials: "SW",
  },
];

const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="testimonials-section" ref={ref}>
      <motion.div
        className="testimonials-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="testimonials-label">Feedback</span>
        <GradientText>Testimonials</GradientText>
      </motion.div>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
          >
            <div className="testimonial-author">
              <div
                className="testimonial-avatar"
                style={{
                  background: `color-mix(in srgb, ${t.color} 20%, rgba(255,255,255,0.05))`,
                  border: `1px solid color-mix(in srgb, ${t.color} 30%, transparent)`,
                  color: t.color,
                }}
                aria-hidden="true"
              >
                {t.initials}
              </div>
              <div className="testimonial-author-info">
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </div>
            <p className="testimonial-text">"{t.quote}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
