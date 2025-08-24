import { add, startOfDay, subDays } from "date-fns";
import FarePlanDetail from "./FarePlanDetail";
import type Pass from "./Pass";

export default function fareCalculate(
  startDate: Date,
  endDate: Date,
  passes: Pass[],
  holidays: Set<string> // Dateの文字列表現をキーにしたSet
): FarePlanDetail[] {
  const FarePlans: FarePlanDetail[] = [];
  const resultMap: Record<string, FarePlanDetail> = {};

  startDate = startOfDay(startDate);
  endDate = startOfDay(endDate);

  if (startDate > endDate) {
    return FarePlans;
  }

  if (passes.length === 0) {
    return FarePlans;
  }

  for (
    let currentDate = new Date(subDays(startDate, 1)); // 開始日の前日から開始
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const newFarePlanDetail = new FarePlanDetail(new Date(currentDate));
    FarePlans.push(newFarePlanDetail);
    resultMap[currentDate.toDateString()] = newFarePlanDetail;
  }

  FarePlanDetail.setPassList(passes);

  // 最小値を保持
  let overFarePlan: FarePlanDetail | undefined = undefined;

  for (let i = 0; i < FarePlans.length; i++) {
    const currentFarePlan = FarePlans[i];
    const isHoliday = holidays.has(currentFarePlan.getDate().toDateString());

    // よりコストが低いならコピーしないようにしとく
    if (isHoliday && i > 0) {
      if (
        (FarePlans[i - 1].getMinTotalAmount()?.amount || 0) <=
        (currentFarePlan.getMinTotalAmount()?.amount || 0)
      ) {
        currentFarePlan.copyTotalAmountMap(FarePlans[i - 1]);
        currentFarePlan.setPurchased(false);
      }
    }

    const currentAmount = currentFarePlan.getMinTotalAmount()?.amount || 0;

    for (const pass of passes) {
      const nextDate = add(currentFarePlan.getDate(), { ...pass.duration });
      const nextFarePlan =
        resultMap[nextDate.toDateString()] || new FarePlanDetail(nextDate);

      const nextAmount =
        currentAmount + pass.price * (pass.isReturnTicket ? 2 : 1);

      if (
        nextDate > endDate &&
        nextAmount < (overFarePlan?.getMinTotalAmount()?.amount || Infinity)
      ) {
        overFarePlan = nextFarePlan;
      }
      nextFarePlan.addTotalAmount(nextAmount, pass.id);
    }
  }

  // console.log(
  //   [...Object.values(resultMap), overFarePlan].map((detail) =>
  //     detail
  //       ? `${detail.getDate().toLocaleDateString()}: ${
  //           detail.getMinTotalAmount()?.amount
  //         }, ${detail.getPurchasedPass()?.id}, purchasedDate: ${
  //           detail.isPurchased()
  //             ? detail.getPurchasedDate()?.toLocaleDateString()
  //             : "not purchased"
  //         }`
  //       : ""
  //   )
  // );

  // console.log([...Object.values(resultMap), overFarePlan]);

  let purchaseList: FarePlanDetail[] = [];
  for (
    let currentDate = new Date(
      (() => {
        if (!overFarePlan) return endDate;
        const lastResult = resultMap[endDate.toDateString()];
        if (!lastResult) return endDate;
        const lastMinAmount = lastResult.getMinTotalAmount();
        const overMinAmount = overFarePlan.getMinTotalAmount();
        if (!lastMinAmount || !overMinAmount) return endDate;
        if (overMinAmount.amount < lastMinAmount.amount) {
          return overFarePlan.getDate();
        } else {
          return endDate;
        }
      })()
    );
    currentDate >= startDate;

  ) {
    const purchasedDate =
      currentDate.toDateString() === overFarePlan?.getDate().toDateString()
        ? overFarePlan
        : resultMap[currentDate.toDateString()];
    if (purchasedDate.isPurchased()) purchaseList.push(purchasedDate);
    currentDate = (() => {
      const yesterday = subDays(currentDate, 1);
      if (!purchasedDate) return yesterday;
      if (!purchasedDate.isPurchased()) return yesterday;
      return purchasedDate.getPurchasedDate() || yesterday;
    })();
  }
  purchaseList = purchaseList.reverse();

  return purchaseList;
}

// テスト用
export function fareCalculateTest() {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-01-12");
  const passes = [
    {
      id: "pass1",
      duration: { years: 0, months: 0, days: 1 },
      price: 500,
      isReturnTicket: false,
    },
    {
      id: "pass2",
      duration: { years: 0, months: 0, days: 2 },
      price: 800,
      isReturnTicket: false,
    },
    {
      id: "pass3",
      duration: { years: 0, months: 0, days: 3 },
      price: 1100,
      isReturnTicket: false,
    },
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
        amount: detail.getMinTotalAmount()?.amount,
        purchasedDate: detail.getPurchasedDate(true)?.toDateString(),
      };
    })
  );
}
