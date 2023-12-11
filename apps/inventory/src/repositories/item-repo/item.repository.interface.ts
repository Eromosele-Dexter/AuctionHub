import { Item } from '../../../../../libs/shared-library/src/entities/inventory/item.entity';

export interface IItemRepository {
  createItem(item: Item): Promise<Item>;
  getItemById(id: number): Promise<Item>;
  getItems(): Promise<Item[]>;
  updateItem(item: Item);
  deleteItem(id: number): Promise<void>;
  getItemByNameAndseller_id(itemName: string, userId: number): Promise<Item>;
}
