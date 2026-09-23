export const tokens = {
  colors: {
    brand: {
      navy: '#00193c',
      navyLight: '#0d2e5c',
      gold: '#fea619',
      goldDark: '#855300',
      goldLight: '#ffebd1',
    },
    surface: {
      bg: '#f2f4f6',
      card: 'rgba(255, 255, 255, 0.78)',
      cardHover: 'rgba(255, 255, 255, 0.92)',
      elevated: '#ffffff',
    },
    border: {
      subtle: 'rgba(196, 198, 208, 0.7)',
      focus: '#fea619',
      active: '#00193c',
    },
    text: {
      primary: '#191c1e',
      secondary: '#44474f',
      muted: '#747780',
      inverse: '#ffffff',
    },
    status: {
      idle: {
        bg: '#f3f4f6',
        text: '#4b5563',
        border: '#d1d5db',
        badge: 'bg-gray-100 text-gray-700 border-gray-300',
      },
      processing: {
        bg: '#eff6ff',
        text: '#1d4ed8',
        border: '#93c5fd',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      success: {
        bg: '#ecfdf5',
        text: '#047857',
        border: '#a7f3d0',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      'review-required': {
        bg: '#fffbeb',
        text: '#b45309',
        border: '#fde68a',
        badge: 'bg-amber-50 text-amber-800 border-amber-300',
      },
      'provider-unavailable': {
        bg: '#f8fafc',
        text: '#475569',
        border: '#cbd5e1',
        badge: 'bg-slate-100 text-slate-700 border-slate-300',
      },
      error: {
        bg: '#fef2f2',
        text: '#b91c1c',
        border: '#fecaca',
        badge: 'bg-red-50 text-red-700 border-red-200',
      },
    },
  },
  radius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    full: '9999px',
  },
  typography: {
    fontFamily: "'Public Sans', sans-serif",
  },
} as const;

export type GlassCoreState =
  | 'idle'
  | 'loading'
  | 'processing'
  | 'success'
  | 'review-required'
  | 'provider-unavailable'
  | 'error';
