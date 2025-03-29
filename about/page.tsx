'use client';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../lib/ThemeContext'; 

// Interface untuk data profil
interface ProfileData {
  name: string;
  title: string;
  description: string;
  photoUrl: string;
  details: {
    label: string;
    value: string;
    icon: string;
  }[];
}

const About = () => {
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
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
  
  // Data profil - ganti sesuai data pribadi Anda
  const profileData: ProfileData = {
    name: "Ibnu Risqi Saputro",
    title: "Mahasiswa Aktif Universitas Ma'soem",
    description: "Seorang mahasiswa aktif semester 4 yang terus berjuang antara deadline tugas, dosen killer, dan impian jadi PNS. Saat ini sedang fokus jalan ninja di dunia Sistem Informasi, di mana logika harus tajam, mata harus kuat melihat kode error, dan sikap yang satset dalam mengerjakan tugas. Semoga Puunya passion besar dalam ngoding, terutama dalam membangun aplikasi web yang fungsional dan estetis. Sudah terbiasa menghadapi bug yang lebih rumit dari skripsi, dan error yang datang tanpa aba-aba seperti kuota yang tiba-tiba habis. Saat tidak sedang berkutat dengan kode, biasanya sibuk mencari motivasi hidup di warung kopi(Opsional) atau merenungkan masa depan di sela-sela main games.",
    photoUrl: "/images/saya2.jpg", 
    details: [
      { label: "Tempat/Tanggal Lahir", value: "Klaten, 04 Desember 2003", icon: "🎂" },
      { label: "Pendidikan Saat ini", value: "S1 Sistem Informasi", icon: "🎓" },
      { label: "Nim", value: "232505024", icon: "📧" },
      { label: "Lokasi", value: "Kencana, Indonesia", icon: "📍" },
    ]
  };

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

  // Animasi untuk foto
  const photoFrameVariants = {
    initial: { 
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
      scale: 1
    },
    hover: { 
      boxShadow: '0 0 25px rgba(124, 58, 237, 0.8)',
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section 
      ref={containerRef}
      id="about" 
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
          Tentang Saya
        </h2>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto"
        >
          {/* Photo Frame Section */}
          <motion.div
            variants={itemVariants}
            className="md:w-2/5 flex justify-center"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden border-4 p-1"
              variants={photoFrameVariants}
              initial="initial"
              whileHover="hover"
              animate={isPhotoHovered ? "hover" : "initial"}
              onMouseEnter={() => setIsPhotoHovered(true)}
              onMouseLeave={() => setIsPhotoHovered(false)}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                padding: '4px'
              }}
            >
            <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-xl bg-gray-800">
            <Image
              src={profileData.photoUrl}
              alt={profileData.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-in-out"
              style={{
                transform: isPhotoHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          </div>
                        
              {/* Animated elements around photo */}
              <motion.div
                className="absolute -top-3 -left-3 w-10 h-10 bg-blue-500 rounded-full"
                animate={{ 
                  y: [0, 10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-3 -right-3 w-8 h-8 bg-purple-500 rounded-full"
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute top-1/2 -right-4 w-6 h-6 bg-pink-500 rounded-full"
                animate={{ 
                  x: [0, -8, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
          </motion.div>
          
          {/* About Content Section */}
          <motion.div
            variants={itemVariants}
            className="md:w-3/5"
          >
            <h3 className={`text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{profileData.name}</h3>
            <p className="text-xl text-blue-400 mb-6">{profileData.title}</p>
            
            <motion.p 
              className={`mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              variants={itemVariants}
            >
              {profileData.description}
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileData.details.map((detail, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center space-x-3 rounded-lg p-3 border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 bg-opacity-50 border-gray-700 hover:border-blue-500'
                      : 'bg-white bg-opacity-80 border-gray-200 hover:border-blue-500 shadow-sm'
                  }`}
                >
                  <span className="text-2xl">{detail.icon}</span>
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{detail.label}</p>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          {/* Updated Experience Button */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/portfolio" 
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
                <span className="relative z-10">Lihat Pengalaman</span>
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;