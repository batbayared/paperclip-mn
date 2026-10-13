// XO: upstream-ийн модулийн түвшний англи шошгыг render үед орчуулна.
// tx()-ийн аргумент бүр литерал байх ёстой — extract зөвхөн литералыг хураадаг.
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";

export function xoLabel(english: string): string {
  switch (english) {
    case "Use API key instead": return tx("Use API key instead");
    case "Use subscription instead": return tx("Use subscription instead");
    case "Subscription": return tx("Subscription");
    case "Create your first agent": return tx("Create your first agent");
    case "Connect a model": return tx("Connect a model");
    case "Review": return tx("Review");
    case "Name your organization": return tx("Name your organization");
    case "Make changes and run work": return tx("Make changes and run work");
    case "Draft a plan before acting": return tx("Draft a plan before acting");
    case "Answer questions only, no changes": return tx("Answer questions only, no changes");
    default: return english;
  }
}

function normalizeStatus(status: string): string {
  const s = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return s === "to_do" ? "todo" : s === "canceled" ? "cancelled" : s;
}

export function xoStatusLabel(status: string, english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (normalizeStatus(status)) {
    case "backlog": return tx("Backlog");
    case "todo": return tx("Todo");
    case "in_progress": return tx("In Progress");
    case "in_review": return tx("In Review");
    case "done": return tx("Done");
    case "cancelled": return tx("Cancelled");
    case "blocked": return tx("Blocked");
    default: return english;
  }
}

// task-chat-attachments.ts-ийн файлын төрөл. "Archive" түлхүүр каталогт «Архивлах»
// үйл үгтэй тул файлын төрөлд тусдаа түлхүүр хэрэглэнэ; en дээр guard англиар буцаана.
export function xoFileKindLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Archive": return tx("Archive (file type)");
    case "Audio": return tx("Audio");
    case "Code": return tx("Code");
    case "Doc": return tx("Doc");
    case "File": return tx("File");
    case "Log": return tx("Log");
    case "Patch": return tx("Patch");
    case "Sheet": return tx("Sheet");
    case "Text": return tx("Text");
    case "Video": return tx("Video");
    default: return english;
  }
}

// RichWorkProductCard-ийн PR статусын «Open». "Open" түлхүүр каталогт «Нээх» (товчны
// үйл үг) тул статусын тэмдэгт тусдаа түлхүүр хэрэглэнэ; en дээр guard англиар буцаана.
export function xoWorkProductStatusLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Open": return tx("Open (PR status)");
    default: return english;
  }
}

// completed-activity-summary.ts-ийн хураангуй шошго. Түлхүүр нь англи тексттэй ижил
// тул en дээр tx() түлхүүрээ буцаана, guard хэрэггүй.
export function xoActivityLabel(english: string): string {
  switch (english) {
    case "Ran commands": return tx("Ran commands");
    case "Searched files": return tx("Searched files");
    case "Read files": return tx("Read files");
    case "Edited files": return tx("Edited files");
    case "Searched the web": return tx("Searched the web");
    case "Worked on a plan": return tx("Worked on a plan");
    case "Requested input": return tx("Requested input");
    case "Worked with agents": return tx("Worked with agents");
    case "Reviewed safety": return tx("Reviewed safety");
    case "Worked with images": return tx("Worked with images");
    case "Waited": return tx("Waited");
    case "Used connected tools": return tx("Used connected tools");
    case "Used tools": return tx("Used tools");
    case "Worked with artifacts": return tx("Worked with artifacts");
    case "Managed context": return tx("Managed context");
    case "Checked memory": return tx("Checked memory");
    case "Checked model settings": return tx("Checked model settings");
    case "Worked in review mode": return tx("Worked in review mode");
    case "Ran hooks": return tx("Ran hooks");
    case "Received a provider update": return tx("Received a provider update");
    case "Worked on files": return tx("Worked on files");
    case "Referenced files": return tx("Referenced files");
    case "Added resources": return tx("Added resources");
    case "Checked files": return tx("Checked files");
    case "Thought through the task": return tx("Thought through the task");
    case "Activity stopped": return tx("Activity stopped");
    case "Recorded usage": return tx("Recorded usage");
    default: return english;
  }
}
