FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json ./

# 🔥 CLAVE: evitar scripts postinstall
RUN npm install --legacy-peer-deps --ignore-scripts

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
