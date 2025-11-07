/**
 * Sistema de Storage y Cache para Redes Sociales
 * Directorio SENA - Gestión de datos de usuario
 */

// Interfaces para los datos de redes sociales
export interface SocialMedia {
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  spotify?: string;
  website?: string;
}

export interface UserSocialData {
  socialMedia: SocialMedia;
  lastUpdated: number;
  userId?: string;
}

// Keys para localStorage
const STORAGE_KEYS = {
  SOCIAL_LINKS: 'socialLinks',
  USER_DATA: 'userData',
  SOCIAL_CACHE: 'socialMediaCache',
  PROFILE_IMAGE: 'profileImage'
} as const;

// Cache en memoria para optimizar accesos
class SocialMediaCache {
  private cache = new Map<string, UserSocialData>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: UserSocialData): void {
    this.cache.set(key, {
      ...data,
      lastUpdated: Date.now()
    });
  }

  get(key: string): UserSocialData | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Verificar si el cache ha expirado
    if (Date.now() - cached.lastUpdated > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    // Verificar si no ha expirado
    return Date.now() - cached.lastUpdated <= this.cacheTimeout;
  }
}

// Instancia global del cache
const socialCache = new SocialMediaCache();

/**
 * Guarda los datos de redes sociales en localStorage y cache
 */
export function saveSocialMediaData(socialData: SocialMedia, userId?: string): boolean {
  try {
    const dataToStore: UserSocialData = {
      socialMedia: socialData,
      lastUpdated: Date.now(),
      userId: userId || 'current-user'
    };

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(socialData));
    localStorage.setItem(STORAGE_KEYS.SOCIAL_CACHE, JSON.stringify(dataToStore));

    // Guardar en cache en memoria
    socialCache.set(userId || 'current-user', dataToStore);

    console.log('✅ Datos de redes sociales guardados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error guardando datos de redes sociales:', error);
    return false;
  }
}

/**
 * Recupera los datos de redes sociales del cache o localStorage
 */
export function getSocialMediaData(userId?: string): SocialMedia {
  const key = userId || 'current-user';

  try {
    // Intentar obtener del cache en memoria primero
    const cached = socialCache.get(key);
    if (cached) {
      console.log('🚀 Datos obtenidos del cache en memoria');
      return cached.socialMedia;
    }

    // Si no está en cache, obtener de localStorage
    const storedCache = localStorage.getItem(STORAGE_KEYS.SOCIAL_CACHE);
    if (storedCache) {
      const parsedCache: UserSocialData = JSON.parse(storedCache);
      
      // Verificar si los datos no son muy antiguos (24 horas)
      const isRecent = Date.now() - parsedCache.lastUpdated < 24 * 60 * 60 * 1000;
      
      if (isRecent) {
        // Restaurar en cache en memoria
        socialCache.set(key, parsedCache);
        console.log('📦 Datos obtenidos de localStorage y restaurados al cache');
        return parsedCache.socialMedia;
      }
    }

    // Fallback: obtener datos del formato anterior
    const socialLinks = localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS);
    if (socialLinks) {
      const parsedLinks: SocialMedia = JSON.parse(socialLinks);
      console.log('⚡ Datos obtenidos del formato legacy');
      
      // Migrar al nuevo formato
      saveSocialMediaData(parsedLinks, userId);
      return parsedLinks;
    }

    console.log('ℹ️ No hay datos de redes sociales guardados');
    return {};
  } catch (error) {
    console.error('❌ Error recuperando datos de redes sociales:', error);
    return {};
  }
}

/**
 * Obtiene una URL específica de una red social
 */
export function getSocialUrl(platform: string, socialData?: SocialMedia): string {
  const data = socialData || getSocialMediaData();
  const platformKey = platform.toLowerCase() as keyof SocialMedia;
  const userValue = data[platformKey];

  if (userValue && userValue.trim()) {
    return formatSocialUrl(platform, userValue);
  }

  // URLs de fallback si el usuario no tiene configurada la red social
  const fallbackUrls: Record<string, string> = {
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    tiktok: "https://tiktok.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    twitter: "https://x.com/",
    spotify: "https://spotify.com/",
    website: "https://www.directoriosena.com/"
  };

  return fallbackUrls[platform] || "#";
}

/**
 * Formatea la URL de la red social según el platform
 */
function formatSocialUrl(platform: string, userValue: string): string {
  // Si ya es una URL completa, retornarla directamente
  if (userValue.startsWith('http://') || userValue.startsWith('https://')) {
    return userValue;
  }

  // Limpiar el valor (remover @ y espacios)
  const cleanValue = userValue.replace(/[@\s]/g, '');

  const baseUrls: Record<string, string> = {
    instagram: 'https://instagram.com/',
    whatsapp: 'https://wa.me/',
    tiktok: 'https://tiktok.com/@',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/@',
    twitter: 'https://x.com/',
    spotify: 'https://open.spotify.com/user/',
    website: ''
  };

  const baseUrl = baseUrls[platform.toLowerCase()];
  return baseUrl ? baseUrl + cleanValue : userValue;
}

/**
 * Actualiza una red social específica
 */
export function updateSocialMedia(platform: string, value: string, userId?: string): boolean {
  try {
    const currentData = getSocialMediaData(userId);
    const platformKey = platform.toLowerCase() as keyof SocialMedia;
    
    const updatedData: SocialMedia = {
      ...currentData,
      [platformKey]: value
    };

    return saveSocialMediaData(updatedData, userId);
  } catch (error) {
    console.error(`❌ Error actualizando ${platform}:`, error);
    return false;
  }
}

/**
 * Elimina una red social específica
 */
export function removeSocialMedia(platform: string, userId?: string): boolean {
  try {
    const currentData = getSocialMediaData(userId);
    const platformKey = platform.toLowerCase() as keyof SocialMedia;
    
    const updatedData: SocialMedia = { ...currentData };
    delete updatedData[platformKey];

    return saveSocialMediaData(updatedData, userId);
  } catch (error) {
    console.error(`❌ Error eliminando ${platform}:`, error);
    return false;
  }
}

/**
 * Limpia todos los datos de cache
 */
export function clearSocialMediaCache(): void {
  socialCache.clear();
  console.log('🧹 Cache de redes sociales limpiado');
}

/**
 * Obtiene estadísticas del cache
 */
export function getCacheStats(): { hasData: boolean; lastUpdated?: number; platforms: string[] } {
  try {
    const data = getSocialMediaData();
    const platforms = Object.keys(data).filter(key => data[key as keyof SocialMedia]);
    
    const storedCache = localStorage.getItem(STORAGE_KEYS.SOCIAL_CACHE);
    let lastUpdated: number | undefined;
    
    if (storedCache) {
      const parsedCache: UserSocialData = JSON.parse(storedCache);
      lastUpdated = parsedCache.lastUpdated;
    }

    return {
      hasData: platforms.length > 0,
      lastUpdated,
      platforms
    };
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas del cache:', error);
    return { hasData: false, platforms: [] };
  }
}

/**
 * Inicializa datos de ejemplo para desarrollo
 */
export function initializeSampleData(): void {
  const sampleData: SocialMedia = {
    instagram: 'sena.oficial',
    whatsapp: '573001234567',
    tiktok: 'sena_colombia',
    facebook: 'SENA.Colombia'
  };

  saveSocialMediaData(sampleData);
  console.log('📝 Datos de ejemplo inicializados');
}