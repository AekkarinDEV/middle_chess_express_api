# Base Stage
FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build Stage
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV NODE_PATH=./build

RUN npm run build

# Run Stage
FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=production /app/build ./build
COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

# Optional: specify what ports this container listens on
EXPOSE 4000

CMD ["node", "build/index.js"]