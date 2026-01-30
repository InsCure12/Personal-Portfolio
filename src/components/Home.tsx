import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Mail, Twitter, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import ProfileCard from './ProfileCard'
import TextType from './TextType'

const Home = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const socialIcons = [
    { Icon: Github, href: 'https://github.com/InsCure12', delay: 0, target: '_blank', rel: 'noopener noreferrer', },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/i-putu-mahadiputra-udayana-7252012ab/', delay: 0.1, target: '_blank', rel: 'noopener noreferrer', },
    { Icon: Mail, href: 'mailto:mahadiputra09@gmail.com', delay: 0.2, target: '_blank', rel: 'noopener noreferrer', },
    { Icon: Twitter, href: '#', delay: 0.3 },
    { Icon: Instagram, href: 'https://www.instagram.com/adip.jpeg/', delay: 0.4, target: '_blank', rel: 'noopener noreferrer',  },
  ]

  return (
    <div className="h-screen flex items-start justify-center px-6 pt-50 pb-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start max-w-7xl">
        {/* Left side - Text content */}
        <motion.div 
          className="space-y-8 flex flex-col justify-start text-center lg:text-left pt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <motion.div 
              className="mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight"
                style={{
                  background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-green), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Putu Adip
              </motion.h1>
              <motion.h2 
                className="text-3xl lg:text-4xl xl:text-5xl font-light neon-text tracking-wider"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TextType 
                  text={["FrontEnd Developer", "Blockchain Enthusiast", "Happy coding!"]}
                  speed={100}
                  deleteSpeed={50}
                  delay={2000}
                  className="text-3xl lg:text-4xl xl:text-5xl font-light neon-text tracking-wider"
                />
              </motion.h2>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.p 
              className="text-lg lg:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              I create beautiful, responsive web applications with modern technologies. 
              Passionate about clean code and exceptional user experiences.
            </motion.p>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            {socialIcons.map(({ Icon, href, delay }, index) => (
              <motion.a
                key={index}
                href={href}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-white/20 hover:scale-110"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + delay, duration: 0.5 }}
              >
                <Icon className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => window.location.href = '#portfolio scrollIntoView'}
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                onClick={() => {
                  document.getElementById('portfolio')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View My Work
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                Download CV
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - Profile Card */}
        <motion.div 
          className="flex justify-center lg:justify-end"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileCard 
              name="Putu Adip"
              title="FrontEnd Developer"
              handle="adipadiadip"
              status="Online"
              contactText="Contact Me"
              avatarUrl="./public/profile.jpg"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={true}
              onContactClick={() => console.log('Contact clicked')}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home