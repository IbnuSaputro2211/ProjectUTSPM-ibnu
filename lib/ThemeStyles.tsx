'use client';
import { useTheme } from './ThemeContext';

export default function ThemeStyles() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <style jsx global>{`
      /* Base theme styles */
      :root {
        --bg-color: ${isDarkMode ? '#121212' : '#ffffff'};
        --text-color: ${isDarkMode ? '#ffffff' : '#4a4a4a'};
        --card-bg: ${isDarkMode ? '#1e1e1e' : '#f5f5f5'};
        --border-color: ${isDarkMode ? '#333333' : '#e0e0e0'};
      }
      
      body {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Keep original animation styles */
      @keyframes float {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.1;
        }
        25% {
          opacity: 0.3;
        }
        50% {
          transform: translateY(-20px) rotate(10deg);
          opacity: 0.4;
        }
        75% {
          opacity: 0.2;
        }
        100% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.1;
        }
      }

      .floating-element {
        position: absolute;
        animation-name: float;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        pointer-events: none;
        user-select: none;
        font-family: monospace;
        font-weight: 500;
      }

      /* Glowing effect for buttons and interactive elements */
      .shadow-glow {
        box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
      }
      
      /* Animations for hover effects */
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      /* Transitions for smooth theme switching */
      .theme-transition {
        transition: all 0.3s ease;
      }
      
      /* Enhanced scrollbar for dark mode */
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--bg-color);
      }
      
      ::-webkit-scrollbar-thumb {
        background: #4f46e5;
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #3730a3;
      }
    `}</style>
  );
}