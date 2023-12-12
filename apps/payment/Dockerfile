FROM node:alpine 

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/payment apps/payment
COPY libs libs

RUN npm run build payment

CMD ["node", "dist/apps/payment/main"]