import { subDays, subMonths, subYears } from "date-fns";
import FarePlanDetail, { type UnPassType } from "./FarePlanDetail";
import type Pass from "./Pass";

export default function fareCalculate(
  startDate: Date,
  endDate: Date,
  passes: Pass[],
  holidays: Set<string> // Dateの文字列表現をキーにしたSet
): FarePlanDetail[] {
  const result: FarePlanDetail[] = [];

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
      prevDate = subDays(prevDate, pass.duration.day);
      prevDate = subMonths(prevDate, pass.duration.month);
      prevDate = subYears(prevDate, pass.duration.year);
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

  return result;
}

// テスト用
export function calcTest() {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-01-12");
  const passes = [
    { id: "pass1", duration: { year: 0, month: 0, day: 1 }, price: 500 },
    { id: "pass2", duration: { year: 0, month: 0, day: 2 }, price: 800 },
    { id: "pass3", duration: { year: 0, month: 0, day: 3 }, price: 1100 },
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
        purchasedDate: detail.getPurchasedDate()?.toDateString(),
      };
    })
  );
}
