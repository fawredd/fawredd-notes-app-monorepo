FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm prune --production
EXPOSE 5000
CMD ["npm", "start"]