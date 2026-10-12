import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { xoLabel, xoStatusLabel } from "./labels";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("xoLabel", () => {
  it("en дээр англи текстийг хэвээр буцаана", () => {
    expect(xoLabel("Subscription")).toBe("Subscription");
    expect(xoLabel("Some unknown label")).toBe("Some unknown label");
  });

  it("mn дээр мэдэгдэх шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoLabel("Subscription")).toBe("Захиалга");
    expect(xoLabel("Use API key instead")).toBe("Оронд нь API түлхүүр ашиглах");
    expect(xoLabel("Use subscription instead")).toBe("Оронд нь захиалга ашиглах");
    expect(xoLabel("Create your first agent")).not.toBe("Create your first agent");
    expect(xoLabel("Connect a model")).not.toBe("Connect a model");
    expect(xoLabel("Review")).toBe("Хянах");
    expect(xoLabel("Name your organization")).toBe("Байгууллагаа нэрлэх");
    expect(xoLabel("Some unknown label")).toBe("Some unknown label");
  });
});

describe("xoStatusLabel", () => {
  it("en дээр дуудагчийн англи шошгыг яг буцаана", () => {
    expect(xoStatusLabel("todo", "To Do")).toBe("To Do");
    expect(xoStatusLabel("in_review", "In Review")).toBe("In Review");
  });

  it("mn дээр статусыг орчуулна (enum ба англи шошгын аль алинаас)", async () => {
    await i18n.changeLanguage("mn");
    expect(xoStatusLabel("backlog", "Backlog")).toBe("Нөөц");
    expect(xoStatusLabel("todo", "To Do")).toBe("Хийх");
    expect(xoStatusLabel("Todo", "Todo")).toBe("Хийх");
    expect(xoStatusLabel("in_progress", "In Progress")).toBe("Хийгдэж буй");
    expect(xoStatusLabel("In Review", "In Review")).toBe("Хянагдаж буй");
    expect(xoStatusLabel("done", "Done")).toBe("Дууссан");
    expect(xoStatusLabel("cancelled", "Cancelled")).toBe("Цуцалсан");
    expect(xoStatusLabel("blocked", "Blocked")).toBe("Саатсан");
    expect(xoStatusLabel("running", "running")).toBe("running");
  });
});
