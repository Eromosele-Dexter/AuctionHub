import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  CREATE_LISTING_EVENT_PATTERN,
  INVENTORY_SERVICE,
  START_AUCTION_EVENT_PATTERN,
  VIEW_LISTING_MESSAGE_PATTERN,
} from '@app/shared-library';
import { CreateListingRequest } from '@app/shared-library/api-contracts/inventory/requests';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { ViewListingResponse } from '@app/shared-library/api-contracts/inventory/responses/view-listing.response';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { StartAuctionRequest } from '@app/shared-library/api-contracts/auction-management/requests/start-auction.request';
import * as AWS from 'aws-sdk';

@Injectable()
export class SellerEventService {
  private readonly s3: AWS.S3;
  private readonly EXPIRATION_TIME = 604_800; // 7 days

  constructor(
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
  ) {
    this.s3 = new AWS.S3({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage(fileName: string, image: Buffer): Promise<string> {
    await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: image,
      })
      .promise();
    return await this.getimage_url(fileName);
  }

  async getimage_url(fileName: string) {
    const response = this.s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Expires: this.EXPIRATION_TIME, // expires in 7 days
    });
    return response;
  }

  async deleteImage(fileName: string) {
    this.s3.deleteObject(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
      },
      (err) => {
        if (err) {
          throw new HttpException(`Error deleting Image: ${err}`, HttpStatus.NOT_FOUND);
        }
      },
    );
  }

  async createListing(createListingRequest: CreateListingRequest) {
    const image_name = createListingRequest.image.originalname;
    const image_url = await this.uploadImage(image_name, createListingRequest.image.buffer);

    this.inventoryClient.emit(
      CREATE_LISTING_EVENT_PATTERN,
      new CreateListingEvent(
        createListingRequest.seller_id,
        createListingRequest.name,
        createListingRequest.description,
        image_name,
        image_url,
        new Date().getTime(),
        createListingRequest.auctionType,
        createListingRequest.keyword1,
        createListingRequest.keyword2,
        createListingRequest.keyword3,
        createListingRequest.starting_bid_price,
        createListingRequest.end_time,
        createListingRequest.decrement_amount,
      ),
    );
  }

  async viewListing(seller_id: number): Promise<ViewListingResponse> {
    const response = new Promise<ViewListingResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(VIEW_LISTING_MESSAGE_PATTERN, new ViewListingMessage(seller_id))
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    return response;
  }

  async startAuction(listing_item_id: number, seller_id: number) {
    this.auctionManagementClient.emit(
      START_AUCTION_EVENT_PATTERN,
      new StartAuctionEvent(listing_item_id, seller_id),
    );
  }
}
