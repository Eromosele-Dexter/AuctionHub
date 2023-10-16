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
  async getAuctionItems(): Promise<AuctionItem[]> {
    return this.find();
  }
  async updateAuctionItem(auctionItem: AuctionItem) {
    this.dataSource.manager.query(
      `UPDATE auction_items SET end_time = '${auctionItem.endTime}', starting_bid_price = ${auctionItem.startingBidPrice}, current_bid_price = ${auctionItem.currentBidPrice}, decrement_amount = ${auctionItem.decrementAmount} WHERE id = ${auctionItem.id}`,
    );
    this.save(auctionItem);
  }

  async searchAuctionItems(keyword: string): Promise<any[]> {
    const searchItems = await this.dataSource.manager.query(`
    SELECT items.id, items.name, items.description, items.image, auction_types.name AS auction_type_name, auction_items.end_time, auction_items.current_bid_price
  FROM items
  INNER JOIN auction_items ON items.id = auction_items.item_id
  INNER JOIN item_keywords ON auction_items.item_id = item_keywords.item_id
  INNER JOIN keywords ON item_keywords.keyword_id = keywords.id
  INNER JOIN auction_types ON items.auction_type_id = auction_types.id
  WHERE keywords.name = '${keyword}';
    `);
    return searchItems;
  }
  async deleteAuctionItem(id: number): Promise<void> {
    this.delete(id);
  }
}
