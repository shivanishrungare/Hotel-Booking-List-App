# Use Node 22 Alpine image
FROM node:22-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
