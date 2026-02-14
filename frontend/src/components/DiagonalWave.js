import { motion } from 'framer-motion';

export const DiagonalWave = () => {
  // Generate sparkles along horizontal path
  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 6)}%`,
    top: `${15 + Math.sin(i) * 10}%`,
    delay: i * 0.2,
  }));

  // White sparkles for water flowing effect
  const waterSparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.4,
  }));

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {/* Horizontal Wave - Left to Right */}
      <svg className="absolute w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="20%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main flowing wave */}
        <motion.path
          d="M -200,150 Q 100,120 400,150 T 1000,150 T 1640,150"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ x: -200 }}
          animate={{ x: [0, 1440] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Second wave layer */}
        <motion.path
          d="M -200,180 Q 150,160 450,180 T 1050,180 T 1640,180"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          opacity="0.6"
          filter="url(#glow)"
          initial={{ x: -200 }}
          animate={{ x: [0, 1440] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
        />
      </svg>

      {/* Blue sparkles following the wave */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: sparkle.left,
            top: sparkle.top,
          }}
          initial={{ scale: 0, opacity: 0, x: -100 }}
          animate={{
            scale: [0, 1, 1.2, 0],
            opacity: [0, 0.8, 1, 0],
            x: [0, 1440],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 20 20" className="w-3 h-3">
            <path
              d="M10 0 L11 9 L20 10 L11 11 L10 20 L9 11 L0 10 L9 9 Z"
              fill="#93c5fd"
              opacity="0.9"
            />
          </svg>
        </motion.div>
      ))}
      
      {/* White sparkles in water - Very subtle */}
      {waterSparkles.map((sparkle) => (
        <motion.div
          key={`white-${sparkle.id}`}
          className="absolute w-1 h-1"
          style={{
            top: `${16 + sparkle.id * 1.5}%`,
          }}
          initial={{ left: '-5%', opacity: 0, scale: 0 }}
          animate={{
            left: ['0%', '105%'],
            opacity: [0, 0.6, 0.8, 0.6, 0],
            scale: [0, 1, 1.2, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 10 10" className="w-full h-full">
            <circle cx="5" cy="5" r="4" fill="white" opacity="0.8" />
            <circle cx="5" cy="5" r="2" fill="white" opacity="1" />
          </svg>
        </motion.div>
      ))}
      
      {/* Small glowing particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            top: `${18 + i * 2}%`,
          }}
          initial={{ left: '-5%', opacity: 0 }}
          animate={{
            left: ['0%', '105%'],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
