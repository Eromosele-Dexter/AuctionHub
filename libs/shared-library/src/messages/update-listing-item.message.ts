import { ListingItem } from '@app/shared-library/entities/auction-management/listing-item.entity';

class UpdateListingItemMessage {
  constructor(
    public readonly listing_item: ListingItem,
    public readonly listing_item_id: number,
  ) {}

  toString() {
    return JSON.stringify({
      listing_item: this.listing_item,
      listing_item_id: this.listing_item_id,
    });
  }
}

export default UpdateListingItemMessage;
