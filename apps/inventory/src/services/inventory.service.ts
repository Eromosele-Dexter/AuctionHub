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
import {
  AUCTION_MANAGEMENT_SERVICE,
  CREATE_LISTING_ITEM_MESSAGE_PATTERN,
  GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN,
  GET_LISTING_ITEM_MESSAGE_PATTERN,
  VIEW_LISTING_ITEMS_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { GetAuctionItemsForSellerResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-for-seller.response';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import { ViewListingItem } from '@app/shared-library/types/view-listing-item';
import { GetAllActiveItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-all-active-items.response';
import { ActiveItem } from '@app/shared-library/types/active-item';
import { AuctionType } from '../entities/auction-type.entity';
import CreateListingItemEvent from '@app/shared-library/messages/create-listing-item.message';
import { ViewListingItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-listing-items.response';
import GetAuctionTypeMessage from '@app/shared-library/messages/get-auction-type.message';
import { GetAuctionTypeResponse } from '@app/shared-library/api-contracts/inventory/responses/get-auction-type.response';
import { CreateListingItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/create-listing-item.response';
import { GetListingItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-listing-item.response';
import GetListingItemMessage from '@app/shared-library/messages/get-listing-item.message';
import SearchForListingItemsIdByKeywordMessage from '@app/shared-library/messages/search-for-listing-items-id-by-keyword.message';
import { SearchForListingItemsIdByKeywordResponse } from '@app/shared-library/api-contracts/inventory/responses/search-listing-items-id.response';

@Injectable()
export class InventoryService {
  constructor(
    private auctionTypeRepository: AuctionTypeRepository,
    private itemKeywordRepository: ItemKeywordRepository,
    private itemRepository: ItemRepository,
    private keywordRepository: KeywordRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
  ) {}

  async migration() {
    const auctionTypesExist = await this.auctionTypeRepository.getAuctionTypes();

    if (auctionTypesExist.length === 0) {
      await this.auctionTypeRepository.createAuctionType(new AuctionType('dutch'));
      await this.auctionTypeRepository.createAuctionType(new AuctionType('forward'));
    }
  }

  async handleCreateListing(data: CreateListingEvent) {
    await this.migration();

    const auctionTypeByName = data.auctionType.toLowerCase();

    const auctionType = await this.auctionTypeRepository.getAuctionTypeByName(auctionTypeByName);

    const auction_type_id = auctionType.id;

    const item = new Item(
      data.seller_id,
      data.name.toLocaleLowerCase(),
      data.description,
      data.image_name,
      data.created_at,
      auction_type_id,
      false,
      data.starting_bid_price,
      data.image_url,
    );

    // dont create item if the seller already has an item with the same name
    const existingItem = await this.itemRepository.getItemByNameAndseller_id(item.name, item.seller_id);

    if (existingItem) {
      item.id = existingItem.id;

      await this.itemRepository.updateItem(item);
      // TODO: update listing item in auction management service
    } else {
      // // create item

      await this.itemRepository.createItem(item);

      await new Promise<CreateListingItemResponse>((resolve, reject) => {
        this.auctionManagementClient
          .send(
            CREATE_LISTING_ITEM_MESSAGE_PATTERN,
            new CreateListingItemEvent(
              item.name,
              item.id,
              item.seller_id,
              item.starting_bid_price,
              item.description,
              item.image_name,
              item.image_url,
              item.auction_type_id,
              data.end_time,
              auctionType.name === 'forward' ? -1 : data.decrement_amount,
              item.created_at,
              item.has_been_sold,
            ),
          )
          .subscribe({
            next: (response) => {
              resolve(response);
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    }

    const createdListingItem = (
      await new Promise<GetListingItemResponse>((resolve, reject) => {
        this.auctionManagementClient
          .send(GET_LISTING_ITEM_MESSAGE_PATTERN, new GetListingItemMessage(item.name, item.seller_id))
          .subscribe({
            next: (response) => {
              resolve(response);
            },
            error: (error) => {
              reject(error);
            },
          });
      })
    ).data;

    const listing_item_id = createdListingItem.id;

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

      const ItemKeyword1 = new ItemKeyword(listing_item_id, keywordId1);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword1);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByListingItemAndKeywordId(
        listing_item_id,
        existingKeyword1.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(listing_item_id, existingKeyword1.id));
      }
    }

    if (!existingKeyword2) {
      await this.keywordRepository.createKeyword(keyword2);

      const createdKeyword2 = await this.keywordRepository.getKeywordByName(keyword2.name);

      const keywordId2 = createdKeyword2.id;

      const ItemKeyword2 = new ItemKeyword(listing_item_id, keywordId2);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword2);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByListingItemAndKeywordId(
        listing_item_id,
        existingKeyword2.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(listing_item_id, existingKeyword2.id));
      }
    }

    if (!existingKeyword3) {
      await this.keywordRepository.createKeyword(keyword3);

      const createdKeyword3 = await this.keywordRepository.getKeywordByName(keyword3.name);

      const keywordId3 = createdKeyword3.id;

      const ItemKeyword3 = new ItemKeyword(listing_item_id, keywordId3);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword3);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByListingItemAndKeywordId(
        listing_item_id,
        existingKeyword3.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(listing_item_id, existingKeyword3.id));
      }
    }
  }

  // TODO: ensure deletion of an entities cascades
  // TODO: Need to include pagination in view catalog endpoint

  // async handleViewListing(data: ViewListingMessage): Promise<ViewListingResponse> {
  //   const { seller_id } = data;

  //   const listingItems = (
  //     await new Promise<ViewListingItemsResponse>((resolve, reject) => {
  //       this.auctionManagementClient
  //         .send(VIEW_LISTING_ITEMS_MESSAGE_PATTERN, new ViewListingMessage(seller_id))
  //         .subscribe({
  //           next: (response) => {
  //             resolve(response);
  //           },
  //           error: (error) => {
  //             reject(error);
  //           },
  //         });
  //     })
  //   ).listingItems;

  //   const auctionItems = (
  //     await new Promise<GetAuctionItemsForSellerResponse>((resolve, reject) => {
  //       this.auctionManagementClient
  //         .send(GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN, new GetAuctionItemsForSellerMessage(data.seller_id))
  //         .subscribe({
  //           next: (response) => {
  //             resolve(response);
  //           },
  //           error: (error) => {
  //             reject(error);
  //           },
  //         });
  //     })
  //   ).auctionItems;

  //   console.log('auctionItems: ', auctionItems);

  //   const viewListingItems: ViewListingItem[] = [];

  //   listingItems.forEach(async (item) => {
  //     const matchingItem = auctionItems.find((auctionItem) => auctionItem.item_id === item.id);
  //     const autId = item.auction_type_id;
  //     console.log('autId: ', autId);
  //     console.log('matchingItem: ', item);
  //     const auctionType = await this.auctionTypeRepository.getAuctionTypeById(item.auction_type_id);

  //     const end_time = item.end_time;

  //     let status;

  //     // has_been_sold -> status = sold
  //     // end time < current time -> status = expired
  //     // not matchingItem -> status = 'Draft'
  //     // matching -> status = ongoing

  //     console.log('auctionType: ', auctionType);

  //     if (item.has_been_sold) {
  //       status = VIEW_LISTING_ITEM_STATUS.SOLD;
  //     } else if (end_time <= new Date()) {
  //       status = VIEW_LISTING_ITEM_STATUS.EXPIRED;
  //     } else if (!matchingItem) {
  //       status = VIEW_LISTING_ITEM_STATUS.DRAFT;
  //     } else {
  //       status = VIEW_LISTING_ITEM_STATUS.ONGOING;
  //     }

  //     const current_bid_price = matchingItem ? matchingItem.current_bid_price : item.starting_bid_price;

  //     const viewListingItem = new ViewListingItem(
  //       item.id,
  //       item.name,
  //       item.description,
  //       item.image_name,
  //       auctionType.name,
  //       status,
  //       end_time,
  //       current_bid_price,
  //       item.image_url,
  //     );

  //     viewListingItems.push(viewListingItem);
  //   });
  //   return new ViewListingResponse(viewListingItems, 'Items successfully retrieved', STATUS.SUCCESS);
  // }

  async handleGetAuctionType(data: GetAuctionTypeMessage) {
    const { auction_type_id } = data;

    const auctionType = await this.auctionTypeRepository.getAuctionTypeById(auction_type_id);

    return new GetAuctionTypeResponse(auctionType.name, 'Auction type successfully retrieved', STATUS.SUCCESS);
  }

  async handleSearchForListingItemsIdByKeyword(
    data: SearchForListingItemsIdByKeywordMessage,
  ): Promise<SearchForListingItemsIdByKeywordResponse> {
    const { keyword } = data;

    const listingItemsIds = await this.itemKeywordRepository.searchForListingItemsIdByKeyword(keyword);

    return new SearchForListingItemsIdByKeywordResponse(
      listingItemsIds,
      'Listing items ids successfully retrieved',
      STATUS.SUCCESS,
    );
  }
}
