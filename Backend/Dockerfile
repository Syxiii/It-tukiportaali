##fix
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash git openssh python3 make g++

COPY package*.json ./

COPY prisma ./prisma

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
