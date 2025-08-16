import type Pass from "./Pass";
import { createPassId } from "./Pass";

export const HEADER_HEIGHT = 60;

export const INIT_PASS: Pass[] = [
  {
    id: createPassId(0),
    duration: {
      year: 0,
      month: 0,
      day: 1,
    },
    price: 500,
  },
  {
    id: createPassId(1),
    duration: {
      year: 0,
      month: 1,
      day: 0,
    },
    price: 1000,
  },
  {
    id: createPassId(2),
    duration: {
      year: 0,
      month: 3,
      day: 0,
    },
    price: 2500,
  },
  {
    id: createPassId(3),
    duration: {
      year: 0,
      month: 6,
      day: 0,
    },
    price: 4500,
  },
];
