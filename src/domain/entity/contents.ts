export enum ITypeContent {
  FEED = 'FEED',
  STORY = 'STORY',
  PROFILE = 'PROFILE',
  SHORTS = 'SHORT',
}

export interface IComment {
  owner: string;
  text: string;
}

export interface IContentEntity {
  text?: string;
  type?: ITypeContent;
  owner?: string;
  contents?: string[];
  comments?: IComment[];
  gifters?: string[];
  likersId?: string[];
  settings?: Record<string, any>;
  canEdit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
