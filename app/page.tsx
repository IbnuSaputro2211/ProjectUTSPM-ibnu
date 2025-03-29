'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/Navbar';
import Skills from '../skills/page';
import Link from 'next/link';
import About from '../about/page';
import Contact from '../contact/page';
import Komentar from '../komentar/page';
import { useTheme } from '../lib/ThemeContext';

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const timelineItems = [
    { year: '2010', title: 'SDN KENCANA INDAH 1', description: 'Mulai ngerti kalau 1+1 = 2, tapi masih bingung kenapa kalau ditambah "0" tetap 2. Mulai suka koleksi penghapus wangi dan stik es krim' },
    { year: '2016', title: 'SMPN 3 RANCAEKEK', description: 'Masa-masa puncak labil. Tugas makin numpuk, Udah mulai kenal istilah "crush", "LDR", "Kita udah  nggak kayak dulu lagi." ' },
    { year: '2019', title: 'SMAS PASUNDAN RANCAEKEK', description: 'Dahlah, masa - masa galau + Covid, -1/10' },
    { year: '2023', title: 'MASOEM UNIVERSITY', description: 'Gadang --> Tugas  (No Gadang No Kelar ini Tugas), Saya butuh medkit!' },
  ];
  
  const [ref0, inView0] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [ref1, inView1] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: false, threshold: 0.1 });
  
  const timelineRefs = [
    { ref: ref0, inView: inView0 },
    { ref: ref1, inView: inView1 },
    { ref: ref2, inView: inView2 },
    { ref: ref3, inView: inView3 }
  ];
  
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

  const createFloatingElements = (container: HTMLElement) => {
    const codeSnippets = [
      "<div>",
      "</div>",
      "const",
      "let",
      "function()",
      "{}",
      "[]",
      "=>",
      "import",
      "export",
      "React",
      "useState",
      "useEffect",
      "</>",
      "return",
      ".map()",
      ".filter()",
      "async",
      "await",
    ];

    const colors = ["#4f46e5", "#8b5cf6", "#3b82f6", "#10b981", "#f97316"];

    for (let i = 0; i < 25; i++) {
      const element = document.createElement("div");
      const snippet =
        codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      element.innerText = snippet;
      element.className = "floating-element";
      element.style.color = color;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 200}vh`;
      element.style.animationDuration = `${Math.random() * 30 + 20}s`;
      element.style.animationDelay = `${Math.random() * 5}s`;
      element.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      element.style.fontSize = `${Math.random() * 0.8 + 0.8}rem`;
      element.style.transform = `rotate(${Math.random() * 360}deg)`;

      if (container) {
        container.appendChild(element);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    const codeContainer = document.getElementById("floating-code-container");
    if (codeContainer) {
      createFloatingElements(codeContainer);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Head>
        <title>Developer Portfolio</title>
        <meta name="description" content="Full-stack developer portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Dynamic Background */}
      <div id="floating-code-container" className="fixed inset-0 pointer-events-none overflow-hidden z-0" />
      
      {/* Gradient Overlay*/}
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gradient-radial from-transparent via-black/70 to-black' : 'bg-gradient-radial from-transparent via-gray-100/70 to-gray-200'} pointer-events-none z-0`} />
      
      {/* Interactive Background Blob - disesuaikan dengan tema */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background: isDarkMode 
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15) 0%, transparent 20%)`
            : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.1) 0%, transparent 20%)`,
          filter: 'blur(40px)',
        }}
      />
      
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233b82f6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundPosition: 'center',
          opacity: isDarkMode ? 0.5 : 0.3,
          x: backgroundX,
          y: backgroundY,
        }}
      />
      
      {/* Animated Grid Background - disesuaikan dengan tema */}
      <motion.div 
        className={`fixed inset-0 pointer-events-none z-0 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(79, 70, 229, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          y: useTransform(scrollYProgress, [0, 1], [0, 150]),
        }}
      />

      <Navbar scrollPosition={scrollPosition} />

      {/* Hero Section with scroll indicator */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Glowing circle behind name */}
        <motion.div 
          className={`absolute rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'} filter blur-3xl w-96 h-96`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3], 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Dari Ngoding Error ke Ngoding Pro inilah Perjalanan Epik Saya!
            </motion.h1>
            <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto mb-10`}>
              Saya Ibnu Risqi Saputro, Simak lika-liku perjalanan saya, dari pusing debugging hingga akhirnya bisa login!
            </p>
            
            {/* Animated portfolio link button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#about" 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md inline-flex items-center hover:shadow-glow transition-all duration-300 relative overflow-hidden group"
              >
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  animate={{ 
                    x: ['-100%', '100%'], 
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    ease: "easeInOut" 
                  }}
                />
                <span className="relative z-10">Lebih Banyak Tentang Saya</span>
                <svg 
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 12, 0], 
            opacity: [0.8, 0.4, 0.8] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2 
          }}
        >
          <div className="flex flex-col items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Scroll Ke Bawah Sikit</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 5V19M12 19L5 12M12 19L19 12" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-blue-400"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section with enhanced animations */}
      <section id="education" className="py-20 relative">
        {/* Decorative elements */}
        <motion.div 
          className={`absolute top-1/4 right-10 w-64 h-64 rounded-full ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'} filter blur-3xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2], 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut" 
          }}
        />
      
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Timeline Pendidikan
          </motion.h2>
          
          {/* Timeline container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full top-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 opacity-30" />
            
            {/* Enhanced progress line with glow effect */}
            <motion.div 
              className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-1 top-0 bg-gradient-to-b from-blue-400 to-purple-500 shadow-glow"
              style={{ 
                height: useTransform(scrollYProgress, [0, 0.1, 0.3], ['0%', '50%', '100%']),
                originY: 0,
                transition: "height 0.3s ease-out",
                boxShadow: "0 0 15px 1px rgba(79, 70, 229, 0.5)"
              }}
            />

            {/* Timeline items with enhanced animations */}
            <div className="relative">
              {timelineItems.map((item, index) => {
                const { ref, inView } = timelineRefs[index]; 
                const isEven = index % 2 === 0;
                const xInitialMobile = 50;

                return (
                  <motion.div
                    ref={ref}
                    key={index}
                    className="mb-16 relative pl-12 md:pl-0"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Left side */}
                      <motion.div 
                        className="hidden md:block md:w-1/2 md:pr-8 text-right"
                        initial={{ x: isEven ? -50 : 0, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      >
                        {isEven && (
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{item.title}</h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Enhanced center point with glow and pulse effect */}
                      <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: inView ? [0.8, 1.2, 1] : 0.8,
                            boxShadow: inView ? [
                              "0 0 0 0 rgba(79, 70, 229, 0)",
                              "0 0 0 10px rgba(79, 70, 229, 0.3)",
                              "0 0 0 0 rgba(79, 70, 229, 0)"
                            ] : "0 0 0 0 rgba(79, 70, 229, 0)"
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: inView ? 3 : 0,
                            repeatType: "loop"
                          }}
                          className="text-xs font-bold w-full h-full rounded-full flex items-center justify-center"
                          style={{
                            filter: inView ? "drop-shadow(0 0 8px rgba(103, 232, 249, 0.6))" : "none"
                          }}
                        >
                          {item.year}
                        </motion.div>
                      </div>
                      
                      {/* Right side */}
                      <motion.div 
                        className="hidden md:block md:w-1/2 md:pl-8"
                        initial={{ x: !isEven ? 50 : 0, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      >
                        {!isEven && (
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{item.title}</h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Mobile content */}
                      <motion.div 
                        className="md:hidden"
                        initial={{ x: xInitialMobile, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      >
                        <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{item.title}</h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <Skills />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <section id="komentar">
      <Komentar/>
      </section>
    </div>
  );
}