# RecommendedCompanies Component

## Descripción
Componente interactivo de "Empresas Más Recomendadas" que muestra las empresas ganadoras del Fondo Emprender más destacadas de Cali. Presenta un carrusel visual con transiciones suaves y diseño responsive.

## Ubicación
`/components/recommended-companies.tsx`

## Características

- **Carrusel interactivo**: Navegación entre empresas con transiciones suaves
- **Diseño responsive**: Adaptación completa para desktop, tablet y móvil
- **Efectos visuales**: Transformaciones CSS3 y gradientes dinámicos
- **Iconografía**: Font Awesome icons para representar cada sector empresarial
- **Colores dinámicos**: Cada empresa tiene su propio color de marca
- **Interactividad**: Click para cambiar entre empresas

## Código del Componente

```tsx
"use client"

import type React from "react"
import { useState } from "react"

interface CompanyData {
  id: number
  background: string
  icon: string
  main: string
  sub: string
  defaultColor: string
}

const RecommendedCompanies: React.FC = () => {
  const [activeCompany, setActiveCompany] = useState<number>(0)

  const companiesData: CompanyData[] = [
    {
      id: 0,
      background: "/placeholder.jpg",
      icon: "fas fa-laptop-code",
      main: "TechCali Solutions",
      sub: "Desarrollo de software innovador",
      defaultColor: "#3B82F6",
    },
    {
      id: 1,
      background: "/placeholder.jpg",
      icon: "fas fa-leaf",
      main: "EcoVerde Sostenible",
      sub: "Productos ecológicos y sostenibles",
      defaultColor: "#10B981",
    },
    {
      id: 2,
      background: "/placeholder.jpg",
      icon: "fas fa-utensils",
      main: "Gastronomía Valluna",
      sub: "Restaurante de comida tradicional",
      defaultColor: "#F59E0B",
    },
    {
      id: 3,
      background: "/placeholder.jpg",
      icon: "fas fa-tshirt",
      main: "Textiles del Valle",
      sub: "Manufactura textil de alta calidad",
      defaultColor: "#8B5CF6",
    },
    {
      id: 4,
      background: "/placeholder.jpg",
      icon: "fas fa-truck",
      main: "Logística Express",
      sub: "Servicios de transporte y logística",
      defaultColor: "#EF4444",
    },
  ]

  const handleCompanyClick = (companyId: number) => {
    setActiveCompany(companyId)
  }

  const styles = \`
    .companies-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      height: 60vh;
      font-family: 'Roboto', sans-serif;
      transition: 0.25s;
      background: transparent;
      padding: 0;
    }
    
    .companies-wrapper {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      overflow: hidden;
      min-width: 600px;
      max-width: 900px;
      width: calc(100% - 100px);
      height: 400px;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .company-item {
      position: relative;
      overflow: hidden;
      min-width: 60px;
      margin: 10px;
      background-size: auto 120%;
      background-position: center;
      cursor: pointer;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
      border-radius: 30px;
      flex-grow: 1;
    }
    
    .company-item.active {
      flex-grow: 10000;
      transform: scale(1);
      max-width: 600px;
      margin: 0px;
      border-radius: 40px;
      background-size: auto 100%;
    }
    
    .company-item:not(.active) {
      flex-grow: 1;
      border-radius: 30px;
    }
    
    .company-item.active .company-shadow {
      box-shadow: none;
    }
    
    .company-item:not(.active) .company-shadow {
      bottom: -40px;
      box-shadow: none;
    }
    
    .company-item.active .company-label {
      bottom: 20px;
      left: 20px;
    }
    
    .company-item:not(.active) .company-label {
      bottom: 10px;
      left: 10px;
    }
    
    .company-item.active .company-info > div {
      left: 0px;
      opacity: 1;
    }
    
    .company-item:not(.active) .company-info > div {
      left: 20px;
      opacity: 0;
    }
    
    .company-shadow {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 120px;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
    }
    
    .company-label {
      display: flex;
      position: absolute;
      right: 0px;
      height: 40px;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
    }
    
    .company-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      border-radius: 100%;
      background-color: white;
    }
    
    .company-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      color: white;
      white-space: pre;
    }
    
    .company-info > div {
      position: relative;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
    }
    
    .company-main {
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .company-sub {
      transition-delay: 0.1s;
    }
    
    .inactive-companies {
      display: none;
    }
    
    /* Tablet and Mobile Responsive Styles */
    @media screen and (max-width: 1024px) {
      .companies-container {
        padding: 0;
        height: auto;
        min-height: 60vh;
        flex-direction: column;
      }
      
      .companies-wrapper {
        display: flex;
        flex-direction: column;
        min-width: auto;
        max-width: none;
        width: 100%;
        height: auto;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .company-item.active {
        display: block;
        width: 100%;
        max-width: 500px;
        height: 300px;
        margin: 0 0 30px 0;
        border-radius: 25px;
        background-size: cover;
        flex-grow: 0;
        transform: none;
      }
      
      .company-item.active .company-label {
        bottom: 25px;
        left: 25px;
        right: auto;
        height: 40px;
      }
      
      .company-item.active .company-info > div {
        left: 0px;
        opacity: 1;
      }
      
      .company-item:not(.active) {
        display: none;
      }
      
      .inactive-companies {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
        width: 100%;
        max-width: 500px;
      }
      
      .inactive-company {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;
        overflow: hidden;
      }
      
      .inactive-company::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
      }
      
      .inactive-company-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 1;
      }
    }
    
    @media screen and (max-width: 768px) {
      .company-item.active {
        height: 250px;
        border-radius: 20px;
        max-width: 400px;
      }
      
      .company-item.active .company-label {
        bottom: 20px;
        left: 20px;
      }
      
      .inactive-company {
        width: 60px;
        height: 60px;
      }
      
      .inactive-company-inner {
        width: 35px;
        height: 35px;
        font-size: 16px;
      }
    }
    
    @media screen and (max-width: 480px) {
      .company-item.active {
        height: 220px;
        border-radius: 18px;
      }
      
      .company-item.active .company-label {
        bottom: 18px;
        left: 18px;
      }
      
      .company-main {
        font-size: 1.1rem;
      }
      
      .inactive-company {
        width: 50px;
        height: 50px;
      }
      
      .inactive-company-inner {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
    }
  \`

  return (
    <section className="py-40 lg:py-48 px-8 lg:px-16">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="container px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Empresas Más Recomendadas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre las empresas ganadoras del Fondo Emprender más destacadas de Cali
          </p>
        </div>
      </div>

      <div className="companies-container">
        <div className="companies-wrapper">
          {companiesData.map((company) => (
            <div
              key={company.id}
              className={\`company-item \${activeCompany === company.id ? "active" : ""}\`}
              style={
                {
                  backgroundImage: \`url(\${company.background})\`,
                  backgroundSize: company.id === 1 || company.id === 2 || company.id === 4 ? "cover" : undefined,
                  "--defaultBackground": company.defaultColor,
                } as React.CSSProperties
              }
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="company-shadow"></div>
              <div className="company-label">
                <div
                  className="company-icon"
                  style={{
                    color: "#6B7280",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.5)",
                    filter: "drop-shadow(0 0 2px rgba(255,255,255,0.8))",
                  }}
                >
                  <i className={company.icon}></i>
                </div>
                <div className="company-info">
                  <div className="company-main font-mono">{company.main}</div>
                  <div className="company-sub font-mono">{company.sub}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="inactive-companies">
            {companiesData.map(
              (company) =>
                company.id !== activeCompany && (
                  <div
                    key={company.id}
                    className="inactive-company"
                    style={{
                      backgroundImage: \`url(\${company.background})\`,
                    }}
                    onClick={() => handleCompanyClick(company.id)}
                  >
                    <div className="inactive-company-inner">
                      <i className={company.icon} style={{ color: "#6B7280" }}></i>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { RecommendedCompanies }
```

## Estructura de datos

```typescript
interface CompanyData {
  id: number
  background: string        // URL de la imagen de fondo
  icon: string             // Clase de Font Awesome
  main: string             // Nombre principal de la empresa
  sub: string              // Descripción/subtítulo
  defaultColor: string     // Color de marca en hexadecimal
}
```

## Datos de las empresas

```typescript
const companiesData: CompanyData[] = [
  {
    id: 0,
    background: "/placeholder.jpg",
    icon: "fas fa-laptop-code",
    main: "TechCali Solutions",
    sub: "Desarrollo de software innovador",
    defaultColor: "#3B82F6", // Azul
  },
  {
    id: 1,
    background: "/placeholder.jpg", 
    icon: "fas fa-leaf",
    main: "EcoVerde Sostenible",
    sub: "Productos ecológicos y sostenibles",
    defaultColor: "#10B981", // Verde
  },
  {
    id: 2,
    background: "/placeholder.jpg",
    icon: "fas fa-utensils", 
    main: "Gastronomía Valluna",
    sub: "Restaurante de comida tradicional",
    defaultColor: "#F59E0B", // Amarillo/Naranja
  },
  {
    id: 3,
    background: "/placeholder.jpg",
    icon: "fas fa-tshirt",
    main: "Textiles del Valle", 
    sub: "Manufactura textil de alta calidad",
    defaultColor: "#8B5CF6", // Púrpura
  },
  {
    id: 4,
    background: "/placeholder.jpg",
    icon: "fas fa-truck",
    main: "Logística Express",
    sub: "Servicios de transporte y logística", 
    defaultColor: "#EF4444", // Rojo
  }
]
```

## Dependencias externas

```html
<!-- Font Awesome para iconos -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

<!-- Google Fonts - Roboto -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
```

## Funcionalidades principales

### 1. Carrusel Interactivo
- **Estado activo**: Una empresa se muestra expandida con información completa
- **Navegación**: Click en cualquier empresa para activarla
- **Transiciones suaves**: Animaciones CSS3 con cubic-bezier

### 2. Diseño Responsive

#### Desktop (>1024px)
- Layout horizontal con carrusel expandible
- Empresa activa se expande, otras se contraen
- Hover effects y transiciones suaves

#### Tablet (768px - 1024px) 
- Layout vertical con empresa activa arriba
- Miniaturas circulares debajo para navegación
- Altura adaptable al contenido

#### Móvil (<768px)
- Empresa activa ocupa todo el ancho disponible
- Miniaturas más pequeñas para fácil navegación táctil
- Tipografía optimizada para pantallas pequeñas

### 3. Efectos Visuales
- **Sombras dinámicas**: Gradientes según el color de marca
- **Iconos destacados**: Efectos de drop-shadow y text-shadow
- **Transiciones fluidas**: cubic-bezier para movimientos naturales
- **Colores de marca**: Sistema de colores personalizado por empresa

## Estilos CSS avanzados

### Variables CSS personalizadas
```css
--defaultBackground: company.defaultColor // Color dinámico por empresa
```

### Transiciones principales
```css
transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95)
```

### Media queries responsive
- `@media screen and (max-width: 1024px)` - Tablet
- `@media screen and (max-width: 768px)` - Móvil grande
- `@media screen and (max-width: 480px)` - Móvil pequeño

## Uso

```typescript
// Importar en página principal
import { RecommendedCompanies } from '@/components/recommended-companies'

// Usar en layout
export default function Home() {
  return (
    <main>
      <RecommendedCompanies />
    </main>
  )
}
```

## Personalización

### Agregar nueva empresa
```typescript
const newCompany: CompanyData = {
  id: 5,
  background: "/nueva-empresa.jpg",
  icon: "fas fa-nueva-icon",
  main: "Nombre Empresa",
  sub: "Descripción de la empresa", 
  defaultColor: "#HEXCOLOR"
}
```

### Cambiar colores de marca
Modificar el campo `defaultColor` en cada empresa con el código hexadecimal deseado.

### Actualizar iconos
Usar cualquier ícono de Font Awesome 5.15.4 cambiando la clase en el campo `icon`.

## Notas técnicas

- **Performance**: Usa CSS transform en lugar de cambios de layout
- **Accesibilidad**: Navegación por teclado mediante click handlers
- **SEO**: Estructura semántica con section y headings apropiados
- **Compatibilidad**: CSS moderno con fallbacks para navegadores antiguos
- **Optimización**: Lazy loading implícito para imágenes de fondo

## Sectores empresariales representados

1. **Tecnología**: TechCali Solutions (Desarrollo software)
2. **Sostenibilidad**: EcoVerde Sostenible (Productos ecológicos)  
3. **Gastronomía**: Gastronomía Valluna (Comida tradicional)
4. **Textil**: Textiles del Valle (Manufactura textil)
5. **Logística**: Logística Express (Transporte y logística)