import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef, useState, useEffect } from 'react'
// @ts-ignore
import GradientText from './GradientText'
import './Resume.css'

const Resume = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const educationData = [
    {
      date: "2021 - 2023",
      title: "High School",
      institution: "SMAN 2 Denpasar"
    },
    {
      date: "2023-Present",
      title: "Technology Information System",
      institution: "ITB STIKOM Bali"
    },
    {
      date: "2025",
      title: "Full Stack Development",
      institution: "Hacktiv8"
    },
    {
      date: "2025",
      title: "Web Development",
      institution: "Purwadhika Bootcamp"
    }
  ]

  const experienceData = [
    {
      date: "2023 - Present",
      title: "Freelance Photographer",
      company: "Freelance"
    },
    {
      date: "2023 - Present",
      title: "Junior Web Developer",
      company: "Balica Travel"
    }
  ]
  
  // Combine all timeline data
  const allTimelineData = [
    ...educationData.map(item => ({ ...item, type: 'education' })),
    ...experienceData.map(item => ({ ...item, type: 'experience' }))
  ].sort((a, b) => {
    // Sort by year (extract year from date)
    const yearA = parseInt(a.date.split('-')[0])
    const yearB = parseInt(b.date.split('-')[0])
    return yearB - yearA // Most recent first
  })

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((progress) => {
      const newIndex = Math.floor(progress * allTimelineData.length)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < allTimelineData.length) {
        setActiveIndex(newIndex)
      }
    })
    return () => unsubscribe()
  }, [smoothProgress, allTimelineData.length, activeIndex])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <div className="resume-section" ref={ref}>
      <div className="resume-container">
        {/* Header */}
        <motion.div 
          className="resume-header"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h1 
            className="resume-title"
            variants={itemVariants}
          >
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="custom-class"
            >
              My Academic and Professional Journey
            </GradientText>
          </motion.h1>
        </motion.div>

        {/* Scroll-Triggered Timeline */}
        <motion.div 
          className="scroll-timeline-container"
          ref={timelineRef}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Progress Line */}
          <div className="timeline-progress-line">
            <motion.div 
              className="timeline-progress-fill"
              style={{
                scaleY: smoothProgress,
                transformOrigin: "top"
              }}
            />
            <motion.div 
              className="timeline-progress-indicator"
              style={{
                y: useTransform(smoothProgress, [0, 1], [0, 400])
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="timeline-items">
            {allTimelineData.map((item, index) => (
              <motion.div
                key={index}
                className={`timeline-item-scroll ${index <= activeIndex ? 'active' : ''} ${item.type}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.6, delay: index * 0.1 }
                }}
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="timeline-item-content">
                  <div className="timeline-item-header">
                    <span className="timeline-type-badge">{item.type}</span>
                    <span className="timeline-date">{item.date}</span>
                  </div>
                  <h3 className="timeline-title">
                    {item.title}
                  </h3>
                  <p className="timeline-company">
                    {'institution' in item ? item.institution : item.company}
                  </p>
                </div>
                <div className="timeline-connector"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Resume


