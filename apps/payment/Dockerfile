FROM node:alpine 

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/payment apps/payment
COPY libs libs

RUN npm run build payment

# Set environment variables
ENV RABBIT_MQ_URI=amqps://rabbitmq:ComplexPolice123@b-d695d737-8818-49eb-abf2-a47c5febd4d8.mq.us-east-1.amazonaws.com:5671 \
    RABBIT_MQ_AUTH_SERVICE_QUEUE=AUTH \
    RABBIT_MQ_AUCTION_MANAGEMENT_SERVICE_QUEUE=AUCTION_MANAGEMENT \
    RABBIT_MQ_BID_SERVICE_QUEUE=BID \
    RABBIT_MQ_INVENTORY_SERVICE_QUEUE=INVENTORY \
    RABBIT_MQ_PAYMENT_SERVICE_QUEUE=PAYMENT \
    RABBIT_MQ_API_GATEWAY_SERVICE_QUEUE=API_GATEWAY \
    POSTGRES_HOST=payment.cukw1cikhrbl.us-east-2.rds.amazonaws.com \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=Police123 \
    POSTGRES_PAYMENT_DATABASE=payment \
    MAILJET_API_KEY=6ea1e1398700a1ed5e8c325e27ad037f \
    MAILJET_API_SECRET=2d910a3904d9f7f8e05b639109b4df49

CMD ["node", "dist/apps/payment/main"]