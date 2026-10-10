/**
 * Field Operator: Contractor-facing review and follow-up handoff
 */

import { MantisInteractionRecord } from './mantis';

export type ReviewStatus = 'pending' | 'reviewed' | 'callback_prepared' | 'archived';

export interface FieldOperatorQueueItem {
  record: MantisInteractionRecord;
  reviewStatus: ReviewStatus;
  reviewedAt?: string;
  contractorNotes?: string;
  mockProviderStatus: {
    adapterName: string;
    isOfflineMode: boolean;
    networkCallsPrevented: boolean;
    credentialsUsed: 'NONE';
    statusMessage: string;
  };
}
