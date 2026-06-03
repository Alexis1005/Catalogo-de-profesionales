# 🏢 Plataforma de Gestión de Profesionales

Una plataforma web moderna, intuitiva y completamente funcional para gestionar profesionales organizados por categorías. Construida con **HTML5, CSS3 y JavaScript vanilla** sin dependencias externas.

## ✨ Características

### 🌐 Vista Pública
- **Búsqueda global** en tiempo real por nombre de profesional
- **Filtrado por categoría** (Áreas/Especialidades)
- **Cards responsivas** con información profesional
- **Contacto directo** vía email y WhatsApp
- **Diseño limpio y profesional** con paleta marrón cálida

### 🔐 Panel de Administración
- **Autenticación con contraseña** (hardcoded: `admin1234`)
- **Gestión completa de áreas**: Crear, editar, eliminar
- **Gestión completa de profesionales**: CRUD completo
- **Validaciones inteligentes** con feedback visual
- **Notificaciones Toast** para cada acción
- **Interfaz intuitiva** con sidebar y tabs

## 🎨 Paleta de Colores

Paleta profesional de **tonos marrón cálido**:

```css
--color-primary: #8B6F47        /* Marrón principal */
--color-secondary: #A0826D      /* Marrón secundario */
--color-accent: #D4A574         /* Marrón acento */
--color-text: #3E3E3E           /* Texto oscuro */
--color-bg: #F5F1ED             /* Fondo claro */
--color-card-bg: #FFFFFF        /* Cards blanco */
```

## 🚀 Cómo Empezar

### Requisitos
- Un navegador moderno (Chrome, Firefox, Safari, Edge)
- No necesita servidor local (funciona con `file://`)

### Pasos

1. **Descarga o clona el proyecto**
   ```
   /proyecto
   ├── index.html           (Vista pública)
   ├── admin.html           (Panel admin)
   ├── css/
   │   ├── styles.css       (Estilos públicos)
   │   └── admin.css        (Estilos admin)
   ├── js/
   │   ├── storage.js       (Persistencia)
   │   ├── auth.js          (Autenticación)
   │   ├── app.js           (Lógica pública)
   │   └── admin.js         (Lógica admin)
   └── CAMBIOS.md           (Historial de cambios)
   ```

2. **Abre en tu navegador**
   - Vista pública: Abre `index.html` directamente
   - Panel admin: Haz clic en "Panel de Administración" o abre `admin.html`

3. **Prueba el login**
   - Contraseña: `admin1234`

## 💡 Funcionalidades Detalladas

### Vista Pública (index.html)

#### Búsqueda
- Busca por nombre de profesional en tiempo real
- Se combina con filtros de categoría

#### Filtros
- Botones para cada área/categoría
- "Ver todos" para resetear filtros
- Filtros y búsqueda trabajan juntos

#### Cards de Profesional
- Foto (con fallback a avatar marrón)
- Nombre y categoría
- Descripción profesional
- Teléfono y email
- Botón WhatsApp directo
- Hover con animación

### Panel Admin (admin.html)

#### Login
- Pantalla simple y segura
- Validación de contraseña
- Error visual si es incorrecta

#### Gestión de Áreas
- Lista de áreas existentes
- Botones Editar y Eliminar
- Formulario para crear/editar
- Icono emoji para cada área
- Advertencia al eliminar (elimina profesionales asociados)

#### Gestión de Profesionales
- Tabla filtrable por área
- CRUD completo
- Campos: Nombre*, Email, Teléfono, Descripción, Área*, Foto URL
- Validaciones: Email válido, campos requeridos
- Feedback visual en cada acción

#### Notificaciones
- Toast de éxito (verde)
- Toast de error (rojo)
- Toast de advertencia (naranja)
- Auto-cierre después de 3 segundos

## 📱 Responsivo

Optimizado para:
- **Desktop** (1024px+) - Layout completo
- **Tablet** (768px) - Layout ajustado
- **Móvil** (480px) - Optimizado para touch
  - Inputs con font-size 16px (evita zoom)
  - Sidebar convertido a navbar horizontal
  - Tabla de profesionales compacta
  - Cards apiladas verticalmente

## 💾 Persistencia de Datos

- **localStorage** del navegador
- Datos se guardan automáticamente
- Persisten entre recargas
- No se comparten entre navegadores
- Se pierden si se limpia el caché

### Estructura de Datos

```javascript
// localStorage["areas"]
[
  { id: "uuid", nombre: "Electricistas", icono: "⚡" }
]

// localStorage["profesionales"]
[
  {
    id: "uuid",
    nombre: "Juan Pérez",
    telefono: "+54 9 11 1234-5678",
    email: "juan@ejemplo.com",
    descripcion: "Especialista...",
    areaId: "uuid",
    foto_url: "https://..."
  }
]

// localStorage["admin_session"]
true | false
```

## 🔧 Desarrollo

### Estructura de Módulos

- **storage.js**: Abstracción de localStorage (CRUD)
- **auth.js**: Lógica de autenticación
- **app.js**: Lógica de vista pública
- **admin.js**: Lógica del panel admin

### Sin Dependencias
- No usa React, Vue, Angular
- No usa Bootstrap, TailwindCSS
- No usa jQuery o librerías externas
- Solo Google Fonts (tipografía)

### Variables CSS para Temas
Fácil de customizar - solo edita `:root` en el CSS

## 📸 Datos Precargados

### Áreas
1. **Electricistas** ⚡
2. **Plomeros** 💧
3. **Gasistas** 🔥

### Profesionales (6 ejemplos)
- 2 Electricistas
- 2 Plomeros
- 2 Gasistas

Con fotos de ejemplo, emails, teléfonos y descripciones realistas.

## 🎯 Mejoras Implementadas

✅ Paleta de colores marrón profesional
✅ Notificaciones Toast en lugar de alert()
✅ Validación de email
✅ Avatar con gradiente marrón
✅ Email clickeable (mailto)
✅ WhatsApp con emoji
✅ Footer informativo
✅ Responsive mejorado
✅ Placeholder descriptivos
✅ Feedback visual en todas acciones
✅ UX intuitiva y clara

## 🛡️ Seguridad

⚠️ **Notas Importantes**
- La contraseña está en el código fuente (aceptable para proyectos personales)
- No usa HTTPS o encriptación (adicionar si es necesario)
- Los datos están en localStorage (accesibles al navegador)

Para producción con usuarios reales, considera:
- Backend con autenticación segura
- Base de datos
- HTTPS obligatorio
- API con autenticación tokens

## 📝 Licencia

Proyecto de código abierto. Libre de usar, modificar y distribuir.

---

**Versión**: 1.0 | **Última actualización**: 2024
