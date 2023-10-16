import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { AuctionItemRepository } from '../repositories/auction-item-repo/auction-item.repository';
import {
  GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN,
  INVENTORY_SERVICE,
  START_AUCTION_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientKafka } from '@nestjs/microservices';
import { StartAuctionResponse } from '@app/shared-library/api-contracts/auction-management/responses/start-auction.response';
import { AuctionItem } from '../entities/auction-item.entity';
import StartAuctionMessage from '@app/shared-library/messages/start-auction.message';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import { ViewCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-catalog.response';
import { CatalogItem } from '@app/shared-library/types/view-catalog-item';
import { GetAllActiveItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-all-active-items.response';
import GetAllActiveItemsMessage from '@app/shared-library/messages/get-all-items.message';
import { STATUS } from '@app/shared-library/types';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import { SearchCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/search-catalog.response';

@Injectable()
export class AuctionManagementService implements OnModuleInit {
  constructor(
    private auctionItemRepository: AuctionItemRepository,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.inventoryClient.subscribeToResponseOf(START_AUCTION_MESSAGE_PATTERN);
    this.inventoryClient.subscribeToResponseOf(GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN);
    await this.inventoryClient.connect();
  }

  async handleStartAuction(data: StartAuctionEvent) {
    const { itemId, sellerId, endTime, startingBidPrice, decrementAmount } = data;

    const itemExists = await new Promise<StartAuctionResponse>((resolve, reject) => {
      this.inventoryClient.send(START_AUCTION_MESSAGE_PATTERN, new StartAuctionMessage(itemId)).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });

    if (!itemExists) {
      return;
    }

    const isValidSeller = itemExists.item.sellerId === sellerId;

    if (!isValidSeller) {
      return;
    }

    const auctionItem = new AuctionItem(itemId, endTime, startingBidPrice, startingBidPrice, decrementAmount);

    this.auctionItemRepository.createAuctionItem(auctionItem);
  }

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
    ).activeItems;

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
