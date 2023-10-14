import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IItemRepository } from './item.repository.interface';
import { Item } from '../../entities/item.entity';

@Injectable()
export class ItemRepository extends Repository<Item> implements IItemRepository {
  private readonly logger = new Logger(ItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async createItem(item: Item): Promise<Item> {
    this.dataSource.manager.create(Item, item);
    return this.save(item);
  }

  async getItemByNameAndSellerId(itemName: string, userId: number): Promise<Item> {
    const item = await this.dataSource.manager.query(`SELECT * FROM items WHERE name = $1 AND seller_id = $2`, [
      itemName,
      userId,
    ]);
    return item[0];
  }

  getItemsByUserId(userId: number): Promise<Item[]> {
    throw new Error('Method not implemented.');
  }

  async getItemById(id: number): Promise<Item> {
    throw new Error('Method not implemented.');
  }
  async getItems(): Promise<Item[]> {
    throw new Error('Method not implemented.');
  }
  async updateItem(item: Item) {
    this.dataSource.manager.query(
      `UPDATE items SET name = '${item.name}', description = '${item.description}', image = '${item.image}', auction_type_id = ${item.auctionTypeId} WHERE id = ${item.id}`,
    );
    this.save(item);
  }

  async deleteItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
