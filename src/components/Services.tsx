import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code, PenTool } from "lucide-react";
import GradientText from "./GradientText";
import "./Services.css";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "From landing pages to full-stack apps — I deliver responsive, performant products built with React, Next.js, and TypeScript that scale.",
    color: "var(--neon-cyan)",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description:
      "Clean, intentional interfaces designed in Figma and brought to life with pixel-perfect precision. Beautiful and accessible by default.",
    color: "var(--neon-purple)",
  },
];

const Services = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="services-section" ref={ref}>
      <motion.div
        className="services-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="services-label">What I Do</span>
        <GradientText>Services</GradientText>
      </motion.div>

      <div className="services-grid">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            className="service-card"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
          >
            <div
              className="service-icon-wrapper"
              style={
                { "--service-color": service.color } as React.CSSProperties
              }
            >
              <service.icon size={28} aria-hidden="true" />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
