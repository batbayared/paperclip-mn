import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { xoActivityLabel, xoFileKindLabel, xoLabel, xoStatusLabel, xoWorkProductStatusLabel } from "./labels";

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

  it("mn дээр ажлын горимын тайлбарыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoLabel("Make changes and run work")).toBe("Өөрчлөлт хийж, ажил гүйцэтгэх");
    expect(xoLabel("Draft a plan before acting")).toBe("Ажиллахаас өмнө төлөвлөгөө боловсруулах");
    expect(xoLabel("Answer questions only, no changes")).toBe("Зөвхөн асуултад хариулна, өөрчлөлт хийхгүй");
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

describe("xoFileKindLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoFileKindLabel("Archive")).toBe("Archive");
    expect(xoFileKindLabel("Doc")).toBe("Doc");
    expect(xoFileKindLabel("PDF")).toBe("PDF");
  });

  it("mn дээр файлын төрлийг орчуулж, товчлолыг хэвээр үлдээнэ", async () => {
    await i18n.changeLanguage("mn");
    expect(xoFileKindLabel("Archive")).toBe("Архив");
    expect(xoFileKindLabel("Audio")).toBe("Аудио");
    expect(xoFileKindLabel("Code")).toBe("Код");
    expect(xoFileKindLabel("Doc")).toBe("Баримт");
    expect(xoFileKindLabel("File")).toBe("Файл");
    expect(xoFileKindLabel("Log")).toBe("Лог");
    expect(xoFileKindLabel("Patch")).toBe("Патч");
    expect(xoFileKindLabel("Sheet")).toBe("Хүснэгт");
    expect(xoFileKindLabel("Text")).toBe("Текст");
    expect(xoFileKindLabel("Video")).toBe("Видео");
    expect(xoFileKindLabel("PDF")).toBe("PDF");
    expect(xoFileKindLabel("JSON")).toBe("JSON");
  });
});

describe("xoActivityLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoActivityLabel("Ran commands")).toBe("Ran commands");
    expect(xoActivityLabel("Recorded usage")).toBe("Recorded usage");
  });

  it("mn дээр мэдэгдэх шошгыг орчуулж, үл мэдэгдэхийг хэвээр үлдээнэ", async () => {
    await i18n.changeLanguage("mn");
    expect(xoActivityLabel("Ran commands")).toBe("Команд ажиллуулсан");
    expect(xoActivityLabel("Searched the web")).toBe("Вэбээс хайсан");
    expect(xoActivityLabel("Thought through the task")).toBe("Даалгаврыг бодож үзсэн");
    expect(xoActivityLabel("Something new")).toBe("Something new");
  });
});

describe("xoWorkProductStatusLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoWorkProductStatusLabel("Open")).toBe("Open");
  });

  it("mn дээр PR статусыг «Нээлттэй» гэж орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoWorkProductStatusLabel("Open")).toBe("Нээлттэй");
    expect(xoWorkProductStatusLabel("Draft")).toBe("Draft");
  });
});
