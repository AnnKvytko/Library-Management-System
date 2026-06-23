FROM node:22-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]