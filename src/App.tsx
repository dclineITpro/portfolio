import React from 'react';
import EnhancedHero from './components/EnhancedHero';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import AI from './components/AI';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollAnimationWrapper from './components/ScrollAnimationWrapper';
import CertificationsFrameworks from './components/CertificationsFrameworks';
import AuditOutcomes from './components/AuditOutcomes';
import SkillsMatrix from './components/SkillsMatrix';
// AI Lab removed
import LetterRainBackground from './components/LetterRainBackground';

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Indigo/Purple Letter Rain Background */}
      <LetterRainBackground />
      <div className="relative z-10">
        <Header />
        <EnhancedHero />
        <ScrollAnimationWrapper>
          <About />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <Experience />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <Skills />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <AI />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <CertificationsFrameworks />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <AuditOutcomes />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <SkillsMatrix />
        </ScrollAnimationWrapper>
        {/* AI Lab removed */}
        <ScrollAnimationWrapper>
          <Achievements />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <Contact />
        </ScrollAnimationWrapper>
        <Footer />
      </div>
    </div>
  );
}

export default App;
