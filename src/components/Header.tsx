import { useState, useEffect } from 'react'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    // Use Intersection Observer for more accurate detection
    const observerOptions = {
      root: document.querySelector('motion.div[style*="overflowY: auto"]'),
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          console.log(`Intersection Observer detected: ${sectionId}`)
          setActiveSection(sectionId)
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = ['home', 'about', 'resume', 'portfolio']
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    // Fallback scroll handler
    const handleScroll = () => {
      const scrollContainer = document.querySelector('motion.div[style*="overflowY: auto"]')
      if (scrollContainer) {
        setScrolled(scrollContainer.scrollTop > 50)
      } else {
        setScrolled(window.scrollY > 50)
      }
    }

    // Listen to scroll events for scrolled state
    window.addEventListener('scroll', handleScroll)
    const scrollContainer = document.querySelector('motion.div[style*="overflowY: auto"]')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleNavigation = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId)
      const scrollContainer = document.querySelector('motion.div[style*="overflowY: auto"]')
      
      // Immediately update active section
      setActiveSection(sectionId)
      console.log(`Navigating to: ${sectionId}`)
      
      if (element) {
        if (sectionId === 'home') {
          // For Home, force scroll to absolute top
          if (scrollContainer) {
            scrollContainer.scrollTop = 0
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
            console.log('Direct scroll to top for Home')
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            console.log('Window scroll to top for Home')
          }
          
          // Also try scrollIntoView as backup
          setTimeout(() => {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
            console.log('Backup scrollIntoView for Home')
          }, 100)
        } else {
          // For other sections, use normal scrollIntoView
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
    
    setIsMenuOpen(false)
  }

  const isActive = (sectionId: string) => {
    return activeSection === sectionId
  }

  const navItems = [
    { label: 'Home', href: 'home' },
    { label: 'About', href: 'about' },
    { label: 'Resume', href: 'resume' },
    { label: 'Portfolio', href: 'portfolio' }
  ]

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          {navItems.map((item) => (
            <div key={item.href} className="nav-item">
              <button
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.href)}
              >
                <span className="nav-text">{item.label}</span>
                <div className="nav-indicator"></div>
              </button>
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <button
              key={item.href}
              className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header