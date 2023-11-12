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

  async getItemByNameAndseller_id(itemName: string, userId: number): Promise<Item> {
    const item = await this.dataSource.manager.query(`SELECT * FROM items WHERE name = $1 AND seller_id = $2`, [
      itemName,
      userId,
    ]);
    return item[0];
  }

  async getItemsByseller_id(userId: number): Promise<Item[]> {
    const items = await this.dataSource.manager.query(`SELECT * FROM items WHERE seller_id = $1`, [userId]);
    return items;
  }

  async getItemById(id: number): Promise<Item> {
    const item = await this.dataSource.manager.query(`SELECT * FROM items WHERE id = ${id}`);
    return item[0];
  }
  async getItems(): Promise<Item[]> {
    return this.find();
  }
  async updateItem(item: Item) {
    this.dataSource.manager.query(
      `UPDATE items SET name = '${item.name}', description = '${item.description}', image_name = '${item.image_name}', auction_type_id = ${item.auction_type_id}, image_url = '${item.image_url}' WHERE id = ${item.id}`,
    );
    this.save(item);
  }

  async deleteItem(id: number): Promise<void> {
    this.delete(id);
  }

  async getAllActiveItems(): Promise<Item[]> {
    const items = await this.dataSource.manager.query(`SELECT * FROM items WHERE has_been_sold = false`);
    return items;
  }
}
