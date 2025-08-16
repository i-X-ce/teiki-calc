import { addDays, sub } from "date-fns";
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

  // 購入したパスの開始日を取得
  // displayがtrueの場合は表示用のフォーマット(日+1)で返す
  public getPurchasedDate(display?: boolean): UnDateType {
    if (!this.purchasedPass) {
      return undefined;
    }
    let purchasedDate = new Date(this.date);
    purchasedDate = sub(purchasedDate, { ...this.purchasedPass.duration });
    if (display) {
      purchasedDate = addDays(purchasedDate, 1); // 表示用に1日加算
    }
    return purchasedDate;
  }
}
