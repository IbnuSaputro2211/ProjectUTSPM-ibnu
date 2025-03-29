'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../lib/ThemeContext';
import { useRef } from 'react';

const Contact = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Ref for scroll-based transformations
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background parallax transformations
  const backgroundX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -50]
  );
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100]
  );
  
  // Setup intersection observer
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  // Animasi untuk komponen-komponen
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Data kontak
  const contactInfo = [
    { label: "Email", value: "saputroibnu300@gmail.com", icon: "📧" },
    { label: "WhatsApp", value: "+62 8562 4854 162", icon: "📱" },
    { label: "Instagram", value: "ibnoe8", icon: "📷" },
  ];

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className={`py-20 relative overflow-hidden ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      {/* Fixed background elements */}
      <div className={`fixed inset-0 ${
        isDarkMode 
          ? 'bg-gradient-radial from-transparent via-black/70 to-black' 
          : 'bg-gradient-radial from-transparent via-gray-100/70 to-gray-200'
      } pointer-events-none`} />

      {/* Animated background blobs */}
      <motion.div 
        className={`absolute rounded-full ${
          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
        } filter blur-3xl w-96 h-96`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* Animated grid background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          backgroundImage: isDarkMode
            ? 'linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(79, 70, 229, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          x: backgroundX,
          y: backgroundY,
          opacity: isDarkMode ? 0.5 : 0.3,
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className={`text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r ${
          isDarkMode 
            ? 'from-blue-400 to-purple-500'
            : 'from-blue-600 to-purple-700'
        }`}>
          Hubungi Saya
        </h2>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto"
        >
          {/* Informasi Kontak */}
          <motion.div
            variants={itemVariants}
            className="md:w-full"
          >
            <div className={`rounded-2xl p-8 border backdrop-filter backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800 bg-opacity-50 border-gray-700'
                : 'bg-white bg-opacity-80 border-gray-200 shadow-lg'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Informasi Kontak</h3>
              
              <p className={`mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Mau kerja sama? Atau cuma mau say hi biar kelihatan sibuk? Jangan malu-malu, hubungi saya aja lewat kontak di bawah. Saya janji nggak gigit! 😆📩
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    }`}
                    whileHover={{ 
                      x: 10,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-2xl">
                      {info.icon}
                    </div>
                    <div>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{info.label}</p>
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>{info.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Existing animated decorative elements */}
              <div className="relative h-16 mt-8">
                <motion.div
                  className="absolute bottom-0 left-0 w-10 h-10 bg-blue-500 rounded-full opacity-20"
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-1/3 w-8 h-8 bg-purple-500 rounded-full opacity-20"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-2/3 w-6 h-6 bg-pink-500 rounded-full opacity-20"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;