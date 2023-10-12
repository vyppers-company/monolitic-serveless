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
  owner?: string;
  contents?: string[];
  comments?: IComment[];
  giftersId?: string[];
  likersId?: string[];
  payed?: boolean;
  allowPreview?: boolean;
  allowComments?: boolean;
  canEdit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
