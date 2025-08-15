import { subDays, subMonths, subYears } from "date-fns";
import type Pass from "./Pass";

export type UnPassType = Pass | undefined;
export type UnDateType = Date | undefined;

export default class FarePlanDetail {
  private date: Date;
  private purchasedPass: UnPassType;
  private totalAmount: number;

  constructor(
    date: Date,
    purchasedPass: UnPassType = undefined,
    totalAmount: number = 0
  ) {
    this.date = date;
    this.purchasedPass = purchasedPass;
    this.totalAmount = totalAmount;
  }

  public getDate(): Date {
    return this.date;
  }

  public getPurchasedPass(): UnPassType {
    return this.purchasedPass;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public setPurchasedPass(purchasedPassId: UnPassType): void {
    this.purchasedPass = purchasedPassId;
  }

  public setTotalAmount(totalAmount: number): void {
    this.totalAmount = totalAmount;
  }

  public getPurchasedDate(): UnDateType {
    if (!this.purchasedPass) {
      return undefined;
    }
    let purchasedDate = new Date(this.date);
    purchasedDate = subDays(purchasedDate, this.purchasedPass.duration.day);
    purchasedDate = subMonths(purchasedDate, this.purchasedPass.duration.month);
    purchasedDate = subYears(purchasedDate, this.purchasedPass.duration.year);
    return purchasedDate;
  }
}
