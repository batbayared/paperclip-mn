import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import {
  xoActivityLabel,
  xoBrandVars,
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
  xoRoleLabel,
  xoRunRowSubtitle,
  xoRunSourceLabel,
  xoSidePanelTabLabel,
  xoStatusLabel,
  xoToolDetailLabel,
  xoTraceStatusLabel,
  xoWorkProductStatusLabel,
  xoResolverPolicyLabel,
  xoResolverPolicyEffect,
  xoInteractionKindLabel,
  xoVerdictLabel,
  xoNavLabel,
  xoAttentionSourceLabel,
  xoSnoozePresetLabel,
  xoFolderItemLabel,
  xoCompactKindLabel,
  xoDecisionOptionLabel,
  xoRoutineSectionLabel,
  xoTriggerKindLabel,
  xoSigningModeLabel,
  xoSigningModeDescription,
  xoFireDispositionLabel,
  xoWeekdayName,
  xoRoutineDirtyFieldLabel,
  xoRoutineHistoryFieldLabel,
  xoSkillSourceFilterLabel,
  xoSkillDiscoverySortLabel,
  xoSkillReservedRootLabel,
  xoSkillPolicyDenialTitle,
  xoSkillPolicyDenialRemediation,
  xoSkillSourceLabel,
  xoSkillVersionLabel,
  xoSkillTestTemplateText,
  xoAttentionInteractionLabel,
  xoAttentionWhyNow,
  xoDecisionQueueSeedText,
  xoRoutineRunSourceLabel,
  xoRoutineTriggerLabel,
  xoRoutineHistoryValueLabel,
  xoRoutineChangeSummary,
  xoSkillEditableReason,
  xoAttentionTitle,
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
    expect(xoStatusLabel("some_unknown", "some unknown")).toBe("some unknown");
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

describe("xoRunRowSubtitle ба Markdown (Ү6 7.3)", () => {
  it("mn дээр", async () => {
    await i18n.changeLanguage("mn");
    expect(xoRunRowSubtitle("Run failed")).toBe("Ажиллагаа амжилтгүй болсон");
    expect(xoRunRowSubtitle("Skipped — routine paused")).not.toBe("Skipped — routine paused");
    expect(xoRunRowSubtitle("custom failure reason")).toBe("custom failure reason");
    expect(xoFileKindLabel("Markdown")).toBe("Markdown");
  });

  it("en дээр хэвээр", () => {
    expect(xoRunRowSubtitle("Run failed")).toBe("Run failed");
    expect(xoRunRowSubtitle("Skipped — routine paused")).toBe("Skipped — routine paused");
  });
});

describe("xoRoleLabel / xoRunSourceLabel / xoTraceStatusLabel", () => {
  it("en дээр оролт хэвээр", () => {
    expect(xoRoleLabel("engineer", "Engineer")).toBe("Engineer");
    expect(xoRunSourceLabel("assignment", "Assignment")).toBe("Assignment");
    expect(xoTraceStatusLabel("Trace off")).toBe("Trace off");
    expect(xoStatusLabel("succeeded", "succeeded")).toBe("succeeded");
    expect(xoStatusLabel("pending_approval", "pending approval")).toBe("pending approval");
  });

  it("mn дээр үүрэг, эх сурвалж, мөрдөлт, ажиллагааны статусыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoRoleLabel("engineer", "Engineer")).toBe("Инженер");
    expect(xoRunSourceLabel("assignment", "Assignment")).toBe("Даалгавар оноолт");
    expect(xoTraceStatusLabel("Trace off")).toBe("Мөрдөлт унтраалттай");
    expect(xoStatusLabel("succeeded", "succeeded")).toBe("Амжилттай");
    expect(xoStatusLabel("idle", "idle")).toBe("Сул");
    expect(xoStatusLabel("timed_out", "timed out")).toBe("Хугацаа хэтэрсэн");
  });
});

describe("Ү6 7.5 helper-ууд (en)", () => {
  it("en дээр англи утгаа буцаана, мэдэгдэхгүйг дамжуулна", () => {
    expect(xoResolverPolicyLabel("Anyone except creator")).toBe("Anyone except creator");
    expect(xoResolverPolicyEffect("A request keeps whatever audience it asks for.")).toBe(
      "A request keeps whatever audience it asks for.",
    );
    expect(xoInteractionKindLabel("Checkbox confirmations")).toBe("Checkbox confirmations");
    expect(xoVerdictLabel("Defer")).toBe("Defer");
    expect(xoNavLabel("Permissions / Trust")).toBe("Permissions / Trust");
    expect(xoNavLabel("Something else")).toBe("Something else");
    expect(xoStatusLabel("withdrawn", "Withdrawn")).toBe("Withdrawn");
  });
});

describe("Ү6 7.5 helper-ууд (mn)", () => {
  it("Ү6 7.5 helper-ууд mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoResolverPolicyLabel("Human only")).toBe("Зөвхөн хүн");
    expect(xoResolverPolicyLabel("Anyone")).toBe("Хэн ч");
    expect(xoNavLabel("Permissions / Trust")).toBe("Эрх / Итгэл");
    expect(xoVerdictLabel("Defer")).toBe("Хойшлуулах");
    expect(xoInteractionKindLabel("Suggested tasks")).toBe("Санал болгосон даалгаврууд");
    expect(xoStatusLabel("withdrawn", "Withdrawn")).toBe("Буцаан татсан");
    expect(xoStatusLabel("disabled", "Disabled")).toBe("Идэвхгүй");
  });
});

describe("Ү6 7.6 helper-ууд (en)", () => {
  it("en дээр англи утгаа буцаана, мэдэгдэхгүйг дамжуулна", () => {
    for (const v of ["Approval", "Decision requested", "Blocked dependency", "Agent error", "some kind"]) {
      expect(xoAttentionSourceLabel(v)).toBe(v);
    }
    for (const v of ["1 hour", "4 hours", "Tomorrow morning", "Next week", "Later"]) {
      expect(xoSnoozePresetLabel(v)).toBe(v);
    }
    for (const v of ["routines", "Routines", "skills", "Skills", "widgets"]) {
      expect(xoFolderItemLabel(v)).toBe(v);
    }
    for (const v of ["Suggested tasks", "Choose options", "Review items", "Connect service", "Selection", "Other"]) {
      expect(xoCompactKindLabel(v)).toBe(v);
    }
  });
});

describe("Ү6 7.6 helper-ууд (mn)", () => {
  it("Ү6 7.6 helper-ууд mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoAttentionSourceLabel("Failed run")).toBe("Амжилтгүй ажиллагаа");
    expect(xoAttentionSourceLabel("Approval")).toBe("Зөвшөөрөл");
    expect(xoAttentionSourceLabel("Decision requested")).toBe("Шийдвэр хүссэн");
    expect(xoSnoozePresetLabel("1 hour")).toBe("1 цаг");
    expect(xoSnoozePresetLabel("Next week")).toBe("Дараа долоо хоног");
    expect(xoFolderItemLabel("routines")).toBe("тогтмол ажлууд");
    expect(xoFolderItemLabel("Skills")).toBe("Чадварууд");
    expect(xoCompactKindLabel("Choose options")).toBe("Сонголт хийх");
    expect(xoCompactKindLabel("Suggested tasks")).toBe("Санал болгосон даалгаврууд");
  });

  it("T1 transform-оор модулийн түвшинд орчуулсан snooze шошгыг давхар орчуулахгүй дамжуулна", async () => {
    // AttentionQueueRow T1-д орсноор SNOOZE_PRESETS-ийн label импортын үед tx() болно
    // (locale солиход хуудас reload хийгддэг тул тухайн locale-ийн утга). Helper mn утгыг хэвээр буцаана.
    await i18n.changeLanguage("mn");
    expect(xoSnoozePresetLabel("Маргааш өглөө")).toBe("Маргааш өглөө");
    await i18n.changeLanguage("en");
    expect(xoSnoozePresetLabel("Tomorrow morning")).toBe("Tomorrow morning");
  });
});

describe("Ү6 7.7 helper-ууд (en)", () => {
  it("en дээр англи утгаа буцаана, мэдэгдэхгүйг дамжуулна", () => {
    for (const v of ["Critical", "High", "Medium", "Low", "All", "Today", "Yesterday", "Last 7 days", "This month", "Custom", "This week", "Whenever", "Earlier", "None", "Date", "Type", "Project", "Severity", "Newest first", "Oldest first", "No project", "Something else"]) {
      expect(xoDecisionOptionLabel(v)).toBe(v);
    }
    for (const v of ["Tomorrow", "1 hour", "Next week"]) {
      expect(xoSnoozePresetLabel(v)).toBe(v);
    }
    for (const v of ["disabled", "archived", "deleted"]) {
      expect(xoStatusLabel(v, v)).toBe(v);
    }
  });
});

describe("Ү6 7.7 helper-ууд (mn)", () => {
  it("mn дээр decision option, snooze, нууц утгын төлөвийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoDecisionOptionLabel("Last 7 days")).toBe("Сүүлийн 7 хоног");
    expect(xoDecisionOptionLabel("Critical")).toBe("Яаралтай");
    expect(xoDecisionOptionLabel("Newest first")).toBe("Шинэ нь эхэндээ");
    expect(xoDecisionOptionLabel("No project")).toBe("Төсөлгүй");
    expect(xoDecisionOptionLabel("Something else")).toBe("Something else");
    expect(xoStatusLabel("archived", "archived")).toBe("Архивласан");
    expect(xoSnoozePresetLabel("Tomorrow")).toBe("Маргааш");
  });
});

describe("Ү6 7.8 helper-ууд (en)", () => {
  it("en дээр англи утгаа буцаана, мэдэгдэхгүйг дамжуулна", () => {
    for (const v of ["Overview", "Schedule", "Variables", "Secrets", "Delivery", "Runs", "Activity", "Version history", "Something else"]) {
      expect(xoRoutineSectionLabel(v)).toBe(v);
    }
    for (const v of ["schedule", "webhook", "api"]) {
      expect(xoTriggerKindLabel(v)).toBe(v);
    }
    for (const v of ["bearer", "hmac_sha256", "github_hmac", "none", "other"]) {
      expect(xoSigningModeLabel(v)).toBe(v);
    }
    expect(xoSigningModeDescription("bearer")).toBe("Expect a shared bearer token in the Authorization header.");
    expect(xoSigningModeDescription("hmac_sha256")).toBe("Expect an HMAC SHA-256 signature over the request using the shared secret.");
    expect(xoSigningModeDescription("github_hmac")).toBe("Accept GitHub-style X-Hub-Signature-256 header (HMAC over raw body, no timestamp).");
    expect(xoSigningModeDescription("none")).toBe("No authentication — the webhook URL itself acts as a shared secret.");
    expect(xoSigningModeDescription("other")).toBe("");
    for (const v of ["queued", "would be coalesced", "would be skipped", "something"]) {
      expect(xoFireDispositionLabel(v)).toBe(v);
    }
    for (const v of ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Someday"]) {
      expect(xoWeekdayName(v)).toBe(v);
    }
    for (const v of ["the title", "the description", "the project", "the default agent", "the priority", "the concurrency policy", "the catch-up policy", "the advanced run policy", "the activity gate scope", "the variables", "the secrets", "the routine", "the unknown"]) {
      expect(xoRoutineDirtyFieldLabel(v)).toBe(v);
    }
    for (const v of ["Title", "Priority", "Status", "Default agent", "Project", "Concurrency", "Catch-up", "Env", "Variables", "Unknown"]) {
      expect(xoRoutineHistoryFieldLabel(v)).toBe(v);
    }
  });
});

describe("Ү6 7.8 helper-ууд (mn)", () => {
  it("mn дээр routine хэсэг, идэвхжүүлэгч, гарын үсгийн горим, disposition, гараг, талбарыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    for (const v of ["Overview", "Schedule", "Variables", "Secrets", "Delivery", "Runs", "Activity", "Version history"]) {
      expect(xoRoutineSectionLabel(v), v).not.toBe(v);
    }
    expect(xoRoutineSectionLabel("Version history")).toBe("Хувилбарын түүх");
    expect(xoRoutineSectionLabel("Delivery")).toBe("Хүргэлт");
    expect(xoRoutineSectionLabel("Something else")).toBe("Something else");
    for (const v of ["schedule", "webhook"]) {
      expect(xoTriggerKindLabel(v), v).not.toBe(v);
    }
    expect(xoSigningModeLabel("none")).not.toBe("none");
    // bearer, HMAC нэрс латинаар үлдэж болно; мэдэгдэхгүй утгыг дамжуулна.
    expect(xoSigningModeLabel("other")).toBe("other");
    for (const v of ["bearer", "hmac_sha256", "github_hmac", "none"]) {
      const d = xoSigningModeDescription(v);
      expect(d, v).not.toBe("");
      expect(d, v).not.toMatch(/^(Expect|Accept|No authentication)/);
    }
    expect(xoSigningModeDescription("other")).toBe("");
    for (const v of ["queued", "would be coalesced", "would be skipped"]) {
      expect(xoFireDispositionLabel(v), v).not.toBe(v);
    }
    expect(xoFireDispositionLabel("would be skipped")).toBe("алгасагдана");
    expect(xoFireDispositionLabel("something")).toBe("something");
    for (const v of ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]) {
      expect(xoWeekdayName(v), v).not.toBe(v);
    }
    expect(xoWeekdayName("Someday")).toBe("Someday");
    for (const v of ["the title", "the description", "the project", "the default agent", "the priority", "the concurrency policy", "the catch-up policy", "the advanced run policy", "the activity gate scope", "the variables", "the secrets", "the routine"]) {
      expect(xoRoutineDirtyFieldLabel(v), v).not.toBe(v);
    }
    expect(xoRoutineDirtyFieldLabel("the title")).toBe("гарчиг");
    expect(xoRoutineDirtyFieldLabel("the concurrency policy")).toBe("зэрэгцээ ажиллагааны бодлого");
    expect(xoRoutineDirtyFieldLabel("the catch-up policy")).toBe("нөхөн ажиллуулах бодлого");
    expect(xoRoutineDirtyFieldLabel("the unknown")).toBe("the unknown");
    for (const v of ["Title", "Priority", "Status", "Default agent", "Project", "Concurrency", "Catch-up", "Variables"]) {
      expect(xoRoutineHistoryFieldLabel(v), v).not.toBe(v);
    }
    expect(xoRoutineHistoryFieldLabel("Catch-up")).toBe("Нөхөн ажиллуулалт");
    expect(xoRoutineHistoryFieldLabel("Unknown")).toBe("Unknown");
  });
});

describe("Ү6 7.9 helper-ууд (en)", () => {
  it("en дээр англи утгаа буцаана, мэдэгдэхгүйг дамжуулна", () => {
    for (const v of ["All", "Organization", "Bundled", "Optional", "External", "Something else"]) {
      expect(xoSkillSourceFilterLabel(v)).toBe(v);
    }
    for (const v of ["Most agents", "Most stars", "Most forks", "Recently updated", "Alphabetical", "Something else"]) {
      expect(xoSkillDiscoverySortLabel(v)).toBe(v);
    }
    for (const v of ["My Skills", "Projects", "Bundled", "Organization", "Custom folder"]) {
      expect(xoSkillReservedRootLabel(v)).toBe(v);
    }
    const titles: Record<string, string> = {
      skill_authentication_required: "Sign in to manage skills.",
      skill_company_boundary_denied: "This skill belongs to another organization.",
      skill_workspace_boundary_denied: "This skill source is outside an allowed workspace.",
      skill_source_validation_failed: "This skill source failed validation.",
      skill_unsafe_content_blocked: "This skill contains unsafe content.",
      skill_secret_handling_blocked: "This skill exposes a secret value.",
      skill_actor_restricted: "This action isn't available for the current actor.",
      unknown_code: "Fallback title.",
    };
    for (const [code, english] of Object.entries(titles)) {
      expect(xoSkillPolicyDenialTitle(code, english)).toBe(english);
    }
    const remediations: Record<string, string> = {
      skill_authentication_required: "Sign in and try again.",
      skill_company_boundary_denied: "Open the skill from the organization that owns it.",
      skill_workspace_boundary_denied:
        "Import from a configured Paperclip workspace or the organization managed-skill directory.",
      skill_source_validation_failed: "Fix the flagged source and retry.",
      skill_unsafe_content_blocked: "Remove the fetch-and-execute or unsafe pattern before saving.",
      skill_secret_handling_blocked: "Remove the secret value before saving.",
      skill_actor_restricted: "Retry from an account with access to this action.",
      unknown_code: "Fallback remediation.",
    };
    for (const [code, english] of Object.entries(remediations)) {
      expect(xoSkillPolicyDenialRemediation(code, english)).toBe(english);
    }
  });
});

describe("Ү6 7.9 helper-ууд (mn)", () => {
  it("mn дээр эх сурвалжийн шүүлтүүр, эрэмбэ, үндсэн хавтас, бодлогын татгалзлыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    for (const v of ["All", "Organization", "Bundled", "Optional", "External"]) {
      expect(xoSkillSourceFilterLabel(v), v).not.toBe(v);
    }
    expect(xoSkillSourceFilterLabel("Bundled")).toBe("Багцад орсон");
    expect(xoSkillSourceFilterLabel("Something else")).toBe("Something else");
    for (const v of ["Most agents", "Most stars", "Most forks", "Recently updated", "Alphabetical"]) {
      expect(xoSkillDiscoverySortLabel(v), v).not.toBe(v);
    }
    expect(xoSkillDiscoverySortLabel("Most stars")).toBe("Хамгийн олон одтой");
    expect(xoSkillDiscoverySortLabel("Most forks")).toBe("Хамгийн олон салаатай");
    expect(xoSkillDiscoverySortLabel("Something else")).toBe("Something else");
    for (const v of ["My Skills", "Projects", "Bundled", "Organization"]) {
      expect(xoSkillReservedRootLabel(v), v).not.toBe(v);
    }
    expect(xoSkillReservedRootLabel("My Skills")).toBe("Миний чадварууд");
    expect(xoSkillReservedRootLabel("Custom folder")).toBe("Custom folder");
    const codes = [
      "skill_authentication_required",
      "skill_company_boundary_denied",
      "skill_workspace_boundary_denied",
      "skill_source_validation_failed",
      "skill_unsafe_content_blocked",
      "skill_secret_handling_blocked",
      "skill_actor_restricted",
    ];
    for (const code of codes) {
      const title = xoSkillPolicyDenialTitle(code, "Fallback title.");
      expect(title, code).not.toBe("Fallback title.");
      expect(title, code).not.toMatch(/skill/i);
      const remediation = xoSkillPolicyDenialRemediation(code, "Fallback remediation.");
      expect(remediation, code).not.toBe("Fallback remediation.");
      expect(remediation, code).not.toContain("Paperclip");
    }
    expect(xoSkillPolicyDenialTitle("skill_authentication_required", "x")).toBe("Чадваруудыг удирдахын тулд нэвтэрнэ үү.");
    expect(xoSkillPolicyDenialRemediation("skill_authentication_required", "x")).toBe("Нэвтэрч дахин оролдоно уу.");
    expect(xoSkillPolicyDenialTitle("unknown_code", "Fallback title.")).toBe("Fallback title.");
    expect(xoSkillPolicyDenialRemediation("unknown_code", "Fallback remediation.")).toBe("Fallback remediation.");
  });
});

// Ү6 7.10: шинэ түлхүүрүүд Task 9-ийн merge хүртэл каталогт байхгүй тул mn тестэд
// overwrite=false-оор нэмнэ (merge хийсний дараа каталогийн утга давамгайлна).
const Y6_7_10_MN: Record<string, string> = {
  "{{brand}} bundled": "{{brand}}-ийн багц",
  "{{brand}} workspace": "{{brand}}-ийн ажлын талбар",
  "Initial version": "Анхны хувилбар",
  "{{brand}}'s read-only default harness instructions for Skills Studio runs.":
    "Чадварын студийн ажиллагаанд зориулсан {{brand}}-ийн зөвхөн уншигдах анхдагч орчны заавар.",
  "Selection confirmation requested": "Сонголтын баталгаажуулалт хүссэн",
  "Questions need answers": "Асуултад хариулт хэрэгтэй",
  "Suggested tasks need a decision": "Санал болгосон даалгаврууд шийдвэр хүлээж байна",
  "Item verdicts need a decision": "Зүйл тус бүрд шийдвэр гаргах шаардлагатай",
  "Interaction needs a decision": "Харилцан үйлдэл шийдвэр хүлээж байна",
  "{{label}} on an issue thread.": "Даалгаврын сэдэвт: {{label}}.",
  PRs: "Pull request-ууд",
  Plans: "Төлөвлөгөөнүүд",
  "Pull-request and merge decisions detected from issue work products.":
    "Даалгаврын ажлын бүтээгдэхүүнээс илэрсэн pull request ба нэгтгэлийн шийдвэрүүд.",
  "Plan revisions waiting for confirmation.": "Баталгаажуулалт хүлээж буй төлөвлөгөөний хувилбарууд.",
  "Structured questions waiting for a board response.": "Удирдах зөвлөлийн хариу хүлээж буй бүтэцлэгдсэн асуултууд.",
  "Attention items whose issue has a pull_request work product.":
    "pull_request төрлийн ажлын бүтээгдэхүүнтэй даалгаврын анхаарах зүйлс.",
  "Pending request_confirmation interactions bound to the issue's plan document.":
    "Даалгаврын төлөвлөгөөний баримтад холбогдсон, хүлээгдэж буй request_confirmation харилцан үйлдлүүд.",
  "Pending ask_user_questions interactions.": "Хүлээгдэж буй ask_user_questions харилцан үйлдлүүд.",
  Received: "Хүлээн авсан",
  Coalesced: "Нэгтгэсэн",
  "Issue created": "Даалгавар үүссэн",
  manual: "гараар",
};

const ATTENTION_LABELS = [
  "Confirmation requested",
  "Selection confirmation requested",
  "Questions need answers",
  "Suggested tasks need a decision",
  "Item verdicts need a decision",
  "Interaction needs a decision",
];

const QUEUE_SEED_TEXTS = [
  "PRs",
  "Plans",
  "Questions",
  "Pull-request and merge decisions detected from issue work products.",
  "Attention items whose issue has a pull_request work product.",
  "Plan revisions waiting for confirmation.",
  "Pending request_confirmation interactions bound to the issue's plan document.",
  "Structured questions waiting for a board response.",
  "Pending ask_user_questions interactions.",
];

const HISTORY_VALUES = [
  "low",
  "medium",
  "high",
  "critical",
  "active",
  "paused",
  "archived",
  "coalesce if active",
  "always enqueue",
  "skip if active",
  "skip missed",
  "enqueue missed with cap",
  "coalesce_if_active",
  "enqueue_missed_with_cap",
];

describe("Ү6 7.10 helper-ууд (en)", () => {
  it("en дээр серверийн англи утгыг байт ижлээр буцаана", () => {
    expect(xoSkillSourceLabel("Paperclip bundled")).toBe("Paperclip bundled");
    expect(xoSkillSourceLabel("Paperclip workspace")).toBe("Paperclip workspace");
    expect(xoSkillSourceLabel("owner/repo")).toBe("owner/repo");
    expect(xoSkillVersionLabel("Initial version")).toBe("Initial version");
    expect(xoSkillVersionLabel("v2 tweaks")).toBe("v2 tweaks");
    expect(xoSkillTestTemplateText("Default test template")).toBe("Default test template");
    expect(xoSkillTestTemplateText("Paperclip's read-only default harness instructions for Skills Studio runs.")).toBe(
      "Paperclip's read-only default harness instructions for Skills Studio runs.",
    );
    for (const v of [...ATTENTION_LABELS, "Plan approval - Ship it"]) {
      expect(xoAttentionInteractionLabel(v)).toBe(v);
      expect(xoAttentionWhyNow(`${v} on an issue thread.`)).toBe(`${v} on an issue thread.`);
    }
    expect(xoAttentionWhyNow("Something else.")).toBe("Something else.");
    for (const v of [...QUEUE_SEED_TEXTS, "My queue"]) {
      expect(xoDecisionQueueSeedText(v)).toBe(v);
    }
    for (const v of ["schedule", "manual", "api", "webhook"]) {
      expect(xoRoutineRunSourceLabel(v)).toBe(v);
    }
    expect(xoRoutineTriggerLabel(null, "schedule")).toBe("schedule");
    expect(xoRoutineTriggerLabel(undefined, "webhook")).toBe("webhook");
    expect(xoRoutineTriggerLabel("schedule", "schedule")).toBe("schedule");
    expect(xoRoutineTriggerLabel("", "schedule")).toBe("");
    expect(xoRoutineTriggerLabel("Nightly", "schedule")).toBe("Nightly");
    for (const v of [...HISTORY_VALUES, "something"]) {
      expect(xoRoutineHistoryValueLabel(v)).toBe(v);
    }
    expect(xoStatusLabel("issue_created", "issue created")).toBe("issue created");
    expect(xoStatusLabel("received", "received")).toBe("received");
  });
});

describe("Ү6 7.10 helper-ууд (mn)", () => {
  beforeAll(() => {
    i18n.addResourceBundle("mn", "xo", Y6_7_10_MN, true, false);
  });

  it("mn дээр skill-ийн эх сурвалж, хувилбар, туршилтын загварыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoSkillSourceLabel("Paperclip bundled")).toBe("XO-ийн багц");
    expect(xoSkillSourceLabel("Paperclip workspace")).toBe("XO-ийн ажлын талбар");
    expect(xoSkillSourceLabel("owner/repo")).toBe("owner/repo");
    expect(xoSkillVersionLabel("Initial version")).toBe("Анхны хувилбар");
    expect(xoSkillVersionLabel("v2 tweaks")).toBe("v2 tweaks");
    expect(xoSkillTestTemplateText("Default test template")).toBe("Туршилтын анхдагч загвар");
    expect(xoSkillTestTemplateText("Paperclip's read-only default harness instructions for Skills Studio runs.")).toBe(
      "Чадварын студийн ажиллагаанд зориулсан XO-ийн зөвхөн уншигдах анхдагч орчны заавар.",
    );
    expect(xoSkillTestTemplateText("My template")).toBe("My template");
  });

  it("mn дээр attention-ийн харилцан үйлдлийн шошго ба whyNow-г орчуулна", async () => {
    await i18n.changeLanguage("mn");
    for (const v of ATTENTION_LABELS) {
      expect(xoAttentionInteractionLabel(v), v).not.toBe(v);
      expect(xoAttentionWhyNow(`${v} on an issue thread.`), v).toBe(
        `Даалгаврын сэдэвт: ${xoAttentionInteractionLabel(v)}.`,
      );
    }
    expect(xoAttentionInteractionLabel("Questions need answers")).toBe("Асуултад хариулт хэрэгтэй");
    expect(xoAttentionInteractionLabel("Confirmation requested")).toBe("Баталгаажуулалт хүссэн");
    expect(xoAttentionInteractionLabel("Custom title")).toBe("Custom title");
    expect(xoAttentionWhyNow("Custom title on an issue thread.")).toBe("Custom title on an issue thread.");
    expect(xoAttentionWhyNow("Something else.")).toBe("Something else.");
  });

  it("mn дээр шийдвэрийн дарааллын seed текстийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    for (const v of QUEUE_SEED_TEXTS) {
      expect(xoDecisionQueueSeedText(v), v).not.toBe(v);
    }
    expect(xoDecisionQueueSeedText("Questions")).toBe("Асуултууд");
    expect(xoDecisionQueueSeedText("Structured questions waiting for a board response.")).toBe(
      "Удирдах зөвлөлийн хариу хүлээж буй бүтэцлэгдсэн асуултууд.",
    );
    expect(xoDecisionQueueSeedText("Pending ask_user_questions interactions.")).toBe(
      "Хүлээгдэж буй ask_user_questions харилцан үйлдлүүд.",
    );
    expect(xoDecisionQueueSeedText("My queue")).toBe("My queue");
  });

  it("mn дээр тогтмол ажлын ажиллагааны эх сурвалж, төлөв, идэвхжүүлэгч, түүхийн утгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoRoutineRunSourceLabel("schedule")).toBe("хуваарь");
    expect(xoRoutineRunSourceLabel("webhook")).toBe("вэбхүүк");
    expect(xoRoutineRunSourceLabel("manual")).toBe("гараар");
    expect(xoRoutineRunSourceLabel("api")).toBe("api");
    expect(xoRoutineTriggerLabel(null, "schedule")).toBe("хуваарь");
    expect(xoRoutineTriggerLabel("schedule", "schedule")).toBe("хуваарь");
    expect(xoRoutineTriggerLabel("Nightly", "schedule")).toBe("Nightly");
    expect(xoRoutineTriggerLabel("", "schedule")).toBe("");
    expect(xoStatusLabel("received", "received")).toBe("Хүлээн авсан");
    expect(xoStatusLabel("coalesced", "coalesced")).toBe("Нэгтгэсэн");
    expect(xoStatusLabel("skipped", "skipped")).toBe("Алгассан");
    expect(xoStatusLabel("issue_created", "issue created")).toBe("Даалгавар үүссэн");
    for (const v of HISTORY_VALUES) {
      expect(xoRoutineHistoryValueLabel(v), v).not.toBe(v);
    }
    expect(xoRoutineHistoryValueLabel("medium")).toBe("Дунд");
    expect(xoRoutineHistoryValueLabel("paused")).toBe("Түр зогссон");
    expect(xoRoutineHistoryValueLabel("coalesce if active")).toBe("Идэвхтэй бол нэгтгэх");
    expect(xoRoutineHistoryValueLabel("coalesce_if_active")).toBe("Идэвхтэй бол нэгтгэх");
    expect(xoRoutineHistoryValueLabel("skip missed")).toBe("Алдсаныг алгасах");
    expect(xoRoutineHistoryValueLabel("something")).toBe("something");
  });
});

const Y6_7_11_MN: Record<string, string> = {
  "Created routine": "Тогтмол ажил үүсгэсэн",
  "Updated routine": "Тогтмол ажлыг шинэчилсэн",
  "Rotated webhook trigger secret": "Вэбхүүк идэвхжүүлэгчийн нууц утгыг сэлгэсэн",
  "Created {{kind}} trigger": "Идэвхжүүлэгч үүсгэсэн: {{kind}}",
  "Updated {{kind}} trigger": "Идэвхжүүлэгчийг шинэчилсэн: {{kind}}",
  "Deleted {{kind}} trigger": "Идэвхжүүлэгчийг устгасан: {{kind}}",
  "Restored from revision {{number}}": "{{number}} дугаар хувилбараас сэргээсэн",
  "Bundled {{brand}} skills are read-only.": "{{brand}}-ийн багцад орсон чадварууд зөвхөн уншигдана.",
  "Skills.sh-managed skills are read-only.": "Skills.sh-ийн удирддаг чадварууд зөвхөн уншигдана.",
  "Remote GitHub skills are read-only. Fork or import locally to edit them.":
    "Алсын GitHub чадварууд зөвхөн уншигдана. Засварлахын тулд салаалах эсвэл локалд импортлоно уу.",
  "URL-based skills are read-only. Save them locally to edit them.":
    "URL-д суурилсан чадварууд зөвхөн уншигдана. Засварлахын тулд локалд хадгална уу.",
  "This skill source is read-only.": "Энэ чадварын эх сурвалж зөвхөн уншигдана.",
  "Plan approval - {{title}}": "Төлөвлөгөөний баталгаажуулалт - {{title}}",
  schedule: "хуваарь",
  webhook: "вэбхүүк",
  "Confirmation requested": "Баталгаажуулалт хүссэн",
};

const ROUTINE_CHANGE_SUMMARIES = [
  "Created routine",
  "Updated routine",
  "Rotated webhook trigger secret",
  "Created schedule trigger",
  "Updated webhook trigger",
  "Deleted api trigger",
  "Restored from revision 3",
];

const SKILL_EDITABLE_REASONS = [
  "Bundled Paperclip skills are read-only.",
  "Skills.sh-managed skills are read-only.",
  "Remote GitHub skills are read-only. Fork or import locally to edit them.",
  "URL-based skills are read-only. Save them locally to edit them.",
  "This skill source is read-only.",
];

describe("Ү6 7.11 helper-ууд (en)", () => {
  it("en дээр серверийн утгыг өөрчлөлтгүй буцаана", async () => {
    await i18n.changeLanguage("en");
    for (const v of [...ROUTINE_CHANGE_SUMMARIES, "My own note", "Created custom trigger"]) {
      expect(xoRoutineChangeSummary(v)).toBe(v);
    }
    for (const v of [...SKILL_EDITABLE_REASONS, "Something else."]) {
      expect(xoSkillEditableReason(v)).toBe(v);
    }
    for (const v of ["Plan approval - Ship it", "Confirmation requested", "Custom title"]) {
      expect(xoAttentionTitle(v)).toBe(v);
    }
  });
});

describe("Ү6 7.11 helper-ууд (mn)", () => {
  beforeAll(() => {
    i18n.addResourceBundle("mn", "xo", Y6_7_11_MN, true, false);
  });

  it("mn дээр тогтмол ажлын changeSummary-г орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoRoutineChangeSummary("Created routine")).toBe("Тогтмол ажил үүсгэсэн");
    expect(xoRoutineChangeSummary("Updated routine")).toBe("Тогтмол ажлыг шинэчилсэн");
    expect(xoRoutineChangeSummary("Rotated webhook trigger secret")).toBe("Вэбхүүк идэвхжүүлэгчийн нууц утгыг сэлгэсэн");
    expect(xoRoutineChangeSummary("Created schedule trigger")).toBe("Идэвхжүүлэгч үүсгэсэн: хуваарь");
    expect(xoRoutineChangeSummary("Updated webhook trigger")).toBe("Идэвхжүүлэгчийг шинэчилсэн: вэбхүүк");
    expect(xoRoutineChangeSummary("Deleted api trigger")).toBe("Идэвхжүүлэгчийг устгасан: api");
    expect(xoRoutineChangeSummary("Restored from revision 12")).toBe("12 дугаар хувилбараас сэргээсэн");
    expect(xoRoutineChangeSummary("My own note")).toBe("My own note");
    expect(xoRoutineChangeSummary("Restored from revision x")).toBe("Restored from revision x");
  });

  it("mn дээр skill-ийн editableReason-ийг орчуулна (брэнд XO)", async () => {
    await i18n.changeLanguage("mn");
    for (const v of SKILL_EDITABLE_REASONS) {
      expect(xoSkillEditableReason(v), v).not.toBe(v);
    }
    expect(xoSkillEditableReason("Bundled Paperclip skills are read-only.")).toBe(
      "XO-ийн багцад орсон чадварууд зөвхөн уншигдана.",
    );
    expect(xoSkillEditableReason("Something else.")).toBe("Something else.");
  });

  it("mn дээр attention гарчгийн «Plan approval - » угтварыг орчуулж, issue гарчгийг хэвээр үлдээнэ", async () => {
    await i18n.changeLanguage("mn");
    expect(xoAttentionTitle("Plan approval - Ship it")).toBe("Төлөвлөгөөний баталгаажуулалт - Ship it");
    expect(xoAttentionTitle("Plan approval - {{x}} & <b>")).toBe("Төлөвлөгөөний баталгаажуулалт - {{x}} & <b>");
    expect(xoAttentionTitle("Confirmation requested")).toBe("Баталгаажуулалт хүссэн");
    expect(xoAttentionTitle("Custom title")).toBe("Custom title");
  });
});

describe("xoBrandVars", () => {
  it("en дээр BASE-ийн «Paperclip»-ийг буцааж, mn дээр XO брэнд өгнө", async () => {
    expect(xoBrandVars()).toEqual({ brand: "Paperclip" });
    await i18n.changeLanguage("mn");
    expect(xoBrandVars()).toEqual({ brand: "XO" });
  });
});
