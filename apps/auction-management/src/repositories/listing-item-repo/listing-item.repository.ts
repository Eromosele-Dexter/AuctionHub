import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListingItem } from '../../entities/listing-item.entity';
import { IListingItemRepository } from './listing-item.repository.interface';

@Injectable()
export class ListingItemRepository extends Repository<ListingItem> implements IListingItemRepository {
  constructor(private dataSource: DataSource) {
    super(ListingItem, dataSource.createEntityManager());
  }

  async createListingItem(listingItem: ListingItem): Promise<ListingItem> {
    this.dataSource.manager.create(ListingItem, listingItem);
    return this.save(listingItem);
  }

  async getListingItemById(id: number): Promise<ListingItem> {
    const listingItem = await this.dataSource.manager.query(`SELECT * FROM listing_items WHERE id = ${id}`);
    return listingItem[0];
  }

  async getListingItemsBySellerId(sellerId: number): Promise<ListingItem[]> {
    const listingItems = await this.dataSource.manager.query(
      `SELECT * FROM listing_items WHERE seller_id = ${sellerId}`,
    );
    return listingItems;
  }

  async getListingItems(): Promise<ListingItem[]> {
    return this.find();
  }

  async updateListingItem(listingItem: ListingItem) {
    this.dataSource.manager.query(
      `UPDATE listing_items SET name = '${listingItem.name}', starting_bid_price = '${listingItem.startingBidPrice}',
        description = '${listingItem.description}', image_name = '${listingItem.imageName}', image_url = '${listingItem.imageUrl}',
        auction_type_id = '${listingItem.auctionTypeId}', end_time = '${listingItem.endTime}', decrement_amount = '${listingItem.decrementAmount}',
        created_at = '${listingItem.created_at}' 
       WHERE id = ${listingItem.id}`,
    );
    this.save(listingItem);
  }

  async deleteListingItem(id: number): Promise<void> {
    this.delete(id);
  }
}
