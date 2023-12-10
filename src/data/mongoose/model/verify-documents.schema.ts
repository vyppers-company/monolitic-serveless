import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IConfirmationData,
  IDocumentData,
  IVerificationStatus,
  IVerifyDocuments,
} from 'src/domain/entity/verify-documents';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type VerifyDocumentsDocument = VerifyDocuments & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.verifyDocuments,
})
export class VerifyDocuments extends Document implements IVerifyDocuments {
  _id?: string;

  @Prop()
  owner: string;
  @Prop({ type: Object, default: null })
  documents: IDocumentData;
  @Prop({ default: false })
  isValid: boolean;
  @Prop()
  status: IVerificationStatus;
  @Prop({ type: Object, default: null })
  documentConfirmation?: IConfirmationData;
  @Prop({ default: null })
  verifiedBy?: string;
  @Prop({ default: null })
  reason?: string;

  createdAt?: string;
  updatedAt?: string;
}

export const VerifiDocumentsSchema =
  SchemaFactory.createForClass(VerifyDocuments);
