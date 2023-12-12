FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

RUN npm install

COPY apps/api-gateway apps/api-gateway 
COPY libs libs

RUN npm run build api-gateway

# Expose the necessary port(s)
EXPOSE 7080

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/api-gateway/main"]