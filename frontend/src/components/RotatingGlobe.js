import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export const RotatingGlobe = () => {
  // Generate orbiting particles around the globe - increased radius and slower
  const orbitingDots = Array.from({ length: 20 }, (_, i) => {
    const angle = (i * 360) / 20;
    return {
      id: i,
      angle,
      radius: 150, // Increased from 100 to 150 for wider orbit
      delay: i * 0.15,
    };
  });

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Ambient glow - increased size */}
      <div className="absolute inset-0 blur-3xl opacity-50">
        <motion.div 
          className="w-full h-full bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Smooth rotating latitude rings - increased size */}
      <motion.div
        className="absolute w-[450px] h-[450px]"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 30, // Slowed down from 25
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg className="w-full h-full opacity-30" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Latitude lines - removed outer circle */}
          <ellipse cx="100" cy="100" rx="85" ry="20" fill="none" stroke="url(#ringGrad)" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="85" ry="45" fill="none" stroke="url(#ringGrad)" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="85" ry="70" fill="none" stroke="url(#ringGrad)" strokeWidth="0.6" />
        </svg>
      </motion.div>
      
      {/* Smooth rotating longitude rings - increased size */}
      <motion.div
        className="absolute w-96 h-96"
        animate={{ rotateX: 360 }}
        transition={{
          duration: 35, // Slowed down from 30
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg className="w-full h-full opacity-30" viewBox="0 0 200 200">
          {/* Longitude lines */}
          <ellipse cx="100" cy="100" rx="25" ry="80" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="50" ry="80" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="75" ry="80" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
        </svg>
      </motion.div>
      
      {/* Orbiting dots - slower and wider orbit */}
      {orbitingDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
          animate={{
            x: [
              `${Math.cos((dot.angle * Math.PI) / 180) * dot.radius}px`,
              `${Math.cos(((dot.angle + 90) * Math.PI) / 180) * dot.radius}px`,
              `${Math.cos(((dot.angle + 180) * Math.PI) / 180) * dot.radius}px`,
              `${Math.cos(((dot.angle + 270) * Math.PI) / 180) * dot.radius}px`,
              `${Math.cos((dot.angle * Math.PI) / 180) * dot.radius}px`,
            ],
            y: [
              `${Math.sin((dot.angle * Math.PI) / 180) * dot.radius}px`,
              `${Math.sin(((dot.angle + 90) * Math.PI) / 180) * dot.radius}px`,
              `${Math.sin(((dot.angle + 180) * Math.PI) / 180) * dot.radius}px`,
              `${Math.sin(((dot.angle + 270) * Math.PI) / 180) * dot.radius}px`,
              `${Math.sin((dot.angle * Math.PI) / 180) * dot.radius}px`,
            ],
            scale: [1, 0.8, 0.5, 0.8, 1],
            opacity: [0.8, 0.9, 1, 0.9, 0.8],
          }}
          transition={{
            duration: 15, // Increased from 8 to 15 for slower movement
            repeat: Infinity,
            delay: dot.delay,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Connection lines that pulse inward to center */}
      <svg className="absolute w-full h-full" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="connectionGrad">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Radial lines converging to center */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 360) / 12;
          const x = 100 + 85 * Math.cos((angle * Math.PI) / 180);
          const y = 100 + 85 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <motion.line
              key={i}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="url(#connectionGrad)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>
      
      {/* Central logo with smooth entrance and three lights behind */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.3
        }}
      >
        {/* Three rotating lights behind logo */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {/* Light 1 - Blue */}
          <div 
            className="absolute w-40 h-40 bg-blue-400/40 rounded-full blur-2xl"
            style={{
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{ rotate: -360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {/* Light 2 - Cyan */}
          <div 
            className="absolute w-36 h-36 bg-cyan-400/40 rounded-full blur-2xl"
            style={{
              top: '50%',
              left: '5%',
              transform: 'translateY(-50%)',
            }}
          />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {/* Light 3 - Sky Blue */}
          <div 
            className="absolute w-38 h-38 bg-sky-400/40 rounded-full blur-2xl"
            style={{
              bottom: '5%',
              right: '15%',
            }}
          />
        </motion.div>
        
        {/* Central glow pulse */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="w-full h-full bg-blue-500/30 rounded-full blur-2xl" />
        </motion.div>
        
        <motion.div 
          className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-900 flex items-center justify-center border-4 border-blue-400/50 shadow-2xl backdrop-blur-sm relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Inner network grid pattern - subtle */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.5" fill="#60a5fa" />
                  <line x1="5" y1="5" x2="10" y2="5" stroke="#60a5fa" strokeWidth="0.3" />
                  <line x1="5" y1="5" x2="5" y2="10" stroke="#60a5fa" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Scale Logo icon - back to original */}
          <Scale className="w-24 h-24 text-white relative z-10" strokeWidth={1.5} />
          
          {/* Subtle pulse overlay */}
          <motion.div
            className="absolute inset-0 bg-blue-300 rounded-full"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Rotating shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(96, 165, 250, 0.15) 25%, transparent 50%, rgba(96, 165, 250, 0.15) 75%, transparent 100%)',
        }}
      />
    </div>
  );
};
