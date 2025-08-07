import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stats = [
  {
    title: 'IT Strategy & Alignment',
    description: 'Aligning technology with business goals for optimal performance.',
  },
  {
    title: 'Business Integration',
    description: 'Seamlessly integrating technology into business processes.',
  },
  {
    title: 'Technology Innovation',
    description: 'Driving growth through the adoption of cutting-edge technologies.',
  },
  {
    title: 'Operational Excellence',
    description: 'Optimizing IT operations for reliability, efficiency, and scalability.',
  },
  {
    title: 'Team Management',
    description: 'Leading and mentoring high-performing technology teams.',
  },
  {
    title: 'Project Oversight',
    description: 'Managing the entire project lifecycle to ensure successful delivery.',
  },
  {
    title: 'Stakeholder Engagement',
    description: 'Building strong relationships with stakeholders at all levels.',
  },
  {
    title: 'Vendor Relations',
    description: 'Managing vendor relationships to maximize value and performance.',
  },
  {
    title: 'Financial Stewardship',
    description: 'Managing IT budgets and resources to optimize ROI.',
  },
];

const FadingStats: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card p-4 animate-slide-up">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl font-bold text-primary-400">{stats[index].title}</div>
          <div className="text-sm text-slate-400">{stats[index].description}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FadingStats;
