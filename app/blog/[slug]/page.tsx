"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LpNavbar1 } from '@/components/lp-navbar-1';
import { Footer2 } from '@/components/footer-2';
import Link from 'next/link';
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useParams } from 'next/navigation';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  cover_image: string | null;
  published_at: string;
  views: number;
  content_path: string;
  company: {
    company_name: string;
    slug: string;
  };
}

export default function BlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos del blog
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select(`
          *,
          company:companies(company_name, slug)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (blogError || !blogData) {
        console.error('Error al cargar blog:', blogError);
        return;
      }

      setBlog(blogData);

      // Incrementar vistas
      await supabase
        .from('blogs')
        .update({ views: (blogData.views || 0) + 1 })
        .eq('id', blogData.id);

      // Cargar contenido del archivo markdown
      const { data: fileData, error: fileError } = await supabase.storage
        .from('blog-content')
        .download(blogData.content_path);

      if (fileError) {
        console.error('Error al cargar contenido:', fileError);
        return;
      }

      const text = await fileData.text();
      setContent(text);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <LpNavbar1 />
        <div className="container mx-auto px-6 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer2 />
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <LpNavbar1 />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog no encontrado</h1>
          <p className="text-gray-600 mb-8">El blog que buscas no existe o fue eliminado.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a blogs
          </Link>
        </div>
        <Footer2 />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <LpNavbar1 />
      
      <div className="container mx-auto px-6 py-16">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a blogs
        </Link>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {blog.cover_image && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(blog.published_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{blog.views} vistas</span>
              </div>
            </div>

            {/* Company and Share */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
              {blog.company && (
                <Link
                  href={`/${blog.company.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Por {blog.company.company_name}
                </Link>
              )}
              <button
                onClick={shareArticle}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-green max-w-none mb-12">
            <style jsx global>{`
              .prose {
                color: #374151;
              }
              .prose h1 {
                color: #111827;
                font-weight: 700;
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .prose h2 {
                color: #111827;
                font-weight: 700;
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .prose h3 {
                color: #1f2937;
                font-weight: 600;
                margin-top: 1.6em;
                margin-bottom: 0.8em;
              }
              .prose p {
                margin-bottom: 1.5em;
                line-height: 1.8;
              }
              .prose strong {
                color: #111827;
                font-weight: 600;
              }
              .prose ul, .prose ol {
                margin-top: 1.5em;
                margin-bottom: 1.5em;
                padding-left: 1.5em;
              }
              .prose li {
                margin-bottom: 0.5em;
              }
              .prose a {
                color: #059669;
                text-decoration: underline;
              }
              .prose a:hover {
                color: #047857;
              }
              .prose blockquote {
                border-left: 4px solid #059669;
                padding-left: 1em;
                font-style: italic;
                color: #4b5563;
                margin: 1.5em 0;
              }
              .prose code {
                background: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 0.25em;
                font-size: 0.9em;
              }
              .prose pre {
                background: #1f2937;
                color: #f3f4f6;
                padding: 1em;
                border-radius: 0.5em;
                overflow-x: auto;
              }
              .prose pre code {
                background: transparent;
                padding: 0;
              }
              .prose img {
                border-radius: 0.5em;
                margin: 2em 0;
              }
            `}</style>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Te gustó esta historia?
              </h3>
              <p className="text-gray-700 mb-6">
                Visita el perfil de {blog.company?.company_name} y descubre más sobre su emprendimiento.
              </p>
              <Link
                href={`/${blog.company?.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Visitar perfil
              </Link>
            </div>
          </div>
        </article>
      </div>

      <Footer2 />
    </main>
  );
}
