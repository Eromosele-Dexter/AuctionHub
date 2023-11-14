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

  async getListingItemByNameAndSellerId(name: string, seller_id: number): Promise<ListingItem> {
    const listingItem = await this.dataSource.manager.query(
      `SELECT * FROM listing_items WHERE name = $1 AND seller_id = $2`,
      [name, seller_id],
    );
    return listingItem[0];
  }

  async getListingItemById(id: number): Promise<ListingItem> {
    const listingItem = await this.dataSource.manager.query(`SELECT * FROM listing_items WHERE id = ${id}`);
    return listingItem[0];
  }

  async getListingItemsByseller_id(seller_id: number): Promise<ListingItem[]> {
    const listingItems = await this.dataSource.manager.query(
      `SELECT * FROM listing_items WHERE seller_id = ${seller_id}`,
    );
    return listingItems;
  }

  async getListingItems(): Promise<ListingItem[]> {
    return this.find();
  }

  async updateListingItem(listingItem: ListingItem) {
    this.dataSource.manager.query(
      `UPDATE listing_items SET name = '${listingItem.name}', starting_bid_price = '${listingItem.starting_bid_price}',
        description = '${listingItem.description}', image_name = '${listingItem.image_name}', image_url = '${listingItem.image_url}',
        auction_type_id = '${listingItem.auction_type_id}', end_time = '${listingItem.end_time}', decrement_amount = '${listingItem.decrement_amount}',
        created_at = '${listingItem.created_at}' 
       WHERE id = ${listingItem.id}`,
    );
    this.save(listingItem);
  }

  async updateListingItemHasSold(listingItem: ListingItem) {
    this.dataSource.manager.query(
      `UPDATE listing_items SET has_been_sold = '${listingItem.has_been_sold}' WHERE id = ${listingItem.id}`,
    );
    this.save(listingItem);
  }

  async deleteListingItem(id: number): Promise<void> {
    this.delete(id);
  }
}
