FROM node:alpine 

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/bid apps/bid
COPY libs libs

RUN npm run build bid

# Expose the necessary port(s)
EXPOSE 7081


CMD ["node", "dist/apps/bid/main"]