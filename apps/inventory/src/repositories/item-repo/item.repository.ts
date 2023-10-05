import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IItemRepository } from './item.repository.interface';
import { Item } from '../../entities/item.entity';

@Injectable()
export class ItemRepository
  extends Repository<Item>
  implements IItemRepository
{
  private readonly logger = new Logger(ItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  getItemsByUserId(userId: number): Promise<Item[]> {
    throw new Error('Method not implemented.');
  }
  async createItem(item: Item): Promise<Item> {
    throw new Error('Method not implemented.');
  }
  async getItemById(id: number): Promise<Item> {
    throw new Error('Method not implemented.');
  }
  async getItems(): Promise<Item[]> {
    throw new Error('Method not implemented.');
  }
  async updateItem(item: Item): Promise<Item> {
    throw new Error('Method not implemented.');
  }
  async deleteItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
