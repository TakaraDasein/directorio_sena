"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { 
  Link, 
  Store, 
  Palette, 
  DollarSign, 
  BarChart3, 
  Users, 
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X,
  Save,
  XCircle,
  GripVertical,
  Image as ImageIcon,
  Upload,
  Trash
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks: number;
  isActive: boolean;
  type: "platform" | "custom";
  platformId?: string;
}

interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  clicks_count: number;
  sales_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  template: string;
}

interface CompanyData {
  id: string;
  slug: string;
  company_name: string;
  description: string;
  category: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  social_links: any;
  logo_url: string;
  cover_image_url: string;
  theme: string;
}

const sidebarItems = [
  { id: "links", label: "Enlaces", icon: Link, active: true },
  { id: "shop", label: "Tienda", icon: Store },
  { id: "images", label: "Imágenes", icon: ImageIcon },
  { id: "design", label: "Diseño", icon: Palette },
  { id: "earn", label: "Ganar", icon: DollarSign, badge: "NUEVO" },
  { id: "overview", label: "Vista General", icon: BarChart3 },
  { id: "audience", label: "Audiencia", icon: Users },
  { id: "insights", label: "Estadísticas", icon: TrendingUp }
];

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("links");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [setupProgress, setSetupProgress] = useState(67);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", url: "" });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock_quantity: "0"
  });
  const [selectedTheme, setSelectedTheme] = useState<string>("sena-green");
  const [customColor, setCustomColor] = useState<string>("#2F4D2A");
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  
  // Estados para imágenes
  const [companyImages, setCompanyImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState({
    logo: "",
    cover: "",
    gallery: [] as string[]
  });
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuario autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error al obtener usuario:', userError);
        router.push('/auth');
        return;
      }

      // Obtener datos de la empresa
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (companyError) {
        console.error('Error al cargar empresa:', companyError);
        // Si no tiene empresa, redirigir a crear una
        router.push('/company-name');
        return;
      }

      if (company) {
        setCompanyData(company);
        
        // Cargar tema personalizado
        setSelectedTheme(company.selected_theme || 'sena-green');
        setCustomColor(company.custom_color || '#2F4D2A');
        
        // Establecer perfil de usuario
        setUserProfile({
          name: company.company_name,
          username: company.slug,
          bio: company.description || '',
          avatar: company.logo_url,
          template: company.theme || 'default'
        });

        // Convertir social_links a formato de links
        const socialLinks: LinkItem[] = [];
        if (company.social_links) {
          Object.entries(company.social_links).forEach(([platform, url], index) => {
            if (url && typeof url === 'string' && url.trim()) {
              socialLinks.push({
                id: `social-${platform}`,
                title: getPlatformName(platform),
                url: url as string,
                clicks: Math.floor(Math.random() * 100),
                isActive: true,
                type: "platform",
                platformId: platform
              });
            }
          });
        }

        // Agregar enlaces de contacto
        if (company.website) {
          socialLinks.push({
            id: 'website',
            title: 'Sitio Web',
            url: company.website,
            clicks: Math.floor(Math.random() * 150),
            isActive: true,
            type: "custom"
          });
        }

        if (company.email) {
          socialLinks.push({
            id: 'email',
            title: 'Email',
            url: `mailto:${company.email}`,
            clicks: Math.floor(Math.random() * 80),
            isActive: true,
            type: "custom"
          });
        }

        if (company.whatsapp) {
          socialLinks.push({
            id: 'whatsapp',
            title: 'WhatsApp',
            url: `https://wa.me/${company.whatsapp}`,
            clicks: Math.floor(Math.random() * 200),
            isActive: true,
            type: "platform",
            platformId: "whatsapp"
          });
        }

        setLinks(socialLinks);

        // Cargar productos de la empresa
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', company.id)
          .order('display_order', { ascending: true });

        if (!productsError && productsData) {
          setProducts(productsData);
        }
        
        // Cargar imágenes de la empresa
        const { data: imagesData, error: imagesError } = await supabase
          .from('company_images')
          .select('*')
          .eq('company_id', company.id)
          .order('display_order', { ascending: true });

        if (!imagesError && imagesData) {
          setCompanyImages(imagesData);
          
          // Organizar imágenes por tipo
          const logo = imagesData.find(img => img.image_type === 'logo')?.image_url || '';
          const cover = imagesData.find(img => img.image_type === 'cover')?.image_url || '';
          const gallery = imagesData
            .filter(img => img.image_type === 'gallery')
            .map(img => img.image_url);
          
          setImageUrls({ logo, cover, gallery });
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformName = (platformId: string): string => {
    const names: Record<string, string> = {
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      tiktok: "TikTok",
      youtube: "YouTube",
      facebook: "Facebook",
      twitter: "X",
      spotify: "Spotify",
      website: "Personal Website"
    };
    return names[platformId] || platformId;
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

  const toggleLinkStatus = (linkId: string) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const deleteLink = (linkId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
      setLinks(prev => prev.filter(link => link.id !== linkId));
    }
  };

  const startEditing = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setEditForm({ title: link.title, url: link.url });
  };

  const cancelEditing = () => {
    setEditingLinkId(null);
    setEditForm({ title: "", url: "" });
  };

  const saveEdit = (linkId: string) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { ...link, title: editForm.title, url: editForm.url } 
        : link
    ));
    cancelEditing();
  };

  const copyLink = (link: LinkItem) => {
    const newLink: LinkItem = {
      ...link,
      id: `copy-${link.id}-${Date.now()}`,
      title: `${link.title} (copia)`,
      clicks: 0
    };
    setLinks(prev => [...prev, newLink]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(index, 0, draggedLink);

    setLinks(newLinks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // ====== FUNCIONES PARA PRODUCTOS ======
  
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        image_url: product.image_url || "",
        category: product.category || "",
        stock_quantity: product.stock_quantity.toString()
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        stock_quantity: "0"
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      stock_quantity: "0"
    });
  };

  const saveProduct = async () => {
    if (!companyData) return;

    try {
      const productData = {
        company_id: companyData.id,
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        currency: "COP",
        image_url: productForm.image_url,
        category: productForm.category,
        stock_quantity: parseInt(productForm.stock_quantity),
        is_active: true
      };

      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productData, updated_at: new Date().toISOString() }
            : p
        ));
      } else {
        // Crear nuevo producto
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setProducts(prev => [...prev, data]);
        }
      }

      closeProductModal();
      alert(editingProduct ? '¡Producto actualizado!' : '¡Producto creado!');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const toggleProductStatus = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Producto eliminado');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  // ====== FUNCIONES PARA DISEÑO/TEMAS ======
  
  const predefinedThemes = [
    { id: 'sena-green', name: 'SENA Verde', color: '#2F4D2A', description: 'Color institucional del SENA' },
    { id: 'ocean-blue', name: 'Azul Océano', color: '#0EA5E9', description: 'Profesional y confiable' },
    { id: 'forest-green', name: 'Verde Bosque', color: '#10B981', description: 'Natural y fresco' },
    { id: 'sunset-orange', name: 'Naranja Atardecer', color: '#F97316', description: 'Energético y vibrante' },
    { id: 'royal-purple', name: 'Púrpura Real', color: '#8B5CF6', description: 'Elegante y creativo' },
    { id: 'ruby-red', name: 'Rojo Rubí', color: '#EF4444', description: 'Apasionado y audaz' },
    { id: 'golden-yellow', name: 'Amarillo Dorado', color: '#EAB308', description: 'Optimista y cálido' },
    { id: 'midnight-blue', name: 'Azul Medianoche', color: '#1E3A8A', description: 'Corporativo y formal' },
  ];

  const selectTheme = (themeId: string) => {
    const theme = predefinedThemes.find(t => t.id === themeId);
    if (theme) {
      setSelectedTheme(themeId);
      setCustomColor(theme.color);
    }
  };

  const saveThemeSettings = async () => {
    if (!companyData) return;

    setIsSavingTheme(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          selected_theme: selectedTheme,
          custom_color: customColor,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyData.id);

      if (error) throw error;

      alert('¡Configuración de diseño guardada! Los cambios se verán reflejados en tu ficha pública.');
      
      // Actualizar companyData local
      setCompanyData(prev => prev ? { ...prev, selected_theme: selectedTheme, custom_color: customColor } : null);
    } catch (error) {
      console.error('Error al guardar tema:', error);
      alert('Error al guardar la configuración de diseño');
    } finally {
      setIsSavingTheme(false);
    }
  };

  // ====== FUNCIONES PARA IMÁGENES ======
  
  const uploadImage = async (file: File, imageType: 'logo' | 'cover' | 'gallery') => {
    if (!companyData) return;
    
    setUploadingImage(imageType);
    
    try {
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyData.id}/${imageType}-${Date.now()}.${fileExt}`;
      
      // Subir imagen a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-images')
        .getPublicUrl(fileName);
      
      // Verificar si ya existe una imagen de este tipo
      const existingImage = companyImages.find(img => img.image_type === imageType);
      
      if (existingImage) {
        // Actualizar imagen existente
        const { error: updateError } = await supabase
          .from('company_images')
          .update({
            image_url: publicUrl,
            storage_path: fileName,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingImage.id);
        
        if (updateError) throw updateError;
        
        // Actualizar estado local
        setCompanyImages(prev => 
          prev.map(img => img.id === existingImage.id ? { ...img, image_url: publicUrl, storage_path: fileName } : img)
        );
      } else {
        // Crear nueva entrada en la base de datos
        const { data: newImage, error: insertError } = await supabase
          .from('company_images')
          .insert({
            company_id: companyData.id,
            image_url: publicUrl,
            storage_path: fileName,
            image_type: imageType,
            alt_text: `${imageType} de ${companyData.company_name}`,
            display_order: companyImages.length
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        // Actualizar estado local
        setCompanyImages(prev => [...prev, newImage]);
      }
      
      // Actualizar URLs locales
      if (imageType === 'logo') {
        setImageUrls(prev => ({ ...prev, logo: publicUrl }));
      } else if (imageType === 'cover') {
        setImageUrls(prev => ({ ...prev, cover: publicUrl }));
      } else if (imageType === 'gallery') {
        setImageUrls(prev => ({ ...prev, gallery: [...prev.gallery, publicUrl] }));
      }
      
      alert(`¡${imageType === 'logo' ? 'Logo' : imageType === 'cover' ? 'Portada' : 'Imagen de galería'} actualizada con éxito!`);
      
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
    } finally {
      setUploadingImage(null);
    }
  };
  
  const deleteImage = async (imageId: string, imageType: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    
    try {
      const { error } = await supabase
        .from('company_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      
      // Actualizar estado local
      setCompanyImages(prev => prev.filter(img => img.id !== imageId));
      
      // Actualizar URLs locales
      if (imageType === 'logo') {
        setImageUrls(prev => ({ ...prev, logo: '' }));
      } else if (imageType === 'cover') {
        setImageUrls(prev => ({ ...prev, cover: '' }));
      } else if (imageType === 'gallery') {
        const deletedImage = companyImages.find(img => img.id === imageId);
        if (deletedImage) {
          setImageUrls(prev => ({ 
            ...prev, 
            gallery: prev.gallery.filter(url => url !== deletedImage.image_url) 
          }));
        }
      }
      
      alert('Imagen eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'cover' | 'gallery') => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      uploadImage(file, imageType);
    }
  };

  const renderLinksSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 mt-2 text-base">Administra tus enlaces y contenido</p>
        </div>
        <button className="flex items-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium">
          <Plus className="w-5 h-5" />
          Agregar
        </button>
      </div>

      {/* Add Collection */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[hsl(111,29%,23%)]/5 to-transparent rounded-lg border border-[hsl(111,29%,23%)]/20 hover:border-[hsl(111,29%,23%)]/40 transition-colors cursor-pointer group">
        <input type="checkbox" className="rounded border-[hsl(111,29%,23%)] text-[hsl(111,29%,23%)] focus:ring-[hsl(111,29%,23%)] focus:ring-offset-0 w-5 h-5" />
        <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Agregar colección</span>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link, index) => (
          <div 
            key={link.id} 
            draggable={editingLinkId !== link.id}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`bg-white border-2 rounded-xl p-5 transition-all ${
              draggedIndex === index 
                ? 'opacity-50 border-[hsl(111,29%,23%)]' 
                : 'border-gray-200 hover:shadow-lg hover:border-[hsl(111,29%,23%)]/30'
            }`}
          >
            {editingLinkId === link.id ? (
              // MODO EDICIÓN
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                    placeholder="Título del enlace"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="text"
                    value={editForm.url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => saveEdit(link.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              // MODO VISTA
              <div className="flex items-center justify-between">
                {/* Drag Handle */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="cursor-move text-gray-400 hover:text-[hsl(111,29%,23%)] transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{link.title}</h3>
                      <a 
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[hsl(111,29%,23%)] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-[hsl(111,29%,23%)]" />
                      </a>
                    </div>
                    <a 
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[hsl(111,29%,23%)] truncate block transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-4">
                  {/* Stats */}
                  <div className="flex items-center gap-2 text-sm bg-[hsl(111,29%,23%)]/5 px-4 py-2 rounded-lg">
                    <Eye className="w-4 h-4 text-[hsl(111,29%,23%)]" />
                    <span className="font-semibold text-gray-900">{link.clicks}</span>
                    <span className="text-gray-600">clicks</span>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.isActive}
                      onChange={() => toggleLinkStatus(link.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(111,29%,23%)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(111,29%,23%)]"></div>
                  </label>

                  {/* Menu */}
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => startEditing(link)}
                      className="p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => copyLink(link)}
                      className="p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors"
                      title="Copiar"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteLink(link.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-[hsl(111,29%,23%)]/5 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[hsl(111,29%,23%)]/10 rounded-full mb-6">
              <Link className="w-10 h-10 text-[hsl(111,29%,23%)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No hay enlaces todavía</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Agrega tu primer enlace para comenzar a compartir tu contenido</p>
            <button className="bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Agregar Enlace
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderShopSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tienda</h1>
          <p className="text-gray-600 mt-2 text-base">Administra tus productos y ventas</p>
        </div>
        <button 
          onClick={() => openProductModal()}
          className="flex items-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[hsl(111,29%,23%)]/30 transition-all"
          >
            {/* Imagen del producto */}
            <div className="relative h-48 bg-gray-100">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="w-16 h-16 text-gray-300" />
                </div>
              )}
              
              {/* Badge de estado */}
              <div className="absolute top-3 right-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.is_active}
                    onChange={() => toggleProductStatus(product.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(111,29%,23%)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(111,29%,23%)]"></div>
                </label>
              </div>
            </div>

            {/* Información del producto */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-[hsl(111,29%,23%)]">
                    ${product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {product.stock_quantity}</p>
                </div>
                {product.category && (
                  <span className="px-3 py-1 bg-[hsl(111,29%,23%)]/10 text-[hsl(111,29%,23%)] rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Estadísticas */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{product.views_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>{product.clicks_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{product.sales_count} ventas</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => openProductModal(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(111,29%,23%)]/10 hover:bg-[hsl(111,29%,23%)]/20 text-[hsl(111,29%,23%)] rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {products.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-[hsl(111,29%,23%)]/5 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[hsl(111,29%,23%)]/10 rounded-full mb-6">
            <Store className="w-10 h-10 text-[hsl(111,29%,23%)]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No hay productos todavía</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Comienza a vender agregando tu primer producto</p>
          <button 
            onClick={() => openProductModal()}
            className="bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        </div>
      )}

      {/* Modal de producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button 
                  onClick={closeProductModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                  placeholder="Ej: Café Premium"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                  placeholder="Describe tu producto..."
                />
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (COP) *
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                  placeholder="Ej: Alimentos, Ropa, Electrónica"
                />
              </div>

              {/* URL de imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de imagen
                </label>
                <input
                  type="text"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900"
                  placeholder="https://..."
                />
                {productForm.image_url && (
                  <div className="mt-2">
                    <img 
                      src={productForm.image_url} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeProductModal}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={saveProduct}
                disabled={!productForm.name || !productForm.price}
                className="px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderImagesSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imágenes</h1>
          <p className="text-gray-600 mt-2 text-base">Gestiona el logo, portada y galería de tu ficha pública</p>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Logo</h3>
            <p className="text-sm text-gray-600">Imagen que representa tu empresa (recomendado: 400x400px)</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Preview */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
              {imageUrls.logo ? (
                <img src={imageUrls.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'logo')}
              disabled={uploadingImage === 'logo'}
            />
            <label
              htmlFor="logo-upload"
              className={`flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium ${
                uploadingImage === 'logo' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImage === 'logo' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  {imageUrls.logo ? 'Cambiar Logo' : 'Subir Logo'}
                </>
              )}
            </label>
            {imageUrls.logo && (
              <button
                onClick={() => {
                  const logoImage = companyImages.find(img => img.image_type === 'logo');
                  if (logoImage) deleteImage(logoImage.id, 'logo');
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
              >
                <Trash className="w-5 h-5" />
                Eliminar Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cover Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Imagen de Portada</h3>
            <p className="text-sm text-gray-600">Imagen principal de tu perfil (recomendado: 1920x480px)</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageUrls.cover ? (
              <img src={imageUrls.cover} alt="Portada" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'cover')}
              disabled={uploadingImage === 'cover'}
            />
            <label
              htmlFor="cover-upload"
              className={`flex items-center gap-2 px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium ${
                uploadingImage === 'cover' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImage === 'cover' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  {imageUrls.cover ? 'Cambiar Portada' : 'Subir Portada'}
                </>
              )}
            </label>
            {imageUrls.cover && (
              <button
                onClick={() => {
                  const coverImage = companyImages.find(img => img.image_type === 'cover');
                  if (coverImage) deleteImage(coverImage.id, 'cover');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
              >
                <Trash className="w-5 h-5" />
                Eliminar Portada
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg">
              <ImageIcon className="w-6 h-6 text-[hsl(111,29%,23%)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Galería de Imágenes</h3>
              <p className="text-sm text-gray-600">Imágenes adicionales para mostrar tu trabajo ({imageUrls.gallery.length} imágenes)</p>
            </div>
          </div>
          <input
            type="file"
            id="gallery-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'gallery')}
            disabled={uploadingImage === 'gallery'}
          />
          <label
            htmlFor="gallery-upload"
            className={`flex items-center gap-2 px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium ${
              uploadingImage === 'gallery' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadingImage === 'gallery' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Subiendo...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Agregar Imagen
              </>
            )}
          </label>
        </div>

        {/* Gallery Grid */}
        {imageUrls.gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {companyImages
              .filter(img => img.image_type === 'gallery')
              .map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <img src={image.image_url} alt={image.alt_text || 'Galería'} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => deleteImage(image.id, 'gallery')}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No hay imágenes en la galería</p>
            <p className="text-sm text-gray-500">Haz clic en "Agregar Imagen" para comenzar</p>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Recomendaciones para imágenes</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• <strong>Logo:</strong> Formato cuadrado (400x400px), fondo transparente preferiblemente</li>
              <li>• <strong>Portada:</strong> Formato panorámico (1920x480px), imagen impactante de tu negocio</li>
              <li>• <strong>Galería:</strong> Cualquier tamaño, máximo 5MB por imagen</li>
              <li>• <strong>Formatos:</strong> JPG, PNG, WebP (PNG recomendado para logos)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesignSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diseño</h1>
          <p className="text-gray-600 mt-2 text-base">Personaliza la apariencia de tu ficha pública</p>
        </div>
        <button 
          onClick={saveThemeSettings}
          disabled={isSavingTheme}
          className="flex items-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50"
        >
          {isSavingTheme ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Vista previa del color actual */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-24 h-24 rounded-xl shadow-lg border-4 border-white ring-2 ring-gray-200"
            style={{ backgroundColor: customColor }}
          ></div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Vista Previa</h3>
            <p className="text-gray-600 mb-2">Este es el color que se verá en tu ficha pública</p>
            <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded inline-block">{customColor.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Temas Predefinidos */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[hsl(111,29%,23%)]/10 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Temas Predefinidos</h3>
            <p className="text-sm text-gray-600">Selecciona un tema y personalízalo</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {predefinedThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedTheme === theme.id
                  ? 'border-[hsl(111,29%,23%)] bg-[hsl(111,29%,23%)]/5 ring-2 ring-[hsl(111,29%,23%)]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-16 h-16 rounded-lg shadow-md"
                  style={{ backgroundColor: theme.color }}
                ></div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-sm">{theme.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                </div>
              </div>
              
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-[hsl(111,29%,23%)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Color Personalizado */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[hsl(111,29%,23%)]/10 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Color Personalizado</h3>
            <p className="text-sm text-gray-600">Elige el color exacto de tu marca</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de color */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selector de Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedTheme('custom');
                  }}
                  className="w-24 h-24 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Haz clic en el cuadro para abrir el selector de color
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input hexadecimal */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Hexadecimal
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-600">#</span>
                <input
                  type="text"
                  value={customColor.replace('#', '')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                    setCustomColor(`#${value}`);
                    setSelectedTheme('custom');
                  }}
                  placeholder="2F4D2A"
                  maxLength={6}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900 font-mono text-lg uppercase"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ingresa el código hexadecimal de tu marca (sin el #)
              </p>
            </div>

            {/* Colores rápidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colores Rápidos
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['#2F4D2A', '#EF4444', '#F97316', '#EAB308', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899', '#6B7280', '#1E3A8A', '#BE185D', '#059669'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setCustomColor(color);
                      setSelectedTheme('custom');
                    }}
                    className={`w-full h-10 rounded-lg shadow-sm hover:scale-110 transition-transform ${
                      customColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Acerca de la personalización</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los cambios se aplicarán a tu ficha pública después de guardar</li>
              <li>• El color se utilizará en botones, encabezados y elementos destacados</li>
              <li>• Puedes cambiar el diseño en cualquier momento</li>
              <li>• Recomendamos usar el color principal de tu marca</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultSection = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{activeSection}</h1>
        <p className="text-gray-600 mt-2 text-base">Esta sección estará disponible pronto</p>
      </div>
      
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-[hsl(111,29%,23%)]/5 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[hsl(111,29%,23%)]/10 rounded-full mb-6">
          {sidebarItems.find(item => item.id === activeSection)?.icon && 
            React.createElement(sidebarItems.find(item => item.id === activeSection)!.icon, { className: "w-10 h-10 text-[hsl(111,29%,23%)]" })
          }
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Próximamente</h3>
        <p className="text-gray-600 max-w-md mx-auto">Esta funcionalidad estará disponible muy pronto</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "links":
        return renderLinksSection();
      case "shop":
        return renderShopSection();
      case "images":
        return renderImagesSection();
      case "design":
        return renderDesignSection();
      default:
        return renderDefaultSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[hsl(111,29%,23%)]/5 flex">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-[hsl(111,29%,23%)]/20 border-t-[hsl(111,29%,23%)] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando datos de tu empresa...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-gray-200 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-gray-200 bg-gradient-to-r from-[hsl(111,29%,23%)]/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-900">{userProfile?.name || 'Cargando...'}</p>
                <p className="text-xs text-gray-600">@{userProfile?.username || 'usuario'}</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => companyData && router.push(`/${companyData.slug}`)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[hsl(111,29%,23%)]/30 transition-all text-sm font-medium text-gray-700"
            >
              <Eye className="w-4 h-4" />
              Ver Ficha
            </button>
            <button
              onClick={() => companyData && router.push(`/company/create?edit=${companyData.id}`)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-all text-sm font-medium"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium ${
                activeSection === item.id
                  ? "bg-[hsl(111,29%,23%)] text-white shadow-md"
                  : "text-gray-700 hover:bg-[hsl(111,29%,23%)]/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-bold ${
                  activeSection === item.id
                    ? "bg-white/20 text-white"
                    : "bg-[hsl(111,29%,23%)]/10 text-[hsl(111,29%,23%)]"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Setup Progress */}
        <div className="p-4 border-t-2 border-gray-200 mt-auto absolute bottom-0 left-0 right-0 bg-white">
          <div className="bg-gradient-to-br from-[hsl(111,29%,23%)]/10 to-[hsl(111,29%,23%)]/5 rounded-xl p-5 border-2 border-[hsl(111,29%,23%)]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">Tu lista de configuración</span>
              <span className="text-sm font-bold text-[hsl(111,29%,23%)]">{setupProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${setupProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mb-4 font-medium">4 de 6 completadas</p>
            <button className="w-full bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              Finalizar configuración
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-[hsl(111,29%,23%)]" />
              </button>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(111,29%,23%)] focus:border-transparent text-gray-900 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2.5 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">
                  {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      </>
      )}
    </div>
  );
}