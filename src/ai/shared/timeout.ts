export class TimeoutError extends Error {
  constructor(
    message: string,
    public readonly timeoutMs: number,
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}

export const AI_TIMEOUTS = {
  chat: 300_000,
  planning: 120_000,
  knowledge: 90_000,
  tool: 180_000,
  resourceTool: 120_000,
  quickEvaluate: 120_000,
  brief: 180_000,
  batchDesign: 900_000,
  batchEvaluate: 180_000,
  batchSave: 300_000,
};

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(`${label} 超时`, timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof TimeoutError || (error as any)?.name === "TimeoutError"
  );
}
