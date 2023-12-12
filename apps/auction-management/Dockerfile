FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/auction-management apps/auction-management 
COPY libs libs

RUN npm run build auction-management

CMD ["node", "dist/apps/auction-management/main"]