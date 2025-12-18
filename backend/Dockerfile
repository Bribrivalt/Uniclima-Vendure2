FROM node:20-bullseye

WORKDIR /app

COPY package.json ./

# 👇 ESTA LÍNEA ES LA CLAVE
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]

