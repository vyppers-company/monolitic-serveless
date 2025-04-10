import { IPlanEntity } from './plan';
import { IProfile } from './user.entity';

export enum AuthorizedTypesMidia {
  VIDEO_EXTENSIONS = 'VIDEO',
  IMAGE_EXTENSIONS = 'IMAGE',
}

export interface ISingleProductOnContentDto {
  price: number;
}
export interface IUploadContent {
  _id?: string;
  extension?: string;
  type: AuthorizedTypesMidia;
  content: string;
  thumb?: string;
  blockedThumb?: string;
  product?: string | ISingleProductOnContentDto;
}

export enum ITypeContent {
  FEED = 'FEED',
  STORY = 'STORY',
  PROFILE = 'PROFILE',
  SHORTS = 'SHORT',
  DOCUMENT = 'DOCUMENT',
}

export interface IComment {
  _id: string;
  text: string;
  createdAt: Date;
}

export interface IProfileExtended2 extends IProfile {
  isVerfied?: boolean;
}
export interface IContentEntity {
  _id?: string;
  text?: string;
  type?: ITypeContent;
  owner?: string | IProfileExtended2;
  contents?: IUploadContent[];
  likersId?: string[];
  canEdit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  plans?: string[] | IPlanEntity[];
  product?: ISingleProductOnContentDto;
  productId?: string;
  isDeleted?: boolean;
}

export interface IContentEntityExtended extends IContentEntity {
  isFollowed: boolean;
  isSubscriptor: boolean;
  isBuyerSingleContent: boolean;
}
