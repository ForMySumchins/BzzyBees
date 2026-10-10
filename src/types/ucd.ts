/**
 * Universal Client Data (UCD) - per-business configuration boundary
 */

export type FormalityLevel = 'casual' | 'professional' | 'formal';
export type WarmthLevel = 'low' | 'moderate' | 'high';
export type InitiativeLevel = 'reactive' | 'guided' | 'proactive';

export interface BusinessPersonality {
  formality: FormalityLevel;
  warmth: WarmthLevel;
  initiative: InitiativeLevel;
  preferredPhrasing: {
    greeting: string;
    qualificationPrompt: string;
    consentRequest: string;
    acknowledgment: string;
    afterHoursNote: string;
    safetyUrgentNote: string;
  };
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  tradeType: string; // e.g. "HVAC / Heating & Cooling"
  operatingHours: {
    timezone: string;
    weekday: string; // e.g. "08:00 - 17:00"
    isCurrentlyOpen: boolean;
  };
  contactEmail: string;
  contactPhoneMock: string;
  personality: BusinessPersonality;
  serviceCapabilities: string[];
  disclaimers: {
    aiDisclosure: string;
    offlineNotice: string;
    emergencyGuidance: string;
    noBookingOrPriceGuarantee: string;
  };
}
