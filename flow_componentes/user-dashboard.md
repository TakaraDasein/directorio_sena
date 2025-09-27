# UserDashboard Component

## Descripción
Componente de dashboard completo para usuarios del directorio SENA. Proporciona una interfaz unificada para gestionar perfil, enlaces, analíticas y configuración.

## Ubicación
`/components/admin/user-dashboard.tsx`

## Ruta de acceso
`/admin-user`

## Características

- **Navegación lateral responsive**: Sidebar con navegación principal y adaptable a dispositivos móviles
- **4 secciones principales**:
  - Mi Perfil: Gestión de información personal
  - Mis Links: Administración de enlaces sociales
  - Analíticas: Métricas y estadísticas (placeholder)
  - Configuración: Ajustes de cuenta
- **Persistencia de datos**: Integración con localStorage
- **Diseño responsive**: Optimizado para desktop y móvil
- **Iconografía**: Lucide React icons

## Código del Componente

```tsx
"use client"

import { useState, useEffect } from 'react'
import { User, Link, BarChart3, Settings, Menu, X, Upload, Instagram, MessageCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  name: string
  description: string
  profileImage: string | null
  instagram: string
  tiktok: string
  whatsapp: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    description: '',
    profileImage: null,
    instagram: '',
    tiktok: '',
    whatsapp: ''
  })

  useEffect(() => {
    // Cargar datos del localStorage
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const saveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newProfile = { ...profile, profileImage: e.target?.result as string }
        saveProfile(newProfile)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    const newProfile = { ...profile, [field]: value }
    saveProfile(newProfile)
  }

  const menuItems = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'links', label: 'Mis Links', icon: Link },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ]

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Mi Perfil</h2>
        <p className="text-gray-400">Gestiona tu información personal y perfil público</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label 
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={profile.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLinksSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Mis Links</h2>
        <p className="text-gray-400">Gestiona tus enlaces de redes sociales</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        {/* Instagram */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={profile.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@tu_usuario"
            />
          </div>
        </div>

        {/* TikTok */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              TikTok
            </label>
            <input
              type="text"
              value={profile.tiktok}
              onChange={(e) => handleInputChange('tiktok', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@tu_usuario"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              value={profile.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número de WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Analíticas</h2>
        <p className="text-gray-400">Visualiza el rendimiento de tu perfil</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Visitas totales</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clics en enlaces</p>
              <p className="text-2xl font-bold text-white">567</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Link className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tiempo promedio</p>
              <p className="text-2xl font-bold text-white">2:34</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Visitas por día</h3>
        <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Gráfico de analíticas (próximamente)</p>
        </div>
      </div>
    </div>
  )

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Configuración</h2>
        <p className="text-gray-400">Ajusta la configuración de tu cuenta</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Privacidad</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Perfil público</p>
                <p className="text-gray-400 text-sm">Permite que otros usuarios vean tu perfil</p>
              </div>
              <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="sr-only">Activar perfil público</span>
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Notificaciones por email</p>
                <p className="text-gray-400 text-sm">Recibe actualizaciones importantes por correo</p>
              </div>
              <button className="bg-gray-600 relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="sr-only">Activar notificaciones</span>
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cuenta</h3>
          <div className="space-y-4">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSection()
      case 'links':
        return renderLinksSection()
      case 'analytics':
        return renderAnalyticsSection()
      case 'settings':
        return renderSettingsSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-6 right-6">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden flex items-center justify-between h-16 px-6 bg-gray-800">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="w-6" />
        </div>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
```

## Dependencias

```typescript
// Iconos
import { 
  User, 
  Link, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Upload, 
  Instagram, 
  MessageCircle, 
  Clock 
} from 'lucide-react'

// Next.js
import { useRouter } from 'next/navigation'

// React
import { useState, useEffect } from 'react'
```

## Estructura de datos

```typescript
interface UserProfile {
  name: string
  description: string
  profileImage: string | null
  instagram: string
  tiktok: string
  whatsapp: string
}
```

## Funcionalidades principales

### 1. Gestión de Perfil
- Subida de imagen de perfil
- Edición de nombre y descripción
- Persistencia en localStorage

### 2. Gestión de Enlaces
- Configuración de redes sociales (Instagram, TikTok, WhatsApp)
- Interfaz visual con iconos identificativos

### 3. Analíticas (Placeholder)
- Métricas de visitas
- Estadísticas de clics
- Tiempo promedio de visita

### 4. Configuración
- Opciones de privacidad
- Configuración de notificaciones
- Gestión de cuenta

## Responsive Design

- **Desktop**: Sidebar fijo visible
- **Mobile**: Sidebar colapsable con overlay
- **Tablet**: Adaptación automática del grid

## Estilos

- **Color scheme**: Tema oscuro con grays y blues
- **Tipografía**: Sistema de fuentes Tailwind
- **Iconografía**: Lucide React icons
- **Interactividad**: Hover effects y transiciones suaves

## Uso

```typescript
// Importar en página
import UserDashboard from '@/components/admin/user-dashboard'

// Usar en ruta /admin-user
export default function AdminUserPage() {
  return <UserDashboard />
}
```

## Notas técnicas

- Uso de `localStorage` para persistencia local
- Estado reactivo con `useState` y `useEffect`
- Navegación programática con `useRouter`
- Diseño responsive con clases Tailwind
- Componente completamente funcional y autocontenido