// @vitest-environment jsdom
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IssueQueuedCommentQueue } from "@paperclipai/shared";
import { i18n } from "@/i18n";
import { ThemeProvider } from "@/context/ThemeContext";
import { MemoryRouter } from "@/lib/router";
import { parseRunnerGoalCommand } from "./TaskChatComposer";
import { RuntimeQuestionHistory, TaskChatProtocolCard } from "./TaskChatProtocolCard";
import { TaskChatQueuedMessages } from "./TaskChatQueuedMessages";
import type { TaskChatProtocolItem, TaskChatRuntimeRequestItem } from "./task-chat-model";
import { humanizeToolName } from "./tool-taxonomy";
import { toolDisplayName, transcriptToTaskChatItems } from "./transcript-adapter";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("/goal алдаа", () => {
  it("en хэвээр", () => {
    expect(parseRunnerGoalCommand("/goal pause now")).toEqual({
      matched: true,
      error: "/goal pause does not accept extra arguments.",
    });
  });

  it("mn орчуулагдсан", async () => {
    await i18n.changeLanguage("mn");
    expect(parseRunnerGoalCommand("/goal pause now")).toEqual({
      matched: true,
      error: "/goal pause нэмэлт аргумент хүлээн авахгүй.",
    });
  });
});

describe("нэргүй хэрэгсэл", () => {
  it("en хэвээр", () => {
    expect(toolDisplayName(undefined)).toBe("Unnamed tool");
    expect(humanizeToolName("")).toBe("Unnamed tool");
  });

  it("mn орчуулагдсан", async () => {
    await i18n.changeLanguage("mn");
    expect(toolDisplayName(undefined)).toBe("Нэргүй хэрэгсэл");
    expect(humanizeToolName("")).toBe("Нэргүй хэрэгсэл");
  });
});

function thinking(seconds: number) {
  const end = new Date(Date.UTC(2026, 7, 21, 12, 0, seconds)).toISOString();
  return transcriptToTaskChatItems(
    [
      { kind: "thinking", ts: "2026-08-21T12:00:00.000Z", text: "", lifecycle: "started", channel: "summary" },
      { kind: "thinking", ts: end, text: "", lifecycle: "completed", channel: "summary" },
    ],
    { runId: "run-thought", running: true },
  );
}

describe("Thought for", () => {
  it("en хэвээр", () => {
    expect(thinking(2)).toEqual([expect.objectContaining({ summaryLabel: "Thought for 2s" })]);
    expect(thinking(75)).toEqual([expect.objectContaining({ summaryLabel: "Thought for 1m 15s" })]);
  });

  it("mn орчуулагдсан", async () => {
    await i18n.changeLanguage("mn");
    expect(thinking(2)).toEqual([expect.objectContaining({ summaryLabel: "2 с бодсон" })]);
    expect(thinking(75)).toEqual([expect.objectContaining({ summaryLabel: "1 мин 15 с бодсон" })]);
  });
});

describe("DOM", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    flushSync(() => root.unmount());
    container.remove();
  });

  const workspaceItem = {
    id: "workspace",
    kind: "protocol",
    surface: "workspace_change",
    changeSetId: "changes-1",
    revision: 1,
    source: "runner_verified",
    complete: true,
    files: [
      { path: "ui/src/App.tsx", operation: "modify", previousPath: null, additions: 1, deletions: 1, binary: false, diff: "-old\n+new" },
    ],
    totals: { files: 1, additions: 1, deletions: 1 },
    patchArtifactRef: null,
  } as unknown as TaskChatProtocolItem;

  function renderCard(item: TaskChatProtocolItem) {
    flushSync(() =>
      root.render(
        <MemoryRouter>
          <ThemeProvider>
            <TaskChatProtocolCard item={item} presentation="timeline" imageUploadHandler={async () => "blob:x"} />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );
  }

  it("ажлын талбарын өөрчлөлт: en хэвээр, mn орчуулагдсан", async () => {
    renderCard(workspaceItem);
    expect(container.textContent).toContain("1 file changed · +1 −1");
    await i18n.changeLanguage("mn");
    renderCard({ ...workspaceItem, id: "workspace-mn" } as TaskChatProtocolItem);
    expect(container.textContent).toContain("1 файл өөрчлөгдсөн · +1 −1");
  });

  const unansweredRequest = (status: "pending" | "resolved" | "cancelled" | "expired") =>
    ({
      id: `request-${status}`,
      kind: "protocol",
      surface: "runtime_request",
      runId: "run-1",
      requestId: `request-${status}`,
      requestKind: "user_input",
      turnId: "turn-1",
      requestType: "input",
      status,
      prompt: "Codex needs your input.",
      choices: [],
      fields: [],
      questionSet: {
        schema: "paperclip.question_set.v1",
        questions: [{ id: "q-1", prompt: "Which one?", required: true, answerMode: "text" }],
      },
      response: null,
    }) as unknown as TaskChatRuntimeRequestItem;

  // Хүлээгдэж буй хүсэлт карт дээр form харуулдаг тул fallback текстийг түүхийн хэсгээр шууд шалгана.
  function renderHistory(status: "pending" | "resolved" | "cancelled" | "expired") {
    flushSync(() => root.render(<RuntimeQuestionHistory item={unansweredRequest(status)} />));
    return container.textContent;
  }

  it("хариултгүй хүсэлтийн төлөв: en хэвээр", () => {
    expect(renderHistory("pending")).toContain("No answers were submitted; this request was pending.");
    expect(renderHistory("resolved")).toContain("Answer details were not recorded by this older runtime.");
    expect(renderHistory("cancelled")).toContain("No answers were submitted; this request was cancelled.");
    expect(renderHistory("expired")).toContain("No answers were submitted; this request was expired.");
  });

  it("хариултгүй хүсэлтийн төлөв: mn орчуулагдсан", async () => {
    await i18n.changeLanguage("mn");
    expect(renderHistory("pending")).toContain("Хариулт ирүүлээгүй; энэ хүсэлтийн төлөв: хүлээгдэж буй.");
    expect(renderHistory("resolved")).toContain("Энэ хуучин ажиллах орчин хариултын дэлгэрэнгүйг бүртгээгүй.");
    expect(renderHistory("cancelled")).toContain("Хариулт ирүүлээгүй; хүсэлт цуцлагдсан.");
    expect(renderHistory("expired")).toContain("Хариулт ирүүлээгүй; хүсэлтийн хугацаа дууссан.");
  });

  const queue = {
    issueId: "issue-1",
    queueId: "wake-1",
    state: "deferred",
    targetRunId: "run-1",
    revision: "rev-1",
    protocol: "paperclip_runner_v1",
    steeringDisposition: "unsupported",
    entries: [
      {
        comment: {
          id: "comment-1",
          companyId: "company-1",
          issueId: "issue-1",
          authorType: "user",
          authorAgentId: null,
          authorUserId: "user-1",
          body: "First queued message",
          presentation: null,
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        position: 0,
        canEdit: true,
        canDiscard: true,
      },
    ],
  } as IssueQueuedCommentQueue;

  function renderQueue() {
    flushSync(() =>
      root.render(
        <TaskChatQueuedMessages
          queue={queue}
          onEdit={vi.fn()}
          onReorder={vi.fn().mockResolvedValue(undefined)}
          onSteer={vi.fn().mockResolvedValue(undefined)}
          onDiscard={vi.fn().mockResolvedValue(undefined)}
        />,
      ),
    );
    return container.querySelector('[data-testid="task-chat-queued-steer-comment-1"]');
  }

  it("чиглүүлэлтийн title: en хэвээр, mn орчуулагдсан", async () => {
    expect(renderQueue()?.getAttribute("title")).toBe("This runner does not support steering");
    await i18n.changeLanguage("mn");
    expect(renderQueue()?.getAttribute("title")).toBe("Энэ гүйцэтгэгч чиглүүлэлт дэмжихгүй");
  });
});
