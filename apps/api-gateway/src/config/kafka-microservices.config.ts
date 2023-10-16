import {
  AUTH_SERVICE,
  AUCTION_MANAGEMENT_SERVICE,
  BID_SERVICE,
  PAYMENT_SERVICE,
  INVENTORY_SERVICE,
  AUTH_CLIENT_ID,
  AUTH_GROUP_ID,
  AUCTION_MANAGEMENT_CLIENT_ID,
  AUCTION_MANAGEMENT_GROUP_ID,
  BID_CLIENT_ID,
  BID_GROUP_ID,
  INVENTORY_CLIENT_ID,
  INVENTORY_GROUP_ID,
  PAYMENT_CLIENT_ID,
  PAYMENT_GROUP_ID,
} from '@app/shared-library';
import { ClientProviderOptions, Transport, ClientsModuleOptions } from '@nestjs/microservices';

// const KAFKA_BROKER = process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT;

const authKafkaConfig: ClientProviderOptions = {
  name: AUTH_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: AUTH_CLIENT_ID,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: AUTH_GROUP_ID,
    },
  },
};

export const inventoryKafkaConfig: ClientProviderOptions = {
  name: INVENTORY_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: INVENTORY_CLIENT_ID,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: INVENTORY_GROUP_ID,
    },
  },
};

export const auctionManagementKafkaConfig: ClientProviderOptions = {
  name: AUCTION_MANAGEMENT_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: AUCTION_MANAGEMENT_CLIENT_ID,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: AUCTION_MANAGEMENT_GROUP_ID,
    },
  },
};

export const bidKafkaConfig: ClientProviderOptions = {
  name: BID_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: BID_CLIENT_ID,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: BID_GROUP_ID,
    },
  },
};

export const paymentKafkaConfig: ClientProviderOptions = {
  name: PAYMENT_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: PAYMENT_CLIENT_ID,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: PAYMENT_GROUP_ID,
    },
  },
};

console.log('auth kafka config: ', authKafkaConfig);
console.log('inventory kafka config: ', inventoryKafkaConfig);

export const microservices: ClientsModuleOptions = [
  authKafkaConfig,
  auctionManagementKafkaConfig,
  bidKafkaConfig,
  paymentKafkaConfig,
  inventoryKafkaConfig,
];
