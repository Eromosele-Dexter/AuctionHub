FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/api-gateway apps/api-gateway
COPY libs libs

RUN npm run build api-gateway

# Expose the necessary port(s)
EXPOSE 7080


CMD ["node", "dist/apps/api-gateway/main.js"]

