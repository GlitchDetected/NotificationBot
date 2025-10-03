FROM node:22
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .
COPY .env ./

RUN pnpm run build

CMD ["pnpm", "run", "start"]