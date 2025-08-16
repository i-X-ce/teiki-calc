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

export const durationToString = (duration: DateDuration): string => {
  const { years, months, days } = duration;
  const yearsStr = years > 0 ? `${years}${DateDurationJP.years}` : "";
  const monthsStr = months > 0 ? `${months}ヶ${DateDurationJP.months}` : "";
  const daysStr = days > 0 ? `${days}${DateDurationJP.days}` : "";
  return `${yearsStr}${monthsStr}${daysStr}分`;
};
