import { Injectable, Logger } from '@nestjs/common';
import { ItemKeyword } from '../../entities/item-keyword.entity';
import { IItemKeywordRepository } from './item-keyword.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ItemKeywordRepository extends Repository<ItemKeyword> implements IItemKeywordRepository {
  private readonly logger = new Logger(ItemKeywordRepository.name);

  constructor(private dataSource: DataSource) {
    super(ItemKeyword, dataSource.createEntityManager());
  }

  async createItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword> {
    this.dataSource.manager.create(ItemKeyword, itemKeyword);
    return this.save(itemKeyword);
  }

  getItemKeywordByListingItemAndKeywordId(listing_item_id: number, keywordId: number): Promise<ItemKeyword> {
    const itemKeyword = this.dataSource.manager.query(
      `SELECT * FROM item_keywords WHERE listing_item_id = ${listing_item_id} AND keyword_id = ${keywordId}`,
    );
    return itemKeyword[0];
  }

  async searchForListingItemsIdByKeyword(keyword: string): Promise<number[]> {
    const listingItemsIds = await this.dataSource.manager.query(
      `SELECT ik.listing_item_id
      FROM item_keywords ik
      JOIN keywords k ON ik.keyword_id = k.id
      WHERE k.name = '${keyword}'`,
    );

    const ids = listingItemsIds.map((item) => item.listing_item_id);

    return ids;
  }

  async getItemKeywords(): Promise<ItemKeyword[]> {
    throw new Error('Method not implemented.');
  }
  async updateItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword> {
    throw new Error('Method not implemented.');
  }
  async deleteItemKeyword(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getItemKeywordByitem_id(item_id: number): Promise<ItemKeyword> {
    throw new Error('Method not implemented.');
  }
}
