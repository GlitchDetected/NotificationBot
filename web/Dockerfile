FROM node:22
WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]