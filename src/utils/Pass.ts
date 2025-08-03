import type DateDuration from "./DateDuration";

export default interface Pass {
  id: string;
  duration: DateDuration;
  price: number;
}
