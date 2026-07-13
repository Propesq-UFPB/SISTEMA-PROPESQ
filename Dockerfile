FROM oven/bun:1-alpine

WORKDIR /usr/src/app

# Cache dependencies
COPY bun.lock* bun.lockb* package.json ./
RUN bun install

# Copy source code
COPY . .

# Expose Vite / dev server port
EXPOSE 3100

# Development server (hot reload)
CMD ["bun", "run", "dev"]