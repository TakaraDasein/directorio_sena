"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  X
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

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  template: string;
}

const sidebarItems = [
  { id: "links", label: "Links", icon: Link, active: true },
  { id: "shop", label: "Shop", icon: Store },
  { id: "design", label: "Design", icon: Palette },
  { id: "earn", label: "Earn", icon: DollarSign, badge: "NEW" },
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "audience", label: "Audience", icon: Users },
  { id: "insights", label: "Insights", icon: TrendingUp }
];

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("links");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [setupProgress, setSetupProgress] = useState(67);
  const router = useRouter();

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userData = localStorage.getItem("userData");
    const linkData = localStorage.getItem("linkData");
    const additionalLinks = localStorage.getItem("additionalLinks");
    const selectedTemplate = localStorage.getItem("selectedTemplate");

    if (userData) {
      const user = JSON.parse(userData);
      setUserProfile({
        name: user.name,
        username: user.name?.toLowerCase().replace(/\s+/g, '') || 'usuario',
        bio: user.bio,
        template: selectedTemplate || 'default'
      });
    }

    // Convertir datos de links al formato del dashboard
    const allLinks: LinkItem[] = [];
    
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
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const renderLinksSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 mt-1">Manage your links and content</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Add Collection */}
      <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer">
        <input type="checkbox" className="rounded" />
        <span className="text-sm">Add collection</span>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              {/* Drag Handle */}
              <div className="flex items-center gap-4">
                <div className="cursor-move text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                  </svg>
                </div>

                {/* Link Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{link.title}</h3>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 truncate max-w-md">{link.url}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {link.clicks} clicks
                  </span>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={() => toggleLinkStatus(link.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>

                {/* Menu */}
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button 
                    onClick={() => deleteLink(link.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Link className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-500 mb-4">Add your first link to get started</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
              Add Link
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
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-600 mt-1">Manage your products and sales</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="text-center py-12 text-gray-500">
        <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
          Add Product
        </button>
      </div>
    </div>
  );

  const renderDesignSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Design</h1>
          <p className="text-gray-600 mt-1">Customize your page appearance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <span>Current Template: {userProfile?.template || 'Default'}</span>
              <button className="text-purple-600 hover:text-purple-700">Change</button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Colors</h3>
          <div className="grid grid-cols-4 gap-3">
            {['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-gray-800'].map((color, index) => (
              <div key={index} className={`w-12 h-12 rounded-lg cursor-pointer ${color}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultSection = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h1>
        <p className="text-gray-600 mt-1">This section is coming soon</p>
      </div>
      
      <div className="text-center py-12 text-gray-500">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
          {sidebarItems.find(item => item.id === activeSection)?.icon && 
            React.createElement(sidebarItems.find(item => item.id === activeSection)!.icon, { className: "w-12 h-12" })
          }
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500">This feature will be available soon</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "links":
        return renderLinksSection();
      case "shop":
        return renderShopSection();
      case "design":
        return renderDesignSection();
      default:
        return renderDefaultSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {userProfile?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">@{userProfile?.username || 'usuario'}</p>
              <p className="text-xs text-gray-500">linktree.com/{userProfile?.username || 'usuario'}</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Setup Progress */}
        <div className="p-4 border-t mt-auto">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900">Your setup checklist</span>
              <span className="text-sm text-purple-700">{setupProgress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${setupProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-purple-700 mt-2">4 of 6 complete</p>
            <button className="w-full mt-3 bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Finish setup
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}