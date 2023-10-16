import { ClientProviderOptions, ClientsModuleOptions, Transport } from '@nestjs/microservices';

export const AUTH_SERVICE = 'AUTH_SERVICE';
export const AUCTION_MANAGEMENT_SERVICE = 'AUCTION_MANAGEMENT_SERVICE';
export const BID_SERVICE = 'BID_SERVICE';
export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';
export const INVENTORY_SERVICE = 'INVENTORY_SERVICE';

export const AUTH_CLIENT_ID = 'auth';
export const AUCTION_MANAGEMENT_CLIENT_ID = 'auction-management';
export const BID_CLIENT_ID = 'bid';
export const PAYMENT_CLIENT_ID = 'payment';
export const INVENTORY_CLIENT_ID = 'inventory';

const KAFKA_BROKER = 'localhost:9092';

export const AUTH_GROUP_ID = 'auth-consumer';
export const AUCTION_MANAGEMENT_GROUP_ID = 'auction-management-consumer';
export const BID_GROUP_ID = 'bid-consumer';
export const PAYMENT_GROUP_ID = 'payment-consumer';
export const INVENTORY_GROUP_ID = 'inventory-consumer';

export const authKafkaConfig: ClientProviderOptions = {
  name: AUTH_SERVICE,
  transport: Transport.KAFKA,
  options: {},
};

export const authKafkaOptions = {
  client: {
    clientId: AUTH_CLIENT_ID,
    brokers: [KAFKA_BROKER],
  },
  consumer: {
    groupId: AUTH_GROUP_ID,
  },
};

export const auctionManagementKafkaConfig: ClientProviderOptions = {
  name: AUCTION_MANAGEMENT_SERVICE,
  transport: Transport.KAFKA,
  options: {},
};

export const auctionManagementKafkaOptions = {
  client: {
    clientId: AUCTION_MANAGEMENT_CLIENT_ID,
    brokers: [KAFKA_BROKER],
  },
  consumer: {
    groupId: AUCTION_MANAGEMENT_GROUP_ID,
  },
};

export const bidKafkaConfig: ClientProviderOptions = {
  name: BID_SERVICE,
  transport: Transport.KAFKA,
  options: {},
};

export const bidKafkaOptions = {
  client: {
    clientId: BID_CLIENT_ID,
    brokers: [KAFKA_BROKER],
  },
  consumer: {
    groupId: BID_GROUP_ID,
  },
};

export const paymentKafkaConfig: ClientProviderOptions = {
  name: PAYMENT_SERVICE,
  transport: Transport.KAFKA,
  options: {},
};

export const paymentKafkaOptions = {
  client: {
    clientId: PAYMENT_CLIENT_ID,
    brokers: [KAFKA_BROKER],
  },
  consumer: {
    groupId: PAYMENT_GROUP_ID,
  },
};

export const inventoryKafkaConfig: ClientProviderOptions = {
  name: INVENTORY_SERVICE,
  transport: Transport.KAFKA,
  options: {},
};

export const inventoryKafkaOptions = {
  client: {
    clientId: INVENTORY_CLIENT_ID,
    brokers: [KAFKA_BROKER],
  },
  consumer: {
    groupId: INVENTORY_GROUP_ID,
  },
};
