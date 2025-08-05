import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="container-padding py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">DJ Cline</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              IT Director & Technology Leader with 25+ years of experience driving 
              digital transformation, cybersecurity excellence, and team development 
              across diverse industries.
            </p>
            <button
              onClick={scrollToTop}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              Back to top ↑
            </button>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-primary-400" />
                <a 
                  href="mailto:djcline@protonmail.com" 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  djcline@protonmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-primary-400" />
                <a 
                  href="tel:563-213-6358" 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  563-213-6358
                </a>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-3 text-primary-400" />
                <span className="text-slate-300">Hazel Green, WI 53811</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#about" className="block text-slate-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#experience" className="block text-slate-300 hover:text-white transition-colors">
                Experience
              </a>
              <a href="#skills" className="block text-slate-300 hover:text-white transition-colors">
                Skills
              </a>
              <a href="#achievements" className="block text-slate-300 hover:text-white transition-colors">
                Achievements
              </a>
              <a href="#contact" className="block text-slate-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Social & Professional */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://www.linkedin.com/in/dj-cline-22219834/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <Linkedin size={16} className="mr-2" />
                LinkedIn
              </a>
              <p className="text-slate-300 text-sm">
                Available for strategic IT leadership roles, cybersecurity consulting, 
                and digital transformation initiatives.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © {currentYear} DJ Cline. All rights reserved.
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
