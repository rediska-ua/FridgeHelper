import {Product} from "../../shared-module/types/product";
import {Month} from "./month";

export interface AnalyticsPerMonth {
  userId: string;
  month: Month;
  moneySpent: number;
  productBought: Product[];
}
