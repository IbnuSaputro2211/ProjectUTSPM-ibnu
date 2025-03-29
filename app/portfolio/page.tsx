'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Navbar from '../../components/Navbar2'
import { useTheme } from '../../lib/ThemeContext';

// Portfolio item type
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  date: string;
  links: {
    demo?: string;
    github?: string;
  };
}

// Function to create floating elements
const createFloatingElements = (container: HTMLElement) => {
  const codeSnippets = [
    "<div>", "</div>", "const", "let", "function()", "{}", "[]", "=>", "import", "export", 
    "React", "useState", "useEffect", "</>", "return", ".map()", ".filter()", "async", "await",
  ];
  
  // Clear any existing elements
  const existingElements = container.querySelectorAll('.floating-element');
  existingElements.forEach(el => el.remove());
  
  // Create new elements
  codeSnippets.forEach((snippet) => {
    const element = document.createElement('div');
    element.className = 'floating-element absolute text-opacity-20 pointer-events-none select-none';
    element.textContent = snippet;
    
    // Random positioning
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    element.style.left = `${left}%`;
    element.style.top = `${top}%`;
    
    // Random size
    const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
    element.style.fontSize = `${size}px`;
    
    // Random opacity
    const opacity = (Math.random() * 0.15) + 0.05; // 0.05 to 0.2
    element.style.opacity = opacity.toString();
    
    // Random rotation
    const rotation = Math.random() * 360;
    element.style.transform = `rotate(${rotation}deg)`;
    
    // Append to container
    container.appendChild(element);
    
    // Add animation
    const duration = (Math.random() * 50) + 30; // 30s to 80s
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    element.animate(
      [
        { transform: `rotate(${rotation}deg) translate(0px, 0px)` },
        { transform: `rotate(${rotation + 360 * direction}deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` }
      ],
      {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      }
    );
  });
};

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use theme context hook
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Refs for parallax effect
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Handle mounting state to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    
    // Check if mobile on initial load
    setIsMobile(window.innerWidth < 768);
    
    // Setup resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle scroll position for Navbar - only add event listeners after mounting
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);
  
  // Initialize floating elements after mounting
  useEffect(() => {
    if (isMounted && containerRef.current) {
      createFloatingElements(containerRef.current);
      
      // Recreate elements on window resize
      const handleResize = () => {
        if (containerRef.current) {
          createFloatingElements(containerRef.current);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMounted]);
  
  // Portfolio data with 4 items
  const portfolioItems: PortfolioItem[] = [ 
    {
      id: '1',
      title: 'Pernah Jadi Anggota KPPS - 24 Jam Begadang Demi Demokrasi',
      description: 'Skill spesial: Menulis, menghitung, dan tetap waras meski kurang tidur, serta waspada terhadap serangan Fajarrr.',
      longDescription:"Pernah merasakan sensasi begadang tanpa kopi demi menghitung suara dengan ketelitian setara AI? Jadi anggota KPPS bukan cuma soal ngitung kertas boss, tapi juga bertahan hidup dari serangan 'Mas surat suara kurang satu!, gimana nih?' sambil berusaha tetap senyum di depan saksi. Keahlian mencakup menulis cepat, multitasking ekstrem (ngitung suara sambil ngeladenin yang lupa bawa KTP), serta kepekaan tinggi terhadap kertas suara yang mirip lipatan baju. Tak lupa, pengalaman menghadapi pemilih yang datang 5 menit sebelum TPS tutup dengan ekspresi tidak bersalah, hadehh!",
      technologies: ['Kecepatan Merekap Suara Rakyat', 'Kesabaran Level Dewa', 'Anti-Serangan Fajar Club'],
      image: '/images/kpps.jpeg',
      date: 'June 2024',
      links: {
      },
    },
    {
      id: '2',
      title: 'Pernah Mengikuti Pelatihan Online Dicoding JavaScript – Skripnya Tak Terlihat, Tapi Errornya Nyata',
      description: "Petualangan seru belajar JavaScript: dari 'Hello World' hingga 'Kenapa Undefined Lagi?!'.",
      longDescription: 'Mengikuti pelatihan ini bukan sekadar belajar ngoding, tapi juga melatih mental menghadapi error yang muncul tanpa aba-aba. Berawal dari niat bikin web keren, berakhir dengan stack overflow penuh tab tutorial. Keahlian meliputi debugging dengan tatapan kosong, menulis kode yang jalan di satu file tapi error di file lain, serta kemampuan sakti menebak apakah bug berasal dari kode sendiri atau semesta sedang bercanda. Selain itu, berhasil memahami async-await setelah 3 kali baca ulang dokumentasi dan mengalami momen pencerahan saat akhirnya berhasil bikin aplikasi tanpa reload terus-terusan.',
      technologies: ['JavaScript', 'Promise vs Callback Battle', 'Debugging Pakai Insting'],
      image: '/images/java.jpg',
      date: 'January 2025',
      links: {
      
      },
    },
    {
      id: '3',
      title: 'Pernah Membuat Kalkulator Modern - Lebih dari Sekadar Hitung-hitungan!',
      description: 'Kalkulator canggih yang bukan cuma buat tambah-kurang, tapi juga bisa bantu perhitungan kompleks dengan gaya futuristik.',
      longDescription: 'Kalkulator Modern ini dirancang untuk membantu kebutuhan perhitungan dengan tema kalkulator yang menarik dan futuristik, mulai dari operasi dasar. Aplikasi ini juga mendukung perhitungan berbasis real-time dengan antarmuka minimalis, responsif, dan Tema yang bervariatif. Dibangun menggunakan teknologi modern untuk performa cepat dan tampilan elegan, Well Pokona mah!',
      technologies: ['React', 'Node.js', 'Next JS','Vercel'],
      image: '/images/kalk.jpg',
      date: 'February 2025',
      links: {
        demo: 'https://kalkulator-modern-seven.vercel.app/',
        github: 'https://github.com/IbnuSaputro2211/KalkulatorModern',
      },
    },
    {
      id: '4',
      title: 'Bonus: Pernah Mencapai Rank Mythical Glory di Mobile Legends (Trus Turun Lagi, Maklum Solo Rank)',
      description: 'Ahli dalam mendaki Mythical Glory dengan penuh perjuangan, lalu turun secepat pesawat tanpa mesin gara-gara tim sakti mandraguna—sakti ngefeed maksudnya.',
      longDescription: 'Skill ini mencakup pengalaman naik turun rank lebih cepat dari flash sale, penguasaan hero META (tapi kalau di-nerf langsung pura-pura nggak kenal), serta kemampuan blaming tim setiap kekalahan dengan dalih “bukan salah gue, salah sistem matchmaking.” Hero andalan mencakup: Gatotkaca (ultimate buat buka war, tapi tim malah sibuk farming), Chou (suka freestyle tendang musuh ke dalam turret, tapi lupa mundur), dan Yuzhong (nge-dive ke lima orang musuh, berharap tim follow-up, tapi malah sebaliknya). Selain itu, sudah terbiasa mengalami epic comeback (kalau musuhnya panik), adaptasi cepat terhadap patch baru yang sering kali mengubah hero favorit jadi sekadar koleksi skin, serta menghadapi berbagai spesies Solo Rank: player feeder santuy, joki akun pinjaman, dan bocil yang lebih suka spamming chat daripada main game.',
      technologies: ['Macro Play (Tapi Kadang Ngaco)', 'Micro Play (Kalau Lagi Serius)', 'Map Awareness (Cuma Pas Lagi Jaga Buff)', 'Sabar di Solo Rank (Opsional)', 'Selalu Istigfar (Habis Kalah Gara-Gara Tim)'],
      image: '/images/newml.jpg',
      date: '2021-2024',
      links: {
      },
    },
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Theme-based background and card gradients
  const gradientBg = isDark 
    ? "bg-gradient-to-br from-black via-gray-900 to-gray-800" 
    : "bg-gradient-to-br from-white via-gray-100 to-gray-200";
  
  const cardGradient = isDark 
    ? "bg-gradient-to-br from-gray-900 to-black" 
    : "bg-gradient-to-br from-gray-100 to-white";
  
  const buttonGradient = "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600";
  
  // Theme-based text colors
  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const subtitleColor = isDark ? "text-gray-300" : "text-gray-600";
  const accentColor = isDark ? "text-blue-400" : "text-blue-600";
  const cardTextColor = isDark ? "text-gray-300" : "text-gray-600";
  const timelineColor = isDark 
    ? "bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500" 
    : "bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400";
  
  // Badge color
  const badgeBg = isDark ? "bg-gray-800/60" : "bg-gray-200/60";
  const badgeText = isDark ? "text-gray-200" : "text-gray-700";
  
  // Parallax effect transformations
  const bgY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const bgY2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const bgY3 = useTransform(scrollY, [0, 1000], [0, -50]);
  const bgOpacity1 = useTransform(scrollY, [0, 300], [0.5, 0.2]);
  const bgOpacity2 = useTransform(scrollY, [0, 300], [0.4, 0.15]);
  const titleY = useTransform(scrollY, [0, 300], [0, -30]);

  // Add CSS for floating elements
  const floatingElementsStyle = `
    .floating-element {
      font-family: monospace;
      color: ${isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(37, 99, 235, 0.2)'};
      z-index: 1;
      text-shadow: 0 0 5px ${isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.3)'};
    }
  `;

  return (
    <>
      {/* Render Navbar after client-side hydration */}
      {isMounted && <Navbar scrollPosition={scrollPosition} />}
      
      {/* Style tag for floating elements */}
      {isMounted && (
        <style jsx global>{floatingElementsStyle}</style>
      )}
      
      {/* Main container with ref for parallax effect */}
      <div 
        ref={containerRef} 
        className={`min-h-screen ${gradientBg} ${textColor} py-24 px-4 sm:px-6 relative overflow-hidden`}
      >
        {/* Smooth parallax background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Theme-based gradient layers */}
          <motion.div 
            className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-transparent to-blue-900/5' : 'bg-gradient-to-t from-transparent to-blue-500/5'}`}
            style={{ y: bgY1, opacity: bgOpacity1 }}
          />
          <motion.div 
            className={`absolute inset-0 ${isDark ? 'bg-gradient-to-tr from-purple-900/5 to-transparent' : 'bg-gradient-to-tr from-purple-500/5 to-transparent'}`}
            style={{ y: bgY2, opacity: bgOpacity2 }}
          />
          <motion.div 
            className="absolute left-0 right-0 top-0 h-full"
            style={{ y: bgY3 }}
          >
            <div className={`absolute top-20 left-1/4 w-64 h-64 rounded-full ${isDark ? 'bg-blue-600/5' : 'bg-blue-400/5'} blur-3xl`}></div>
            <div className={`absolute top-40 right-1/4 w-96 h-96 rounded-full ${isDark ? 'bg-purple-600/5' : 'bg-purple-400/5'} blur-3xl`}></div>
            <div className={`absolute bottom-20 left-1/3 w-80 h-80 rounded-full ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-300/5'} blur-3xl`}></div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 sm:mb-20 text-center"
            style={{ y: titleY }}
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
              Portofolio / Pengalaman
            </motion.h1>
            <motion.p 
              className={`text-base sm:text-lg md:text-xl ${subtitleColor} max-w-3xl mx-auto px-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Welcome to my portofolio, tempat gue pamer hasil keringet dan begadang! 😎☕
            </motion.p>
          </motion.div>

          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Timeline line - Updated with themed gradient - hidden on mobile, visible on md+ */}
            <div className={`absolute left-0 md:left-1/2 transform md:translate-x-px top-0 h-full w-px ${timelineColor} hidden md:block`}></div>
            
            {/* Mobile timeline line - Updated with themed gradient */}
            <div className={`absolute left-4 top-0 h-full w-px ${timelineColor} md:hidden`}></div>

            {/* Portfolio items */}
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`mb-12 sm:mb-20 flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Enhanced timeline dot with pulse effect */}
                <motion.div 
                  className={`absolute left-4 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg border-4 ${isDark ? 'border-black' : 'border-white'} z-10`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-purple-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>

                {/* Content - adjusted for mobile */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 pl-12 md:pl-0' : 'md:pl-16 pl-12 md:pl-0'}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`${cardGradient} rounded-lg overflow-hidden shadow-xl cursor-pointer transition-all ${isDark ? 'border border-gray-800/20 hover:shadow-blue-500/10 hover:border-blue-500/30' : 'border border-gray-300/30 hover:shadow-blue-300/20 hover:border-blue-400/40'}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Added portfolio item image */}
                    <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title}
                        fill={true}
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4 sm:p-8">
                      <div className={`text-xs sm:text-sm ${accentColor} mb-2 font-medium`}>{item.date}</div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 line-clamp-2">{item.title}</h3>
                      <p className={`${cardTextColor} mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base line-clamp-3`}>{item.description}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-5">
                        {item.technologies.slice(0, isMobile ? 2 : 3).map((tech) => (
                          <span key={tech} className={`${badgeBg} ${badgeText} text-xs rounded-full px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm`}>
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > (isMobile ? 2 : 3) && (
                          <span className={`${isDark ? 'bg-blue-900/60 text-blue-200' : 'bg-blue-200/60 text-blue-700'} text-xs rounded-full px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm`}>
                            +{item.technologies.length - (isMobile ? 2 : 3)} more
                          </span>
                        )}
                      </div>
                      <motion.div
                        whileHover={{ x: 8 }}
                        className={`${accentColor} flex items-center text-xs sm:text-sm font-medium`}
                      >
                        View details <ArrowRight size={14} className="ml-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Portfolio Detail Modal with proper image display - optimized for mobile */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className={`${cardGradient} rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'border border-gray-800/30' : 'border border-gray-300/30'} shadow-2xl`}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Back button for mobile */}
                <div className={`${isDark ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-sm py-3 px-4 flex items-center md:hidden sticky top-0 z-10 ${isDark ? 'border-b border-gray-800/30' : 'border-b border-gray-300/30'}`}>
                  <motion.button
                    className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'} gap-1`}
                    onClick={() => setSelectedItem(null)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </motion.button>
                </div>
                
                {/* Improved image display in modal */}
                <div className="relative h-48 sm:h-72 w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                  <Image 
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill={true}
                    className="object-cover"
                    priority={true}
                  />
                  <motion.button
                    className={`absolute top-4 right-4 ${isDark ? 'bg-black/80' : 'bg-white/80'} p-2 rounded-full ${isDark ? 'border border-gray-800/30' : 'border border-gray-300/30'} backdrop-blur-sm hidden md:flex`}
                    onClick={() => setSelectedItem(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                  </motion.button>
                </div>
                <div className="p-5 sm:p-10">
                  <motion.h2 
                    className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedItem.title}
                  </motion.h2>
                  <motion.div 
                    className={`${accentColor} mb-4 sm:mb-6 text-sm sm:text-base`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedItem.date}
                  </motion.div>
                  <motion.p 
                    className={`${cardTextColor} mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedItem.longDescription}
                  </motion.p>
                  <motion.div 
                    className="mb-6 sm:mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${isDark ? 'text-blue-300' : 'text-blue-500'}`}>Skill yang dikuasai</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {selectedItem.technologies.map((tech) => (
                        <motion.span 
                          key={tech} 
                          className={`${badgeBg} ${badgeText} rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm`}
                          whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.1)" 
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex gap-3 sm:gap-4 flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {selectedItem.links.demo && (
                      <motion.a
                        href={selectedItem.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${buttonGradient} px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base text-white`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={16} className="sm:w-5 sm:h-5" /> View Demo
                      </motion.a>
                    )}
                    {selectedItem.links.github && (
                      <motion.a
                        href={selectedItem.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${isDark ? 'bg-gray-800/60 hover:bg-gray-700/60' : 'bg-gray-200/60 hover:bg-gray-300/60'} px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={16} className="sm:w-5 sm:h-5" /> View Code
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Portfolio;