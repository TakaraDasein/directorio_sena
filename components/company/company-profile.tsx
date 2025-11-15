"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  User,
  Briefcase,
  Eye,
  Share2,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Star,
  Clock,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Store,
  ShoppingCart,
  Package,
} from "lucide-react";
import type { CompanyWithRelations } from "@/lib/types/database.types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getThemeById, applyTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";

interface CompanyProfileProps {
  company: CompanyWithRelations;
}

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

const categoryLabels: Record<string, string> = {
  "emprendimiento-egresado": "Egresado con Emprendimiento",
  "empresa-fe": "Empresa Ganadora FE",
  "agente-digitalizador": "Agente Digitalizador",
  // Legacy values para compatibilidad
  egresado: "Egresado con Emprendimiento",
  empresa: "Empresa Ganadora FE",
  instructor: "Agente Digitalizador",
};

const daysOfWeek = [
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADOS",
  "DOMINGOS",
];

export function CompanyProfile({ company }: CompanyProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();

  // Estados para review/calificación
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    comment: "",
    title: "",
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Estados para horarios
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(true);

  // Estados para redes sociales
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [isLoadingSocialLinks, setIsLoadingSocialLinks] = useState(true);

  // Verificar si el usuario es dueño del perfil
  useEffect(() => {
    const checkOwnership = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && company.user_id === user.id) {
        setIsOwner(true);
      }
    };
    checkOwnership();
  }, [company.user_id]);

  // Obtener color personalizado
  const primaryColor =
    (company as any).custom_color || company.theme_color || "#2F4D2A";

  // Aplicar color personalizado de la empresa
  useEffect(() => {
    // Crear estilos dinámicos para la ficha
    const styleId = "company-custom-styles";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Inyectar CSS personalizado
    styleElement.textContent = `
      .custom-primary-bg {
        background-color: ${primaryColor} !important;
      }
      .custom-primary-text {
        color: ${primaryColor} !important;
      }
      .custom-primary-bg-10 {
        background-color: ${primaryColor}1A !important;
      }
      .custom-primary-border {
        border-color: ${primaryColor} !important;
      }
      .custom-primary-ring {
        --tw-ring-color: ${primaryColor} !important;
      }
      .custom-primary-hover:hover {
        background-color: ${primaryColor}DD !important;
      }
      
      /* Sobrescribir botones SENA con color personalizado */
      .sena-btn-primary {
        background-color: ${primaryColor} !important;
      }
      .sena-btn-primary:hover {
        background-color: ${primaryColor}DD !important;
      }
      .sena-btn-secondary {
        border-color: ${primaryColor} !important;
        color: ${primaryColor} !important;
      }
      .sena-btn-secondary:hover {
        background-color: ${primaryColor}0D !important;
      }
      
      /* Iconos y elementos con clase sena-icon-box */
      .sena-icon-box {
        background-color: ${primaryColor}1A !important;
      }
      .sena-icon-box svg {
        color: ${primaryColor} !important;
      }
      
      /* Sobrescribir clases de Tailwind/Shadcn */
      .text-primary {
        color: ${primaryColor} !important;
      }
      .bg-primary {
        background-color: ${primaryColor} !important;
      }
      .border-primary {
        border-color: ${primaryColor} !important;
      }
      .hover\\:border-primary\\/30:hover {
        border-color: ${primaryColor}4D !important;
      }
    `;

    return () => {
      // Cleanup cuando el componente se desmonte
      styleElement?.remove();
    };
  }, [primaryColor]);

  // Cargar reviews de la empresa
  useEffect(() => {
    loadReviews();
    loadBusinessHours();
    loadSocialLinks();
  }, [company.id]);

  const loadReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("company_reviews")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error("Error al cargar reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const loadBusinessHours = async () => {
    try {
      setIsLoadingHours(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("business_hours")
        .select("*")
        .eq("company_id", company.id)
        .order("day_of_week", { ascending: true });

      if (error) throw error;

      setBusinessHours(data || []);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    } finally {
      setIsLoadingHours(false);
    }
  };

  const loadSocialLinks = async () => {
    try {
      setIsLoadingSocialLinks(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("company_id", company.id)
        .order("display_order", { ascending: true });

      if (error) throw error;

      setSocialLinks(data || []);
    } catch (error) {
      console.error("Error al cargar enlaces sociales:", error);
    } finally {
      setIsLoadingSocialLinks(false);
    }
  };

  // Obtener imágenes por tipo
  const logoImage = company.company_images?.find(
    (img) => img.image_type === "logo"
  );
  const coverImage = company.company_images?.find(
    (img) => img.image_type === "cover"
  );
  const galleryImages =
    company.company_images?.filter((img) => img.image_type === "gallery") || [];

  // Carrusel de imágenes
  const carouselImages = coverImage
    ? [coverImage, ...galleryImages]
    : galleryImages;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: company.company_name,
          text: company.short_description || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error al compartir:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡URL copiada al portapapeles!");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (
      !reviewForm.comment.trim() ||
      !reviewForm.title.trim() ||
      !reviewForm.name.trim() ||
      !reviewForm.email.trim()
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Guardar review en Supabase
      const { data, error } = await supabase
        .from("company_reviews")
        .insert({
          company_id: company.id,
          rating: rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          author_name: reviewForm.name,
          author_email: reviewForm.email,
          is_approved: false, // Requiere aprobación del admin
        })
        .select()
        .single();

      if (error) throw error;

      alert(
        "¡Gracias por tu opinión! Tu comentario será revisado y publicado pronto."
      );

      // Limpiar formulario
      setReviewForm({
        comment: "",
        title: "",
        name: "",
        email: "",
      });
      setRating(0);
    } catch (error) {
      console.error("Error al enviar review:", error);
      alert("Hubo un error al enviar tu opinión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar con tema de la empresa */}
      <nav
        className="sticky top-0 z-50 py-3.5 md:py-4 shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="container px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <Logo asLink={false} size="sm" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="https://www.directoriosena.com/search"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              Directorio
            </Link>
            <Link
              href="/blog"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              Blogs
            </Link>
            <Link
              href="/kit-digital"
              className="text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              Kit Digital
            </Link>
            <Link href={isOwner ? "/admin" : "/auth"}>
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30"
              >
                {isOwner ? "Ir al Admin" : "Unirme"}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 px-6 space-y-3">
            <Link
              href="https://www.directoriosena.com/search"
              className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Directorio
            </Link>
            <Link
              href="/blog"
              className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="/kit-digital"
              className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Kit Digital
            </Link>
            <Link
              href={isOwner ? "/admin" : "/auth"}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="outline"
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30"
              >
                {isOwner ? "Ir al Admin" : "Unirme"}
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section - Minimalista estilo Vercel */}
      <div className="relative border-b border-gray-200">
        {/* Cover Image - Más bajo y elegante */}
        <div className="relative h-[280px] md:h-[320px] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden">
          {carouselImages.length > 0 ? (
            <div className="relative h-full group">
              <Image
                src={carouselImages[currentImageIndex].image_url}
                alt={
                  carouselImages[currentImageIndex].alt_text ||
                  company.company_name
                }
                fill
                className="object-cover opacity-90"
                priority
                onError={() => setImageError(true)}
              />

              {/* Gradient Overlay Sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

              {/* Carousel Controls - Minimalistas */}
              {carouselImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Indicators - Discretos */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "custom-primary-bg w-6"
                            : "bg-gray-300 hover:bg-gray-400 w-1.5"
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-24 w-24 text-gray-300" />
              </div>
            </div>
          )}
        </div>

        {/* Company Header - Debajo de la imagen */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo - Estilo Vercel */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-sm border border-gray-200 p-2 overflow-hidden">
                  {logoImage ? (
                    <Image
                      src={logoImage.image_url}
                      alt={`Logo de ${company.company_name}`}
                      fill
                      className="object-contain p-1"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                      {company.company_name}
                    </h1>
                    {company.short_description && (
                      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {company.short_description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons - Estilo Vercel */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Meta Info - Horizontal con separadores */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <Badge
                    variant="secondary"
                    className="custom-primary-bg border-0 font-medium"
                    style={{ color: "white" }}
                  >
                    {categoryLabels[company.category] || company.category}
                  </Badge>
                  {company.industry && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {company.industry}
                      </span>
                    </>
                  )}
                  {company.city && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.city}
                      </span>
                    </>
                  )}
                  {company.year_founded && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Desde {company.year_founded}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Estilo Vercel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions - Cards estilo Vercel */}
            <div className="flex flex-wrap gap-3">
              {company.phone && (
                <Button
                  asChild
                  size="lg"
                  className="custom-primary-bg custom-primary-hover text-white font-medium shadow-sm"
                >
                  <a href={`tel:${company.phone}`} className="gap-2">
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                </Button>
              )}

              {company.email && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <a href={`mailto:${company.email}`} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Correo
                  </a>
                </Button>
              )}

              {company.website && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Sitio web
                  </a>
                </Button>
              )}

              {/* Social Links */}
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <Button
                    key={link.id}
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {link.platform.charAt(0).toUpperCase() +
                        link.platform.slice(1)}
                    </a>
                  </Button>
                );
              })}
            </div>

            {/* Description - Card minimalista */}
            {company.description && (
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Acerca de
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {company.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* YouTube Video Section */}
            {(company as any).youtube_video_url &&
              (() => {
                const extractYouTubeId = (url: string): string | null => {
                  const patterns = [
                    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                    /youtube\.com\/shorts\/([^&\n?#]+)/,
                  ];

                  for (const pattern of patterns) {
                    const match = url.match(pattern);
                    if (match && match[1]) {
                      return match[1];
                    }
                  }
                  return null;
                };

                const videoId = extractYouTubeId(
                  (company as any).youtube_video_url
                );

                return videoId ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Video</h3>
                      </div>

                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Video de la empresa"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })()}

            {/* Company Details Grid - Estilo Vercel */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Información de la empresa
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.industry && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Industria</p>
                        <p className="font-medium text-gray-900">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.year_founded && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Año de fundación
                        </p>
                        <p className="font-medium text-gray-900">
                          {company.year_founded}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.employee_count && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Users className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Número de empleados
                        </p>
                        <p className="font-medium text-gray-900">
                          {company.employee_count}
                        </p>
                      </div>
                    </div>
                  )}

                  {(company.city || company.department) && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                        <p className="font-medium text-gray-900">
                          {[company.city, company.department]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags/Categories */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Categorías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.category && (
                    <Badge
                      className="custom-primary-bg hover:custom-primary-bg/90 border-0 px-3 py-1.5 font-medium"
                      style={{ color: "white" }}
                    >
                      {categoryLabels[company.category]}
                    </Badge>
                  )}
                  {company.industry && (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1.5 font-medium">
                      {company.industry}
                    </Badge>
                  )}
                  {company.employee_count && (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1.5 font-medium">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {company.employee_count}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Califica y escribe un comentario
                </h3>

                <form
                  onSubmit={handleSubmitReview}
                  className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200"
                >
                  <p className="text-gray-900 font-semibold mb-4">Tu Opinión</p>

                  {/* Textarea para comentario */}
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    placeholder="Cuente su experiencia o deje un consejo para otros"
                    className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                    required
                  />

                  {/* Sistema de calificación con estrellas */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Su calificación general:
                    </p>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-all duration-200 hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                              star <= (hoverRating || rating)
                                ? "fill-current custom-primary-text"
                                : "text-gray-300"
                            }`}
                            style={{
                              color:
                                star <= (hoverRating || rating)
                                  ? primaryColor
                                  : undefined,
                            }}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-3 text-sm text-gray-600 self-center">
                          {rating} de 5 estrellas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Campos del formulario */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Título de su opinión *
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Resuma su opinión"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, name: e.target.value })
                        }
                        placeholder="Tu nombre"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="tu@email.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Botón de envío */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="sena-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      "Envíe su opinión"
                    )}
                  </Button>
                </form>

                {/* Opiniones existentes */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Opiniones de clientes ({reviews.length})
                  </h4>

                  {isLoadingReviews ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                      <p className="text-gray-600 mt-2">
                        Cargando opiniones...
                      </p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-bold text-gray-900 text-lg mb-1">
                                {review.title}
                              </h5>
                              <div className="flex items-center gap-2 mb-2">
                                {/* Estrellas del review */}
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-current"
                                          : "text-gray-300"
                                      }`}
                                      style={{
                                        color:
                                          star <= review.rating
                                            ? primaryColor
                                            : undefined,
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {review.rating} de 5
                                </span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString(
                                "es-CO",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.comment}
                          </p>

                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">
                              {review.author_name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium mb-1">
                        Aún no hay opiniones
                      </p>
                      <p className="text-sm text-gray-500">
                        Sé el primero en compartir tu experiencia
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section - DESHABILITADA TEMPORALMENTE */}
            {false && galleryImages.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Galería de fotos</h3>
                    <Button variant="link" className="text-primary">
                      Todas las fotos ({galleryImages.length})
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || `Galería ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products Section */}
            {company.products && company.products.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Store className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Productos</h3>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {company.products.filter((p: any) => p.is_active).length}{" "}
                      disponibles
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.products
                      .filter((product: any) => product.is_active)
                      .slice(0, 6)
                      .map((product: any) => (
                        <div
                          key={product.id}
                          className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
                        >
                          {/* Imagen del producto */}
                          <div className="relative h-48 bg-gray-100">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-300" />
                              </div>
                            )}

                            {/* Badge de categoría */}
                            {product.category && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-white/90 text-gray-900 border-0">
                                  {product.category}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Información del producto */}
                          <div className="p-4">
                            <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                              {product.name}
                            </h4>

                            {product.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold text-primary">
                                  ${product.price.toLocaleString("es-CO")}
                                </p>
                                {product.stock_quantity > 0 && (
                                  <p className="text-xs text-gray-500">
                                    Stock: {product.stock_quantity}
                                  </p>
                                )}
                              </div>

                              <Button
                                size="sm"
                                className="sena-btn-primary flex items-center gap-2"
                                onClick={() => {
                                  const whatsappNumber = company.whatsapp || "";
                                  if (!whatsappNumber) {
                                    alert(
                                      "El vendedor no ha configurado su WhatsApp"
                                    );
                                    return;
                                  }

                                  const message = `Hola! Estoy interesado en:\n\n*${
                                    product.name
                                  }*\nPrecio: $${product.price.toLocaleString(
                                    "es-CO"
                                  )}\n${
                                    product.description
                                      ? `\n${product.description}\n`
                                      : ""
                                  }\nVisto en: ${window.location.href}`;
                                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                    message
                                  )}`;
                                  window.open(whatsappUrl, "_blank");
                                }}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Comprar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {company.products.filter((p: any) => p.is_active).length >
                    6 && (
                    <div className="mt-6 text-center">
                      <Button variant="outline" className="w-full">
                        Ver todos los productos (
                        {
                          company.products.filter((p: any) => p.is_active)
                            .length
                        }
                        )
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Entrepreneur Card */}
            {((company as any).entrepreneur_name ||
              (company as any).entrepreneur_image_url) && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {(company as any).entrepreneur_image_url ? (
                      <Image
                        src={(company as any).entrepreneur_image_url}
                        alt={
                          (company as any).entrepreneur_name || "Emprendedor"
                        }
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">
                    {(company as any).entrepreneur_name || "Emprendedor"}
                  </h3>
                  <p className="text-gray-600">Empresario</p>
                </CardContent>
              </Card>
            )}

            {/* Map Card */}
            <Card>
              <CardContent className="pt-6">
                {(company.address || company.city) && (
                  <>
                    {/* Google Maps Embed */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden border border-gray-200">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                          `${company.address || ""} ${company.city || ""} ${
                            company.department || ""
                          } Colombia`
                        )}`}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">
                        {company.address || company.city}
                      </p>
                      {company.city && company.department && (
                        <p className="text-sm text-gray-600">
                          {company.city}, {company.department}
                        </p>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${company.address || ""} ${company.city || ""} ${
                            company.department || ""
                          } Colombia`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                        style={{ color: primaryColor }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir en Google Maps
                      </a>
                    </div>
                  </>
                )}

                {!company.address && !company.city && (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Sin ubicación</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Horarios</h3>
                </div>

                {isLoadingHours ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary"></div>
                  </div>
                ) : businessHours.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No hay horarios configurados
                  </p>
                ) : (
                  <div className="space-y-2">
                    {daysOfWeek.map((day, index) => {
                      const dayNumber = index === 6 ? 0 : index + 1; // Ajustar domingo (0)
                      const hourData = businessHours.find(
                        (h) => h.day_of_week === dayNumber
                      );

                      let timeDisplay = "7:00 am – 6:00 pm"; // Default

                      if (hourData) {
                        if (hourData.is_closed) {
                          timeDisplay = "Cerrado";
                        } else if (hourData.is_24_hours) {
                          timeDisplay = "Abierto 24 horas";
                        } else if (hourData.opens_at && hourData.closes_at) {
                          // Formatear horas de 24h a 12h
                          const formatTime = (time: string) => {
                            const [hours, minutes] = time.split(":");
                            const hour = parseInt(hours);
                            const ampm = hour >= 12 ? "pm" : "am";
                            const hour12 = hour % 12 || 12;
                            return `${hour12}:${minutes} ${ampm}`;
                          };
                          timeDisplay = `${formatTime(
                            hourData.opens_at
                          )} – ${formatTime(hourData.closes_at)}`;
                        }
                      }

                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="font-medium">{day}</span>
                          <span
                            className={`${
                              hourData?.is_closed
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {timeDisplay}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories/Tags Sidebar */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="sena-icon-box">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">
                      {categoryLabels[company.category]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="sena-icon-box">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">Eventos</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="sena-icon-box">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">{company.industry}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {company.company_stats && (
              <Card className="bg-gradient-to-br from-secondary to-secondary/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Visitas</span>
                    </div>
                    <span className="font-bold text-2xl text-primary">
                      {company.company_stats.total_views}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
