import animatedHero from "../../../announcements/examples/animated/assets/78bafb6adbfd9da899cdbb5d934b4c0b9df5d419d6f0a5104a87a7b25dcc6bd8.html?raw";
import type { Announcement } from "@paperclipai/shared";
import { tx } from "@/i18n/xo";

function buildPreview(): Announcement {
  return {
    id: "preview-work-together",
    eyebrow: tx("New in {{brand}}"),
    title: tx("Give your next idea a team"),
    description: tx("Bring agents, projects, and work together. Set the direction, then follow your team’s progress in {{brand}}."),
    image: { path: `assets/${"0".repeat(64)}.png`, alt: tx("{{brand}} — ideas become work") },
    secondaryLink: { kind: "external", label: tx("Learn more"), url: "https://paperclip.ing" },
    primaryAction: { kind: "route", label: tx("Explore your projects"), path: "/projects" },
  };
}

function buildAnimationPreview(): Announcement {
  return {
    ...buildPreview(),
    animation: { path: "assets/78bafb6adbfd9da899cdbb5d934b4c0b9df5d419d6f0a5104a87a7b25dcc6bd8.html", alt: tx("Agents plan, build and review work together.") },
  };
}

/** Lazy view of build(): each field is read (and tx() resolved) on access, never at import time. */
function lazyAnnouncement(build: () => Announcement, keys: (keyof Announcement)[]): Announcement {
  const view = {} as Announcement;
  for (const key of keys) {
    Object.defineProperty(view, key, { enumerable: true, get: () => build()[key] });
  }
  return view;
}

const PREVIEW_KEYS: (keyof Announcement)[] = ["id", "eyebrow", "title", "description", "image", "secondaryLink", "primaryAction"];

/** Design guide / Storybook only. Never a runtime feed fallback. */
export const announcementPreview: Announcement = lazyAnnouncement(buildPreview, PREVIEW_KEYS);

export const announcementAnimationPreview: Announcement = lazyAnnouncement(buildAnimationPreview, [...PREVIEW_KEYS, "animation"]);
export const announcementAnimationPreviewSrc = `data:text/html;charset=utf-8,${encodeURIComponent(animatedHero)}`;
