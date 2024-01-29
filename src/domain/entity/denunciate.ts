import { IProfile } from './user.entity';

export enum IDenuncianteReasons {
  CONTEUDO = 'Contéudo Inapropriado',
  ASSEDIO = 'Assédio ou Bullying',
  SPAM = 'Spam',
  INFORMACAO_FALSA = 'Informação Falsa ou Enganosa',
  DISCURSO_ODIO = 'Discurso de Ódio',
  DIREITOS_AUTORIAIS = 'Violação de Direitos Autorais',
  CONTEUDO_GRAFICO = 'Conteúdo Gráfico ou Chocante',
  EXPLORACAO_ABUSO = 'Exploração ou Abuso',
}

export enum IStatusDenunciate {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}

export interface IDenunciate {
  _id?: string;

  complainant: string;
  reported: string | IProfile;
  contentId: string;
  reason: string;

  reviewedBy?: string;
  decisionToBanUser?: boolean;
  decisionToBanContent?: boolean;
  decisionReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
