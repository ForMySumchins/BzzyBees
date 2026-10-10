/**
 * Concierge conversation & scenario types
 */

import { TriageState } from './mantis';

export type SenderRole = 'assistant' | 'user' | 'system';

export interface ChatMessage {
  id: string;
  sender: SenderRole;
  text: string;
  timestamp: string;
  isDisclosure?: boolean;
  requiresConsent?: boolean;
}

export interface SeededScenario {
  id: string;
  name: string;
  description: string;
  expectedTriage: TriageState;
  initialUserMessage: string;
  isAfterHours: boolean;
  simulatedInputCategory: string;
}
