import { ItemKeyword } from '../../entities/item-keyword.entity';

export interface IItemKeywordRepository {
  createItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword>;
  getItemKeywordByItemIdAndKeywordId(itemId: number, keywordId: number): Promise<ItemKeyword>;
  getItemKeywords(): Promise<ItemKeyword[]>;
  updateItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword>;
  deleteItemKeyword(id: number): Promise<void>;
  getItemKeywordByItemId(itemId: number): Promise<ItemKeyword>;
}
