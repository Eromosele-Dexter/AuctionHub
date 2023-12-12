FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/api-gateway apps/api-gateway
COPY libs libs

RUN npm run build api-gateway

# Set environment variables
ENV RABBIT_MQ_URI=amqps://rabbitmq:ComplexPolice123@b-d695d737-8818-49eb-abf2-a47c5febd4d8.mq.us-east-1.amazonaws.com:5671 \
    RABBIT_MQ_AUTH_SERVICE_QUEUE=AUTH \
    RABBIT_MQ_AUCTION_MANAGEMENT_SERVICE_QUEUE=AUCTION_MANAGEMENT \
    RABBIT_MQ_BID_SERVICE_QUEUE=BID \
    RABBIT_MQ_INVENTORY_SERVICE_QUEUE=INVENTORY \
    RABBIT_MQ_PAYMENT_SERVICE_QUEUE=PAYMENT \
    POSTGRES_HOST=auth.cukw1cikhrbl.us-east-2.rds.amazonaws.com \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=Police123 \
    POSTGRES_AUTH_DATABASE=auth \
    SESSION_SECRET=randomsecret \
    AWS_ACCESS_KEY_ID=AKIATRLWVKQD5UNVQ2II \
    AWS_SECRET_ACCESS_KEY=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 \
    AWS_S3_REGION=us-east-1 \
    AWS_S3_BUCKET_NAME=auctionhub-images 

# Expose the necessary port(s)
EXPOSE 7080


CMD ["node", "dist/apps/api-gateway/main.js"]

