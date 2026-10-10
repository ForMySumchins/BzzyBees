import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContractorDashboard } from '../components/ContractorDashboard';
import { MantisInteractionRecord } from '../types/mantis';

describe('Contractor Dashboard Acceptance Tests', () => {
  const sampleRecord: MantisInteractionRecord = {
    id: 'mantis_test_123',
    timestamp: new Date().toISOString(),
    businessId: 'biz_01',
    businessName: 'Test HVAC',
    tradeCategory: 'hvac_cooling',
    urgencyState: 'after_hours',
    requestSummary: 'AC unit non-responsive',
    userMessages: ['AC unit non-responsive'],
    consentGiven: true,
    contactDetails: {
      fullName: 'Jane Doe',
      phoneNumber: '555-0100',
      email: 'jane@example.mock',
      serviceAddress: '123 Main St',
    },
    fallbackReason: 'After hours inquiry',
    recommendedAction: 'Prepare morning callback',
    tradeQualificationNotes: ['Cooling issue logged'],
  };

  it('renders captured record, consent status, triage state, mock provider status, and allows local review actions', () => {
    render(
      <ContractorDashboard
        capturedRecords={[sampleRecord]}
        onClearRecords={() => {}}
      />
    );

    // Mock Provider Status
    expect(screen.getByText(/Mock Provider Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/CREDENTIALS: NONE/i)).toBeInTheDocument();

    // Triage badge specifically
    const triageBadge = screen.getAllByText(/after hours/i)[0];
    expect(triageBadge).toBeInTheDocument();

    expect(screen.getByText(/"AC unit non-responsive"/i)).toBeInTheDocument();

    // Consent info & contact details
    expect(screen.getByText(/Explicit Consent Granted/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();

    // Local review action button
    const reviewBtn = screen.getByRole('button', { name: /Mark Reviewed/i });
    expect(reviewBtn).toBeInTheDocument();

    fireEvent.click(reviewBtn);

    expect(screen.getByText(/Status: reviewed/i)).toBeInTheDocument();
  });
});
