import { startOfDay, sub, subDays } from "date-fns";
import FarePlanDetail, { type UnPassType } from "./FarePlanDetail";
import type Pass from "./Pass";

export default function fareCalculate(
  startDate: Date,
  endDate: Date,
  passes: Pass[],
  holidays: Set<string> // Dateの文字列表現をキーにしたSet
): FarePlanDetail[] {
  const result: FarePlanDetail[] = [];

  startDate = startOfDay(startDate);
  endDate = startOfDay(endDate);

  if (startDate > endDate) {
    return result;
  }

  if (passes.length === 0) {
    return result;
  }

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    result.push(new FarePlanDetail(new Date(currentDate)));
  }

  for (let i = 0; i < result.length; i++) {
    const date = result[i];
    const isHoliday = holidays.has(date.getDate().toDateString());
    if (isHoliday) {
      const prevAmount = i === 0 ? 0 : result[i - 1].getTotalAmount();
      date.setTotalAmount(prevAmount);
      continue;
    }

    const minAmountPass: { pass: UnPassType; amount: number } = {
      pass: undefined,
      amount: Infinity,
    };
    for (const pass of passes) {
      let prevDate = new Date(date.getDate());
      prevDate = sub(prevDate, { ...pass.duration });
      const prevFarePlanDetail = result.find(
        (r) => r.getDate().toDateString() === prevDate.toDateString()
      );
      const amount = (prevFarePlanDetail?.getTotalAmount() || 0) + pass.price;
      if (amount < minAmountPass.amount) {
        minAmountPass.pass = pass;
        minAmountPass.amount = amount;
      }
    }
    date.setPurchasedPass(minAmountPass.pass);
    date.setTotalAmount(minAmountPass.amount);
  }

  const resultMap: Record<string, FarePlanDetail> = result.reduce(
    (acc, detail) => {
      const key = detail.getDate().toString();
      acc[key] = detail;
      return acc;
    },
    {} as Record<string, FarePlanDetail>
  );

  let purchaseList: FarePlanDetail[] = [];
  for (let currentDate = new Date(endDate); currentDate >= startDate; ) {
    const purchasedDate = resultMap[currentDate.toString()];
    purchaseList.push(purchasedDate);
    currentDate = purchasedDate.getPurchasedDate() || subDays(currentDate, 1);
  }
  purchaseList = purchaseList
    .reverse()
    .filter((detail) => detail.getPurchasedPass() !== undefined)
    .map((detail) => detail);

  return purchaseList;
}

// テスト用
export function fareCalculateTest() {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-01-12");
  const passes = [
    { id: "pass1", duration: { years: 0, months: 0, days: 1 }, price: 500 },
    { id: "pass2", duration: { years: 0, months: 0, days: 2 }, price: 800 },
    { id: "pass3", duration: { years: 0, months: 0, days: 3 }, price: 1100 },
  ];
  const holidays = new Set(
    [
      new Date("2023-01-03"),
      new Date("2023-01-05"),
      new Date("2023-01-08"),
      new Date("2023-01-09"),
    ].map((date) => date.toDateString())
  );
  const farePlanDetails = fareCalculate(startDate, endDate, passes, holidays);
  console.log(
    farePlanDetails.map((detail) => {
      return {
        date: detail.getDate().toDateString(),
        pass: detail.getPurchasedPass()?.id,
        amount: detail.getTotalAmount(),
        purchasedDate: detail.getPurchasedDate(true)?.toDateString(),
      };
    })
  );
}
