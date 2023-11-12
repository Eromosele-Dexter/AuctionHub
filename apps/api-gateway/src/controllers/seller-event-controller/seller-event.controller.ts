import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { SellerEventService } from '../../services/seller-event.service';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { CreateListingRequest } from '@app/shared-library/api-contracts/inventory/requests';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileTypesPattern } from '../../utils/fileUtils';
import { StartAuctionRequest } from '@app/shared-library/api-contracts/auction-management/requests/start-auction.request';
import * as fs from 'fs';

@Controller()
export class SellerEventController {
  constructor(private readonly sellerService: SellerEventService) {}

  // create a listing  - inventory service

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/create-listing')
  async createListing(
    @Request() req,
    @Body() createListingRequest: CreateListingRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: fileTypesPattern }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      createListingRequest.image = image;
      createListingRequest.seller_id = req.user.id;

      this.sellerService.createListing(createListingRequest);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating listing', error });
    }
    return response.status(HttpStatus.OK).json({ message: 'Listing created successfully' });
  }

  // start an auction - auction management service

  @UseGuards(AuthenticatedGuard)
  @Post('/start-auction/:listingItemId')
  async startAuction(@Param('listingItemId') listing_item_id, @Request() req, @Res() response: Response) {
    try {
      const seller_id = req.user.id;
      this.sellerService.startAuction(listing_item_id, seller_id);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Error starting auction for item with id: ${listing_item_id}`, error });
    }
    return response
      .status(HttpStatus.OK)
      .json({ message: `Auction started for item with id: ${listing_item_id} successfully` });
  }

  // view item listing - inventory service

  @UseGuards(AuthenticatedGuard)
  @Get('/view-listing')
  async viewListing(@Request() req, @Res() response: Response) {
    const data = await this.sellerService.viewListing(req.user.id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload-image')
  async uploadImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: fileTypesPattern }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const image_url = await this.sellerService.uploadImage(image.originalname, image.buffer);

      response
        .status(HttpStatus.CREATED)
        .json({ message: 'Uploaded image successfully', imageUploadUrl: image_url, errror: null });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error uploading image', error });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/download-image/:image')
  async downloadImage(@Param('image') imageKey, @Request() req, @Res() response: Response) {
    try {
      if (!imageKey) {
        throw new NotFoundException('Image not found');
      }

      const image_url = await this.sellerService.getimage_url(imageKey);

      return response.status(HttpStatus.OK).json({ message: 'Retrieved image url successfully', url: image_url });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving image', error });
    }
  }
  // TODO: when getting the image url in the for loop, check if the url is expiring in less than 1 day, if so, get a new url and also store it the db
  @UseGuards(AuthenticatedGuard)
  @Post('/delete-image/:image')
  async deleteImage(@Param('image') imageKey, @Request() req, @Res() response: Response) {
    try {
      await this.sellerService.deleteImage(imageKey);

      return response.status(HttpStatus.OK).json({ message: 'Deleted image successfully' });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting image', error });
    }
  }
}
