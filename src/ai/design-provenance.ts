export interface AgentPromptHistoryEntry {
  prompt: string;
  createdAt: string;
  tools: string[];
}

export interface AgentDesignProvenance {
  source: "ai-agent";
  prompt: string;
  promptHistory: AgentPromptHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

const provenanceByCanvas = new WeakMap<object, AgentDesignProvenance>();

function cloneProvenance(
  provenance: AgentDesignProvenance,
): AgentDesignProvenance {
  return {
    ...provenance,
    promptHistory: provenance.promptHistory.map((entry) => ({
      ...entry,
      tools: [...entry.tools],
    })),
  };
}

function cleanPrompt(value: unknown): string {
  return String(value || "").trim();
}

function getPromptKey(value: unknown): string {
  return cleanPrompt(value).replace(/\s+/g, " ");
}

function normalizeHistoryEntry(value: any): AgentPromptHistoryEntry | null {
  const prompt = cleanPrompt(typeof value === "string" ? value : value?.prompt);
  if (!prompt) return null;

  return {
    prompt,
    createdAt: String(value?.createdAt || new Date().toISOString()),
    tools: Array.isArray(value?.tools)
      ? value.tools.map((tool: unknown) => String(tool)).filter(Boolean)
      : [],
  };
}

export function recordAgentDesignPrompt(
  canvas: object,
  prompt: string,
  toolName: string,
): AgentDesignProvenance | null {
  const cleanedPrompt = cleanPrompt(prompt);
  if (!canvas || !cleanedPrompt) return null;

  const now = new Date().toISOString();
  const current = provenanceByCanvas.get(canvas);

  if (!current) {
    const next: AgentDesignProvenance = {
      source: "ai-agent",
      prompt: cleanedPrompt,
      promptHistory: [
        {
          prompt: cleanedPrompt,
          createdAt: now,
          tools: toolName ? [toolName] : [],
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    provenanceByCanvas.set(canvas, next);
    return cloneProvenance(next);
  }

  const lastEntry = current.promptHistory[current.promptHistory.length - 1];
  if (getPromptKey(lastEntry?.prompt) === getPromptKey(cleanedPrompt)) {
    if (toolName && !lastEntry.tools.includes(toolName)) {
      lastEntry.tools.push(toolName);
    }
  } else {
    current.promptHistory.push({
      prompt: cleanedPrompt,
      createdAt: now,
      tools: toolName ? [toolName] : [],
    });
  }

  current.updatedAt = now;
  provenanceByCanvas.set(canvas, current);
  return cloneProvenance(current);
}

export function getAgentDesignProvenance(
  canvas: object,
): AgentDesignProvenance | null {
  const provenance = provenanceByCanvas.get(canvas);
  return provenance ? cloneProvenance(provenance) : null;
}

export function clearAgentDesignProvenance(canvas: object): void {
  provenanceByCanvas.delete(canvas);
}

export function restoreAgentDesignProvenance(
  canvas: object,
  stickerMeta: any,
): AgentDesignProvenance | null {
  const prompt = cleanPrompt(stickerMeta?.prompt);
  if (!prompt || stickerMeta?.source !== "ai-agent") {
    clearAgentDesignProvenance(canvas);
    return null;
  }

  const history = Array.isArray(stickerMeta?.promptHistory)
    ? stickerMeta.promptHistory
        .map(normalizeHistoryEntry)
        .filter((entry): entry is AgentPromptHistoryEntry => !!entry)
    : [];
  const now = new Date().toISOString();
  const provenance: AgentDesignProvenance = {
    source: "ai-agent",
    prompt,
    promptHistory:
      history.length > 0
        ? history
        : [{ prompt, createdAt: stickerMeta?.createdAt || now, tools: [] }],
    createdAt: String(stickerMeta?.createdAt || history[0]?.createdAt || now),
    updatedAt: String(stickerMeta?.updatedAt || now),
  };

  provenanceByCanvas.set(canvas, provenance);
  return cloneProvenance(provenance);
}

export function buildStickerRecordMeta(
  canvasData: unknown,
  provenance: AgentDesignProvenance | null,
): Record<string, any> {
  const meta: Record<string, any> = { data: canvasData };
  if (!provenance) return meta;

  return {
    ...meta,
    prompt: provenance.prompt,
    promptHistory: provenance.promptHistory,
    source: provenance.source,
    createdAt: provenance.createdAt,
    updatedAt: provenance.updatedAt,
  };
}
