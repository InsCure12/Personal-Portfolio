import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import "./Footer.css";

const quickLinks = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Portfolio", href: "portfolio" },
  { label: "Contact", href: "contact" },
];

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/InsCure12", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://www.instagram.com/adip.jpeg/", label: "Instagram" },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <p className="footer-name">Adip</p>
            <p className="footer-tagline">Web Developer & UI/UX Designer</p>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <button
                key={link.href}
                className="footer-link"
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="footer-social">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Adip. All rights reserved.
          </p>
          <button
            className="footer-back-to-top"
            onClick={() => scrollToSection("home")}
            aria-label="Back to top"
          >
            <ArrowUp size={16} aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
