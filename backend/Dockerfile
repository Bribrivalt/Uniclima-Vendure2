FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# 🔥 ESTA LÍNEA ES LA CLAVE
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]
