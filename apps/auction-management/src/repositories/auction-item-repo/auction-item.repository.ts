import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IAuctionItemRepository } from './auction-item.repository.interface';
import { AuctionItem } from '../../../../../libs/shared-library/src/entities/auction-management/auction-item.entity';

@Injectable()
export class AuctionItemRepository extends Repository<AuctionItem> implements IAuctionItemRepository {
  private readonly logger = new Logger(AuctionItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionItem, dataSource.createEntityManager());
  }

  async createAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem> {
    this.dataSource.manager.create(AuctionItem, auctionItem);
    return this.save(auctionItem);
  }

  async getAuctionItemById(id: number): Promise<AuctionItem> {
    const auctionItem = await this.dataSource.manager.query(`SELECT * FROM auction_items WHERE id = ${id}`);
    return auctionItem[0];
  }

  async getAuctionItemByListingItemId(listing_item_id: number): Promise<AuctionItem> {
    const auctionItem = await this.dataSource.manager.query(
      `SELECT * FROM auction_items WHERE listing_item_id = ${listing_item_id}`,
    );
    return auctionItem[0];
  }

  async getAuctionItems(): Promise<AuctionItem[]> {
    return await this.find();
  }

  async getAuctionItemsByseller_id(seller_id: number): Promise<AuctionItem[]> {
    return this.dataSource.manager.query(`SELECT * FROM auction_items WHERE seller_id = ${seller_id}`);
  }

  async updateAuctionItem(auctionItem: AuctionItem) {
    this.dataSource.manager.query(
      `UPDATE auction_items SET end_time = '${auctionItem.end_time}', starting_bid_price = ${auctionItem.starting_bid_price}, current_bid_price = ${auctionItem.current_bid_price}, decrement_amount = ${auctionItem.decrement_amount} WHERE id = ${auctionItem.id}`,
    );
  }

  async updateAuctionItemCurrentBidPrice(auctionItem: AuctionItem, auction_item_id: number) {
    this.dataSource.manager.query(
      `UPDATE auction_items SET current_bid_price = ${auctionItem.current_bid_price} WHERE id = ${auction_item_id}`,
    );
  }

  async getAuctionItemsByListingItemIds(listing_item_ids: number[]): Promise<AuctionItem[]> {
    if (listing_item_ids.length === 0) {
      return [];
    }

    const auctionItems = await this.dataSource.manager.query(
      `SELECT * FROM auction_items WHERE listing_item_id IN (${listing_item_ids})`,
    );
    return auctionItems;
  }

  async deleteAuctionItem(id: number): Promise<void> {
    this.delete(id);
  }

  async deleteAuctionItemByListingItemId(listing_item_id: number) {
    this.dataSource.manager.query(`DELETE FROM auction_items WHERE listing_item_id = ${listing_item_id}`);
  }

  async getAuctionItemsByAuctionTypeId(auctionTypeId: number): Promise<AuctionItem[]> {
    const auctionItems = await this.dataSource.manager.query(
      `SELECT * FROM auction_items WHERE auction_type_id = ${auctionTypeId}`,
    );
    return auctionItems;
  }
}
