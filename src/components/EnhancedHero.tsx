import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Highlights from './Highlights';
import ParticlesBackground from './ParticlesBackground';
import PDFResume from './PDFResume';
import { ChevronDown, Mail, Linkedin, Cpu, Network, Shield, Zap, Download } from 'lucide-react';

const EnhancedHero: React.FC = () => {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <ParticlesBackground />

      {/* Main Content */}
      <div className="relative z-10 container-padding text-center">
        <div className="max-w-4xl mx-auto">
          {/* Photo */}
          <motion.img
            src="/portfolio/dj.jpg"
            alt="DJ Cline"
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-cyber-blue/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

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
            <TypeAnimation
              sequence={[
                'IT Director & Technology Leader',
                2000,
                'Cybersecurity Strategist',
                2000,
                'AI-Driven Innovator',
                2000,
                'Digital Transformation Expert',
                2000,
              ]}
              wrapper="p"
              speed={50}
              className="text-2xl md:text-3xl text-slate-300 mb-2 h-20 md:h-auto"
              repeat={Infinity}
            />
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transforming organizations through strategic IT leadership, cybersecurity excellence, and AI-driven innovation
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <Highlights />
          </div>

          {/* Animated CTA Buttons */}
          <div className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold rounded-lg animate-pulse-glow hover:scale-105 transition-transform duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Get In Touch
            </button>
            <button
              onClick={() => {
                // Simple PDF generation for now
                const link = document.createElement('a');
                link.href = '/portfolio/dj-cline-resume.pdf';
                link.download = 'DJ-Cline-Resume.pdf';
                link.click();
              }}
              className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
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


    </section>
  );
};

export default EnhancedHero;
