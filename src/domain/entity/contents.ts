import { IPlanEntity } from './plan';
import { IProfile } from './user.entity';

export enum AuthorizedTypesMidia {
  VIDEO_EXTENSIONS = 'VIDEO',
  IMAGE_EXTENSIONS = 'IMAGE',
}

export interface ISingleProductOnContentDto {
  activated?: boolean;
  benefits: string[];
  description: string;
  limit?: number;
  price: number;
}
export interface IUploadContent {
  _id?: string;
  extension?: string;
  type: AuthorizedTypesMidia;
  content: string;
  thumb?: string;
  blockedThumb?: string;
  preview?: string;
  shortContent?: string;
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

export interface IContentEntity {
  _id?: string;
  text?: string;
  type?: ITypeContent;
  owner?: string | IProfile;
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
}
