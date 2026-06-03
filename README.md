# 🏢 Catálogo de Profesionales

Plataforma web moderna para gestionar y consultar profesionales organizados por áreas de especialidad. Construida con **Vite, Firebase Firestore y Cloudinary** para una experiencia segura y escalable.

## ✨ Características

### 🌐 Vista Pública
- **Búsqueda en tiempo real**
- **Filtrado por área** (Electricistas, Plomeros, Gasistas, etc.)
- **Tarjetas responsivas** con información profesional
- **Contacto directo** vía WhatsApp
- **Fotos de profesionales** con iniciales como fallback
- **Diseño profesional** con paleta marrón cálida
- **Filtrado de activos/inactivos** (solo muestra activos)

### 🔐 Panel de Administración
- **Autenticación con contraseña** (variable de entorno)
- **Gestión de áreas**: Crear, editar, eliminar
- **Gestión de profesionales**: CRUD completo
- **Carga de imágenes** directa desde el panel (Cloudinary)
- **Estado activo/inactivo** con badge visual
- **Validaciones inteligentes** con feedback visual
- **Notificaciones Toast** en cada acción
- **Vista previa de imágenes** antes de guardar

## 🏗️ Stack Tecnológico

### Frontend
- **Vite** - Empaquetador y servidor de desarrollo
- **HTML5 + CSS3 + JavaScript vanilla** - Sin frameworks
- **Variables de entorno** - Configuración segura

### Backend & Servicios
- **Firebase Firestore** - Base de datos NoSQL
- **Cloudinary** - Hosting y optimización de imágenes
- **Firebase Storage** - Almacenamiento (configuración CORS)

## 🎨 Paleta de Colores

Tema **"Topo y Arena"** - tonos marrón cálido:

```css
--color-primary: #5A5047        /* Marrón principal */
--color-secondary: #8B7355      /* Marrón secundario */
--color-accent: #D4A574         /* Arena acento */
--color-text: #3A3330           /* Texto oscuro */
--color-bg: #F5F1ED             /* Fondo claro */
```

## 🚀 Instalación & Configuración

### Requisitos
- Node.js 20.19+ o 22.12+
- npm 10+
- Credenciales de Firebase
- Cuenta Cloudinary (gratuita)

### Pasos

1. **Clona o descarga el proyecto**
   ```bash
   git clone https://github.com/tu-usuario/Catalogo-de-profesionales.git
   cd Catalogo-de-profesionales
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus credenciales:
   ```dotenv
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   VITE_ADMIN_PASSWORD=tu_contraseña_segura
   ```

4. **Desarrollo local**
   ```bash
   npm run dev
   ```

5. **Build para producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
Catalogo-de-profesionales/
├── .env                    (No en GitHub - credenciales)
├── .env.example            (En GitHub - plantilla)
├── .gitignore              (Protege .env y node_modules)
├── package.json            (Dependencias)
├── vite.config.js          (Configuración Vite)
├── index.html              (Catálogo público)
├── admin.html              (Panel administrador)
├── js/
│   ├── storage.js          (Firestore + Cloudinary)
│   ├── auth.js             (Autenticación
│   ├── app_new.js          (Lógica catálogo público)
│   ├── admin_new.js        (Lógica panel admin)
│   └── cloudinary.js       (Upload a Cloudinary)
├── css/
│   ├── styles.css          (Estilos públicos)
│   └── admin.css           (Estilos admin)
└── assets/
    └── logo_portfolio.png
```

## 💡 Funcionalidades Detalladas

### Vista Pública (index.html)

#### Búsqueda & Filtros
- Selecciona un área → Ve profesionales activos
- Búsqueda por nombre en tiempo real
- Filtros y búsqueda trabajan juntos
- Volver a servicios con botón

#### Tarjetas de Profesional
- Foto cargada en Cloudinary
- Si no hay foto: iniciales del nombre y apellido
- Nombre y área
- Descripción profesional
- Teléfono
- Botón WhatsApp con enlace directo
- Animación hover

### Panel Admin

#### Autenticación
- Contraseña desde variable de entorno
- Sesión persistente en localStorage
- Cierre de sesión (logout)

#### Gestión de Áreas
- Crear, editar, eliminar áreas
- Icono emoji para cada área
- Advertencia al eliminar (elimina profesionales asociados)

#### Gestión de Profesionales
- **CRUD Completo**: Crear, leer, editar, eliminar
- **Tabla filtrable** por área
- **Carga de imágenes**: Directamente a Cloudinary
- **Vista previa**: Antes de guardar
- **Validaciones**:
  - Nombre requerido
  - Área requerida
  - Imagen: solo JPG/PNG/WebP, máx 5MB
- **Estado**: Marcar como activo/inactivo
- **Notificaciones**: Toast con feedback visual

## 🔄 Flujo de Datos

```
Admin Panel
    ↓ (sube imagen)
Cloudinary (hosting + optimización)
    ↓ (retorna URL)
Firestore (guarda URL + datos)
    ↓
Catálogo Público
    ↓ (muestra profesionales activos)
Usuario (busca, filtra, contacta)
```

## 💾 Persistencia de Datos

### Firestore
- Base de datos NoSQL en la nube
- **Colecciones**:
  - `areas` - Áreas/especialidades
  - `profesionales` - Profesionales con datos completos

### Cloudinary
- Almacena imágenes optimizadas
- URLs públicas en Firestore
- Eliminación automática al borrar profesional

### localStorage
- Solo para sesión admin (activo/inactivo)

## 🔒 Seguridad

### Variables de Entorno
- Credenciales Firebase **no expuestas** en GitHub
- Contraseña admin en variable de entorno
- `.env` en `.gitignore`

### Firebase Rules
```javascript
match /databases/{database}/documents {
  match /{document=**} {
    allow read, write: if request.auth != null;
  }
}
```

### Cloudinary
- Upload unsigned (sin autenticación backend)
- Upload preset configurado

⚠️ **Para producción con usuarios reales**:
- Implementar autenticación Firebase
- Restringir permisos de Firestore
- HTTPS obligatorio
- Rate limiting en API


## 🛠️ Desarrollo

### Scripts
```bash
npm run dev      # Servidor local
npm run build    # Build producción
npm run preview  # Previsualizar build
```

### Agregar Nueva Área
1. Panel Admin → Gestión de Áreas
2. Ingresa nombre (ej: "Carpinteros") e icono (ej: "🪵")
3. Click "Agregar Área"

### Agregar Profesional
1. Panel Admin → Gestión de Profesionales
2. Click "Agregar Profesional"
3. Completa datos
4. Sube foto (o deja vacío para usar iniciales)
5. Marca como activo
6. Click "Guardar"

## 📱 Responsivo

Optimizado para:
- **Desktop** (1024px+) - Layout completo
- **Tablet** (768px) - Layout ajustado
- **Móvil** (480px) - Optimizado para touch


## 📝 Cambios Principales

**v1.0 (Actual)**
- ✅ Firebase Firestore (reemplaza localStorage)
- ✅ Cloudinary para imágenes
- ✅ Vite como bundler
- ✅ Variables de entorno
- ✅ Estado activo/inactivo
- ✅ Iniciales como avatar fallback
- ✅ CORS configurado

## 🤝 Contribuir

Las pull requests son bienvenidas. Para cambios mayores, abre una issue primero.

## 📄 Licencia

MIT - Libre de usar, modificar y distribuir.

---

**Versión**: 1.0  
**Última actualización**: Junio 2026  
**Desarrollador**: Alexis Vespa  
**Repositorio**: [GitHub](https://github.com/Alexis1005/Catalogo-de-profesionales)
