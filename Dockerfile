FROM node:14-alpine

RUN apk add --no-cache python make g++ bind-tools chromium

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]