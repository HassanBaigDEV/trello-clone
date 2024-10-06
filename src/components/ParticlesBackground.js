import React from 'react';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';  // For loading the full engine (optional)

const ParticlesBackground = ({ disableMove }) => {
  // Initialize the particle engine
  const particlesInit = async (engine) => {
    // Load the tsparticles full engine, add this only if you need the complete engine
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: false, // If you want it only within a container and not fullscreen
        },
        background: {
          color: {
            value: 'rgb(35, 39, 65)', // Background color
          },
        },
        particles: {
          number: {
            value: 200,
            density: {
              enable: false,
            },
          },
          size: {
            value: 3,
            random: {
              enable: true,
            },
            animation: {
              speed: 4,
              minimumValue: 0.3,
            },
          },
          links: {
            enable: false, // Equivalent to `line_linked` in react-particles-js
          },
          move: {
            enable: !disableMove,
            random: true,
            speed: 1,
            direction: 'top',
            outModes: {
              default: 'out',
            },
          },
          opacity: {
            value: 0.4,
            animation: {
              enable: !disableMove,
              speed: 1,
              minimumValue: 0.1,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
          },
          modes: {
            bubble: {
              enable: false,
              distance: 100,
              duration: 2,
              size: 0,
              opacity: 0,
            },
            repulse: {
              enable: false,
              distance: 250,
              duration: 4,
            },
          },
        },
        detectRetina: true, // Enable retina detection for better quality on high-resolution screens
      }}
      style={{
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
      }}
    />
  );
};

export default ParticlesBackground;
