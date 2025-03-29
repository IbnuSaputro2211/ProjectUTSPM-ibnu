'use client';
import { useState, useEffect, useRef} from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';
import Navbar from '../../components/Navbar3';
import MessageItem from '../../components/MessageItem';

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Correctly typed message refs
  const messageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Get scroll progress
  const { scrollYProgress } = useScroll();
  
  // Move useTransform to component level instead of inside renderChatBackground
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
  
  // Grid background transform
  const gridBackgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Convert scrollYProgress to a numeric value for Navbar
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Subscribe to scrollYProgress changes
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollPosition(latest);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [scrollYProgress]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input || isAiTyping) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    
    // Show typing indicator
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      // Hide typing indicator and add the AI response
      setIsAiTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setIsAiTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error retrieving response." }]);
    }
  };

  // Fungsi ini tidak lagi menggunakan useTransform langsung di dalamnya
  const renderChatBackground = () => (
    <>
      {/* Dynamic Background Effects */}
      <motion.div 
        className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
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
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%233b82f6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundPosition: 'center',
          opacity: isDarkMode ? 0.5 : 0.3,
          x: backgroundX,
          y: backgroundY,
        }}
      />

      <motion.div 
        className={`fixed inset-0 pointer-events-none z-0 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(79, 70, 229, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          y: gridBackgroundY, // Menggunakan variabel transformasi yang didefinisikan di level komponen
        }}
      />
    </>
  );

  // AI Typing animation component
  const TypingIndicator = () => (
    <div className={`flex items-center p-3 rounded-lg max-w-[85%] ml-auto ${
      isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-100'
    }`}>
      <div className="flex space-x-2">
        <motion.div 
          className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-300' : 'bg-indigo-500'}`}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0 }}
        />
        <motion.div 
          className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-300' : 'bg-indigo-500'}`}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.15 }}
        />
        <motion.div 
          className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-300' : 'bg-indigo-500'}`}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen overflow-x-hidden relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Navbar scrollPosition={scrollPosition} />

      {renderChatBackground()}

      {/* Responsive container - added max-w for different screen sizes */}
      <div className="relative z-10 p-4 pt-20 w-full mx-auto 
                      max-w-[95%] sm:max-w-[90%] md:max-w-xl lg:max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Lite
          </h1>
        </motion.div>

        <div 
          ref={chatContainerRef}
          className="border border-gray-300/20 p-3 sm:p-4 rounded-lg h-[400px] sm:h-[500px] 
                    overflow-y-auto flex flex-col bg-white/10 backdrop-blur-md shadow-lg"
        >
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Mulai percakapan dengan mengirim pesan...
              </p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div 
              key={index}
              ref={(el) => {
                messageRefs.current[index] = el;
              }}
            >
              <MessageItem msg={msg} />
            </div>
          ))}
          
          {/* Typing indicator */}
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-2 sm:ml-4 mb-2 mt-2"
            >
              <TypingIndicator />
            </motion.div>
          )}
        </div>

        <motion.div 
          className="flex mt-3 sm:mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            className={`flex-1 border p-2 sm:p-3 text-sm sm:text-base rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isAiTyping}
          />
          <motion.button 
            whileHover={{ scale: isAiTyping ? 1 : 1.05 }}
            whileTap={{ scale: isAiTyping ? 1 : 0.95 }}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-r-lg transition-all duration-300 ${
              isAiTyping 
                ? 'bg-gray-500 text-white cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
            }`}
            onClick={sendMessage}
            disabled={isAiTyping}
          >
            {isAiTyping ? 'Sabarrr...' : 'Kirim'}
          </motion.button>
        </motion.div>
        
        {/* Added responsive footer */}
        <div className="mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-1">Gemini Lite &copy; {new Date().getFullYear()}</p>
          <p>Platform chat AI sederhana dengan tampilan yang responsif</p>
        </div>
      </div>
    </div>
  );
}