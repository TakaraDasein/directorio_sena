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
  Trash,
  Video,
  MessageSquare,
  Star,
  Check,
  XCircle as XCircleIcon,
  Clock,
  LogOut,
  FileText
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

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("links");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
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
  
  // Estados para opiniones/reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  
  // Estados para horarios
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  
  // Estados para blogs
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    author: "",
    cover_image: "",
    content: "",
    is_published: false
  });
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);
  
  // Estados para emprendedor
  const [entrepreneurName, setEntrepreneurName] = useState("");
  const [entrepreneurImageUrl, setEntrepreneurImageUrl] = useState("");
  const [uploadingEntrepreneurImage, setUploadingEntrepreneurImage] = useState(false);
  
  // YouTube Video
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Menu items con badge dinámico
  const sidebarItems = [
    { id: "links", label: "Enlaces", icon: Link, active: true },
    { id: "shop", label: "Tienda", icon: Store },
    { id: "images", label: "Imágenes", icon: ImageIcon },
    { id: "video", label: "Video", icon: Video },
    { id: "entrepreneur", label: "Emprendedor", icon: User },
    { id: "hours", label: "Horarios", icon: Clock },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "reviews", label: "Opiniones", icon: MessageSquare, badge: pendingReviewsCount > 0 ? String(pendingReviewsCount) : undefined },
    { id: "design", label: "Diseño", icon: Palette }
  ];

  useEffect(() => {
    loadCompanyData();
  }, []);

  useEffect(() => {
    if (companyData?.id) {
      loadReviews();
      loadBusinessHours();
      loadBlogs();
    }
  }, [companyData?.id]);

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
        
        // Cargar datos del emprendedor
        setEntrepreneurName(company.entrepreneur_name || '');
        setEntrepreneurImageUrl(company.entrepreneur_image_url || '');
        
        // Cargar video de YouTube
        setYoutubeUrl(company.youtube_video_url || '');
        
        // Establecer perfil de usuario
        setUserProfile({
          name: company.company_name,
          username: company.slug,
          bio: company.description || '',
          avatar: company.logo_url,
          template: company.theme || 'default'
        });

        // Cargar enlaces sociales desde la tabla social_links
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('company_id', company.id)
          .order('display_order', { ascending: true });

        const socialLinks: LinkItem[] = [];
        
        if (!socialLinksError && socialLinksData) {
          socialLinksData.forEach((link) => {
            socialLinks.push({
              id: link.id,
              title: getPlatformName(link.platform),
              url: link.url,
              clicks: Math.floor(Math.random() * 100),
              isActive: true,
              type: "platform",
              platformId: link.platform
            });
          });
        }

        // Agregar enlaces de contacto desde la empresa
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

  const loadReviews = async () => {
    if (!companyData?.id) return;
    
    try {
      setIsLoadingReviews(true);
      
      const { data, error } = await supabase
        .from('company_reviews')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar opiniones:', error);
        return;
      }
      
      setReviews(data || []);
      
      // Contar opiniones pendientes
      const pending = data?.filter(review => !review.is_approved).length || 0;
      setPendingReviewsCount(pending);
      
    } catch (error) {
      console.error('Error al cargar opiniones:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const loadBusinessHours = async () => {
    if (!companyData?.id) return;
    
    try {
      setIsLoadingHours(true);
      
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('company_id', companyData.id)
        .order('day_of_week', { ascending: true });
      
      if (error) {
        console.error('Error al cargar horarios:', error);
        return;
      }
      
      // Si no hay horarios, crear estructura por defecto
      if (!data || data.length === 0) {
        const defaultHours = [];
        for (let day = 0; day <= 6; day++) {
          defaultHours.push({
            day_of_week: day,
            opens_at: '07:00',
            closes_at: '18:00',
            is_closed: false,
            is_24_hours: false
          });
        }
        setBusinessHours(defaultHours);
      } else {
        setBusinessHours(data);
      }
      
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setIsLoadingHours(false);
    }
  };

  const loadBlogs = async () => {
    if (!companyData?.id) return;
    
    try {
      setIsLoadingBlogs(true);
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar blogs:', error);
        return;
      }
      
      setBlogs(data || []);
      
    } catch (error) {
      console.error('Error al cargar blogs:', error);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .trim();
  };

  const openBlogModal = (blog?: any) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        author: blog.author,
        cover_image: blog.cover_image || "",
        content: "", // Cargaremos el contenido del archivo markdown
        is_published: blog.is_published
      });
    } else {
      setEditingBlog(null);
      setBlogForm({
        title: "",
        slug: "",
        excerpt: "",
        author: companyData?.company_name || "",
        cover_image: "",
        content: "",
        is_published: false
      });
    }
    setShowBlogModal(true);
  };

  const saveBlog = async () => {
    if (!companyData?.id || !blogForm.title || !blogForm.content) {
      alert('Por favor completa el título y contenido del blog');
      return;
    }

    try {
      const slug = blogForm.slug || generateSlug(blogForm.title);
      const fileName = `${slug}-${Date.now()}.md`;
      const contentPath = `${companyData.id}/${fileName}`;

      // Guardar el contenido markdown en storage
      const { error: storageError } = await supabase.storage
        .from('blog-content')
        .upload(contentPath, new Blob([blogForm.content], { type: 'text/markdown' }));

      if (storageError) {
        console.error('Error al guardar contenido:', storageError);
        alert('Error al guardar el contenido del blog');
        return;
      }

      // Guardar metadatos en la tabla
      const blogData = {
        company_id: companyData.id,
        title: blogForm.title,
        slug: slug,
        excerpt: blogForm.excerpt,
        author: blogForm.author,
        cover_image: blogForm.cover_image,
        content_path: contentPath,
        is_published: blogForm.is_published,
        published_at: blogForm.is_published ? new Date().toISOString() : null
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);

        if (error) {
          console.error('Error al actualizar blog:', error);
          alert('Error al actualizar el blog');
          return;
        }
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);

        if (error) {
          console.error('Error al crear blog:', error);
          alert('Error al crear el blog');
          return;
        }
      }

      setShowBlogModal(false);
      loadBlogs();
      alert('Blog guardado exitosamente');
      
    } catch (error) {
      console.error('Error al guardar blog:', error);
      alert('Error al guardar el blog');
    }
  };

  const deleteBlog = async (blogId: string, contentPath: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este blog?')) return;

    try {
      // Eliminar archivo de storage
      await supabase.storage
        .from('blog-content')
        .remove([contentPath]);

      // Eliminar de la tabla
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) {
        console.error('Error al eliminar blog:', error);
        alert('Error al eliminar el blog');
        return;
      }

      loadBlogs();
      alert('Blog eliminado exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar blog:', error);
      alert('Error al eliminar el blog');
    }
  };

  const uploadBlogImage = async (file: File) => {
    if (!companyData?.id) return null;

    try {
      setUploadingBlogImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${companyData.id}/blog-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      return null;
    } finally {
      setUploadingBlogImage(false);
    }
  };

  const saveBusinessHours = async () => {
    if (!companyData?.id) return;
    
    try {
      // Eliminar horarios existentes
      await supabase
        .from('business_hours')
        .delete()
        .eq('company_id', companyData.id);
      
      // Insertar nuevos horarios
      const hoursToInsert = businessHours.map(hour => ({
        company_id: companyData.id,
        day_of_week: hour.day_of_week,
        opens_at: hour.is_closed || hour.is_24_hours ? null : hour.opens_at,
        closes_at: hour.is_closed || hour.is_24_hours ? null : hour.closes_at,
        is_closed: hour.is_closed,
        is_24_hours: hour.is_24_hours
      }));
      
      const { error } = await supabase
        .from('business_hours')
        .insert(hoursToInsert);
      
      if (error) throw error;
      
      alert('Horarios guardados exitosamente');
      loadBusinessHours();
      
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      alert('Error al guardar los horarios');
    }
  };

  const updateHour = (dayOfWeek: number, field: string, value: any) => {
    setBusinessHours(prevHours => {
      // Asegurar que prevHours sea un array
      const currentHours = prevHours || [];
      
      // Buscar si ya existe un horario para este día
      const existingIndex = currentHours.findIndex(h => h?.day_of_week === dayOfWeek);
      
      if (existingIndex >= 0) {
        // Actualizar horario existente
        const newHours = [...currentHours];
        newHours[existingIndex] = { 
          ...newHours[existingIndex], 
          day_of_week: dayOfWeek, // Asegurar que siempre tenga day_of_week
          [field]: value 
        };
        return newHours;
      } else {
        // Crear nuevo horario para este día
        const newHour = {
          day_of_week: dayOfWeek,
          opens_at: '07:00',
          closes_at: '18:00',
          is_closed: field === 'is_closed' ? value : false,
          is_24_hours: field === 'is_24_hours' ? value : false,
          [field]: value
        };
        return [...currentHours, newHour];
      }
    });
  };

  const approveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('company_reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);
      
      if (error) {
        console.error('Error al aprobar opinión:', error);
        alert('Error al aprobar la opinión');
        return;
      }
      
      // Recargar opiniones
      await loadReviews();
      alert('Opinión aprobada exitosamente');
      
    } catch (error) {
      console.error('Error al aprobar opinión:', error);
      alert('Error al aprobar la opinión');
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta opinión?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('company_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) {
        console.error('Error al eliminar opinión:', error);
        alert('Error al eliminar la opinión');
        return;
      }
      
      // Recargar opiniones
      await loadReviews();
      alert('Opinión eliminada exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar opinión:', error);
      alert('Error al eliminar la opinión');
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

  const deleteLink = async (linkId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este enlace?')) return;
    
    // Si el link tiene un ID real (no es temporal), eliminarlo de la base de datos
    const link = links.find(l => l.id === linkId);
    const isTemporaryLink = linkId.startsWith('link-');
    
    if (link && !isTemporaryLink) {
      try {
        const { error } = await supabase
          .from('social_links')
          .delete()
          .eq('id', linkId);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error al eliminar enlace:', error);
        alert('Error al eliminar el enlace');
        return;
      }
    }
    
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const startEditing = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setEditForm({ title: link.title, url: link.url });
  };

  const cancelEditing = () => {
    setEditingLinkId(null);
    setEditForm({ title: "", url: "" });
  };

  const saveEdit = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    
    if (!companyData) {
      alert('Error: No se pudo identificar la empresa');
      return;
    }

    try {
      // Verificar si el link ya existe en la base de datos
      const isNewLink = linkId.startsWith('link-');
      
      if (isNewLink) {
        // Crear nuevo link en la base de datos
        const { data, error } = await supabase
          .from('social_links')
          .insert({
            company_id: companyData.id,
            platform: editForm.title.toLowerCase().replace(/\s+/g, '-'),
            url: editForm.url,
            display_order: links.length
          })
          .select()
          .single();

        if (error) throw error;

        // Actualizar el ID temporal con el ID real de la base de datos
        setLinks(prev => prev.map(l => 
          l.id === linkId 
            ? { ...l, id: data.id, title: editForm.title, url: editForm.url, type: 'custom' }
            : l
        ));
      } else {
        // Actualizar link existente
        const { error } = await supabase
          .from('social_links')
          .update({ 
            url: editForm.url,
            platform: link?.type === 'custom' 
              ? editForm.title.toLowerCase().replace(/\s+/g, '-')
              : link?.platformId || link?.title.toLowerCase()
          })
          .eq('id', linkId);
        
        if (error) throw error;

        // Actualizar en el estado local
        setLinks(prev => prev.map(l => 
          l.id === linkId 
            ? { ...l, title: editForm.title, url: editForm.url } 
            : l
        ));
      }
      
      cancelEditing();
    } catch (error) {
      console.error('Error al guardar enlace:', error);
      alert('Error al guardar el enlace');
    }
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

  const addNewLink = () => {
    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      title: "Nuevo enlace",
      url: "https://",
      clicks: 0,
      isActive: true,
      type: "custom"
    };
    setLinks(prev => [...prev, newLink]);
    // Activar modo edición para el nuevo link
    startEditing(newLink);
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
        // Reset input file
        const logoInput = document.getElementById('logo-upload') as HTMLInputElement;
        if (logoInput) logoInput.value = '';
      } else if (imageType === 'cover') {
        setImageUrls(prev => ({ ...prev, cover: '' }));
        // Reset input file
        const coverInput = document.getElementById('cover-upload') as HTMLInputElement;
        if (coverInput) coverInput.value = '';
      } else if (imageType === 'gallery') {
        const deletedImage = companyImages.find(img => img.id === imageId);
        if (deletedImage) {
          setImageUrls(prev => ({ 
            ...prev, 
            gallery: prev.gallery.filter(url => url !== deletedImage.image_url) 
          }));
        }
        // Reset input file
        const galleryInput = document.getElementById('gallery-upload') as HTMLInputElement;
        if (galleryInput) galleryInput.value = '';
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
        event.target.value = ''; // Reset input
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        event.target.value = ''; // Reset input
        return;
      }
      
      uploadImage(file, imageType);
      // Reset input después de seleccionar para permitir seleccionar el mismo archivo de nuevo
      event.target.value = '';
    }
  };

  const uploadProductImage = async (file: File) => {
    if (!companyData) return;
    
    setUploadingProductImage(true);
    
    try {
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyData.id}/products/product-${Date.now()}.${fileExt}`;
      
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
      
      // Actualizar formulario con la URL
      setProductForm(prev => ({ ...prev, image_url: publicUrl }));
      
      alert('Imagen subida con éxito');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingProductImage(false);
    }
  };

  const handleProductImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      
      uploadProductImage(file);
    }
  };

  // ====== FUNCIONES PARA EMPRENDEDOR ======
  
  const uploadEntrepreneurImage = async (file: File) => {
    if (!companyData) return;
    
    setUploadingEntrepreneurImage(true);
    
    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 800KB)
      if (file.size > 800 * 1024) {
        alert('La imagen no debe superar los 800KB');
        return;
      }
      
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyData.id}/entrepreneur-${Date.now()}.${fileExt}`;
      
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
      
      // Guardar URL en la base de datos
      const { error: updateError } = await supabase
        .from('companies')
        .update({ entrepreneur_image_url: publicUrl })
        .eq('id', companyData.id);
      
      if (updateError) throw updateError;
      
      setEntrepreneurImageUrl(publicUrl);
      alert('Imagen del emprendedor subida con éxito');
    } catch (error) {
      console.error('Error al subir imagen del emprendedor:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingEntrepreneurImage(false);
    }
  };

  const saveEntrepreneurData = async () => {
    if (!companyData) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({ 
          entrepreneur_name: entrepreneurName,
          entrepreneur_image_url: entrepreneurImageUrl 
        })
        .eq('id', companyData.id);
      
      if (error) throw error;
      
      alert('Datos del emprendedor guardados con éxito');
    } catch (error) {
      console.error('Error al guardar datos del emprendedor:', error);
      alert('Error al guardar los datos');
    }
  };

  const handleEntrepreneurImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadEntrepreneurImage(file);
    }
  };

  // Funciones para YouTube Video
  const extractYouTubeId = (url: string): string | null => {
    // Soporta múltiples formatos de URLs de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const validateYouTubeUrl = (url: string): boolean => {
    if (!url) return true; // Permitir vacío
    return extractYouTubeId(url) !== null;
  };

  const saveYouTubeVideo = async () => {
    if (!companyData) return;

    setYoutubeError(null);

    // Validar URL si no está vacía
    if (youtubeUrl && !validateYouTubeUrl(youtubeUrl)) {
      setYoutubeError('URL de YouTube inválida. Por favor ingresa una URL válida.');
      return;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .update({ youtube_video_url: youtubeUrl || null })
        .eq('id', companyData.id);
      
      if (error) throw error;
      
      alert('Video guardado con éxito');
    } catch (error) {
      console.error('Error al guardar video:', error);
      alert('Error al guardar el video');
    }
  };

  const renderLinksSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Administra tus enlaces y contenido</p>
        </div>
        <button 
          onClick={addNewLink}
          className="flex items-center justify-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-4 md:px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Agregar
        </button>
      </div>

      {/* Add Collection */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[hsl(111,29%,23%)]/5 to-transparent rounded-lg border border-[hsl(111,29%,23%)]/20 hover:border-[hsl(111,29%,23%)]/40 transition-colors cursor-pointer group">
        <input type="checkbox" className="rounded border-[hsl(111,29%,23%)] text-[hsl(111,29%,23%)] focus:ring-[hsl(111,29%,23%)] focus:ring-offset-0 w-5 h-5 flex-shrink-0" />
        <span className="text-sm md:text-base font-medium text-gray-700 group-hover:text-gray-900">Agregar colección</span>
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
            className={`bg-white border-2 rounded-xl p-4 md:p-5 transition-all ${
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
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900 text-sm md:text-base"
                    placeholder="Título del enlace"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="text"
                    value={editForm.url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900 text-sm md:text-base"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={cancelEditing}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm md:text-base"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => saveEdit(link.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-colors text-sm md:text-base"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              // MODO VISTA
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Drag Handle & Link Info */}
                <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="cursor-move text-gray-400 hover:text-[hsl(111,29%,23%)] transition-colors flex-shrink-0 mt-1">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{link.title}</h3>
                      <a 
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[hsl(111,29%,23%)] transition-colors flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-[hsl(111,29%,23%)]" />
                      </a>
                    </div>
                    <a 
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm text-gray-600 hover:text-[hsl(111,29%,23%)] truncate block transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 ml-8 md:ml-4">
                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
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
                      className="p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors touch-manipulation"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => copyLink(link)}
                      className="p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors touch-manipulation"
                      title="Copiar"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteLink(link.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tienda</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Administra tus productos y ventas</p>
        </div>
        <button 
          onClick={() => openProductModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-4 md:px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium touch-manipulation"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* WhatsApp Configuration */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-300 rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-green-500 rounded-xl flex-shrink-0">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1 w-full">
            <h3 className="font-bold text-green-900 mb-2 text-base md:text-lg">Configuración de WhatsApp para Ventas</h3>
            <p className="text-xs md:text-sm text-green-800 mb-4">
              Los clientes serán redirigidos a este número cuando hagan clic en "Comprar"
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={companyData?.whatsapp || ''}
                onChange={(e) => {
                  if (companyData) {
                    setCompanyData({ ...companyData, whatsapp: e.target.value });
                  }
                }}
                placeholder="Ej: 573001234567 (sin +)"
                className="flex-1 px-3 md:px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 text-sm md:text-base"
              />
              <button
                onClick={async () => {
                  if (!companyData) return;
                  try {
                    const { error } = await supabase
                      .from('companies')
                      .update({ whatsapp: companyData.whatsapp })
                      .eq('id', companyData.id);
                    
                    if (error) throw error;
                    alert('WhatsApp actualizado con éxito');
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Error al actualizar WhatsApp');
                  }
                }}
                className="w-full sm:w-auto px-4 md:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
            <p className="text-xs text-green-700 mt-2">
              💡 Ingresa el número con código de país sin el símbolo +. Ejemplo: 573001234567
            </p>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{products.map((product) => (
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
            <div className="p-4 md:p-5">
              <div className="mb-3">
                <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-[hsl(111,29%,23%)]">
                    ${product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {product.stock_quantity}</p>
                </div>
                {product.category && (
                  <span className="px-2 md:px-3 py-1 bg-[hsl(111,29%,23%)]/10 text-[hsl(111,29%,23%)] rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Estadísticas */}
              <div className="flex items-center gap-3 md:gap-4 mb-4 text-xs text-gray-600">
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
                  <span className="hidden xs:inline">{product.sales_count} ventas</span>
                  <span className="xs:hidden">{product.sales_count}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => openProductModal(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[hsl(111,29%,23%)]/10 hover:bg-[hsl(111,29%,23%)]/20 text-[hsl(111,29%,23%)] rounded-lg transition-colors touch-manipulation text-sm md:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-3 md:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors touch-manipulation"
                  title="Eliminar"
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

              {/* Imagen del producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del producto
                </label>
                
                {/* Preview de imagen actual */}
                {productForm.image_url && (
                  <div className="mb-4 relative">
                    <img 
                      src={productForm.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Botón para subir imagen */}
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  uploadingProductImage 
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                    : 'border-[hsl(111,29%,23%)] bg-[hsl(111,29%,23%)]/5 hover:bg-[hsl(111,29%,23%)]/10'
                }`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProductImageSelect}
                    disabled={uploadingProductImage}
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingProductImage ? (
                      <>
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-[hsl(111,29%,23%)] rounded-full animate-spin mb-2"></div>
                        <p className="text-sm text-gray-600">Subiendo imagen...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-[hsl(111,29%,23%)] mb-2" />
                        <p className="text-sm text-gray-700 font-medium">Haz clic para subir una imagen</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG o WebP (máx. 5MB)</p>
                      </>
                    )}
                  </div>
                </label>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Imágenes</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Gestiona el logo, portada y galería de tu ficha pública</p>
        </div>
      </div>

      {/* Información general */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-base">Recomendaciones de imágenes</h4>
            <ul className="space-y-1 text-xs md:text-sm text-blue-800">
              <li>• <strong>Peso máximo:</strong> 800 KB por imagen</li>
              <li>• <strong>Formatos:</strong> JPG, PNG, WebP</li>
              <li>• Imágenes de alta calidad para mejor visualización</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg flex-shrink-0">
            <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Logo</h3>
            <p className="text-xs md:text-sm text-gray-600">
              <strong>Tamaño sugerido:</strong> 400x400px (cuadrado) • 
              <strong className="ml-1">Máximo:</strong> 800 KB
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Preview */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
              {imageUrls.logo ? (
                <img src={imageUrls.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
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
              className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium touch-manipulation text-sm md:text-base ${
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
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg flex-shrink-0">
            <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-[hsl(111,29%,23%)]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Imagen de Portada</h3>
            <p className="text-xs md:text-sm text-gray-600">
              <strong>Tamaño sugerido:</strong> 1920x480px (panorámico) • 
              <strong className="ml-1">Máximo:</strong> 800 KB
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <div className="w-full h-32 md:h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageUrls.cover ? (
              <img src={imageUrls.cover} alt="Portada" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
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
              className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium touch-manipulation text-sm md:text-base ${
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
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium touch-manipulation text-sm md:text-base"
              >
                <Trash className="w-5 h-5" />
                Eliminar Portada
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Section - DESHABILITADA TEMPORALMENTE */}
      {false && (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(111,29%,23%)]/10 rounded-lg">
              <ImageIcon className="w-6 h-6 text-[hsl(111,29%,23%)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Galería de Imágenes</h3>
              <p className="text-sm text-gray-600">
                <strong>Tamaño sugerido:</strong> 1200x800px • 
                <strong className="ml-1">Máximo:</strong> 800 KB c/u • 
                <span className="text-gray-700">({imageUrls.gallery.length}/3 imágenes)</span>
              </p>
            </div>
          </div>
          <input
            type="file"
            id="gallery-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'gallery')}
            disabled={uploadingImage === 'gallery' || imageUrls.gallery.length >= 3}
          />
          <label
            htmlFor="gallery-upload"
            className={`flex items-center gap-2 px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium ${
              uploadingImage === 'gallery' || imageUrls.gallery.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadingImage === 'gallery' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Subiendo...
              </>
            ) : imageUrls.gallery.length >= 3 ? (
              <>
                <Check className="w-5 h-5" />
                Límite alcanzado (3/3)
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Agregar Imagen
              </>
            )}
          </label>
        </div>

        {imageUrls.gallery.length >= 3 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Límite alcanzado:</strong> Has subido el máximo de 3 imágenes. Elimina una para agregar otra.
            </p>
          </div>
        )}

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
      )}

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

  const renderEntrepreneurSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Emprendedor</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Información del fundador o emprendedor</p>
        </div>
      </div>

      {/* Panel informativo */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
        <div className="flex gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-base">Información del emprendedor</h4>
            <ul className="space-y-1 text-xs md:text-sm text-blue-800">
              <li>• Agrega una foto del fundador o emprendedor</li>
              <li>• La imagen debe ser cuadrada (recomendado 400x400px)</li>
              <li>• Tamaño máximo: 800KB</li>
              <li>• Se mostrará en la ficha pública con el nombre y el rol "Empresario"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
        <div className="space-y-6">
          {/* Imagen del emprendedor */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Foto del Emprendedor
            </label>
            
            {entrepreneurImageUrl ? (
              <div className="relative inline-block">
                <img 
                  src={entrepreneurImageUrl} 
                  alt="Emprendedor"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar la foto del emprendedor?')) {
                      setEntrepreneurImageUrl('');
                      saveEntrepreneurData();
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors touch-manipulation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="entrepreneur-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEntrepreneurImageSelect}
                  disabled={uploadingEntrepreneurImage}
                />
                <label
                  htmlFor="entrepreneur-image"
                  className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg cursor-pointer transition-all font-medium touch-manipulation text-sm md:text-base ${
                    uploadingEntrepreneurImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingEntrepreneurImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Subir Foto
                    </>
                  )}
                </label>
                <p className="text-xs md:text-sm text-gray-500">Máximo 800KB • Formato cuadrado recomendado</p>
              </div>
            )}
          </div>

          {/* Nombre del emprendedor */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Nombre del Emprendedor
            </label>
            <input
              type="text"
              value={entrepreneurName}
              onChange={(e) => setEntrepreneurName(e.target.value)}
              placeholder="Ej: Juan Pérez González"
              className="w-full px-3 md:px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(111,29%,23%)] focus:ring-2 focus:ring-[hsl(111,29%,23%)]/20 transition-all text-gray-900 text-sm md:text-base"
            />
            <p className="text-xs md:text-sm text-gray-500 mt-2">Este nombre se mostrará junto a la foto en la ficha pública</p>
          </div>

          {/* Botón guardar */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={saveEntrepreneurData}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg touch-manipulation text-sm md:text-base"
            >
              <Check className="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa */}
      {(entrepreneurImageUrl || entrepreneurName) && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Vista Previa</h3>
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              {entrepreneurImageUrl ? (
                <img 
                  src={entrepreneurImageUrl} 
                  alt={entrepreneurName || 'Emprendedor'}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  {entrepreneurName || 'Nombre del Emprendedor'}
                </h4>
                <p className="text-gray-600">Empresario</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideoSection = () => {
    const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Video de YouTube</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Agrega un video de YouTube a tu ficha pública</p>
          </div>
        </div>

        {/* Panel informativo */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
          <div className="flex gap-2 md:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-base">Cómo agregar un video</h4>
              <ul className="space-y-1 text-xs md:text-sm text-blue-800">
                <li>• Copia la URL completa del video de YouTube</li>
                <li>• Soporta URLs de: youtube.com/watch, youtu.be, youtube.com/shorts</li>
                <li>• El video se mostrará en tu ficha pública</li>
                <li>• Puedes cambiar o eliminar el video en cualquier momento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
          <div className="space-y-6">
            {/* Input URL */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                URL del Video de YouTube
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setYoutubeError(null);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 md:px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(111,29%,23%)] focus:ring-2 focus:ring-[hsl(111,29%,23%)]/20 transition-all text-gray-900 text-sm md:text-base"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                Ejemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
              {youtubeError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {youtubeError}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              {youtubeUrl && (
                <button
                  onClick={() => {
                    setYoutubeUrl('');
                    setYoutubeError(null);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm md:text-base"
                >
                  <Trash className="w-4 h-4" />
                  Limpiar
                </button>
              )}
              <button
                onClick={saveYouTubeVideo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg touch-manipulation text-sm md:text-base"
              >
                <Save className="w-5 h-5" />
                Guardar Video
              </button>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        {videoId && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Vista Previa</h3>
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Video className="w-4 h-4" />
                <span>Este video se mostrará en tu ficha pública</span>
              </div>
            </div>
          </div>
        )}

        {/* Ejemplos de URLs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">Ejemplos de URLs válidas</h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-mono">✓</span>
              <code className="text-gray-700">https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-mono">✓</span>
              <code className="text-gray-700">https://youtu.be/dQw4w9WgXcQ</code>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-mono">✓</span>
              <code className="text-gray-700">https://www.youtube.com/shorts/dQw4w9WgXcQ</code>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-mono">✓</span>
              <code className="text-gray-700">https://www.youtube.com/embed/dQw4w9WgXcQ</code>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewsSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Opiniones</h2>
          <p className="text-gray-600">Aprueba, rechaza o elimina las opiniones de tus clientes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-4 py-2">
            <p className="text-sm text-yellow-800 font-medium">
              <span className="font-bold text-xl">{pendingReviewsCount}</span> pendientes
            </p>
          </div>
          <div className="bg-green-100 border-2 border-green-300 rounded-xl px-4 py-2">
            <p className="text-sm text-green-800 font-medium">
              <span className="font-bold text-xl">{reviews.filter(r => r.is_approved).length}</span> aprobadas
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Opiniones</p>
              <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Calificación Promedio</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingReviewsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.is_approved).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoadingReviews ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[hsl(111,29%,23%)]"></div>
          <p className="mt-4 text-gray-600">Cargando opiniones...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">No hay opiniones aún</p>
          <p className="text-sm text-gray-500">Las opiniones de tus clientes aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className={`bg-white border-2 rounded-xl p-6 transition-all ${
                review.is_approved 
                  ? 'border-green-200 bg-green-50/30' 
                  : 'border-yellow-200 bg-yellow-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg text-gray-800">{review.title}</h4>
                        {review.is_approved ? (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            APROBADA
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                            PENDIENTE
                          </span>
                        )}
                      </div>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-bold text-gray-700 ml-1">
                          {review.rating} de 5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                  {/* Author & Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{review.author_name}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString('es-CO', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {!review.is_approved && (
                    <button
                      onClick={() => approveReview(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-2">Sobre la gestión de opiniones</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Las opiniones nuevas aparecen como <strong>PENDIENTE</strong> hasta que las apruebes</li>
              <li>• Solo las opiniones aprobadas se muestran en tu perfil público</li>
              <li>• Puedes eliminar opiniones inapropiadas o spam en cualquier momento</li>
              <li>• La calificación promedio se calcula solo con opiniones aprobadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoursSection = () => {
    const daysOfWeek = [
      { id: 1, label: 'LUNES' },
      { id: 2, label: 'MARTES' },
      { id: 3, label: 'MIÉRCOLES' },
      { id: 4, label: 'JUEVES' },
      { id: 5, label: 'VIERNES' },
      { id: 6, label: 'SÁBADOS' },
      { id: 0, label: 'DOMINGOS' }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Horarios de Atención</h2>
            <p className="text-gray-600 text-sm md:text-base">Configura los días y horarios en que atiendes a tus clientes</p>
          </div>
          <button
            onClick={saveBusinessHours}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white px-4 md:px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium touch-manipulation text-sm md:text-base"
          >
            <Save className="w-5 h-5" />
            Guardar Horarios
          </button>
        </div>

        {/* Horarios List */}
        {isLoadingHours ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[hsl(111,29%,23%)]"></div>
            <p className="mt-4 text-gray-600">Cargando horarios...</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="space-y-3 md:space-y-4">
              {daysOfWeek.map((day) => {
                const hourData = (businessHours || []).find(h => h?.day_of_week === day.id) || {
                  day_of_week: day.id,
                  opens_at: '07:00',
                  closes_at: '18:00',
                  is_closed: false,
                  is_24_hours: false
                };

                return (
                  <div 
                    key={day.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Día de la semana */}
                    <div className="sm:w-32">
                      <p className="font-bold text-gray-800 text-sm md:text-base">{day.label}</p>
                    </div>

                    {/* Switches de estado */}
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={hourData.is_closed || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setBusinessHours(prevHours => {
                              const currentHours = prevHours || [];
                              const existingIndex = currentHours.findIndex(h => h?.day_of_week === day.id);
                              
                              if (existingIndex >= 0) {
                                const newHours = [...currentHours];
                                newHours[existingIndex] = { 
                                  ...newHours[existingIndex],
                                  day_of_week: day.id,
                                  is_closed: checked,
                                  is_24_hours: checked ? false : newHours[existingIndex].is_24_hours
                                };
                                return newHours;
                              } else {
                                return [...currentHours, {
                                  day_of_week: day.id,
                                  opens_at: '07:00',
                                  closes_at: '18:00',
                                  is_closed: checked,
                                  is_24_hours: false
                                }];
                              }
                            });
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs md:text-sm text-gray-700">Cerrado</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={hourData.is_24_hours || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setBusinessHours(prevHours => {
                              const currentHours = prevHours || [];
                              const existingIndex = currentHours.findIndex(h => h?.day_of_week === day.id);
                              
                              if (existingIndex >= 0) {
                                const newHours = [...currentHours];
                                newHours[existingIndex] = { 
                                  ...newHours[existingIndex],
                                  day_of_week: day.id,
                                  is_24_hours: checked,
                                  is_closed: checked ? false : newHours[existingIndex].is_closed
                                };
                                return newHours;
                              } else {
                                return [...currentHours, {
                                  day_of_week: day.id,
                                  opens_at: '07:00',
                                  closes_at: '18:00',
                                  is_closed: false,
                                  is_24_hours: checked
                                }];
                              }
                            });
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-xs md:text-sm text-gray-700">24 horas</span>
                      </label>
                    </div>

                    {/* Horarios */}
                    {!hourData.is_closed && !hourData.is_24_hours && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-xs md:text-sm text-gray-600 flex-shrink-0">Abre:</label>
                          <input
                            type="time"
                            value={hourData.opens_at || '07:00'}
                            onChange={(e) => updateHour(day.id, 'opens_at', e.target.value)}
                            className="px-2 md:px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900 text-sm md:text-base flex-1 sm:flex-none"
                          />
                        </div>
                        <span className="text-gray-400 hidden sm:inline">—</span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-xs md:text-sm text-gray-600 flex-shrink-0">Cierra:</label>
                          <input
                            type="time"
                            value={hourData.closes_at || '18:00'}
                            onChange={(e) => updateHour(day.id, 'closes_at', e.target.value)}
                            className="px-2 md:px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[hsl(111,29%,23%)] focus:outline-none text-gray-900 text-sm md:text-base flex-1 sm:flex-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Estado visual */}
                    {hourData.is_closed && (
                      <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                        <span className="inline-block px-3 md:px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium text-xs md:text-sm">
                          Cerrado
                        </span>
                      </div>
                    )}
                    {hourData.is_24_hours && (
                      <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                        <span className="inline-block px-3 md:px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-xs md:text-sm">
                          Abierto 24 horas
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-4 md:p-6">
          <div className="flex gap-2 md:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2 text-sm md:text-base">Sobre los horarios de atención</h4>
              <ul className="space-y-1 text-xs md:text-sm text-blue-800">
                <li>• Los horarios se muestran en tu perfil público para que tus clientes sepan cuándo estás disponible</li>
                <li>• Marca "Cerrado" para días que no atiendes</li>
                <li>• Marca "24 horas" si tu negocio está disponible todo el día</li>
                <li>• Los horarios se muestran en formato de 12 horas para los visitantes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlogsSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600 mt-2 text-base">Comparte historias e inspiración con tu audiencia</p>
        </div>
        <button
          onClick={() => openBlogModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nuevo Blog
        </button>
      </div>

      {/* Lista de Blogs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {isLoadingBlogs ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">No tienes blogs aún</p>
            <p className="text-gray-400 mb-6">Empieza a compartir tu historia con tu audiencia</p>
            <button
              onClick={() => openBlogModal()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Crear mi primer blog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blog.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {blog.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{blog.excerpt || 'Sin extracto'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Por {blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{blog.views} vistas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver blog"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openBlogModal(blog)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id, blog.content_path)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-2">Consejos para tu blog</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Usa títulos atractivos que capturen la atención</li>
              <li>• Escribe contenido auténtico que refleje tu experiencia</li>
              <li>• Agrega imágenes de portada llamativas</li>
              <li>• Publica regularmente para mantener el interés</li>
              <li>• Los blogs publicados aparecen en tu perfil público</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Blog */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBlog ? 'Editar Blog' : 'Nuevo Blog'}
              </h3>
              <button
                onClick={() => setShowBlogModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => {
                    setBlogForm({ ...blogForm, title: e.target.value });
                    if (!editingBlog) {
                      setBlogForm({ ...blogForm, title: e.target.value, slug: generateSlug(e.target.value) });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="Título de tu blog"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (slug)
                </label>
                <input
                  type="text"
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="url-del-blog"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tu blog estará en: {window.location.origin}/blog/{blogForm.slug || 'tu-slug'}
                </p>
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="Nombre del autor"
                />
              </div>

              {/* Extracto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extracto
                </label>
                <textarea
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Breve descripción del blog (aparece en las vistas previas)"
                />
              </div>

              {/* Imagen de portada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de portada
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={blogForm.cover_image}
                    onChange={(e) => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="URL de la imagen"
                  />
                  <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-2 text-gray-700">
                    <Upload className="w-4 h-4" />
                    {uploadingBlogImage ? 'Subiendo...' : 'Subir'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingBlogImage}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadBlogImage(file);
                          if (url) setBlogForm({ ...blogForm, cover_image: url });
                        }
                      }}
                    />
                  </label>
                </div>
                {blogForm.cover_image && (
                  <img
                    src={blogForm.cover_image}
                    alt="Preview"
                    className="mt-3 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Contenido en Markdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido (Markdown) *
                </label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm text-gray-900 placeholder:text-gray-400"
                  placeholder="Escribe tu contenido en formato Markdown..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Puedes usar Markdown: **negrita**, *cursiva*, # títulos, - listas, etc.
                </p>
              </div>

              {/* Publicar */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={blogForm.is_published}
                  onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publicar inmediatamente
                </label>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBlogModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveBlog}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
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
      case "video":
        return renderVideoSection();
      case "entrepreneur":
        return renderEntrepreneurSection();
      case "hours":
        return renderHoursSection();
      case "blogs":
        return renderBlogsSection();
      case "reviews":
        return renderReviewsSection();
      case "design":
        return renderDesignSection();
      default:
        return renderDefaultSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[hsl(111,2%,23%)]/5 flex">
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
              onClick={() => companyData && window.open(`/${companyData.slug}`, '_blank')}
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

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-gray-200 mt-auto absolute bottom-0 left-0 right-0 bg-white">
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (!error) {
                router.push('/auth');
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 w-full">
        {/* Top Bar */}
        <div className="bg-white border-b-2 border-gray-200 px-4 md:px-6 py-4 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[hsl(111,29%,23%)]/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-[hsl(111,29%,23%)]" />
              </button>
              
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">
                  {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
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