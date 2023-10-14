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

  getItemKeywordByItemIdAndKeywordId(itemId: number, keywordId: number): Promise<ItemKeyword> {
    const itemKeyword = this.dataSource.manager.query(
      `SELECT * FROM item_keywords WHERE item_id = ${itemId} AND keyword_id = ${keywordId}`,
    );
    return itemKeyword[0];
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
  async getItemKeywordByItemId(itemId: number): Promise<ItemKeyword> {
    throw new Error('Method not implemented.');
  }
}
