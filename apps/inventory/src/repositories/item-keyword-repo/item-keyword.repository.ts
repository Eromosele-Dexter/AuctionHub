import { Injectable, Logger } from '@nestjs/common';
import { ItemKeyword } from '../../entities/item-keyword.entity';
import { IItemKeywordRepository } from './item-keyword.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ItemKeywordRepository
  extends Repository<ItemKeyword>
  implements IItemKeywordRepository
{
  private readonly logger = new Logger(ItemKeywordRepository.name);

  constructor(private dataSource: DataSource) {
    super(ItemKeyword, dataSource.createEntityManager());
  }

  async createItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword> {
    throw new Error('Method not implemented.');
  }
  async getItemKeywordById(id: number): Promise<ItemKeyword> {
    throw new Error('Method not implemented.');
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
