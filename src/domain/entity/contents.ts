import { IPlanEntity } from './plan';
import { IProfile } from './user.entity';

export enum ITypeContent {
  FEED = 'FEED',
  STORY = 'STORY',
  PROFILE = 'PROFILE',
  SHORTS = 'SHORT',
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
  contents?: string[];
  likersId?: string[];
  canEdit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  plans?: string[] | IPlanEntity[];
  productId?: string;
}
export interface IContentEntityExtended extends IContentEntity {
  isFollowed: boolean;
  isSubscriptor: boolean;
}
