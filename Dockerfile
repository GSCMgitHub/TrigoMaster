# --- Stage 1: Construcción del Frontend (React) ---
FROM node:18-alpine as build-step

WORKDIR /app/client

# Copiamos solo los package.json primero para aprovechar el caché de Docker
COPY client/package*.json ./
RUN npm install

# Copiamos el resto del código fuente del frontend
COPY client/ ./

# Construimos la app para producción (genera la carpeta dist o build)
RUN npm run build

# --- Stage 2: Configuración del Backend (Node/Express) ---
FROM node:18-alpine

WORKDIR /app

# Copiamos dependencias del backend
COPY server/package*.json ./
RUN npm install --production

# Copiamos el código del backend
COPY server/ ./

# --- EL TRUCO MAGICO ---
# Copiamos los archivos estáticos construidos en el Stage 1 a la carpeta pública del backend
# Nota: Si usas Vite la carpeta es 'dist', si usas CRA es 'build'
COPY --from=build-step /app/client/dist ./public

# Cloud Run inyecta la variable PORT (por defecto 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]