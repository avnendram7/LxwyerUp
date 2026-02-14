// Harvey.ai Inspired Design System
// Dark, Professional, Minimal

export const corporateTheme = {
  colors: {
    // Backgrounds
    primaryBlack: '#000000',
    darkSlate: '#0f172a',
    cardDark: '#1e293b',
    
    // Single accent color
    accentBlue: '#3b82f6',
    accentBlueHover: '#2563eb',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    
    // Borders
    borderSubtle: '#334155',
    borderLight: '#475569',
    
    // Status (minimal use)
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  
  shadows: {
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
    hover: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
  },
};

// Harvey-style utility classes
export const corporateClasses = {
  // Page
  page: 'min-h-screen bg-black',
  
  // Cards - simple, clean, no glow
  card: 'bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-300',
  cardHover: 'bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300',
  
  // Buttons - solid, no gradients
  buttonPrimary: 'px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors duration-200',
  buttonSecondary: 'px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-200',
  buttonOutline: 'px-6 py-3 border border-slate-700 hover:border-blue-600 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-200',
  
  // Inputs
  input: 'w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors duration-200',
  
  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-slate-400',
  heading: 'text-white font-semibold',
  
  // Container
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};

export default corporateTheme;
