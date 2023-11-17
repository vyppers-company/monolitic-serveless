import { ICurrency } from './currency';

export interface IPlanSubscribers {
  vypperSubscriptionId: string;
  paymentSubscriptionId?: string;
}
export interface IPlanEntity {
  _id?: string;
  owner?: string;
  price: number;
  name: string;
  benefits: string[];
  currency?: ICurrency;
  activate: boolean;
  paymentPlanId?: string;
  subscribers?: IPlanSubscribers[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPlanEntityExtendedResponse extends IPlanEntity {
  canEdit: boolean;
}
