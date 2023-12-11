import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListingItem } from '../../../../../libs/shared-library/src/entities/auction-management/listing-item.entity';
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

  async getListingItemByItemId(item_id: number): Promise<ListingItem> {
    const listingItem = await this.dataSource.manager.query(
      `SELECT * FROM listing_items WHERE item_id = ${item_id}`,
    );
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

  async updateListingItem(listingItem: ListingItem, listing_item_id: number): Promise<ListingItem> {
    await this.dataSource.manager
      .createQueryBuilder()
      .update(ListingItem)
      .set({
        name: listingItem.name,
        item_id: listingItem.item_id,
        seller_id: listingItem.seller_id,
        starting_bid_price: listingItem.starting_bid_price,
        description: listingItem.description,
        image_name: listingItem.image_name,
        image_url: listingItem.image_url,
        auction_type_id: listingItem.auction_type_id,
        end_time: listingItem.end_time,
        decrement_amount: listingItem.decrement_amount,
        created_at: listingItem.created_at,
        has_been_sold: listingItem.has_been_sold,
      })
      .where('id = :id', { id: listing_item_id })
      .execute();

    return this.dataSource.manager.findOne(ListingItem, { where: { id: listing_item_id } });
  }

  async updateListingItemHasSold(listingItem: ListingItem, listing_item_id: number) {
    this.dataSource.manager.query(
      `UPDATE listing_items SET has_been_sold = '${listingItem.has_been_sold}' WHERE id = ${listing_item_id}`,
    );
  }

  async deleteListingItem(id: number): Promise<void> {
    this.delete(id);
  }
}
