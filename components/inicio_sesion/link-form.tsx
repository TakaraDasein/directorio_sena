"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  placeholder: string;
  prefix?: string;
}

interface LinkData {
  platformId: string;
  value: string;
}

interface AdditionalLink {
  id: string;
  title: string;
  url: string;
}

const platformsConfig: Record<string, Platform> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    placeholder: "@username",
    prefix: "https://instagram.com/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    placeholder: "+1 234 567 8900",
    prefix: "https://wa.me/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
      </svg>
    )
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    placeholder: "@username",
    prefix: "https://tiktok.com/@",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    placeholder: "Canal de YouTube",
    prefix: "https://youtube.com/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  website: {
    id: "website",
    name: "Personal Website",
    placeholder: "url",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
      </svg>
    )
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    placeholder: "Perfil de Spotify",
    prefix: "https://open.spotify.com/user/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    placeholder: "Facebook.com/username",
    prefix: "https://facebook.com/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  twitter: {
    id: "twitter",
    name: "X",
    placeholder: "@username",
    prefix: "https://x.com/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    )
  }
};

export function LinkForm() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Cargar plataformas seleccionadas desde localStorage
    const platforms = localStorage.getItem("selectedPlatforms");
    if (platforms) {
      const parsedPlatforms = JSON.parse(platforms);
      setSelectedPlatforms(parsedPlatforms);
      // Inicializar linkData con las plataformas seleccionadas
      setLinkData(parsedPlatforms.map((id: string) => ({ platformId: id, value: "" })));
    }
  }, []);

  const handleLinkChange = (platformId: string, value: string) => {
    setLinkData(prev => 
      prev.map(link => 
        link.platformId === platformId ? { ...link, value } : link
      )
    );
  };

  const handleAddAdditionalLink = () => {
    const newLink: AdditionalLink = {
      id: Date.now().toString(),
      title: "",
      url: ""
    };
    setAdditionalLinks(prev => [...prev, newLink]);
  };

  const handleRemoveAdditionalLink = (id: string) => {
    setAdditionalLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleAdditionalLinkChange = (id: string, field: "title" | "url", value: string) => {
    setAdditionalLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleContinue = () => {
    // Guardar todos los datos en localStorage
    localStorage.setItem("linkData", JSON.stringify(linkData));
    localStorage.setItem("additionalLinks", JSON.stringify(additionalLinks));
    // Redirigir a la página de confirmación
    router.push("/profile-created");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Atrás</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agrega tus links
          </h1>
          <p className="text-gray-600">
            Completa los campos para agregar tu contenido a tu nuevo Linktree.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Selected Platforms */}
        {selectedPlatforms.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tus selecciones</h2>
            <div className="space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = platformsConfig[platformId];
                const linkValue = linkData.find(link => link.platformId === platformId)?.value || "";
                
                if (!platform) return null;

                return (
                  <div key={platformId} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                    {/* Platform Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-gray-600">
                        {platform.icon}
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        {platform.prefix && (
                          <span className="text-sm text-gray-500 mr-1">{platform.prefix}</span>
                        )}
                        <input
                          type="text"
                          placeholder={platform.placeholder}
                          value={linkValue}
                          onChange={(e) => handleLinkChange(platformId, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Links adicionales</h2>
            <button
              onClick={handleAddAdditionalLink}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Agregar link</span>
            </button>
          </div>

          {additionalLinks.length > 0 && (
            <div className="space-y-4">
              {additionalLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                  {/* Link Icon */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </div>

                  {/* Inputs */}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Título del link"
                      value={link.title}
                      onChange={(e) => handleAdditionalLinkChange(link.id, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="https://ejemplo.com"
                      value={link.url}
                      onChange={(e) => handleAdditionalLinkChange(link.id, "url", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveAdditionalLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {additionalLinks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No hay links adicionales agregados</p>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-md mt-8">
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 rounded-full font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}