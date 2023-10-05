import { Injectable } from '@nestjs/common';
import { AuctionTypeRepository } from '../repositories/auction-type-repo/auction-type.repository';
import { ItemKeywordRepository } from '../repositories/item-keyword-repo/item-keyword.repository';
import { ItemRepository } from '../repositories/item-repo/item.repository';
import { KeywordRepository } from '../repositories/keyword-repo/keyword.repository';

@Injectable()
export class InventoryService {
  constructor(
    private auctionTypeRepository: AuctionTypeRepository,
    private itemKeywordRepository: ItemKeywordRepository,
    private itemRepository: ItemRepository,
    private keywordRepository: KeywordRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
