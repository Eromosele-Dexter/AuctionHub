FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/inventory apps/inventory
COPY libs libs

RUN npm run build inventory

# Set environment variables
ENV RABBIT_MQ_URI=amqps://rabbitmq:ComplexPolice123@b-d695d737-8818-49eb-abf2-a47c5febd4d8.mq.us-east-1.amazonaws.com:5671 \
    RABBIT_MQ_AUTH_SERVICE_QUEUE=AUTH \
    RABBIT_MQ_AUCTION_MANAGEMENT_SERVICE_QUEUE=AUCTION_MANAGEMENT \
    RABBIT_MQ_BID_SERVICE_QUEUE=BID \
    RABBIT_MQ_INVENTORY_SERVICE_QUEUE=INVENTORY \
    RABBIT_MQ_PAYMENT_SERVICE_QUEUE=PAYMENT \
    RABBIT_MQ_API_GATEWAY_SERVICE_QUEUE=API_GATEWAY \
    POSTGRES_HOST=inventory.cukw1cikhrbl.us-east-2.rds.amazonaws.com \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=Police123 \
    POSTGRES_INVENTORY_DATABASE=inventory

CMD ["node", "dist/apps/inventory/main"]