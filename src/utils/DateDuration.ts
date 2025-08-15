export default interface DateDuration {
  year: number;
  month: number;
  day: number;
}

export const DateDurationJP: Record<keyof DateDuration, string> = {
  year: "年",
  month: "月",
  day: "日",
};
