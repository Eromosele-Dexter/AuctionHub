import { Inject, Injectable, Logger } from '@nestjs/common';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { AuctionItemRepository } from '../repositories/auction-item-repo/auction-item.repository';
import {
  GET_AUCTION_TYPE_BY_NAME_MESSAGE_PATTERN,
  GET_AUCTION_TYPE_MESSAGE_PATTERN,
  INVENTORY_SERVICE,
  SEARCH_FOR_LISTING_ITEMS_ID_BY_KEYWORD_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { AuctionItem } from '../entities/auction-item.entity';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import { ViewCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-catalog.response';
import { STATUS, VIEW_LISTING_ITEM_STATUS } from '@app/shared-library/types';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import { SearchCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/search-catalog.response';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import { GetAuctionItemsForSellerResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-for-seller.response';
import { ListingItemRepository } from '../repositories/listing-item-repo/listing-item.repository';
import { ListingItem } from '../entities/listing-item.entity';
import ViewListingItemsMessage from '@app/shared-library/messages/view-listing-items.message';
import { ViewListingItemsResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-listing-items.response';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import { ViewListingResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-listing.response';
import { ViewListingItem } from '@app/shared-library/types/view-listing-item';
import { GetAuctionTypeResponse } from '@app/shared-library/api-contracts/inventory/responses/get-auction-type.response';
import GetAuctionTypeMessage from '@app/shared-library/messages/get-auction-type.message';
import CreateListingItemMessage from '@app/shared-library/messages/create-listing-item.message';
import { CreateListingItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/create-listing-item.response';
import { GetListingItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-listing-item.response';
import { SearchForListingItemsIdByKeywordResponse } from '@app/shared-library/api-contracts/inventory/responses/search-listing-items-id.response';
import SearchForListingItemsIdByKeywordMessage from '@app/shared-library/messages/search-for-listing-items-id-by-keyword.message';
import GetAuctionItemMessage from '@app/shared-library/messages/get-auction-item.message';
import { GetAuctionItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-item.response';
import PlaceForwardBidMessage from '@app/shared-library/messages/place-forward-bid.message';
import PlaceDutchBidMessage from '@app/shared-library/messages/place-dutch-bid.message';
import { PlaceBidResponse } from '@app/shared-library/api-contracts/auction-management/responses/place-bid.response';
import { SellAuctionItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/sell-auction-item.response';
import GetAuctionItemsByListingItemsIdsMessage from '@app/shared-library/messages/get-auction-items-by-listing-ids.message';
import { GetAuctionItemsByListingitemIdsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-by-listing-item-ids.response';
import { Cron } from '@nestjs/schedule';
import GetAuctionItemsByAuctionTypeMessage from '@app/shared-library/messages/get-auction-type-by-name.message';
import { GetAuctionTypeObjectResponse } from '@app/shared-library/api-contracts/inventory/responses/get-auction-type-object.response';
import { GetListingItemByIdResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-listing-item-by-id.response';
import GetListingItemByIdMessage from '@app/shared-library/messages/get-listing-item-by-id.message';

@Injectable()
export class AuctionManagementService {
  constructor(
    private auctionItemRepository: AuctionItemRepository,
    private listingItemRepository: ListingItemRepository,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
  ) {}

  async handleCreateListingItem(data: CreateListingItemMessage): Promise<CreateListingItemResponse> {
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

    const createdlistingItem = await this.listingItemRepository.createListingItem(listingItem);

    return new CreateListingItemResponse(createdlistingItem, 'Listing item created successfully', STATUS.SUCCESS);
  }

  async handleGetListingItem(data: CreateListingItemMessage): Promise<GetListingItemResponse> {
    const { name, seller_id } = data;

    const listingItem = await this.listingItemRepository.getListingItemByNameAndSellerId(name, seller_id);

    return new GetListingItemResponse(listingItem, 'Listing item retrieved successfully', STATUS.SUCCESS);
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

      let status: string;

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
      listingItem.name,
      listingItem.description,
      listingItem.decrement_amount,
    );

    this.auctionItemRepository.createAuctionItem(auctionItem);
  }

  // TODO: Need to include pagination in view catalog endpoint
  async handleViewCatalog(data: ViewCatalogMessage): Promise<ViewCatalogResponse> {
    const { userId } = data;

    const viewCatalogItems = await this.auctionItemRepository.getAuctionItems();

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

    const catalogItems = await this.auctionItemRepository.getAuctionItems();

    const listingItemIds = (
      await new Promise<SearchForListingItemsIdByKeywordResponse>((resolve, reject) => {
        this.inventoryClient
          .send(
            SEARCH_FOR_LISTING_ITEMS_ID_BY_KEYWORD_MESSAGE_PATTERN,
            new SearchForListingItemsIdByKeywordMessage(searchkeyword),
          )
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

    const searchResultsKeyword = catalogItems.filter((item) => listingItemIds.includes(item.listing_item_id));

    console.log('search by keyword: ', searchResultsKeyword);

    const searchResultsFilter = catalogItems.filter((item) => item.name.includes(searchkeyword));

    console.log('catalogItems: ', catalogItems);

    console.log('search by name: ', searchResultsFilter);

    const searchResults = searchResultsKeyword.concat(searchResultsFilter);

    const uniqueItems = this.getUniqueCatalogItems(searchResults);

    const searchCatalogItems: AuctionItem[] = [];

    uniqueItems.forEach((item) => {
      if (item.end_time > new Date().getTime()) {
        const searchCatalogItem = new AuctionItem(
          item.item_id,
          item.seller_id,
          item.end_time,
          item.starting_bid_price,
          item.current_bid_price,
          item.name,
          item.description,
          item.decrement_amount,
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

  async handleGetAuctionItem(data: GetAuctionItemMessage): Promise<GetAuctionItemResponse> {
    const { listing_item_id } = data;

    const listingItem = await this.listingItemRepository.getListingItemById(listing_item_id);

    const auctionItem = await this.auctionItemRepository.getAuctionItemByListingItemId(listing_item_id);

    return new GetAuctionItemResponse(
      { ...auctionItem, has_been_sold: listingItem.has_been_sold },
      'Auction item retrieved successfully',
      STATUS.SUCCESS,
    );
  }

  async handlePlaceForwardBidAuction(data: PlaceForwardBidMessage): Promise<PlaceBidResponse> {
    const { auction_item_id, bid_amount } = data;

    const auctionItem = await this.auctionItemRepository.getAuctionItemById(auction_item_id);

    const updatedAuctionItem = new AuctionItem(
      auctionItem.listing_item_id,
      auctionItem.seller_id,
      auctionItem.end_time,
      auctionItem.starting_bid_price,
      bid_amount,
      auctionItem.name,
      auctionItem.description,
      auctionItem.decrement_amount,
    );

    await this.auctionItemRepository.updateAuctionItemCurrentBidPrice(updatedAuctionItem);

    return new PlaceBidResponse(updatedAuctionItem, 'Bid placed successfully', STATUS.SUCCESS);
  }

  async handlePlaceDutchBidAuction(data: PlaceDutchBidMessage): Promise<PlaceBidResponse> {
    const { auction_item_id, listing_item_id } = data;

    const auctionItem = await this.auctionItemRepository.getAuctionItemById(auction_item_id);

    // delete auction item entry to indicate its no longer available
    await this.auctionItemRepository.deleteAuctionItem(auction_item_id);

    // call handle sell item
    await this.handleSellAuctionItem(listing_item_id);

    return new PlaceBidResponse(auctionItem, 'Bid placed successfully', STATUS.SUCCESS);
  }

  async handleSellAuctionItem(listing_item_id: number) {
    const listingItem = await this.listingItemRepository.getListingItemById(listing_item_id);

    const updatedListingItem = new ListingItem(
      listingItem.name,
      listingItem.item_id,
      listingItem.seller_id,
      listingItem.starting_bid_price,
      listingItem.description,
      listingItem.image_name,
      listingItem.image_url,
      listingItem.auction_type_id,
      listingItem.end_time,
      listingItem.decrement_amount,
      listingItem.created_at,
      true,
    );

    // has been sold should be updated

    await this.listingItemRepository.updateListingItemHasSold(updatedListingItem);

    // delete auction item entry to indicate its no longer available
    await this.auctionItemRepository.deleteAuctionItemByListingItemId(listing_item_id);

    return new SellAuctionItemResponse(updatedListingItem, 'Item sold successfully', STATUS.SUCCESS);
  }

  async handleGetAuctionItemsByListingItemsIds(
    data: GetAuctionItemsByListingItemsIdsMessage,
  ): Promise<GetAuctionItemsByListingitemIdsResponse> {
    const { listing_item_ids } = data;

    const auctionItems = await this.auctionItemRepository.getAuctionItemsByListingItemIds(listing_item_ids);

    return new GetAuctionItemsByListingitemIdsResponse(
      auctionItems,
      'Auction items retrieved successfully',
      STATUS.SUCCESS,
    );
  }

  async handleGetListingItemById(
    getListingItemByIdMessage: GetListingItemByIdMessage,
  ): Promise<GetListingItemByIdResponse> {
    const { listing_item_id } = getListingItemByIdMessage;

    const listingItem = await this.listingItemRepository.getListingItemById(listing_item_id);

    return new GetListingItemByIdResponse(listingItem, 'Listing item retrieved successfully', STATUS.SUCCESS);
  }

  @Cron('0 * * * *')
  async decrementPrice() {
    const auctionType = (
      await new Promise<GetAuctionTypeObjectResponse>((resolve, reject) => {
        this.inventoryClient
          .send(GET_AUCTION_TYPE_BY_NAME_MESSAGE_PATTERN, new GetAuctionItemsByAuctionTypeMessage('dutch'))
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

    const auctionTypeId = auctionType.id;

    const dutchAuctionItems = await this.auctionItemRepository.getAuctionItemsByAuctionTypeId(auctionTypeId);

    for (const item of dutchAuctionItems) {
      const decrement_amount = item.decrement_amount;

      const current_bid_price = item.current_bid_price;

      const reservePrice = 0.1 * item.starting_bid_price; // reserve price is 10% of starting bid price do not dcerement below reserve price

      const new_bid_price = current_bid_price - decrement_amount;

      const updatedAuctionItem = new AuctionItem(
        item.listing_item_id,
        item.seller_id,
        item.end_time,
        item.starting_bid_price,
        reservePrice > new_bid_price ? reservePrice : new_bid_price,
        item.name,
        item.description,
        item.decrement_amount,
      );

      await this.auctionItemRepository.updateAuctionItemCurrentBidPrice(updatedAuctionItem);
    }
  }
}
