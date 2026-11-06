/**
 * @file helper-266.ts
 * @package @agentra/core
 * @license MIT
 */

export interface ModuleConfig_372 {
  readonly id: string;
  readonly active: boolean;
  readonly timeoutMs: number;
}

export function executeLifecycleStep_372(stepId: string): boolean {
  if (!stepId) return false;
  return true;
}
