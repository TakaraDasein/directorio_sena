"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code2,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}

const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "h-9 w-9 p-0 transition-all duration-300 hover:scale-105",
      "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl",
      "hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-purple-500/20",
      "group relative overflow-hidden",
      isActive && "bg-purple-500/30 text-white border-purple-400/50 shadow-lg shadow-purple-500/30",
    )}
    title={title}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    <div className="relative z-10 text-white/90 group-hover:text-white">{children}</div>
  </Button>
)

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />

    {/* Floating orbs with glassmorphism */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse delay-2000" />

    {/* Static gradient mesh */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-600/20 via-transparent to-cyan-600/20" />
    </div>

    {/* Subtle noise texture */}
    <div className="absolute inset-0 opacity-[0.02] bg-noise" />
  </div>
)

export default function RichTextEditor() {
  const [content, setContent] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateActiveFormats()
  }, [])

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()

    if (document.queryCommandState("bold")) formats.add("bold")
    if (document.queryCommandState("italic")) formats.add("italic")
    if (document.queryCommandState("underline")) formats.add("underline")
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul")
    if (document.queryCommandState("insertOrderedList")) formats.add("ol")

    setActiveFormats(formats)
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
      updateActiveFormats()
    }
  }, [updateActiveFormats])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            execCommand("bold")
            break
          case "i":
            e.preventDefault()
            execCommand("italic")
            break
          case "u":
            e.preventDefault()
            execCommand("underline")
            break
        }
      }
    },
    [execCommand],
  )

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }, [execCommand])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] relative">
      <AnimatedBackground />

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden relative z-10">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-3xl" />

        <div className="flex items-center gap-2 p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 relative">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 mr-4">
              <div className="p-2 bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
                <Sparkles className="h-4 w-4 text-purple-300" />
              </div>
              <span className="text-sm font-semibold text-white/90 font-sans">Rich Editor</span>
            </div>

            <ToolbarButton
              onClick={() => execCommand("formatBlock", "<h1>")}
              isActive={activeFormats.has("h1")}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("formatBlock", "<h2>")}
              isActive={activeFormats.has("h2")}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("formatBlock", "<h3>")}
              isActive={activeFormats.has("h3")}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => execCommand("bold")}
              isActive={activeFormats.has("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("italic")}
              isActive={activeFormats.has("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("underline")}
              isActive={activeFormats.has("underline")}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => execCommand("insertUnorderedList")}
              isActive={activeFormats.has("ul")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("insertOrderedList")}
              isActive={activeFormats.has("ol")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("formatBlock", "<blockquote>")} title="Quote">
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left">
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center">
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right">
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={insertLink} title="Insert Link">
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("formatBlock", "<pre>")} title="Code Block">
              <Code2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            className={cn(
              "min-h-[500px] p-8 focus:outline-none relative z-10",
              "prose prose-lg max-w-none font-sans",
              "transition-all duration-300",
              "text-white/95 leading-relaxed",
              "selection:bg-purple-500/30 selection:text-white",
              "[&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h1]:mt-8",
              "[&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:text-white/95 [&>h2]:mb-4 [&>h2]:mt-6",
              "[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:text-white/90 [&>h3]:mb-3 [&>h3]:mt-5",
              "[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-white/90",
              "[&>ul]:mb-6 [&>ul]:pl-6 [&>ul]:text-white/90",
              "[&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:text-white/90",
              "[&>li]:mb-2 [&>li]:text-white/90",
              "[&>blockquote]:border-l-4 [&>blockquote]:border-purple-400 [&>blockquote]:pl-6 [&>blockquote]:py-3 [&>blockquote]:italic [&>blockquote]:text-white/80 [&>blockquote]:bg-purple-500/10 [&>blockquote]:backdrop-blur-sm [&>blockquote]:rounded-r-xl [&>blockquote]:my-6",
              "[&>pre]:bg-black/30 [&>pre]:backdrop-blur-sm [&>pre]:p-6 [&>pre]:rounded-xl [&>pre]:font-mono [&>pre]:text-sm [&>pre]:text-green-300 [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/10",
              "[&>code]:bg-purple-500/20 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-purple-200",
              "[&_a]:text-purple-300 [&_a]:underline [&_a]:decoration-purple-300/50 [&_a]:underline-offset-2",
              "hover:[&_a]:decoration-purple-300 [&_a]:transition-colors",
              "empty:before:content-[attr(data-placeholder)] empty:before:text-white/40 empty:before:pointer-events-none",
            )}
            data-placeholder="Start writing something amazing..."
            suppressContentEditableWarning={true}
          />
        </div>

        <div className="flex items-center justify-between px-8 py-6 bg-white/5 backdrop-blur-xl border-t border-white/10 text-sm text-white/60 relative">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Type className="h-4 w-4 text-purple-300" />
              Words:{" "}
              <span className="text-white/90 font-medium">
                {
                  content
                    .replace(/<[^>]*>/g, "")
                    .split(/\s+/)
                    .filter(Boolean).length
                }
              </span>
            </span>
            <span className="flex items-center gap-2">
              Characters: <span className="text-white/90 font-medium">{content.replace(/<[^>]*>/g, "").length}</span>
            </span>
          </div>
          <div className="text-xs text-white/50 flex items-center gap-3">
            <kbd className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs border border-white/20">⌘B</kbd>
            <span>Bold</span>
            <kbd className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs border border-white/20">⌘I</kbd>
            <span>Italic</span>
            <kbd className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs border border-white/20">⌘U</kbd>
            <span>Underline</span>
          </div>
        </div>
      </div>
    </div>
  )
}



@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.7 0.2 270);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
  --font-poppins: "Poppins", sans-serif;
  --font-geist-mono: "Geist Mono", monospace;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.7 0.2 270);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --font-sans: var(--font-poppins);
  --font-mono: var(--font-geist-mono);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }

  .prose {
    @apply text-foreground;
  }

  .prose h1 {
    @apply text-3xl font-bold text-white mb-4 mt-6;
  }

  .prose h2 {
    @apply text-2xl font-semibold text-white mb-3 mt-5;
  }

  .prose h3 {
    @apply text-xl font-medium text-white mb-2 mt-4;
  }

  .prose p {
    @apply text-gray-200 mb-3 leading-relaxed;
  }

  .prose ul,
  .prose ol {
    @apply text-gray-200 mb-4 pl-6;
  }

  .prose li {
    @apply mb-1;
  }

  .prose blockquote {
    @apply border-l-4 border-accent pl-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r;
  }

  .prose pre {
    @apply bg-muted p-4 rounded font-mono text-sm text-gray-200 overflow-x-auto;
  }

  .prose code {
    @apply bg-muted px-2 py-1 rounded text-sm font-mono text-accent;
  }

  .prose a {
    @apply text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent transition-colors;
  }
}

@layer utilities {
  /* Gradient animations for background */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) scale(1);
    }
    50% {
      transform: translateY(-20px) scale(1.05);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 4s ease-in-out infinite;
  }

  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  /* Noise texture for subtle background effect */
  .bg-noise {
    background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
    background-size: 20px 20px;
  }

  /* Glass morphism utilities */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Custom scrollbar for editor */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(147, 51, 234, 0.5);
    border-radius: 4px;
    backdrop-filter: blur(10px);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 51, 234, 0.7);
  }

  /* Enhanced focus states */
  .focus-glow:focus {
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3), 0 0 20px rgba(147, 51, 234, 0.2), inset 0 1px 0
      rgba(255, 255, 255, 0.1);
  }

  /* Subtle text glow for better readability */
  .text-glow {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  /* Animated border gradient */
  .border-gradient {
    position: relative;
    background: linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.3), transparent);
    background-size: 100% 100%;
  }

  .border-gradient::before {
    content: "";
    position: absolute;
    inset: 1px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: inherit;
    backdrop-filter: blur(20px);
  }
}






import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Minimalist Rich Text Editor",
  description: "A beautiful, minimalist rich text editor",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} bg-[#0A0A0A] text-white min-h-screen`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}





import RichTextEditor from "@/components/rich-text-editor"

export default function Home() {
  return (
    <main className="min-h-screen">
      <RichTextEditor />
    </main>
  )
}
