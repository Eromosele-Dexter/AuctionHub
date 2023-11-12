import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { AuctionItemRepository } from '../repositories/auction-item-repo/auction-item.repository';
import {
  GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN,
  INVENTORY_SERVICE,
  START_AUCTION_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { StartAuctionResponse } from '@app/shared-library/api-contracts/auction-management/responses/start-auction.response';
import { AuctionItem } from '../entities/auction-item.entity';
import StartAuctionMessage from '@app/shared-library/messages/start-auction.message';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import { ViewCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-catalog.response';
import { CatalogItem } from '@app/shared-library/types/view-catalog-item';
import { GetAllActiveItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-all-active-items.response';
import GetAllActiveItemsMessage from '@app/shared-library/messages/get-all-items.message';
import { STATUS, VIEW_LISTING_ITEM_STATUS } from '@app/shared-library/types';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import { SearchCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/search-catalog.response';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import { GetAuctionItemsForSellerResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-for-seller.response';
import CreateListingItemEvent from '@app/shared-library/events/create-listing-item.event';
import { ListingItemRepository } from '../repositories/listing-item-repo/listing-item.repository';
import { ListingItem } from '../entities/listing-item.entity';
import ViewListingItemsMessage from '@app/shared-library/messages/view-listing-items.message';
import { View } from 'typeorm/schema-builder/view/View';
import { ViewListingItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-listing-items.response';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import { ViewListingResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-listing.response';
import { ViewListingItem } from '@app/shared-library/types/view-listing-item';

@Injectable()
export class AuctionManagementService {
  constructor(
    private auctionItemRepository: AuctionItemRepository,
    private listingItemRepository: ListingItemRepository,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
  ) {}

  handleCreateListingItem(data: CreateListingItemEvent) {
    const listingItem = new ListingItem(
      data.name,
      data.itemId,
      data.sellerId,
      data.startingBidPrice,
      data.description,
      data.imageName,
      data.imageUrl,
      data.auctionTypeId,
      data.endTime,
      data.decrementAmount,
      data.created_at,
      data.hasBeenSold,
    );

    this.listingItemRepository.createListingItem(listingItem);
  }

  async handleGetAllAuctionItemsForSeller(
    data: GetAuctionItemsForSellerMessage,
  ): Promise<GetAuctionItemsForSellerResponse> {
    const { sellerId } = data;

    const auctionItems = await this.auctionItemRepository.getAuctionItemsBySellerId(sellerId);

    return new GetAuctionItemsForSellerResponse(
      auctionItems,
      'Auction items retrieved successfully',
      STATUS.SUCCESS,
    );
  }

  async handleViewListingItems(data: ViewListingItemsMessage): Promise<ViewListingItemsResponse> {
    const { sellerId } = data;

    const listingItems = await this.listingItemRepository.getListingItemsBySellerId(sellerId);

    console.log('listingItems: ', listingItems);

    return new ViewListingItemsResponse(listingItems, 'Listing items retrieved successfully', STATUS.SUCCESS);
  }

  async handleViewListing(data: ViewListingMessage): Promise<ViewListingResponse> {
    const { sellerId } = data;

    const listingItems: ListingItem[] = (await this.handleViewListingItems(new ViewListingItemsMessage(sellerId)))
      .data;

    const auctionItems = (
      await this.handleGetAllAuctionItemsForSeller(new GetAuctionItemsForSellerMessage(sellerId))
    ).data;

    console.log('auctionItems: ', auctionItems);

    const viewListingItems: ViewListingItem[] = [];

    listingItems.forEach(async (item: ListingItem) => {
      const matchingItem = auctionItems.find((auctionItem) => auctionItem.itemId === item.id);

      const auctionType = { name: 'dutch' };
      // const auctionType = await this.auctionTypeRepository.getAuctionTypeById(item.auctionTypeId); // TODO: fix this
      const endTime = item.endTime;

      let status;

      // hasBeenSold -> status = sold
      // end time < current time -> status = expired
      // not matchingItem -> status = 'Draft'
      // matching -> status = ongoing

      console.log('auctionType: ', auctionType);

      if (item.hasBeenSold) {
        status = VIEW_LISTING_ITEM_STATUS.SOLD;
      } else if (endTime <= new Date()) {
        status = VIEW_LISTING_ITEM_STATUS.EXPIRED;
      } else if (!matchingItem) {
        status = VIEW_LISTING_ITEM_STATUS.DRAFT;
      } else {
        status = VIEW_LISTING_ITEM_STATUS.ONGOING;
      }

      const currentBidPrice = matchingItem ? matchingItem.currentBidPrice : item.startingBidPrice;

      const viewListingItem = new ViewListingItem(
        item.id,
        item.name,
        item.description,
        item.imageName,
        auctionType.name,
        status,
        endTime,
        currentBidPrice,
        item.imageUrl,
      );

      viewListingItems.push(viewListingItem);
    });
    console.log('viewListingItems: ', viewListingItems);
    return new ViewListingResponse(viewListingItems, 'Items successfully retrieved', STATUS.SUCCESS);
  }

  // async handleStartAuction(data: StartAuctionEvent) {
  //   const { itemId, sellerId, endTime, startingBidPrice, decrementAmount } = data;

  //   const itemExists = await new Promise<StartAuctionResponse>((resolve, reject) => {
  //     this.inventoryClient.send(START_AUCTION_MESSAGE_PATTERN, new StartAuctionMessage(itemId)).subscribe({
  //       next: (response) => {
  //         resolve(response);
  //       },
  //       error: (error) => {
  //         reject(error);
  //       },
  //     });
  //   });

  //   if (!itemExists) {
  //     return;
  //   }

  //   const isValidSeller = itemExists.item.sellerId === sellerId;

  //   if (!isValidSeller) {
  //     return;
  //   }

  //   const auctionItem = new AuctionItem(itemId, sellerId, endTime, startingBidPrice, startingBidPrice, decrementAmount);

  //   this.auctionItemRepository.createAuctionItem(auctionItem);
  // }

  async getCatalogItems(): Promise<CatalogItem[]> {
    const auctionItems = await this.auctionItemRepository.getAuctionItems();

    const activeItems = (
      await new Promise<GetAllActiveItemsResponse>((resolve, reject) => {
        this.inventoryClient.send(GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN, new GetAllActiveItemsMessage()).subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
      })
    ).data;

    const viewCatalogItems: CatalogItem[] = [];

    auctionItems.forEach((auctionItem) => {
      const matchingItem = activeItems.find((activeItem) => activeItem.id === auctionItem.itemId);

      // check if the auctionItem has expired
      if (auctionItem.endTime > new Date().getTime()) {
        const viewCatalogItem = new CatalogItem(
          auctionItem.itemId,
          matchingItem.name,
          matchingItem.description,
          matchingItem.imageName,
          matchingItem.auctionType,
          auctionItem.endTime,
          auctionItem.currentBidPrice,
          matchingItem.imageUrl,
        );

        viewCatalogItems.push(viewCatalogItem);
      }
    });

    return viewCatalogItems;
  }

  async handleViewCatalog(data: ViewCatalogMessage): Promise<ViewCatalogResponse> {
    const { userId } = data;

    const viewCatalogItems = await this.getCatalogItems();

    Logger.log(`User with id ${userId} requested to view catalog`);

    return new ViewCatalogResponse(viewCatalogItems, 'Catalog retrieved successfully', STATUS.SUCCESS);
  }

  getUniqueCatalogItems(searchResults: any[]): any[] {
    const uniqueItemIds = new Set<string>();
    const uniqueItems: any[] = [];

    for (const item of searchResults) {
      if (!uniqueItemIds.has(item.itemId)) {
        uniqueItemIds.add(item.itemId);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  }

  async handleSearchCatalog(data: SearchCatalogMessage): Promise<SearchCatalogResponse> {
    const searchkeyword = data.searchKeyword;

    // find if the keyword exists in the db and filter items

    const catalogItems = await this.getCatalogItems();

    const searchResultsKeyword = await this.auctionItemRepository.searchAuctionItems(searchkeyword);

    const searchResultsFilter = catalogItems.filter((item) => item.name.includes(searchkeyword));

    const searchResults = searchResultsKeyword.concat(searchResultsFilter);

    const uniqueItems = this.getUniqueCatalogItems(searchResults);

    const searchCatalogItems: CatalogItem[] = [];

    uniqueItems.forEach((item) => {
      if (item.endTime > new Date().getTime()) {
        const searchCatalogItem = new CatalogItem(
          item.itemId,
          item.name,
          item.description,
          item.image,
          item.auctionType,
          item.endTime,
          item.currentBidPrice,
        );
        searchCatalogItems.push(searchCatalogItem);
      }
    });

    return new SearchCatalogResponse(
      searchCatalogItems,
      `Catalog searched successfully for keyword: ${searchkeyword}`,
      STATUS.SUCCESS,
    );
  }
}
