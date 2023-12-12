FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/inventory apps/inventory
COPY libs libs

RUN npm run build inventory

CMD ["node", "dist/apps/inventory/main"]