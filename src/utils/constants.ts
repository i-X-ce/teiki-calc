import type Pass from "./Pass";
import { createPassId } from "./Pass";

export const HEADER_HEIGHT = 60;

export const INIT_PASS: Pass[] = [
  {
    id: createPassId(0),
    duration: {
      years: 0,
      months: 0,
      days: 1,
    },
    price: 250,
    isReturnTicket: true,
  },
  {
    id: createPassId(1),
    duration: {
      years: 0,
      months: 1,
      days: 0,
    },
    price: 1000,
    isReturnTicket: false,
  },
  {
    id: createPassId(2),
    duration: {
      years: 0,
      months: 3,
      days: 0,
    },
    price: 2500,
    isReturnTicket: false,
  },
  {
    id: createPassId(3),
    duration: {
      years: 0,
      months: 6,
      days: 0,
    },
    price: 4500,
    isReturnTicket: false,
  },
];
