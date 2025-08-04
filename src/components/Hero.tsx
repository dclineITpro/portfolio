import React from 'react';
import { ChevronDown, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50 pt-16">
      <div className="container-padding text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            DJ Cline
          </h1>
          <h2 className="text-xl md:text-2xl text-primary-600 font-semibold mb-6">
            IT Director & Technology Leader
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transforming organizations through strategic technology leadership, cybersecurity excellence, 
            and AI-driven innovation. Over 20 years of experience driving digital transformation across 
            manufacturing, government, and enterprise environments.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center text-slate-600">
              <MapPin size={16} className="mr-2 text-primary-600" />
              <span>Hazel Green, WI</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Mail size={16} className="mr-2 text-primary-600" />
              <span>djcline@protonmail.com</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Phone size={16} className="mr-2 text-primary-600" />
              <span>563-213-6358</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="mailto:djcline@protonmail.com"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Mail size={20} className="mr-2" />
              Get In Touch
            </a>
            <a
              href="https://www.linkedin.com/in/dj-cline-22219834/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              <Linkedin size={20} className="mr-2" />
              LinkedIn
            </a>
          </div>

          <button
            onClick={() => scrollToSection('#about')}
            className="inline-flex flex-col items-center text-slate-600 hover:text-primary-600 transition-colors duration-200"
          >
            <span className="text-sm mb-2">Learn More</span>
            <ChevronDown size={24} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
