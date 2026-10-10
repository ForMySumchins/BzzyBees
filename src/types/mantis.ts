/**
 * Mantis: Captured, normalized interaction evidence
 */

export type TriageState = 'safety_urgent' | 'after_hours' | 'routine_estimate';

export type TradeCategory =
  | 'hvac_heating'
  | 'hvac_cooling'
  | 'hvac_ventilation'
  | 'gas_leak_safety'
  | 'general_inquiry';

export interface ContactFields {
  fullName: string;
  phoneNumber: string;
  email: string;
  serviceAddress: string;
}

export interface MantisInteractionRecord {
  id: string;
  timestamp: string;
  businessId: string;
  businessName: string;
  tradeCategory: TradeCategory;
  urgencyState: TriageState;
  requestSummary: string;
  userMessages: string[];
  consentGiven: boolean;
  consentTimestamp?: string;
  contactDetails?: Partial<ContactFields>;
  fallbackReason: string;
  recommendedAction: string;
  tradeQualificationNotes: string[];
}
