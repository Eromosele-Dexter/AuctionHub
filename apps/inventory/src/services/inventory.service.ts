import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuctionTypeRepository } from '../repositories/auction-type-repo/auction-type.repository';
import { ItemKeywordRepository } from '../repositories/item-keyword-repo/item-keyword.repository';
import { ItemRepository } from '../repositories/item-repo/item.repository';
import { KeywordRepository } from '../repositories/keyword-repo/keyword.repository';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { Item } from '../entities/item.entity';
import { Keyword } from '../entities/keyword.entity';
import { ItemKeyword } from '../entities/item-keyword.entity';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import { ViewListingResponse } from '@app/shared-library/api-contracts/inventory/responses/view-listing.response';
import { STATUS, VIEW_LISTING_ITEM_STATUS } from '@app/shared-library/types/status';
import { AUCTION_MANAGEMENT_SERVICE, GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN } from '@app/shared-library';
import { ClientKafka } from '@nestjs/microservices';
import { GetAuctionItemsForSellerResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-for-seller.response';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import { ViewListingItem } from '@app/shared-library/types/view-listing-item';
import { GetAllActiveItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-all-active-items.response';
import { ActiveItem } from '@app/shared-library/types/active-item';

@Injectable()
export class InventoryService implements OnModuleInit {
  constructor(
    private auctionTypeRepository: AuctionTypeRepository,
    private itemKeywordRepository: ItemKeywordRepository,
    private itemRepository: ItemRepository,
    private keywordRepository: KeywordRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.auctionManagementClient.subscribeToResponseOf(GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN);
    await this.auctionManagementClient.connect();
  }

  async handleCreateListing(data: CreateListingEvent) {
    const auctionTypeByName = data.auctionType.toUpperCase();

    const auctionType = await this.auctionTypeRepository.getAuctionTypeByName(auctionTypeByName);

    const auctionTypeId = auctionType.id;

    const item = new Item(
      data.sellerId,
      data.name,
      data.description,
      data.imageName,
      data.createdAt,
      auctionTypeId,
      false,
      data.imageUrl,
    );

    // dont create item if the seller already has an item with the same name
    const existingItem = await this.itemRepository.getItemByNameAndSellerId(item.name, item.sellerId);

    if (existingItem) {
      item.id = existingItem.id;

      await this.itemRepository.updateItem(item);
    } else {
      // // create item
      await this.itemRepository.createItem(item);
    }

    const createdItem = await this.itemRepository.getItemByNameAndSellerId(item.name, item.sellerId);

    const itemId = createdItem.id;

    const keyword1 = new Keyword(data.keyword1.toLowerCase());
    const keyword2 = new Keyword(data.keyword2.toLowerCase());
    const keyword3 = new Keyword(data.keyword3.toLowerCase());

    const existingKeyword1 = await this.keywordRepository.getKeywordByName(keyword1.name);
    const existingKeyword2 = await this.keywordRepository.getKeywordByName(keyword2.name);
    const existingKeyword3 = await this.keywordRepository.getKeywordByName(keyword3.name);

    // create keywords if they dont exist and associate them with the item

    if (!existingKeyword1) {
      await this.keywordRepository.createKeyword(keyword1);

      const createdKeyword1 = await this.keywordRepository.getKeywordByName(keyword1.name);

      const keywordId1 = createdKeyword1.id;

      const ItemKeyword1 = new ItemKeyword(itemId, keywordId1);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword1);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword1.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword1.id));
      }
    }

    if (!existingKeyword2) {
      await this.keywordRepository.createKeyword(keyword2);

      const createdKeyword2 = await this.keywordRepository.getKeywordByName(keyword2.name);

      const keywordId2 = createdKeyword2.id;

      const ItemKeyword2 = new ItemKeyword(itemId, keywordId2);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword2);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword2.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword2.id));
      }
    }

    if (!existingKeyword3) {
      await this.keywordRepository.createKeyword(keyword3);

      const createdKeyword3 = await this.keywordRepository.getKeywordByName(keyword3.name);

      const keywordId3 = createdKeyword3.id;

      const ItemKeyword3 = new ItemKeyword(itemId, keywordId3);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword3);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword3.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword3.id));
      }
    }
  }

  // TODO: ensure deletion of an entities cascades
  // TODO: Need to include pagination in view catalog endpoint

  async handleViewListing(data: ViewListingMessage): Promise<ViewListingResponse> {
    // const items = await this.itemRepository.getItemsBySellerId(data.sellerId);

    // const auctionItems = await new Promise<GetAuctionItemsForSellerResponse>((resolve, reject) => {
    //   this.auctionManagementClient
    //     .send(GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN, new GetAuctionItemsForSellerMessage(data.sellerId))
    //     .subscribe({
    //       next: (response) => {
    //         resolve(response);
    //       },
    //       error: (error) => {
    //         reject(error);
    //       },
    //     });
    // });

    const viewListingItems: ViewListingItem[] = [];

    // items.forEach(async (item) => {
    //   const matchingItem = auctionItems.auctionItems.find((auctionItem) => auctionItem.itemId === item.id);
    //   const auctionType = await this.auctionTypeRepository.getAuctionTypeById(item.auctionTypeId);

    //   const endTime = matchingItem.endTime;

    //   let status;

    //   // hasBeenSold -> status = sold
    //   // end time < current time -> status = expired
    //   // not matchingItem -> status = 'Draft'
    //   // matching -> status = ongoing

    //   if (item.hasBeenSold) {
    //     status = VIEW_LISTING_ITEM_STATUS.SOLD;
    //   } else if (endTime <= new Date().getTime()) {
    //     status = VIEW_LISTING_ITEM_STATUS.EXPIRED;
    //   } else if (!matchingItem) {
    //     status = VIEW_LISTING_ITEM_STATUS.DRAFT;
    //   } else {
    //     status = VIEW_LISTING_ITEM_STATUS.ONGOING;
    //   }

    //   const currentBidPrice = matchingItem.currentBidPrice;

    //   const viewListingItem = new ViewListingItem(
    //     item.id,
    //     item.name,
    //     item.description,
    //     item.imageName,
    //     auctionType.name,
    //     status,
    //     endTime,
    //     currentBidPrice,
    //     item.imageUrl,
    //   );

    //   viewListingItems.push(viewListingItem);
    // });
    return new ViewListingResponse(viewListingItems, 'Items successfully retrieved', STATUS.SUCCESS);
  }

  async handleGetAllActiveItems() {
    const items = await this.itemRepository.getAllActiveItems();
    const activeItems: ActiveItem[] = [];

    items.forEach(async (item) => {
      const auctionType = await this.auctionTypeRepository.getAuctionTypeById(item.auctionTypeId);

      const activeItem = new ActiveItem(
        item.id,
        item.sellerId,
        item.name,
        item.description,
        item.imageName,
        item.createdAt,
        item.hasBeenSold,
        auctionType.name,
        item.imageUrl,
      );

      activeItems.push(activeItem);
    });

    return new GetAllActiveItemsResponse(activeItems, 'All active Items successfully retrieved', STATUS.SUCCESS);
  }
}
