'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  scrollPosition: number;
}

export default function Navbar({ scrollPosition }: NavbarProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string>("");
  const [menuHovered, setMenuHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Track active section based on scroll position - only run on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.pageYOffset + 100;
      
      sections.forEach((section) => {
        const sectionId = section.getAttribute("id");
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveItem(sectionId || "");
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check for active section
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen || typeof window === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Menu items with hover tracking
  const menuItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/#education", label: "Riwayat Pendidikan", icon: "🎓" },
    { href: "/#skills", label: "Skills", icon: "💻" },
    { href: "/portfolio", label: "Pengalaman", icon: "🚀" },
    { href: "/#about", label: "Tentang", icon: "👨‍💻" },
    { href: "/#contact", label: "Kontak", icon: "📱" },
    { href: "/#komentar", label: "Komentar & Penilaian", icon: "🗨️" },
    { href: "#ai", label: "Chatbot", icon: "🤖" }
  ];

  const handleMenuClick = (href: string) => {
    if (href.startsWith('#')) {
      if (typeof window !== 'undefined') {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    } else {
      // Navigation to a different page
      router.push(href);
      setMobileMenuOpen(false);
    }
  };

  // Variants for mobile menu animations
  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: { 
      x: 50, 
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  // Burger menu button animation variants
  const burgerTopVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 }
  };
  
  const burgerMiddleVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  };
  
  const burgerBottomVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 }
  };

  // Check if item is active
  const isActive = (item: { label: string; href: string }) => {
    if (typeof window === 'undefined') return false;
    
    return (item.label === "Pengalaman" && pathname === "/portfolio") || 
           (item.href.startsWith('#') && activeItem === item.href.replace('#', ''));
  };

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 py-4 px-4 transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, 
          rgba(17,24,39,${Math.min(0.92, 0.75 + scrollPosition/800)}), 
          rgba(30,58,138,${Math.min(0.92, 0.75 + scrollPosition/800)}))`,
        backdropFilter: `blur(${Math.min(8, 4 + scrollPosition/300)}px)`,
        boxShadow: scrollPosition > 50 
          ? '0 10px 30px -10px rgba(0,0,0,0.5), 0 1px 4px rgba(147, 197, 253, 0.07), 0 -1px 0px rgba(147, 197, 253, 0.1) inset' 
          : 'none'
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo area with pulsing effect */}
        <div className="flex items-center group">
          <motion.div
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.6 }
            }}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg overflow-hidden relative"
          >
            <motion.div
              animate={{ 
                opacity: [0.1, 1, 0.1],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-700 opacity-0"
            />
            
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </motion.div>
          
          <motion.span 
            className="ml-3 text-xl font-bold relative"
            whileHover={{ scale: 1.05 }}
          >
            <span className="absolute -inset-0.5 blur-md bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-75 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-500">
              IbnuPortfolio
            </span>
          </motion.span>
        </div>

        {/* Desktop Navigation menu with interactive effects */}
        <nav 
          className="hidden md:flex items-center space-x-5"
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
        >
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.href}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.1 * index, duration: 0.3 }
              }}
            >
              <Link 
                href={item.href} 
                className="relative overflow-hidden group px-2 py-1 block"
                onClick={(e) => {
                  if(item.href.startsWith('#')) {
                    e.preventDefault();
                    handleMenuClick(item.href);
                  }
                }}
                aria-current={isActive(item) ? "page" : undefined}
              >
                {/* Hover background */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out"></span>
                
                {/* Text */}
                <span className={`relative text-sm md:text-base transition-colors duration-300 ${
                  isActive(item) ? 'text-blue-300' : 'text-white group-hover:text-blue-300'
                }`}>
                  {item.label}
                </span>
                
                {/* Underline */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform origin-left transition-all duration-300 ease-out ${
                  isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
                
                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive(item) && (
                    <motion.span 
                      className="absolute -top-1 right-0 h-1.5 w-1.5 rounded-full bg-blue-400"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      layoutId="activeDot"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
          
          {/* Menu hover effect - subtle particle flow */}
          <AnimatePresence>
            {menuHovered && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/80 to-purple-500/0 animate-gradient-x"></span>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden z-50 relative">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col justify-center items-center p-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <motion.div
              variants={burgerTopVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mb-1.5"
            />
            <motion.div
              variants={burgerMiddleVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mb-1.5"
            />
            <motion.div
              variants={burgerBottomVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-gray-900 z-40 flex flex-col p-6 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #111827, #1e3a8a)",
              boxShadow: "0 0 30px rgba(0,0,0,0.7)"
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              >
                Menu Navigasi
              </motion.h3>
            </div>

           {/* Animated cosmic particles in the background */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-500"
                  initial={{ 
                    opacity: 0.5 * Math.random() + 0.1,
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 0.2 + 0.1
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [Math.random() * 0.2 + 0.1, Math.random() * 0.5 + 0.2, Math.random() * 0.2 + 0.1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 5 + Math.random() * 10,
                    delay: Math.random() * 2
                  }}
                  style={{
                    width: Math.random() * 10 + 2 + "px",
                    height: Math.random() * 10 + 2 + "px",
                    filter: `blur(${Math.random() * 2}px)`,
                    background: `radial-gradient(circle, rgba(59, 130, 246, ${Math.random() * 0.5 + 0.5}) 0%, rgba(147, 51, 234, 0) 70%)`
                  }}
                />
              ))}
            </div>

            {/* Menu items with smooth stagger animation */}
            <ul className="space-y-4 mt-4 z-10" role="menu">
              {menuItems.map((item) => (
                <motion.li
                  key={item.href}
                  variants={menuItemVariants}
                  className="border-b border-blue-800/30 pb-3"
                  role="menuitem"
                >
                  <Link 
                    href={item.href}
                    className={`flex items-center space-x-3 group`}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        handleMenuClick(item.href);
                      }
                    }}
                    aria-current={isActive(item) ? "page" : undefined}
                  >
                    <motion.div 
                      className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                        isActive(item)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-blue-900/30'
                      } transition-colors duration-300`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    </motion.div>
                    <span className="relative">
                      <span className={`text-lg ${
                        isActive(item)
                          ? 'text-blue-300' 
                          : 'text-white'
                      } group-hover:text-blue-300 transition-colors duration-300`}>
                        {item.label}
                      </span>
                      <motion.span 
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                        style={{ 
                          width: isActive(item) ? '100%' : '0%' 
                        }}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom section with animated gradient */}
            <motion.div 
              className="mt-auto pt-6 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative h-1 w-full overflow-hidden rounded-full">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 3,
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <div className="mt-6 text-center">
                <motion.p 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  © 2025 Ibnu Risqi
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}