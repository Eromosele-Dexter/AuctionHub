import { Injectable } from '@nestjs/common';
import { AuctionTypeRepository } from '../repositories/auction-type-repo/auction-type.repository';
import { ItemKeywordRepository } from '../repositories/item-keyword-repo/item-keyword.repository';
import { ItemRepository } from '../repositories/item-repo/item.repository';
import { KeywordRepository } from '../repositories/keyword-repo/keyword.repository';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { Item } from '../entities/item.entity';
import { Keyword } from '../entities/keyword.entity';
import { ItemKeyword } from '../entities/item-keyword.entity';

@Injectable()
export class InventoryService {
  constructor(
    private auctionTypeRepository: AuctionTypeRepository,
    private itemKeywordRepository: ItemKeywordRepository,
    private itemRepository: ItemRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  async handleCreateListing(data: CreateListingEvent) {
    const auctionTypeByName = data.auctionType.toUpperCase();
    const auctionType = await this.auctionTypeRepository.getAuctionTypeByName(auctionTypeByName);

    const auctionTypeId = auctionType.id;

    const item = new Item(data.sellerId, data.name, data.description, data.image, data.createdAt, auctionTypeId);

    // dont create item if the seller already has an item with the same name
    const existingItem = await this.itemRepository.getItemByNameAndSellerId(item.name, item.sellerId);

    if (existingItem) {
      item.id = existingItem.id;

      await this.itemRepository.updateItem(item);
    } else {
      // // create item
      await this.itemRepository.createItem(item);
    }

    const createdItem = await this.itemRepository.getItemByNameAndSellerId(item.name, item.sellerId);

    const itemId = createdItem.id;

    const keyword1 = new Keyword(data.keyword1.toLowerCase());
    const keyword2 = new Keyword(data.keyword2.toLowerCase());
    const keyword3 = new Keyword(data.keyword3.toLowerCase());

    const existingKeyword1 = await this.keywordRepository.getKeywordByName(keyword1.name);
    const existingKeyword2 = await this.keywordRepository.getKeywordByName(keyword2.name);
    const existingKeyword3 = await this.keywordRepository.getKeywordByName(keyword3.name);

    // create keywords if they dont exist and associate them with the item

    if (!existingKeyword1) {
      await this.keywordRepository.createKeyword(keyword1);

      const createdKeyword1 = await this.keywordRepository.getKeywordByName(keyword1.name);

      const keywordId1 = createdKeyword1.id;

      const ItemKeyword1 = new ItemKeyword(itemId, keywordId1);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword1);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword1.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword1.id));
      }
    }

    if (!existingKeyword2) {
      await this.keywordRepository.createKeyword(keyword2);

      const createdKeyword2 = await this.keywordRepository.getKeywordByName(keyword2.name);

      const keywordId2 = createdKeyword2.id;

      const ItemKeyword2 = new ItemKeyword(itemId, keywordId2);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword2);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword2.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword2.id));
      }
    }

    if (!existingKeyword3) {
      await this.keywordRepository.createKeyword(keyword3);

      const createdKeyword3 = await this.keywordRepository.getKeywordByName(keyword3.name);

      const keywordId3 = createdKeyword3.id;

      const ItemKeyword3 = new ItemKeyword(itemId, keywordId3);

      this.itemKeywordRepository.createItemKeyword(ItemKeyword3);
    } else {
      // if keyword already exists, associate it with the item
      const itemKeywordExists = await this.itemKeywordRepository.getItemKeywordByItemIdAndKeywordId(
        itemId,
        existingKeyword3.id,
      );

      if (!itemKeywordExists) {
        this.itemKeywordRepository.createItemKeyword(new ItemKeyword(itemId, existingKeyword3.id));
      }
    }
  }
}
