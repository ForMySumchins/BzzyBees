import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConciergeView } from '../components/ConciergeView';
import { mockHvacBusinessWarm } from '../fixtures/ucdFixtures';

describe('Contact Capture Consent Gating Tests', () => {
  it('disables contact detail input fields until explicit consent checkbox is checked', () => {
    render(
      <ConciergeView
        businessProfile={mockHvacBusinessWarm}
        onInteractionCaptured={() => {}}
        onScenarioSelect={() => {}}
        scenarios={[]}
      />
    );

    const nameInput = screen.getByPlaceholderText('Full Name') as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText('Phone Number (Mock)') as HTMLInputElement;
    const consentCheckbox = screen.getByRole('checkbox', { name: /explicit consent required/i });

    // Initially disabled
    expect(nameInput.disabled).toBe(true);
    expect(phoneInput.disabled).toBe(true);

    // Click consent wrapped in act
    act(() => {
      consentCheckbox.click();
    });

    // Now enabled
    expect(nameInput.disabled).toBe(false);
    expect(phoneInput.disabled).toBe(false);
  });
});
