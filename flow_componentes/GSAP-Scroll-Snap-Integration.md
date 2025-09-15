# GSAP Scroll Snap Integration Guide

## Descripción
Este sistema implementa un scroll snap suave entre secciones de altura completa usando GSAP ScrollTrigger y ScrollToPlugin. Permite navegación fluida entre secciones con animaciones controladas.

## Dependencias Necesarias

### CDN (Recomendado para pruebas rápidas)
\`\`\`html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js"></script>
\`\`\`

### NPM (Para proyectos de producción)
\`\`\`bash
npm install gsap
\`\`\`

## Estructura HTML Requerida

\`\`\`html
<section class="panel blue">
  <div>
    <h1>Sección 1</h1>
    <p>Contenido de la primera sección</p>
  </div>
</section>

<section class="panel red">
  <div>
    <h1>Sección 2</h1>
    <p>Contenido de la segunda sección</p>
  </div>
</section>

<section class="panel green">
  <div>
    <h1>Sección 3</h1>
    <p>Contenido de la tercera sección</p>
  </div>
</section>
\`\`\`

## CSS Necesario

\`\`\`css
html, body {
  height: auto;
  margin: 0;
  padding: 0;
}

.panel {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  position: relative;
}

/* Colores de ejemplo para las secciones */
.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.red { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.green { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.orange { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.purple { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
\`\`\`

## JavaScript/TypeScript Implementation

\`\`\`javascript
// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Variables globales
let panels = gsap.utils.toArray(".panel");
let observer;
let scrollTween;

// Configuración para dispositivos táctiles
if (ScrollTrigger.isTouch === 1) {
  observer = ScrollTrigger.normalizeScroll(true);
}

// Prevenir interrupciones en dispositivos táctiles
document.addEventListener("touchstart", e => {
  if (scrollTween) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, {capture: true, passive: false});

// Función para navegar a una sección específica
function goToSection(i) {
  scrollTween = gsap.to(window, {
    scrollTo: {y: i * innerHeight, autoKill: false},
    onStart: () => {
      if (!observer) return;
      observer.disable();
      observer.enable();
    },
    duration: 1,
    onComplete: () => scrollTween = null,
    overwrite: true
  });
}

// Crear ScrollTriggers para cada panel
panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top bottom",
    end: "+=199%",
    onToggle: self => self.isActive && !scrollTween && goToSection(i)
  });
});

// ScrollTrigger de respaldo para snap
ScrollTrigger.create({
  start: 0, 
  end: "max",
  snap: 1 / (panels.length - 1)
});
\`\`\`

## Instrucciones de Integración

### 1. Preparar el HTML
- Asegúrate de que cada sección tenga la clase `panel`
- Cada sección debe tener altura completa (`100vh`)
- Añade clases adicionales para estilos específicos

### 2. Incluir las dependencias
- Añade los scripts de GSAP antes del cierre de `</body>`
- O instala via NPM e importa en tu bundler

### 3. Aplicar los estilos CSS
- Copia los estilos base para `.panel`
- Personaliza los colores y diseños según tu marca

### 4. Inicializar el JavaScript
- Copia el código JavaScript completo
- Asegúrate de que se ejecute después de que el DOM esté cargado

### 5. Personalización
- Ajusta la duración de la animación modificando `duration: 1`
- Cambia los colores de fondo en las clases CSS
- Añade más secciones siguiendo la estructura HTML

## Consideraciones Adicionales

### Performance
- El código usa `will-change: transform` para optimizar las animaciones
- ScrollTrigger maneja automáticamente la limpieza de eventos

### Accesibilidad
- Considera añadir `prefers-reduced-motion` para usuarios sensibles al movimiento
- Incluye navegación alternativa para usuarios con discapacidades

### Responsive Design
- El sistema funciona en todos los dispositivos
- Incluye manejo especial para dispositivos táctiles

### Debugging
- Añade `markers: true` en ScrollTrigger.create() para ver los puntos de activación
- Usa las herramientas de desarrollo de GSAP para debugging avanzado

## Ejemplo de Uso Avanzado

\`\`\`javascript
// Añadir indicadores de progreso
ScrollTrigger.create({
  trigger: ".panel",
  start: "top center",
  end: "bottom center",
  onUpdate: self => {
    // Actualizar indicador de progreso
    document.querySelector('.progress').style.width = `${self.progress * 100}%`;
  }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    // Ir a la siguiente sección
  } else if (e.key === 'ArrowUp') {
    // Ir a la sección anterior
  }
});
\`\`\`

## Troubleshooting

### Problemas Comunes
1. **El scroll no funciona**: Verifica que los plugins estén cargados correctamente
2. **Animaciones entrecortadas**: Asegúrate de usar `will-change: transform`
3. **Problemas en móvil**: Verifica la configuración de `normalizeScroll`

### Compatibilidad
- Funciona en todos los navegadores modernos
- Requiere GSAP 3.0 o superior
- Compatible con frameworks como React, Vue, Angular

