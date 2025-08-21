import { addDays, sub } from "date-fns";
import type Pass from "./Pass";

export type UnPassType = Pass | undefined;
export type UnDateType = Date | undefined;

export default class FarePlanDetail {
  private date: Date;
  private totalAmountMap: Record<string, number> = {};
  private purchased: boolean = true;
  private static passMap: Record<string, Pass> = {};

  constructor(date: Date) {
    this.date = date;
  }

  public static setPassList(passList: Pass[]) {
    FarePlanDetail.passMap = passList.reduce((acc, pass) => {
      acc[pass.id] = pass;
      return acc;
    }, {} as Record<string, Pass>);
  }

  public getDate(): Date {
    return this.date;
  }

  public getPurchasedPass(): UnPassType {
    const purchasedPassId = this.getMinTotalAmount()?.passId;
    if (!purchasedPassId) {
      return undefined;
    }
    return FarePlanDetail.passMap[purchasedPassId];
  }

  public isPurchased(): boolean {
    return this.purchased;
  }

  public setPurchased(purchased: boolean) {
    this.purchased = purchased;
  }

  public addTotalAmount(amount: number, passId: string) {
    this.totalAmountMap[passId] = amount;
  }

  public copyTotalAmountMap(target: FarePlanDetail) {
    this.totalAmountMap = { ...target.totalAmountMap };
  }

  public getMinTotalAmount(): { passId: string; amount: number } | undefined {
    if (Object.keys(this.totalAmountMap).length === 0) {
      return undefined;
    }
    let minAmount = Infinity;
    let minPass = "";
    for (const [passId, amount] of Object.entries(this.totalAmountMap)) {
      if (amount < minAmount) {
        minAmount = amount;
        minPass = passId;
      }
    }
    return { passId: minPass, amount: minAmount };
  }

  // 購入したパスの開始日を取得
  // displayがtrueの場合は表示用のフォーマット(日+1)で返す
  public getPurchasedDate(display?: boolean): UnDateType {
    const purchasedPass = this.getPurchasedPass();
    if (!purchasedPass) {
      return undefined;
    }
    let purchasedDate = new Date(this.date);
    purchasedDate = sub(purchasedDate, { ...purchasedPass.duration });
    if (display) {
      purchasedDate = addDays(purchasedDate, 1); // 表示用に1日加算
    }
    return purchasedDate;
  }
}
