FROM node:20-bullseye

WORKDIR /app

# Copiamos dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiamos el código
COPY . .

# 🔑 COMPILAMOS TYPESCRIPT
RUN npm run build

# Exponemos puerto
EXPOSE 3001

# Arranque real
CMD ["npm", "run", "start"]
