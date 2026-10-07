# ✈️ Airline Booking System

Sistema de reservas de vuelos con funcionalidad de cupones de descuento y checkout integrado.

## 🚀 Características

- **Checkout Interactivo**: Página de checkout completa con resumen de precios
- **Sistema de Cupones**: Validación de códigos de descuento en tiempo real
- **UI Moderna**: Interfaz responsive con TailwindCSS
- **TypeScript**: Tipado completo para mayor seguridad
- **React Router 7**: Navegación y SSR optimizado
- **Hot Module Replacement**: Desarrollo rápido con HMR

## 🎟️ Cupones Disponibles

| Código | Descuento |
|--------|-----------|
| `SAVE10` | 10% |
| `SAVE20` | 20% |
| `SUMMER25` | 25% |
| `WELCOME15` | 15% |

## 🛠️ Instalación

Instalar dependencias:

```bash
npm install
```

## 💻 Desarrollo

Iniciar servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Rutas Disponibles

- `/` - Página principal
- `/checkout` - Página de checkout con cupones

## 🏗️ Build para Producción

Crear build de producción:

```bash
npm run build
```

Iniciar servidor de producción:

```bash
npm start
```

## 📦 Estructura del Proyecto

```
airline-proj/
├── app/
│   ├── routes/
│   │   ├── home.tsx          # Página principal
│   │   └── checkout.tsx      # Página de checkout
│   ├── welcome/
│   │   └── welcome.tsx       # Componente de bienvenida
│   ├── root.tsx              # Layout principal
│   ├── routes.ts             # Configuración de rutas
│   └── app.css               # Estilos globales
├── public/                   # Assets estáticos
├── build/                    # Build de producción
└── Dockerfile               # Configuración Docker
```

## 🐳 Deployment con Docker

Construir imagen:

```bash
docker build -t airline-app .
```

Ejecutar contenedor:

```bash
docker run -p 3000:3000 airline-app
```

### Plataformas Compatibles

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## 🎨 Tecnologías

- **Frontend**: React 19, React Router 7
- **Styling**: TailwindCSS 4
- **Backend**: Node.js, React Router Server
- **Build**: Vite 7
- **Language**: TypeScript 5

## 📝 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm start          # Servidor de producción
npm run typecheck  # Verificación de tipos
```

---

Desarrollado con ❤️ usando React Router
