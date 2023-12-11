import { ItemKeyword } from '../../../../../libs/shared-library/src/entities/inventory/item-keyword.entity';

export interface IItemKeywordRepository {
  createItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword>;
  getItemKeywordByListingItemAndKeywordId(item_id: number, keywordId: number): Promise<ItemKeyword>;
  getItemKeywords(): Promise<ItemKeyword[]>;
  updateItemKeyword(itemKeyword: ItemKeyword): Promise<ItemKeyword>;
  deleteItemKeyword(id: number): Promise<void>;
  getItemKeywordByitem_id(item_id: number): Promise<ItemKeyword>;
}
