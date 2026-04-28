interface NewYorkDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  ymd: string;
}

function getNewYorkDateParts(date: Date): NewYorkDateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  return {
    year,
    month,
    day,
    hour,
    minute,
    ymd: `${get("year")}-${get("month")}-${get("day")}`
  };
}

function newYorkWeekday(date: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short"
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

function ymdFromUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function nextWeekdayFromNewYorkParts(parts: NewYorkDateParts, offsetDays: number): string {
  const next = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + offsetDays));
  while ([0, 6].includes(next.getUTCDay())) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return ymdFromUtcDate(next);
}

export function getCurrentMarketDate(now = new Date()): string {
  return getNextLikelyTradingDate(now);
}

export function getNextLikelyTradingDate(now = new Date()): string {
  const parts = getNewYorkDateParts(now);
  const day = newYorkWeekday(now);
  if (day === 6) return nextWeekdayFromNewYorkParts(parts, 2);
  if (day === 0) return nextWeekdayFromNewYorkParts(parts, 1);
  if (parts.hour >= 16) return nextWeekdayFromNewYorkParts(parts, 1);
  // TODO: account for US market holidays.
  return parts.ymd;
}
