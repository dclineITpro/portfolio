import React, { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const containerRef = useRef<Container | null>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    containerRef.current = container ?? null;
  };

  useEffect(() => {
    const onVis = () => {
      const c = containerRef.current;
      if (!c) return;
      if (document.hidden) {
        c.pause();
      } else {
        c.play();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const options: ISourceOptions = useMemo(
    () => {
      const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fps = isMobile ? 45 : 60;
      const count = isMobile ? 40 : 80;
      const speed = isMobile ? 0.3 : 0.5;
      if (prefersReduced) {
        return {
          background: { color: { value: '#0d1117' } },
          fpsLimit: 30,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
          particles: {
            number: { value: 20, density: { enable: true, area: 600 } },
            move: { enable: true, speed: 0.1, outModes: { default: 'bounce' } },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: false },
            color: { value: ['#ffffff'] },
            shape: { type: 'circle' },
          },
          detectRetina: true,
        } as ISourceOptions;
      }
      return ({
        background: {
          color: {
            value: "#0d1117", // Dark background to match a tech theme
          },
        },
        fpsLimit: fps,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["bubble", "grab"],
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            bubble: {
              distance: 150,
              duration: 2,
              opacity: 0.8,
              size: 6,
              speed: 3,
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.8,
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#3b82f6", "#8b5cf6", "#00ffff"],
            animation: {
              enable: true,
              speed: 5,
            },
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 700,
            },
            value: count,
          },
          opacity: {
            value: 0.3,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 4 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.5,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }) as ISourceOptions;
    },
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      />
    );
  }

  return <></>;
};

export default ParticlesBackground;
