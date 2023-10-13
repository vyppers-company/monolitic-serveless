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
  owner?:
    | string
    | {
        profileImage: string;
        name: string;
        _id: string;
        arroba: string;
      };
  contents?: string[];
  likersId?: string[];
  payed?: boolean;
  canEdit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
