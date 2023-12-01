import { ICurrency } from './currency';
import { IProfile } from './user.entity';

export const percentageValues = [0.05, 0.1, 0.15, 0.2, 0.25];

export interface IPlanSubscribers {
  vypperSubscriptionId: string;
  paymentSubscriptionId?: string;
}
export interface IPlanEntity {
  _id?: string;
  owner?: string | IProfile;
  price: number;
  name: string;
  benefits: string[];
  currency?: ICurrency;
  activate: boolean;
  paymentPlanId?: string;
  subscribers?: IPlanSubscribers[];
  createdAt?: string;
  updatedAt?: string;
  isAnnual?: boolean;
  annualPercentage?: number;
}

export interface IPlanEntityExtendedResponse extends IPlanEntity {
  canEdit: boolean;
  annualPrice: number;
}
