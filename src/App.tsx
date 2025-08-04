import React from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import EnhancedHero from './components/EnhancedHero';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <EnhancedHero />
        <About />
        <Experience />
        <Skills />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
