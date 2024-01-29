import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IDenunciate, IStatusDenunciate } from 'src/domain/entity/denunciate';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type DenunciateDocument = Document & Denunciate;

@Schema({
  collection: environment.mongodb.collections.denunciate,
  timestamps: { currentTime: correctDateNow },
})
export class Denunciate extends Document implements IDenunciate {
  _id?: string;

  @Prop()
  contentId: string;

  @Prop()
  complainant: string;

  @Prop()
  reported: string;

  @Prop()
  reason: string;

  @Prop({ default: null })
  decisionReason?: string;

  @Prop({ default: false })
  decisionToBanUser?: boolean;

  @Prop({ default: false })
  excludeContent?: true;

  @Prop({ enum: IStatusDenunciate, default: IStatusDenunciate.OPENED })
  status?: IStatusDenunciate;

  @Prop({ default: null })
  reviewedBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const denunciateSchema = SchemaFactory.createForClass(Denunciate);
