import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#0d1117", // Dark background to match a tech theme
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: ["bubble", "grab"],
            parallax: {
              enable: true,
              force: 60,
              smooth: 10,
            },
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
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
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
    }),
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
