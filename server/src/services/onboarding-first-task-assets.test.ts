import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import {
  ONBOARDING_FIRST_TASK_OPENING_INTERVIEW_OPTION_ID,
  ONBOARDING_FIRST_TASK_OPENING_QUESTION_ID,
  ONBOARDING_FIRST_TASK_OPENING_TASK_OPTION_ID,
  buildOnboardingFirstTaskBrief,
  buildOnboardingFirstTaskOpeningQuestion,
  buildOnboardingFirstAgentInstructionsBundle,
  fillFirstTaskPlaceholders,
  renderChiefOfStaffPersona,
  renderOnboardingFirstTaskGreeting,
  resolveOnboardingLocale,
} from "./onboarding-first-task-assets.js";

describe("fillFirstTaskPlaceholders", () => {
  it("fills the name and organization when present", () => {
    const out = fillFirstTaskPlaceholders(
      "I'm {{agentName}}, chief of staff for {{organizationName}}.",
      { agentName: "Ada", organizationName: "Acme" },
    );
    expect(out).toBe("I'm Ada, chief of staff for Acme.");
  });

  it("drops the name and its trailing separator when no name is set", () => {
    const out = fillFirstTaskPlaceholders("I'm {{agentName}}, your first agent teammate.", {
      agentName: null,
    });
    expect(out).toBe("I'm your first agent teammate.");
  });

  it("falls back to a generic organization label when missing", () => {
    const out = fillFirstTaskPlaceholders("for {{organizationName}}.", {});
    expect(out).toBe("for your organization.");
  });
});

describe("renderOnboardingFirstTaskGreeting", () => {
  it("renders the board-approved greeting with the agent name", async () => {
    const greeting = await renderOnboardingFirstTaskGreeting({ agentName: "Ada" });
    expect(greeting).toContain("Welcome to Paperclip! I'm Ada, your first agent teammate.");
    // The "what would you like to do" question moved onto the opening card.
    expect(greeting).not.toContain("What would you like to do?");
  });
});

describe("buildOnboardingFirstTaskOpeningQuestion", () => {
  it("builds the two-option opening card with a free-text task option", async () => {
    const payload = await buildOnboardingFirstTaskOpeningQuestion();
    expect(payload.version).toBe(1);
    expect(payload.supersedeOnUserComment).toBe(true);
    expect(payload.submitLabel).toBe("Continue");
    expect(payload.questions).toHaveLength(1);
    const [question] = payload.questions;
    expect(question.id).toBe(ONBOARDING_FIRST_TASK_OPENING_QUESTION_ID);
    expect(question.selectionMode).toBe("single");
    expect(question.required).toBe(true);
    expect(question.prompt).toBe("What would you like to do?");
    expect(question.options.map((option) => option.id)).toEqual([
      ONBOARDING_FIRST_TASK_OPENING_INTERVIEW_OPTION_ID,
      ONBOARDING_FIRST_TASK_OPENING_TASK_OPTION_ID,
    ]);
    expect(question.options[0].label).toBe(
      "Interview me and propose a plan and an agent team to execute it.",
    );
    expect(question.options[0].freeText).toBeUndefined();
    expect(question.options[1].label).toBe("I have a task in mind");
    expect(question.options[1].freeText).toBe(true);
  });
});

describe("buildOnboardingFirstTaskBrief", () => {
  it("assembles the brief with the confirmation proposal when the toggle is off", async () => {
    const brief = await buildOnboardingFirstTaskBrief({ usePlanProposal: false });
    expect(brief).toContain("This is the user's first task in Paperclip.");
    // Step 1 branches on the opening card's two option ids.
    expect(brief).toContain("Take the path the user picked.");
    expect(brief).toContain(`\`${ONBOARDING_FIRST_TASK_OPENING_INTERVIEW_OPTION_ID}\` →`);
    expect(brief).toContain(`\`${ONBOARDING_FIRST_TASK_OPENING_TASK_OPTION_ID}\` →`);
    // The confirmation form is inlined at the {{proposalStep}} slot.
    expect(brief).toContain("post ONE request_confirmation that says, in a few lines");
    expect(brief).not.toContain("{{proposalStep}}");
    // The plan-form-only wording must not appear.
    expect(brief).not.toContain("treat it like the plan path");
  });

  it("assembles the brief with the plan proposal when the toggle is on", async () => {
    const brief = await buildOnboardingFirstTaskBrief({ usePlanProposal: true });
    expect(brief).toContain("treat it like the plan path");
    expect(brief).not.toContain("post ONE request_confirmation that says, in a few lines");
    expect(brief).not.toContain("{{proposalStep}}");
  });
});

describe("chief-of-staff persona", () => {
  it("renders the persona with placeholders filled", async () => {
    const persona = await renderChiefOfStaffPersona({
      agentName: "Ada",
      organizationName: "Acme",
    });
    expect(persona).toContain("You are Ada, chief of staff for Acme.");
    expect(persona).toContain("# Hiring and delegation");
    expect(persona).not.toContain("{{agentName}}");
    expect(persona).not.toContain("{{organizationName}}");
  });

  it("returns an AGENTS.md-keyed bundle for the first agent", async () => {
    const bundle = await buildOnboardingFirstAgentInstructionsBundle({
      agentName: "Ada",
      organizationName: "Acme",
    });
    expect(bundle.entryFile).toBe("AGENTS.md");
    expect(bundle.files["AGENTS.md"]).toContain("You are Ada, chief of staff for Acme.");
  });
});

describe("mongolian onboarding variants", () => {
  it("resolves the locale only from an explicit mn setting", () => {
    expect(resolveOnboardingLocale({ interactionLanguage: "mn" })).toBe("mn");
    expect(resolveOnboardingLocale({ interactionLanguage: "en" })).toBe("en");
    expect(resolveOnboardingLocale({})).toBe("en");
    expect(resolveOnboardingLocale(undefined)).toBe("en");
  });

  it("renders the mongolian greeting with and without a name", async () => {
    expect(await renderOnboardingFirstTaskGreeting({ agentName: "Бат", locale: "mn" })).toBe(
      "XO-д тавтай морил! Би Бат, таны анхны агент хамтрагч. Хэрхэн эхлэхээ сонгоорой, үлдсэнийг нь би хариуцъя.",
    );
    expect(await renderOnboardingFirstTaskGreeting({ agentName: null, locale: "mn" })).toBe(
      "XO-д тавтай морил! Би таны анхны агент хамтрагч. Хэрхэн эхлэхээ сонгоорой, үлдсэнийг нь би хариуцъя.",
    );
  });

  it("builds the mongolian opening question with the fixed ids", async () => {
    const payload = await buildOnboardingFirstTaskOpeningQuestion("mn");
    const question = payload.questions[0];
    expect(question.id).toBe(ONBOARDING_FIRST_TASK_OPENING_QUESTION_ID);
    expect(question.prompt).toBe("Юу хийхийг хүсэж байна вэ?");
    expect(payload.submitLabel).toBe("Үргэлжлүүлэх");
    expect(question.options.map((o) => o.id)).toEqual([
      ONBOARDING_FIRST_TASK_OPENING_INTERVIEW_OPTION_ID,
      ONBOARDING_FIRST_TASK_OPENING_TASK_OPTION_ID,
    ]);
  });

  it("builds the mongolian brief with the selected proposal step", async () => {
    const confirmation = await buildOnboardingFirstTaskBrief({ usePlanProposal: false, locale: "mn" });
    expect(confirmation).toContain("Энэ бол хэрэглэгчийн XO дахь анхны ажил");
    expect(confirmation).toContain("request_confirmation");
    expect(confirmation).not.toContain("{{proposalStep}}");
    const plan = await buildOnboardingFirstTaskBrief({ usePlanProposal: true, locale: "mn" });
    expect(plan).toContain("энгийн ажлыг ч төлөвлөгөөний замаар");
  });

  it("uses the mongolian persona and organization fallback", async () => {
    const persona = await renderChiefOfStaffPersona({ agentName: "Бат", organizationName: null, locale: "mn" });
    expect(persona).toContain("Чи Бат, танай байгууллага-ын штабын дарга");
    expect(persona).toContain("paperclip-create-agent");
  });

  it("falls back to the english file when a mongolian variant is missing", async () => {
    // README.md has no .mn variant; english callers keep the english text.
    expect(await renderOnboardingFirstTaskGreeting({ agentName: "Ada" })).toContain("Welcome to Paperclip!");
  });

  it("falls back to english for locale mn when the .mn file is missing (ENOENT)", async () => {
    // Every asset the loaders read ships a .mn variant, so simulate a missing
    // one: reject only the .mn path with ENOENT and let the english read through.
    const realReadFile = fs.readFile.bind(fs);
    const spy = vi.spyOn(fs, "readFile").mockImplementation(((file: unknown, ...rest: unknown[]) => {
      if (String(file).endsWith("greeting.mn.md")) {
        return Promise.reject(Object.assign(new Error("ENOENT: no such file"), { code: "ENOENT" }));
      }
      return (realReadFile as (...a: unknown[]) => Promise<unknown>)(file, ...rest);
    }) as unknown as typeof fs.readFile);
    try {
      const out = await renderOnboardingFirstTaskGreeting({ agentName: "Ada", locale: "mn" });
      expect(out).toContain("Welcome to Paperclip!");
      expect(spy.mock.calls.some(([f]) => String(f).endsWith("greeting.mn.md"))).toBe(true);
    } finally {
      spy.mockRestore();
    }
  });
});
