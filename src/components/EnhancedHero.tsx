import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Highlights from './Highlights';
import { ChevronDown, Mail, Linkedin, Cpu, Network, Shield, Zap } from 'lucide-react';

const EnhancedHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Mouse tracking for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 network-bg particle-bg">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={Math.random() * 100}
              y1={Math.random() * 100}
              x2={Math.random() * 100}
              y2={Math.random() * 100}
              stroke="url(#networkGradient)"
              strokeWidth="0.5"
              className="animate-network"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>

        {/* Binary Rain Effect */}
        <div className="absolute inset-0 binary-rain" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-padding text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient animate-text-glow">DJ Cline</span>
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Cpu className="w-8 h-8 text-cyber-blue animate-neural" />
              <Network className="w-8 h-8 text-cyber-green animate-neural" style={{ animationDelay: '0.5s' }} />
              <Shield className="w-8 h-8 text-cyber-purple animate-neural" style={{ animationDelay: '1s' }} />
            </div>
            <p className="text-2xl md:text-3xl text-slate-300 mb-2">
              IT Director & Technology Leader
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transforming organizations through strategic IT leadership, cybersecurity excellence, and AI-driven innovation
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <Highlights />
          </div>

          {/* Animated CTA Buttons */}
          <div className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold rounded-lg animate-pulse-glow hover:scale-105 transition-transform duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Get In Touch
            </button>
            <a
              href="https://www.linkedin.com/in/dj-cline-22219834/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border-2 border-cyber-blue text-cyber-blue font-semibold rounded-lg hover:bg-cyber-blue hover:text-slate-900 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </div>

          {/* Animated Tech Stack */}
          <div className="flex justify-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-cyber-orange" />
              <span>AI/ML</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyber-green" />
              <span>Cybersecurity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyber-blue" />
              <span>Digital Transformation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="text-slate-400 hover:text-cyber-blue transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      {/* Parallax Background Elements */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
        }}
      />
    </section>
  );
};

export default EnhancedHero;
