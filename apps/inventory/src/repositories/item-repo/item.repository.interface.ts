import { Item } from '../../entities/item.entity';

export interface IItemRepository {
  createItem(item: Item): Promise<Item>;
  getItemById(id: number): Promise<Item>;
  getItems(): Promise<Item[]>;
  updateItem(item: Item);
  deleteItem(id: number): Promise<void>;
  getItemByNameAndSellerId(itemName: string, userId: number): Promise<Item>;
}
