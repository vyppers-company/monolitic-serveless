import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Content, ContentDocument } from '../model/content.schema';
import { IEditContentDto } from 'src/presentation/dtos/edit-content.dto';
import { ITypeContent } from 'src/domain/entity/contents';

@Injectable()
export class ContentRepository extends BaseAbstractRepository<ContentDocument> {
  constructor(
    @InjectModel(Content.name)
    private readonly content: BaseModel<ContentDocument>,
  ) {
    super(content);
  }
  async deleteMany(owner: string, type: ITypeContent) {
    await this.content.deleteMany({ owner, type });
  }

  async makeLike(contentId: string, likers: Content['likersId']) {
    await this.content.updateOne(
      { _id: contentId },
      {
        $set: {
          likersId: likers,
        },
      },
    );
  }

  async updateOne(dto: IEditContentDto) {
    await this.content.updateOne(
      { _id: dto.contentId, owner: dto.owner },
      {
        $set: {
          text: dto.text,
          plans: dto.plans || [],
        },
      },
    );
  }

  async aggregate(array: any[]) {
    return this.content.aggregate(array);
  }
}
