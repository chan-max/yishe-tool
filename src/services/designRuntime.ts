const WORKSPACE_SESSION_KEY = "yishe_tool_design_workspace_v1";
const LEGACY_MIGRATION_PREFIX = "yishe_tool_workspace_migrated:";

export interface DesignRuntimeSnapshot {
  workspaceId: string;
  workerId: string;
}

function normalizeRuntimeId(value: unknown): string {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9:_-]/g, "")
    .slice(0, 120);
}

function createRuntimeId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  return `${prefix}-${random}`;
}

function readRuntimeParam(key: string): string {
  if (typeof window === "undefined") return "";
  const search = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.split("?")[1] || "";
  const hash = new URLSearchParams(hashQuery);
  return normalizeRuntimeId(search.get(key) || hash.get(key));
}

const hasExplicitWorkspaceId = !!readRuntimeParam("workspaceId");

function getOrCreateWorkspaceId(): string {
  if (typeof window === "undefined") return "workspace-server";

  const fromUrl = readRuntimeParam("workspaceId");
  if (fromUrl) {
    sessionStorage.setItem(WORKSPACE_SESSION_KEY, fromUrl);
    return fromUrl;
  }

  const fromSession = normalizeRuntimeId(
    sessionStorage.getItem(WORKSPACE_SESSION_KEY),
  );
  if (fromSession) return fromSession;

  const workspaceId = createRuntimeId("workspace");
  sessionStorage.setItem(WORKSPACE_SESSION_KEY, workspaceId);
  return workspaceId;
}

const runtimeSnapshot: DesignRuntimeSnapshot = {
  workspaceId: getOrCreateWorkspaceId(),
  workerId: "",
};
runtimeSnapshot.workerId = `worker-${runtimeSnapshot.workspaceId}`;

export function getDesignRuntimeSnapshot(): DesignRuntimeSnapshot {
  return { ...runtimeSnapshot };
}

export function getDesignWorkspaceId(): string {
  return runtimeSnapshot.workspaceId;
}

export function getDesignWorkerId(): string {
  return runtimeSnapshot.workerId;
}

export function getWorkspaceStorageKey(baseKey: string): string {
  return `${baseKey}:${runtimeSnapshot.workspaceId}`;
}

export function migrateLegacyWorkspaceStorage(baseKey: string): string {
  const scopedKey = getWorkspaceStorageKey(baseKey);
  if (typeof window === "undefined") return scopedKey;
  if (hasExplicitWorkspaceId) return scopedKey;

  try {
    const migrationKey = `${LEGACY_MIGRATION_PREFIX}${scopedKey}`;
    if (
      localStorage.getItem(scopedKey) === null &&
      localStorage.getItem(migrationKey) !== "1"
    ) {
      const legacyValue = localStorage.getItem(baseKey);
      if (legacyValue !== null) {
        localStorage.setItem(scopedKey, legacyValue);
      }
      localStorage.setItem(migrationKey, "1");
    }
  } catch {
    // Storage can be unavailable in privacy mode. In-memory state still works.
  }

  return scopedKey;
}
