import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import GradientText from "./GradientText";
import "./Contact.css";

const WHATSAPP_NUMBER = "6281234567890"; // Replace with actual number
const WHATSAPP_TEMPLATE = encodeURIComponent(
  "Hi Adip! I came across your portfolio and would love to discuss a project. Let's connect!"
);

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/InsCure12", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://www.instagram.com/adip.jpeg/", label: "Instagram" },
];

const Contact = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="contact-section" ref={ref}>
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="contact-label">Get In Touch</span>
        <h2 className="contact-heading">
          <GradientText>Let's Work Together</GradientText>
        </h2>
        <p className="contact-subtext">
          Have a project in mind? Let's chat and bring your ideas to life.
        </p>

        <a
          className="contact-whatsapp-btn"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEMPLATE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={22} aria-hidden="true" />
          Chat on WhatsApp
        </a>

        <div className="contact-social-row">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              aria-label={label}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
