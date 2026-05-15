FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD sh -c "echo '------------------------------------' && echo '🚀 Backend API → http://localhost:5001' && echo '------------------------------------' && node server.js"
