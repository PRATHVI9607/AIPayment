FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3003

CMD ["sh", "-c", "next start -p ${PORT:-3003}"]
