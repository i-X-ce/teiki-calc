import type DateDuration from "./DateDuration";

export default interface Pass {
  id: string;
  duration: DateDuration;
  price: number;
}

export const createPassId = (num: number) => {
  return `pass-${num}`;
};
