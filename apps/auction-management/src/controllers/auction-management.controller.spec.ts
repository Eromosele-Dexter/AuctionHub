import { Test, TestingModule } from '@nestjs/testing';
import { AuctionManagementController } from './auction-management.controller';
import { AuctionManagementService } from '../services/auction-management.service';

describe('AuctionManagementController', () => {
  let auctionManagementController: AuctionManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuctionManagementController],
      providers: [AuctionManagementService],
    }).compile();

    auctionManagementController = app.get<AuctionManagementController>(
      AuctionManagementController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(auctionManagementController.getHello()).toBe('Hello World!');
    });
  });
});
