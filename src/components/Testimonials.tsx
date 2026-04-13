import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "./GradientText";
import "./Testimonials.css";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Placeholder testimonial text. Replace with a real quote from a colleague or client about your work.",
    name: "John Doe",
    role: "Role at Company",
    color: "var(--neon-cyan)",
  },
  {
    quote: "Another placeholder. Add real feedback you've received about your development or design work.",
    name: "Jane Smith",
    role: "Role at Company",
    color: "var(--neon-purple)",
  },
  {
    quote: "Third placeholder testimonial for layout balance. Replace with genuine feedback.",
    name: "Alex Johnson",
    role: "Role at Company",
    color: "var(--neon-green)",
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

      <div className="testimonials-track">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <span className="testimonial-quote" style={{ color: t.color }}>"</span>
            <p className="testimonial-text">{t.quote}</p>
            <div className="testimonial-author">
              <div
                className="testimonial-avatar"
                style={{ background: `color-mix(in srgb, ${t.color} 15%, transparent)` }}
                aria-hidden="true"
              />
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
