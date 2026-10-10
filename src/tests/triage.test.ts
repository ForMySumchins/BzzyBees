import { describe, it, expect } from 'vitest';
import { OfflineRulesAdapter } from '../adapters/offlineRulesAdapter';

describe('Deterministic Triage Engine Tests', () => {
  it('maps gas leak / safety triggers to safety_urgent triage and emergency guidance', () => {
    const res = OfflineRulesAdapter.evaluateMessage('I smell gas near my furnace!', false);

    expect(res.triageState).toBe('safety_urgent');
    expect(res.tradeCategory).toBe('gas_leak_safety');
    expect(res.urgencyScore).toBe(10);
    expect(res.fallbackReason).toContain('Safety critical condition');
  });

  it('maps after-hours requests to after_hours triage state', () => {
    const res = OfflineRulesAdapter.evaluateMessage('AC stopped cooling tonight', true);

    expect(res.triageState).toBe('after_hours');
    expect(res.tradeCategory).toBe('hvac_cooling');
    expect(res.urgencyScore).toBe(6);
    expect(res.fallbackReason).toContain('outside standard business hours');
  });

  it('maps routine estimate requests to routine_estimate triage state', () => {
    const res = OfflineRulesAdapter.evaluateMessage('Looking for a quote for a heat pump maintenance tune-up', false);

    expect(res.triageState).toBe('routine_estimate');
    expect(res.tradeCategory).toBe('hvac_heating');
    expect(res.urgencyScore).toBe(3);
    expect(res.fallbackReason).toContain('Standard routine service');
  });
});
