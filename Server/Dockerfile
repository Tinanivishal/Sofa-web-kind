FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy prisma schema BEFORE generate
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the source code
COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]