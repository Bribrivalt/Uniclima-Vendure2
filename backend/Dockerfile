FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# 👇 ESTO ES LO ÚNICO QUE DEBE BUILDAR
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
