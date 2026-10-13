/**
 * Tiny best-effort cron → plain-English helper for the routine Triggers section.
 * Not a full cron parser: it covers the common shapes Paperclip schedule triggers
 * produce (every N minutes/hours, daily at HH:MM, weekday/weekend, day-of-week).
 * Falls back to the raw expression when it can't confidently describe it.
 */

import { tx } from "@/i18n/xo";
import { xoWeekdayName } from "@/xo/labels";

const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

function describeTime(minute: string, hour: string): string | null {
  const m = Number(minute);
  const h = Number(hour);
  if (!Number.isInteger(m) || !Number.isInteger(h)) return null;
  if (m < 0 || m > 59 || h < 0 || h > 23) return null;
  return `${pad2(h)}:${pad2(m)}`;
}

// XO: өгүүлбэр бүр бүтэн литерал tx (цагтайгаа хамт), гарагийн нэрийг xoWeekdayName орчуулна.
function describeDayOfWeekAt(dow: string, time: string): string | null {
  if (dow === "*" || dow === "?") return tx("Every day at {{time}}", { time });
  if (dow === "1-5") return tx("Every weekday at {{time}}", { time });
  if (dow === "0,6" || dow === "6,0" || dow === "0,7") return tx("Every weekend at {{time}}", { time });
  const parts = dow.split(",").map((part) => part.trim());
  const names = parts.map((part) => {
    const n = Number(part);
    if (!Number.isInteger(n)) return null;
    return DOW_NAMES[n % 7];
  });
  if (names.some((name) => name === null)) return null;
  const days = names.map((name) => xoWeekdayName(name as string));
  if (days.length === 1) return tx("Every {{day}} at {{time}}", { day: days[0], time });
  return tx("Every {{days}} and {{last}} at {{time}}", {
    days: days.slice(0, -1).join(", "),
    last: days[days.length - 1],
    time,
  });
}

export function describeCron(expression: string | null | undefined): string | null {
  if (!expression) return null;
  const trimmed = expression.trim();
  const fields = trimmed.split(/\s+/);
  // Standard 5-field cron: minute hour day-of-month month day-of-week
  if (fields.length !== 5) return null;
  const [minute, hour, dom, month, dow] = fields;

  // Every N minutes
  const everyMinutes = minute.match(/^\*\/(\d+)$/);
  if (everyMinutes && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return tx("Every {{n}} minutes", { n: everyMinutes[1] });
  }

  // Every N hours, on the minute
  const everyHours = hour.match(/^\*\/(\d+)$/);
  if (everyHours && /^\d+$/.test(minute) && dom === "*" && month === "*" && dow === "*") {
    return tx("Every {{n}} hours at :{{mm}}", { n: everyHours[1], mm: pad2(Number(minute)) });
  }

  // Hourly
  if (/^\d+$/.test(minute) && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return tx("Every hour at :{{mm}}", { mm: pad2(Number(minute)) });
  }

  // Daily / weekly at a fixed time
  if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && month === "*") {
    const time = describeTime(minute, hour);
    if (!time) return null;
    if (dom === "*" && (dow === "*" || dow === "?")) {
      return tx("Every day at {{time}}", { time });
    }
    if (dom === "*") {
      const dowText = describeDayOfWeekAt(dow, time);
      if (dowText) return dowText;
    }
    if (/^\d+$/.test(dom) && (dow === "*" || dow === "?")) {
      return tx("Day {{n}} of every month at {{time}}", { n: dom, time });
    }
  }

  return null;
}
