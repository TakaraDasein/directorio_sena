"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Link, 
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Settings,
  User,
  Bell,
  Share2,
  UserCircle,
  BarChart3
} from "lucide-react";
import { 
  getSocialMediaData, 
  getSocialUrl, 
  saveSocialMediaData, 
  updateSocialMedia,
  SocialMedia,
  getCacheStats
} from "@/lib/social-media-storage";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks: number;
  isActive: boolean;
  type: "platform" | "custom" | "social";
  platformId?: string;
}

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  template: string;
}

const bottomNavItems = [
  { id: "dashboard", label: "Perfil", icon: UserCircle },
  { id: "links", label: "Redes Sociales", icon: Share2 },
  { id: "settings", label: "Configuración", icon: Settings }
];

export function UserDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia>({});

  const [profileImage, setProfileImage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userData = localStorage.getItem("userData");
    const linkData = localStorage.getItem("linkData");
    const additionalLinks = localStorage.getItem("additionalLinks");
    const socialLinksData = localStorage.getItem("socialLinks");
    const savedImage = localStorage.getItem("profileImage");
    const savedBio = localStorage.getItem("profileBio");

    if (userData) {
      const user = JSON.parse(userData);
      setUserProfile({
        name: user.name, // Nombre completo tal como lo ingresó el usuario
        username: user.name?.toLowerCase().replace(/\s+/g, '') || 'usuario', // Username generado automáticamente
        bio: savedBio || user.bio || '',
        template: 'sena'
      });
      
      console.log("👤 Perfil de usuario cargado:", {
        name: user.name,
        username: user.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'
      });
    }

    if (savedImage) {
      setProfileImage(savedImage);
    }

    if (socialLinksData) {
      setSocialLinks(JSON.parse(socialLinksData));
    }

    // Cargar datos de redes sociales usando el nuevo sistema
    const socialData = getSocialMediaData();
    setSocialMediaData(socialData);
    
    // Log de estadísticas del cache para desarrollo
    const cacheStats = getCacheStats();
    console.log('📊 Estadísticas del cache:', cacheStats);

    // Convertir datos de links al formato del dashboard
    const allLinks: LinkItem[] = [];
    
    // Links de redes sociales
    if (socialLinksData) {
      const social = JSON.parse(socialLinksData);
      Object.entries(social).forEach(([platform, value]: [string, any]) => {
        if (value && value.toString().trim()) {
          allLinks.push({
            id: `social-${platform}`,
            title: getPlatformName(platform),
            url: getFullUrl(platform, value.toString()),
            clicks: Math.floor(Math.random() * 100),
            isActive: true,
            type: "social",
            platformId: platform
          });
        }
      });
    }

    // Links de plataformas
    if (linkData) {
      const platforms = JSON.parse(linkData);
      platforms.forEach((platform: any, index: number) => {
        if (platform.value.trim()) {
          allLinks.push({
            id: `platform-${index}`,
            title: getPlatformName(platform.platformId),
            url: getFullUrl(platform.platformId, platform.value),
            clicks: Math.floor(Math.random() * 100),
            isActive: true,
            type: "platform",
            platformId: platform.platformId
          });
        }
      });
    }

    // Links adicionales
    if (additionalLinks) {
      const additional = JSON.parse(additionalLinks);
      additional.forEach((link: any, index: number) => {
        if (link.title.trim() && link.url.trim()) {
          allLinks.push({
            id: `custom-${index}`,
            title: link.title,
            url: link.url.startsWith("http") ? link.url : `https://${link.url}`,
            clicks: Math.floor(Math.random() * 50),
            isActive: true,
            type: "custom"
          });
        }
      });
    }

    setLinks(allLinks);
  }, []);

  const getPlatformName = (platformId: string): string => {
    const names: Record<string, string> = {
      instagram: "Instagram",
      whatsapp: "WhatsApp", 
      tiktok: "TikTok",
      youtube: "YouTube",
      facebook: "Facebook",
      twitter: "X",
      spotify: "Spotify",
      website: "Sitio Web"
    };
    return names[platformId] || platformId;
  };

  const getSocialIcon = (platformId: string) => {
    const iconClass = "w-5 h-5 text-white";
    
    switch (platformId?.toLowerCase()) {
      case 'instagram':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'spotify':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        );
      case 'website':
      case 'web':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 7.178l-1.414 1.414c1.287 1.287 1.287 3.372 0 4.659l-1.414-1.414c.566-.566.566-1.484 0-2.05-.566-.565-1.484-.565-2.05 0L9.879 12.6c1.287 1.287 1.287 3.372 0 4.659l-1.414-1.414c.566-.566.566-1.484 0-2.05-.566-.565-1.484-.565-2.05 0l-1.414 1.414C3.714 13.922 3.714 10.078 5 8.793l1.414 1.414c-.566.566-.566 1.484 0 2.05.566.565 1.484.565 2.05 0l2.811-2.813C12.562 8.157 12.562 6.072 11.275 4.785l1.414-1.414c1.287 1.287 1.287 3.372 0 4.659l-1.414-1.414c.566-.566.566-1.484 0-2.05-.566-.565-1.484-.565-2.05 0L6.414 7.379c-1.287-1.287-1.287-3.372 0-4.659z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.12 2.06L7.58 0l-.85.77L11.7 4.9c.1.1.2.1.3.1s.2 0 .3-.1l.9-.9c.2-.2.2-.5 0-.7l-.1-.2zm7.93 9.94L19 14.07c-.1-.1-.3-.1-.4 0l-.9.9c-.2.2-.2.5 0 .7l.1.2 1.36 2.06 5.54-2.06-.77-.85c-.1-.1-.2-.1-.3-.1zM12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
          </svg>
        );
    }
  };

  const getFullUrl = (platformId: string, value: string): string => {
    const prefixes: Record<string, string> = {
      instagram: "https://instagram.com/",
      whatsapp: "https://wa.me/",
      tiktok: "https://tiktok.com/@",
      youtube: "https://youtube.com/",
      facebook: "https://facebook.com/",
      twitter: "https://x.com/",
      spotify: "https://open.spotify.com/user/"
    };
    
    const prefix = prefixes[platformId];
    if (prefix) {
      return prefix + value.replace(/^@/, "");
    }
    return value.startsWith("http") ? value : `https://${value}`;
  };

  const getSocialUrlForUser = (platformId: string): string => {
    // Usar el nuevo sistema de storage para obtener la URL
    return getSocialUrl(platformId, socialMediaData);
  };

  const profileUrl = `https://www.directoriosena.com/${userProfile?.username || 'usuario'}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      // Mostrar notificación de copiado
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const renderDashboardSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">¡Hola, {userProfile?.name}! 👋</h2>
        <p className="text-gray-600 mt-2">Gestiona tu perfil en el Directorio SENA</p>
      </div>

      {/* Profile Preview Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tu perfil en el directorio</h2>
            <p className="text-gray-600">Así ven otros tu perfil en el Directorio SENA</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar URL
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>

        {/* Profile Card with Flip Effect */}
        <div className="flex justify-center">
          <div className="group relative w-72 h-96 [perspective:1000px]">
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front Face (Portada) */}
              <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl [backface-visibility:hidden] flex flex-col justify-between p-6">
                {/* Header */}
                <div className="text-center">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-4 backdrop-blur-sm">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Foto de perfil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-white">
                        {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info adicional */}
                <div className="flex justify-center">
                  <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    <p className="text-lg text-green-100 font-medium text-center">
                      {userProfile?.name || 'Usuario'}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="text-center">
                  <div className="text-xs text-green-200 mt-1">
                    Hover para ver redes sociales
                  </div>
                </div>
              </div>

              {/* Back Face (Interior) */}
              <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-gray-800 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {userProfile?.name || 'Usuario'}
                    </h3>
                  </div>

                  {/* Redes Sociales */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">Redes Sociales</h4>
                    <p className="text-xs text-gray-600 text-center">Haz click para abrir</p>
                    <div className="flex justify-center gap-4">
                      {/* Instagram */}
                      <a
                        href={getSocialUrlForUser('instagram')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 cursor-pointer relative z-10 ${
                          socialMediaData.instagram?.trim() ? 'ring-2 ring-white/50' : 'opacity-75'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!socialMediaData.instagram?.trim()) {
                            e.preventDefault();
                            alert('❌ Instagram no configurado. Ve a la sección "Redes Sociales" para configurarlo.');
                            return false;
                          }
                          console.log('✅ Abriendo Instagram:', getSocialUrlForUser('instagram'));
                        }}
                        title={socialMediaData.instagram ? `Instagram: ${socialMediaData.instagram}` : "Instagram no configurado"}
                      >
                        {getSocialIcon('instagram')}
                      </a>

                      {/* TikTok */}
                      <a
                        href={getSocialUrlForUser('tiktok')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 cursor-pointer relative z-10 ${
                          socialMediaData.tiktok?.trim() ? 'ring-2 ring-white/50' : 'opacity-75'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!socialMediaData.tiktok?.trim()) {
                            e.preventDefault();
                            alert('❌ TikTok no configurado. Ve a la sección "Redes Sociales" para configurarlo.');
                            return false;
                          }
                          console.log('✅ Abriendo TikTok:', getSocialUrlForUser('tiktok'));
                        }}
                        title={socialMediaData.tiktok ? `TikTok: ${socialMediaData.tiktok}` : "TikTok no configurado"}
                      >
                        {getSocialIcon('tiktok')}
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={getSocialUrlForUser('whatsapp')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 cursor-pointer relative z-10 ${
                          socialMediaData.whatsapp?.trim() ? 'ring-2 ring-white/50' : 'opacity-75'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!socialMediaData.whatsapp?.trim()) {
                            e.preventDefault();
                            alert('❌ WhatsApp no configurado. Ve a la sección "Redes Sociales" para configurarlo.');
                            return false;
                          }
                          console.log('✅ Abriendo WhatsApp:', getSocialUrlForUser('whatsapp'));
                        }}
                        title={socialMediaData.whatsapp ? `WhatsApp: ${socialMediaData.whatsapp}` : "WhatsApp no configurado"}
                      >
                        {getSocialIcon('whatsapp')}
                      </a>

                      {/* Facebook */}
                      <a
                        href={getSocialUrlForUser('facebook')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 cursor-pointer relative z-10 ${
                          socialMediaData.facebook?.trim() ? 'ring-2 ring-white/50' : 'opacity-75'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!socialMediaData.facebook?.trim()) {
                            e.preventDefault();
                            alert('❌ Facebook no configurado. Ve a la sección "Redes Sociales" para configurarlo.');
                            return false;
                          }
                          console.log('✅ Abriendo Facebook:', getSocialUrlForUser('facebook'));
                        }}
                        title={socialMediaData.facebook ? `Facebook: ${socialMediaData.facebook}` : "Facebook no configurado"}
                      >
                        {getSocialIcon('facebook')}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {userProfile?.bio || 'Este usuario aún no ha agregado una descripción a su perfil. ¡Personaliza tu bio para que otros sepan más sobre ti!'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Activo en SENA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{links.length} links</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Función para actualizar una red social
  const handleSocialMediaUpdate = (platform: string, value: string) => {
    const success = updateSocialMedia(platform, value);
    if (success) {
      // Actualizar el estado local
      setSocialMediaData(prev => ({
        ...prev,
        [platform]: value
      }));
      console.log(`✅ ${platform} actualizado: ${value}`);
    } else {
      console.error(`❌ Error actualizando ${platform}`);
    }
  };

  const renderLinksSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Redes Sociales</h2>
        <p className="text-gray-600 mt-1">Configura tus redes sociales</p>
      </div>

      {/* Formulario de Redes Sociales */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configura tus redes sociales</h3>
        <div className="grid gap-4">
          {/* Instagram */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {getSocialIcon('instagram')}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                value={socialMediaData.instagram || ''}
                onChange={(e) => handleSocialMediaUpdate('instagram', e.target.value)}
                placeholder="tu_usuario_instagram"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              {getSocialIcon('whatsapp')}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={socialMediaData.whatsapp || ''}
                onChange={(e) => handleSocialMediaUpdate('whatsapp', e.target.value)}
                placeholder="573001234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* TikTok */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {getSocialIcon('tiktok')}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
              <input
                type="text"
                value={socialMediaData.tiktok || ''}
                onChange={(e) => handleSocialMediaUpdate('tiktok', e.target.value)}
                placeholder="@tu_usuario_tiktok"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              {getSocialIcon('facebook')}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="text"
                value={socialMediaData.facebook || ''}
                onChange={(e) => handleSocialMediaUpdate('facebook', e.target.value)}
                placeholder="tu.perfil.facebook"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>Tip:</strong> Una vez configuradas, puedes hacer clic en los iconos de tu tarjeta para ir directamente a tus redes sociales.
            </p>
          </div>
          
          {/* Botón para datos de ejemplo */}
          <button
            onClick={() => {
              const sampleData = {
                instagram: 'sena.oficial',
                whatsapp: '573001234567',
                tiktok: '@sena_colombia',
                facebook: 'SENA.Colombia'
              };
              
              Object.entries(sampleData).forEach(([platform, value]) => {
                handleSocialMediaUpdate(platform, value);
              });
            }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            🚀 Cargar datos de ejemplo para probar
          </button>
        </div>
      </div>

      {/* Links adicionales */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Links personalizados</h3>
        {links.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes links personalizados</h3>
            <p className="text-gray-600 mb-4">Agrega enlaces adicionales a tu perfil</p>
            <button 
              onClick={() => router.push('/profile-created')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar link personalizado
            </button>
          </div>
        ) : (
          links.map((link) => (
            <div key={link.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="cursor-move text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{link.title}</h3>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-md">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium text-gray-900">{link.clicks}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Analíticas</h2>
        <p className="text-gray-600 mt-1">Revisa el rendimiento de tu perfil</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analíticas próximamente</h3>
        <p className="text-gray-600">Pronto podrás ver estadísticas detalladas de tu perfil</p>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de cuenta</h3>
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/profile-created')}
            className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Editar perfil</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Notificaciones</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboardSection();
      case "links":
        return renderLinksSection();
      case "analytics":
        return renderAnalyticsSection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderDashboardSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Contenido Principal */}
      <div className="px-4 py-6">
        {renderContent()}
      </div>

      {/* Barra de Navegación Inferior con Iconos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <div className="flex justify-center">
          <div className="flex space-x-8">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-6 h-6 ${
                  activeSection === item.id ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium ${
                  activeSection === item.id ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}