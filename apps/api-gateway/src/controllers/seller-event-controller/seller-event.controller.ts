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
} from '@nestjs/common';
import { Response } from 'express';
import { SellerEventService } from '../../services/seller-event.service';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { CreateListingRequest } from '@app/shared-library/api-contracts/inventory/requests';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileTypesPattern } from '../../utils/fileUtils';

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
      createListingRequest.image = image.buffer; // TODO: need to invoke aws s3 and just store image id or unique image name in postgres db
      createListingRequest.sellerId = req.user.id;

      this.sellerService.createListing(createListingRequest);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating listing', error });
    }
    return response.status(HttpStatus.OK).json({ message: 'Listing created successfully' });
  }

  // start an auction  // protected route
  // @UseGuards(AuthenticatedGuard)
  // @Post('/start-auction/:listingId')
  // async startAuction(@Body() startAuctionRequest: StartAuctionRequest, @Res() response: Response) {
  //   const data = await this.sellerService.createListing(startAuctionRequest);

  //   if (data?.error || !data) {
  //     return response.status(HttpStatus.BAD_REQUEST).json(data);
  //   }

  //   return response.status(HttpStatus.OK).json(data);
  // }

  // view item listing // protected route
}
