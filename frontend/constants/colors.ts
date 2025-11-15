export const colors = {
  background: {
    primary: '#0a0e27',
    secondary: '#141b3d',
    card: '#1a2347',
    overlay: 'rgba(10, 14, 39, 0.95)',
  },
  accent: {
    primary: '#00ff88',
    secondary: '#00d4ff',
    gradient: ['#00ff88', '#00d4ff'],
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0aec0',
    muted: '#718096',
    accent: '#00ff88',
  },
  border: {
    default: '#2d3748',
    focus: '#00ff88',
  },
  status: {
    success: '#00ff88',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#00d4ff',
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
