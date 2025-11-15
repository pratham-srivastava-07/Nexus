export const colors = {
  background: {
    primary: '#000000',           // Pure black base (like screenshot)
    secondary: '#1a1a1a',         // Dark gray for cards/elevation
    card: '#252525',              // Slightly lighter for card surfaces
    overlay: 'rgba(0, 0, 0, 0.92)', // Deep black overlay with high opacity
  },
  accent: {
    primary: '#00d4ff',           // Cool cyan blue
    secondary: '#00b8e6',         // Deeper cyan for variation
    gradient: ['#00d4ff', '#0099cc'], // Cyan to deep blue gradient
  },
  text: {
    primary: '#ffffff',           // Pure white for main text (high contrast)
    secondary: '#b4b4b4',         // Medium gray for secondary text
    muted: '#6e6e6e',            // Darker gray for muted/disabled text
    accent: '#00d4ff',           // Cyan for accent text
  },
  border: {
    default: '#2a2a2a',          // Subtle dark borders
    focus: '#00d4ff',            // Cyan for focus states
  },
  status: {
    success: '#00ff88',          // Keep your success green
    error: '#ff4757',            // Keep your error red
    warning: '#ffa502',          // Keep your warning orange
    info: '#00d4ff',             // Cyan for info (matches theme)
  },
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: colors.text.primary },
  h2: { fontSize: 24, fontWeight: '600' as const, color: colors.text.primary },
  h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text.primary },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text.secondary },
  caption: { fontSize: 14, fontWeight: '400' as const, color: colors.text.muted },
  button: { fontSize: 16, fontWeight: '600' as const, color: colors.text.primary },
};