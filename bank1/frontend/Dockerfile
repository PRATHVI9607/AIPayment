FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3001

CMD ["/app/start.sh"]
