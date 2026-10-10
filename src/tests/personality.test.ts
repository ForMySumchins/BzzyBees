import { describe, it, expect } from 'vitest';
import { OfflineConciergeAdapter } from '../adapters/offlineConciergeAdapter';
import { mockHvacBusinessWarm, mockHvacBusinessFormal } from '../fixtures/ucdFixtures';

describe('UCD Personality Tests', () => {
  it('renders different phrasing per UCD business profile while producing identical triage outcomes', () => {
    const warmAdapter = new OfflineConciergeAdapter(mockHvacBusinessWarm);
    const formalAdapter = new OfflineConciergeAdapter(mockHvacBusinessFormal);

    const testInput = 'I smell gas in my home!';

    const warmResp = warmAdapter.processUserInput(testInput, []);
    const formalResp = formalAdapter.processUserInput(testInput, []);

    // Both must evaluate to safety_urgent triage state
    expect(warmResp.record.urgencyState).toBe('safety_urgent');
    expect(formalResp.record.urgencyState).toBe('safety_urgent');

    // Phrasing rendered must reflect respective UCD personality phrasing
    expect(warmResp.messages[0].text).toContain('IMPORTANT SAFETY WARNING');
    expect(formalResp.messages[0].text).toContain('CRITICAL SAFETY NOTICE');
  });
});
