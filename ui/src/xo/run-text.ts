// XO: ажиллагааны хугацаа ба хэрэгслийн тооны текст. tx()-ийн аргумент бүр литерал
// байх ёстой (extract зөвхөн литералыг хураадаг) тул олон тоог n === 1 салаагаар сонгоно.
// Хувьсагчийг "count" гэж бүү нэрлэ: i18next түүнийг plural дүрэм гэж ойлгоно.
import { tx } from "@/i18n/xo";

export function secondsWords(n: number): string {
  return n === 1 ? tx("{{n}} second", { n }) : tx("{{n}} seconds", { n });
}

export function minutesWords(n: number): string {
  return n === 1 ? tx("{{n}} minute", { n }) : tx("{{n}} minutes", { n });
}

export function hoursWords(n: number): string {
  return n === 1 ? tx("{{n}} hour", { n }) : tx("{{n}} hours", { n });
}

export function ranCommandsWords(n: number): string {
  return n === 1 ? tx("ran {{n}} command", { n }) : tx("ran {{n}} commands", { n });
}

export function calledToolsWords(n: number): string {
  return n === 1 ? tx("called {{n}} tool", { n }) : tx("called {{n}} tools", { n });
}

export function toolsCountWords(n: number): string {
  return n === 1 ? tx("{{n}} tool", { n }) : tx("{{n}} tools", { n });
}

/** "38s", "2m", "2m 5s" — transcript-adapter-ийн formatDurationLabel-ийн орчуулагдах хувилбар. */
export function compactDuration(ms: number): string | undefined {
  if (!Number.isFinite(ms) || ms <= 0) return undefined;
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return tx("{{n}}s", { n: Math.max(1, totalSec) });
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec === 0 ? tx("{{n}}m", { n: min }) : tx("{{min}}m {{sec}}s", { min, sec });
}
