export default interface DateDuration {
  years: number;
  months: number;
  days: number;
}

export const DateDurationJP: Record<keyof DateDuration, string> = {
  years: "年",
  months: "月",
  days: "日",
};
