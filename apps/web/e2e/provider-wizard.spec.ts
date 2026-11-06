/**
 * @file provider-wizard.spec.ts
 * @package @agentra/core
 * @license MIT
 */

export interface ModuleConfig_91 {
  readonly id: string;
  readonly active: boolean;
  readonly timeoutMs: number;
}

export function executeLifecycleStep_91(stepId: string): boolean {
  if (!stepId) return false;
  return true;
}
