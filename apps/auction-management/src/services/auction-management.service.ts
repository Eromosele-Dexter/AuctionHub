import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { AuctionItemRepository } from '../repositories/auction-item-repo/auction-item.repository';
import {
  GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN,
  GET_AUCTION_TYPE_MESSAGE_PATTERN,
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
import { GetAuctionTypeResponse } from '@app/shared-library/api-contracts/inventory/responses/get-auction-type.response';
import GetAuctionTypeMessage from '@app/shared-library/messages/get-auction-type.message';

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
      data.item_id,
      data.seller_id,
      data.starting_bid_price,
      data.description,
      data.image_name,
      data.image_url,
      data.auction_type_id,
      data.end_time,
      data.decrement_amount,
      data.created_at,
      data.has_been_sold,
    );

    this.listingItemRepository.createListingItem(listingItem);
  }

  async handleGetAllAuctionItemsForSeller(
    data: GetAuctionItemsForSellerMessage,
  ): Promise<GetAuctionItemsForSellerResponse> {
    const { seller_id } = data;

    const auctionItems = await this.auctionItemRepository.getAuctionItemsByseller_id(seller_id);

    return new GetAuctionItemsForSellerResponse(
      auctionItems,
      'Auction items retrieved successfully',
      STATUS.SUCCESS,
    );
  }

  async handleViewListingItems(data: ViewListingItemsMessage): Promise<ViewListingItemsResponse> {
    const { seller_id } = data;

    const listingItems = await this.listingItemRepository.getListingItemsByseller_id(seller_id);

    return new ViewListingItemsResponse(listingItems, 'Listing items retrieved successfully', STATUS.SUCCESS);
  }

  async handleViewListing(data: ViewListingMessage): Promise<ViewListingResponse> {
    const { seller_id } = data;

    const listingItems: ListingItem[] = (await this.handleViewListingItems(new ViewListingItemsMessage(seller_id)))
      .data;

    const auctionItems = (
      await this.handleGetAllAuctionItemsForSeller(new GetAuctionItemsForSellerMessage(seller_id))
    ).data;

    const viewListingItems: ViewListingItem[] = [];

    for (const listingItem of listingItems) {
      const matchingItem = auctionItems.find((auctionItem) => auctionItem.listing_item_id === listingItem.id);

      const auctionType = (
        await new Promise<GetAuctionTypeResponse>((resolve, reject) => {
          this.inventoryClient
            .send(GET_AUCTION_TYPE_MESSAGE_PATTERN, new GetAuctionTypeMessage(listingItem.auction_type_id))
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

      const end_time = listingItem.end_time;

      let status;

      // has_been_sold -> status = sold
      // end time < current time -> status = expired
      // not matchingItem -> status = 'Draft'
      // matching -> status = ongoing

      if (listingItem.has_been_sold) {
        status = VIEW_LISTING_ITEM_STATUS.SOLD;
      } else if (end_time <= new Date().getTime()) {
        status = VIEW_LISTING_ITEM_STATUS.EXPIRED;
      } else if (!matchingItem) {
        status = VIEW_LISTING_ITEM_STATUS.DRAFT;
      } else {
        status = VIEW_LISTING_ITEM_STATUS.ONGOING;
      }

      const current_bid_price = matchingItem ? matchingItem.current_bid_price : listingItem.starting_bid_price;

      const viewListingItem = new ViewListingItem(
        listingItem.id,
        listingItem.name,
        listingItem.description,
        listingItem.image_name,
        auctionType,
        status,
        end_time,
        current_bid_price,
        listingItem.image_url,
      );

      viewListingItems.push(viewListingItem);
    }
    return new ViewListingResponse(viewListingItems, 'Items successfully retrieved', STATUS.SUCCESS);
  }

  async handleStartAuction(data: StartAuctionEvent) {
    const { listing_item_id, seller_id } = data;

    const listingItem = await this.listingItemRepository.getListingItemById(listing_item_id);

    const isValidSeller = listingItem && listingItem.seller_id === seller_id;

    if (!isValidSeller) {
      return;
    }

    const auctionItem = new AuctionItem(
      listing_item_id,
      listingItem.seller_id,
      listingItem.end_time,
      listingItem.starting_bid_price,
      listingItem.starting_bid_price,
      listingItem.decrement_amount,
    );

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
    ).data;

    const viewCatalogItems: CatalogItem[] = [];

    auctionItems.forEach((auctionItem) => {
      const matchingItem = activeItems.find((activeItem) => activeItem.id === auctionItem.listing_item_id);

      // check if the auctionItem has expired
      if (auctionItem.end_time > new Date().getTime()) {
        const viewCatalogItem = new CatalogItem(
          auctionItem.listing_item_id,
          matchingItem.name,
          matchingItem.description,
          matchingItem.image_name,
          matchingItem.auctionType,
          auctionItem.end_time,
          auctionItem.current_bid_price,
          matchingItem.image_url,
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
    const uniqueitem_ids = new Set<string>();
    const uniqueItems: any[] = [];

    for (const item of searchResults) {
      if (!uniqueitem_ids.has(item.item_id)) {
        uniqueitem_ids.add(item.item_id);
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
      if (item.end_time > new Date().getTime()) {
        const searchCatalogItem = new CatalogItem(
          item.item_id,
          item.name,
          item.description,
          item.image,
          item.auctionType,
          item.end_time,
          item.current_bid_price,
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
