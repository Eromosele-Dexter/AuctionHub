import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IAuctionItemRepository } from './auction-item.repository.interface';
import { AuctionItem } from '../../entities/auction-item.entity';

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
    this.save(auctionItem);
  }

  // async searchAuctionItems(keyword: string): Promise<any[]> {
  //   const searchItems = await this.dataSource.manager.query(`
  //   SELECT auction_items.id, auction_items.name, auction_items.description, auction_items.image, auction_types.name AS auction_type_name, auction_items.end_time, auction_items.current_bid_price
  // FROM auction_items
  // INNER JOIN item_keywords ON auction_items.listing_item_id = item_keywords.listing_item_id
  // INNER JOIN keywords ON item_keywords.keyword_id = keywords.id
  // WHERE keywords.name = '${keyword}';
  //   `);
  //   return searchItems;
  // }

  async deleteAuctionItem(id: number): Promise<void> {
    this.delete(id);
  }
}
