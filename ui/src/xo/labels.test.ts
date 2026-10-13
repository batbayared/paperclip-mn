import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import {
  xoActivityLabel,
  xoColumnDescription,
  xoColumnLabel,
  xoCreateIssueLabels,
  xoDateGroupLabel,
  xoFileKindLabel,
  xoHumanizeValue,
  xoInboxFilterLabel,
  xoIssueFilterLabel,
  xoLabel,
  xoNewIssueInlineLabel,
  xoPermissionDecision,
  xoQuickFilterLabel,
  xoSidePanelTabLabel,
  xoStatusLabel,
  xoToolDetailLabel,
  xoWorkProductStatusLabel,
} from "./labels";

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

  it("xoLabel: desk shelves ба group-by (mn)", async () => {
    await i18n.changeLanguage("mn");
    expect(xoLabel("Decide now")).toBe("Одоо шийдэх");
    expect(xoLabel("New today")).toBe("Өнөөдрийн шинэ");
    expect(xoLabel("Parent Task")).toBe("Эцэг даалгавар");
    expect(xoLabel("None")).toBe("Байхгүй");
    expect(xoLabel("Unknown label")).toBe("Unknown label");
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

describe("xoDateGroupLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoDateGroupLabel("Today")).toBe("Today");
    expect(xoDateGroupLabel("Older than a week")).toBe("Older than a week");
  });

  it("mn дээр огнооны тусгаарлагчийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoDateGroupLabel("Today")).toBe("Өнөөдөр");
    expect(xoDateGroupLabel("Yesterday")).toBe("Өчигдөр");
    expect(xoDateGroupLabel("Earlier")).toBe("Өмнөх");
    expect(xoDateGroupLabel("Older than a day")).toBe("Нэг өдрөөс өмнөх");
    expect(xoDateGroupLabel("Unknown")).toBe("Unknown");
  });
});

describe("xoColumnLabel / xoColumnDescription", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoColumnLabel("Kicked off by")).toBe("Kicked off by");
    expect(xoColumnDescription("Task labels and tags.")).toBe("Task labels and tags.");
  });

  it("mn дээр баганын нэр ба тайлбарыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoColumnLabel("Status")).toBe("Төлөв");
    expect(xoColumnLabel("Kicked off by")).toBe("Эхлүүлсэн");
    expect(xoColumnLabel("Last updated")).toBe("Сүүлд шинэчилсэн");
    expect(xoColumnDescription("Task labels and tags.")).toBe("Даалгаврын шошго.");
    expect(xoColumnLabel("Unknown")).toBe("Unknown");
  });
});

describe("xoPermissionDecision", () => {
  it("en дээр түүхий утгыг хэвээр буцаана", () => {
    expect(xoPermissionDecision("allowed")).toBe("allowed");
  });

  it("mn дээр allowed/rejected-ийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoPermissionDecision("allowed")).toBe("Зөвшөөрсөн");
    expect(xoPermissionDecision("rejected")).toBe("Татгалзсан");
    expect(xoPermissionDecision("other")).toBe("other");
  });
});

describe("xoHumanizeValue", () => {
  it("en дээр upstream humanizeValue-тэй ижил", () => {
    expect(xoHumanizeValue(null)).toBe("None");
    expect(xoHumanizeValue("in_progress")).toBe("in progress");
    expect(xoHumanizeValue("some_custom_value")).toBe("some custom value");
  });

  it("mn дээр статус ба None-ийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoHumanizeValue(null)).toBe("Байхгүй");
    expect(xoHumanizeValue("in_progress")).toBe("Хийгдэж буй");
    expect(xoHumanizeValue("blocked")).toBe("Саатсан");
    expect(xoHumanizeValue("some_custom_value")).toBe("some custom value");
  });
});

describe("xoToolDetailLabel", () => {
  it("en дээр хэвээр", () => {
    expect(xoToolDetailLabel("Path")).toBe("Path");
    expect(xoToolDetailLabel("Unknown")).toBe("Unknown");
  });

  it("mn дээр describeToolInput-ийн шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoToolDetailLabel("Path")).toBe("Зам");
    expect(xoToolDetailLabel("Directory")).toBe("Хавтас");
    expect(xoToolDetailLabel("Pattern")).toBe("Загвар");
    expect(xoToolDetailLabel("Paths")).toBe("Замууд");
    expect(xoToolDetailLabel("Command")).toBe("Команд");
    expect(xoToolDetailLabel("Intent")).toBe("Зорилго");
    expect(xoToolDetailLabel("Query")).toBe("Асуулга");
    expect(xoToolDetailLabel("Name")).toBe("Нэр");
    expect(xoToolDetailLabel("Unknown")).toBe("Unknown");
  });
});

describe("xoIssueFilterLabel", () => {
  it("en дээр issueFilterLabel-тэй ижил", () => {
    expect(xoIssueFilterLabel("in_progress")).toBe("In Progress");
    expect(xoIssueFilterLabel("critical")).toBe("Critical");
    expect(xoIssueFilterLabel("custom_thing")).toBe("Custom Thing");
  });

  it("mn дээр статус ба зэрэглэлийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoIssueFilterLabel("in_progress")).toBe("Хийгдэж буй");
    expect(xoIssueFilterLabel("backlog")).toBe("Нөөц");
    expect(xoIssueFilterLabel("critical")).not.toBe("Critical");
    expect(xoIssueFilterLabel("low")).not.toBe("Low");
    expect(xoIssueFilterLabel("custom_thing")).toBe("Custom Thing");
  });
});

describe("xoQuickFilterLabel / xoInboxFilterLabel", () => {
  it("en дээр хэвээр", () => {
    expect(xoQuickFilterLabel("Active")).toBe("Active");
    expect(xoInboxFilterLabel("Needs action")).toBe("Needs action");
  });

  it("mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoQuickFilterLabel("All")).toBe("Бүгд");
    expect(xoQuickFilterLabel("Active")).toBe("Идэвхтэй");
    expect(xoQuickFilterLabel("Backlog")).toBe("Нөөц");
    expect(xoQuickFilterLabel("Done")).toBe("Дууссан");
    expect(xoInboxFilterLabel("All categories")).toBe("Бүх ангилал");
    expect(xoInboxFilterLabel("My recent tasks")).toBe("Миний сүүлийн даалгаврууд");
    expect(xoInboxFilterLabel("Join requests")).toBe("Нэгдэх хүсэлт");
    expect(xoInboxFilterLabel("Approvals")).toBe("Зөвшөөрлүүд");
    expect(xoInboxFilterLabel("Failed runs")).toBe("Амжилтгүй ажиллагаа");
    expect(xoInboxFilterLabel("Alerts")).toBe("Сэрэмжлүүлэг");
    expect(xoInboxFilterLabel("All approval statuses")).toBe("Зөвшөөрлийн бүх төлөв");
    expect(xoInboxFilterLabel("Needs action")).toBe("Арга хэмжээ шаардлагатай");
    expect(xoInboxFilterLabel("Resolved")).toBe("Шийдвэрлэсэн");
  });
});

describe("xoCreateIssueLabels", () => {
  it("en дээр upstream template-тэй ижил", () => {
    expect(xoCreateIssueLabels()).toEqual({ action: "Create Task", button: "New Task" });
    expect(xoCreateIssueLabels("Sub-task")).toEqual({ action: "Create Sub-task", button: "New Sub-task" });
    expect(xoCreateIssueLabels("Widget")).toEqual({ action: "Create Widget", button: "New Widget" });
  });

  it("mn дээр мэдэгдэх шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoCreateIssueLabels("Sub-task")).toEqual({
      action: "Дэд даалгавар үүсгэх",
      button: "Шинэ дэд даалгавар",
    });
    expect(xoCreateIssueLabels().button).not.toBe("New Task");
  });
});

describe("xoSidePanelTabLabel", () => {
  it("en дээр хэвээр", () => {
    expect(xoSidePanelTabLabel("Properties")).toBe("Properties");
    expect(xoSidePanelTabLabel("My doc")).toBe("My doc");
  });

  it("mn дээр хадгалсан tab шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoSidePanelTabLabel("Properties")).toBe("Шинж чанарууд");
    expect(xoSidePanelTabLabel("Subtasks")).not.toBe("Subtasks");
    expect(xoSidePanelTabLabel("Artifacts")).not.toBe("Artifacts");
    expect(xoSidePanelTabLabel("My doc")).toBe("My doc");
  });
});

describe("xoNewIssueInlineLabel (M-4)", () => {
  it("en дээр хэвээр", () => {
    expect(xoNewIssueInlineLabel("For")).toBe("For");
    expect(xoNewIssueInlineLabel("in")).toBe("in");
  });

  it("mn дээр шинэ даалгаврын мөрийн шошго", async () => {
    await i18n.changeLanguage("mn");
    expect(xoNewIssueInlineLabel("For")).toBe("Хэнд");
    expect(xoNewIssueInlineLabel("in")).toBe("төсөл");
  });
});
