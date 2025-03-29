import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MessageItemProps {
  msg: { role: string; content: string };
}

const MessageItem: React.FC<MessageItemProps> = ({ msg }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-3 my-2 rounded-lg max-w-[80%] ${
        msg.role === "user" 
          ? "self-end bg-blue-500 text-white ml-auto" 
          : "self-start bg-purple-500 text-white mr-auto"
      }`}
    >
      <strong className="block mb-1 text-sm opacity-80">
        {msg.role === "user" ? "You" : "AI"}:
      </strong>
      {msg.content}
    </motion.div>
  );
};

export default MessageItem;