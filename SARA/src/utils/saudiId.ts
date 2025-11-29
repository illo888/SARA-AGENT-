export function validateSaudiId(id: string): boolean {
  return /^1\d{9}$/.test(id);
}

export type ScenarioType = 'safe_gate' | 'in_saudi' | 'elder' | 'guest';

// Simple deterministic scenario mapping for mock/demo purposes
// Based on ID last digit (no birthdate needed)
export function determineScenario(id: string): ScenarioType {
  if (!validateSaudiId(id)) return 'guest';
  const last = Number(id[id.length - 1]);

  // Mock logic:
  // last digit 0-2 => safe_gate (outside KSA with privileges)
  // 3-6 => in_saudi (active services)
  // 7-8 => elder (simple mode)
  // 9 => guest
  if ([0, 1, 2].includes(last)) return 'safe_gate';
  if ([3, 4, 5, 6].includes(last)) return 'in_saudi';
  if ([7, 8].includes(last)) return 'elder';
  return 'guest';
}
