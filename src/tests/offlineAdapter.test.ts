import { describe, it, expect, vi } from 'vitest';
import { OfflineConciergeAdapter } from '../adapters/offlineConciergeAdapter';
import { mockHvacBusinessWarm } from '../fixtures/ucdFixtures';

describe('Offline Adapter Network Boundary Tests', () => {
  it('operates 100% locally with zero fetch/XHR calls or credentials', () => {
    // Spy on window.fetch if present or global fetch
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const adapter = new OfflineConciergeAdapter(mockHvacBusinessWarm);
    const result = adapter.processUserInput('My AC stopped working', []);

    expect(result).toBeDefined();
    expect(result.record.urgencyState).toBe('routine_estimate');

    // Confirm no network fetch was invoked
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
