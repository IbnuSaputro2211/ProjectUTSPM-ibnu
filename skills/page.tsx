'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../lib/ThemeContext'; 

interface SkillItem {
  name: string;
  icon: string;
  level: number; 
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

const Skills = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filteredSkills, setFilteredSkills] = useState<SkillItem[]>([]);
  
  // Sample skill data - replace with your actual skills
  const skills: SkillItem[] = [
    // Frontend
    { name: 'HTML', icon: '📄', level: 90, category: 'frontend' },
    { name: 'CSS', icon: '🎨', level: 85, category: 'frontend' },
    { name: 'JavaScript', icon: '📜', level: 80, category: 'frontend' },
    { name: 'Next.js', icon: '🔼', level: 75, category: 'frontend' },
    { name: 'Tailwind', icon: '💨', level: 90, category: 'frontend' },
    
    // Backend
    { name: 'Express', icon: '🚂', level: 65, category: 'backend' },
    { name: 'MongoDB', icon: '🍃', level: 60, category: 'backend' },
    { name: 'SQL', icon: '🗄️', level: 70, category: 'backend' },
    
    // Tools
    { name: 'Git', icon: '🔄', level: 80, category: 'tools' },
    { name: 'VS Code', icon: '📝', level: 95, category: 'tools' },
    
    // Design
    { name: 'Figma', icon: '🎭', level: 75, category: 'design' },
    { name: 'Photoshop', icon: '🖌️', level: 65, category: 'design' },
  ];

  // Update filtered skills when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);

  // Categories for filter
  const categories = [
    { id: 'all', name: 'Semua Skill' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'tools', name: 'Tools' },
    { id: 'design', name: 'Design' },
  ];

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Skills & Teknologi
        </h2>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Skills grid */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-xl p-6 border transition-all duration-300 backdrop-blur-sm flex flex-col items-center ${
                isDarkMode 
                  ? 'bg-gray-800 bg-opacity-50 border-gray-700 hover:border-blue-500' 
                  : 'bg-white shadow-md border-gray-200 hover:border-blue-500 hover:shadow-lg'
              }`}
            >
              <span className="text-3xl mb-3">{skill.icon}</span>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>{skill.name}</h3>
              
              <div className={`w-full rounded-full h-3 mt-3 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{
                    boxShadow: '0 0 8px rgba(103, 232, 249, 0.6)'
                  }}
                />
              </div>
              <span className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{skill.level}%</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;