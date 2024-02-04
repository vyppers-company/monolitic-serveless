import { IPlanEntity } from './plan';
import { IProfile } from './user.entity';

export interface IUploadContent {
  _id?: string;
  type: string;
  content: string;
  thumb?: string;
  blockedThumb?: string;
  preview?: string;
  shortContent?: string;
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
  productId?: string;
  isDeleted?: boolean;
}
export interface IContentEntityExtended extends IContentEntity {
  isFollowed: boolean;
  isSubscriptor: boolean;
}
