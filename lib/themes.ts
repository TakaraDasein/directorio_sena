// Temas disponibles para las fichas de empresa

export interface ThemeOption {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant'
  preview: {
    gradientStart: string
    gradientEnd: string
  }
}

export const COMPANY_THEMES: ThemeOption[] = [
  {
    id: 'sena-green',
    name: 'Verde SENA',
    description: 'Tema clásico del SENA con verde institucional',
    primaryColor: '#2F4D2A',
    secondaryColor: '#4A7C59',
    accentColor: '#6BA583',
    textColor: '#1F2937',
    backgroundColor: '#F9FAFB',
    style: 'modern',
    preview: {
      gradientStart: '#2F4D2A',
      gradientEnd: '#4A7C59'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Azul Océano',
    description: 'Profesional y confiable, ideal para tecnología y servicios',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0284C7',
    accentColor: '#38BDF8',
    textColor: '#1E293B',
    backgroundColor: '#F8FAFC',
    style: 'modern',
    preview: {
      gradientStart: '#0EA5E9',
      gradientEnd: '#0284C7'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Naranja Atardecer',
    description: 'Cálido y energético, perfecto para gastronomía y creatividad',
    primaryColor: '#F97316',
    secondaryColor: '#EA580C',
    accentColor: '#FB923C',
    textColor: '#1C1917',
    backgroundColor: '#FAFAF9',
    style: 'bold',
    preview: {
      gradientStart: '#F97316',
      gradientEnd: '#EA580C'
    }
  },
  {
    id: 'royal-purple',
    name: 'Púrpura Real',
    description: 'Elegante y sofisticado, ideal para servicios premium',
    primaryColor: '#9333EA',
    secondaryColor: '#7E22CE',
    accentColor: '#A855F7',
    textColor: '#1F2937',
    backgroundColor: '#FAFAFA',
    style: 'elegant',
    preview: {
      gradientStart: '#9333EA',
      gradientEnd: '#7E22CE'
    }
  },
  {
    id: 'forest-green',
    name: 'Verde Bosque',
    description: 'Natural y ecológico, perfecto para sostenibilidad',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10B981',
    textColor: '#064E3B',
    backgroundColor: '#F0FDF4',
    style: 'modern',
    preview: {
      gradientStart: '#059669',
      gradientEnd: '#047857'
    }
  },
  {
    id: 'midnight-black',
    name: 'Negro Medianoche',
    description: 'Moderno y minimalista, para marcas contemporáneas',
    primaryColor: '#18181B',
    secondaryColor: '#27272A',
    accentColor: '#52525B',
    textColor: '#FAFAFA',
    backgroundColor: '#09090B',
    style: 'minimal',
    preview: {
      gradientStart: '#18181B',
      gradientEnd: '#27272A'
    }
  },
  {
    id: 'crimson-red',
    name: 'Rojo Carmesí',
    description: 'Apasionado y audaz, ideal para destacar',
    primaryColor: '#DC2626',
    secondaryColor: '#B91C1C',
    accentColor: '#EF4444',
    textColor: '#1F2937',
    backgroundColor: '#FEF2F2',
    style: 'bold',
    preview: {
      gradientStart: '#DC2626',
      gradientEnd: '#B91C1C'
    }
  },
  {
    id: 'sky-blue',
    name: 'Azul Cielo',
    description: 'Fresco y limpio, perfecto para salud y bienestar',
    primaryColor: '#0284C7',
    secondaryColor: '#0369A1',
    accentColor: '#0EA5E9',
    textColor: '#0F172A',
    backgroundColor: '#F0F9FF',
    style: 'classic',
    preview: {
      gradientStart: '#0284C7',
      gradientEnd: '#0369A1'
    }
  },
  {
    id: 'golden-yellow',
    name: 'Amarillo Dorado',
    description: 'Optimista y brillante, para creatividad y alegría',
    primaryColor: '#EAB308',
    secondaryColor: '#CA8A04',
    accentColor: '#FACC15',
    textColor: '#1C1917',
    backgroundColor: '#FEFCE8',
    style: 'bold',
    preview: {
      gradientStart: '#EAB308',
      gradientEnd: '#CA8A04'
    }
  },
  {
    id: 'rose-pink',
    name: 'Rosa Elegante',
    description: 'Delicado y moderno, ideal para belleza y moda',
    primaryColor: '#E11D48',
    secondaryColor: '#BE123C',
    accentColor: '#FB7185',
    textColor: '#1F2937',
    backgroundColor: '#FFF1F2',
    style: 'elegant',
    preview: {
      gradientStart: '#E11D48',
      gradientEnd: '#BE123C'
    }
  }
]

// Función para obtener un tema por ID
export const getThemeById = (id: string): ThemeOption | undefined => {
  return COMPANY_THEMES.find(theme => theme.id === id)
}

// Función para aplicar el tema al DOM
export const applyTheme = (theme: ThemeOption, element?: HTMLElement) => {
  const targetElement = element || document.documentElement
  
  targetElement.style.setProperty('--theme-primary', theme.primaryColor)
  targetElement.style.setProperty('--theme-secondary', theme.secondaryColor)
  targetElement.style.setProperty('--theme-accent', theme.accentColor)
  targetElement.style.setProperty('--theme-text', theme.textColor)
  targetElement.style.setProperty('--theme-bg', theme.backgroundColor)
}

// Función para convertir HEX a RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
