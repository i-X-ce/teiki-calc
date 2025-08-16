import type DateDuration from "./DateDuration";

export default interface Pass {
  id: string;
  duration: DateDuration;
  price: number;
  isReturnTicket?: boolean; // 復路を考えるか(金額を二倍にする)
}

export const createPassId = (num: number | string) => {
  return `pass-${num}`;
};
