import {Product} from "../../shared-module/types/product";

export interface AnalyticsDay {
  userId: string;
  day: Date;
  moneySpent: number;
  productBought: Product[];
}
