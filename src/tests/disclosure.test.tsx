import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ConciergeView } from '../components/ConciergeView';
import { mockHvacBusinessWarm } from '../fixtures/ucdFixtures';

describe('Initial Disclosure Acceptance Tests', () => {
  it('uses "AI assistant" and does NOT contain "automated" or "automated system"', () => {
    render(
      <ConciergeView
        businessProfile={mockHvacBusinessWarm}
        onInteractionCaptured={() => {}}
        onScenarioSelect={() => {}}
        scenarios={[]}
      />
    );

    // Initial greeting and disclaimers rendered in component
    const pageText = document.body.textContent || '';

    // Must contain "AI assistant"
    expect(pageText).toContain('AI assistant');

    // Must NOT contain "automated" anywhere (case insensitive)
    expect(pageText.toLowerCase()).not.toContain('automated');
  });
});
