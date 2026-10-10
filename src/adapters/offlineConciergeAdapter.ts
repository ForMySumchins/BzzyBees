import { BusinessProfile } from '../types/ucd';
import { ChatMessage } from '../types/concierge';
import { MantisInteractionRecord } from '../types/mantis';
import { OfflineRulesAdapter } from './offlineRulesAdapter';

export interface ConciergeResponse {
  messages: ChatMessage[];
  record: MantisInteractionRecord;
}

/**
 * MockProviderAdapter / OfflineConciergeAdapter
 * Operates 100% offline with zero network calls, credentials, or third-party APIs.
 */
export class OfflineConciergeAdapter {
  private businessProfile: BusinessProfile;

  constructor(businessProfile: BusinessProfile) {
    this.businessProfile = businessProfile;
  }

  public setBusinessProfile(profile: BusinessProfile) {
    this.businessProfile = profile;
  }

  public generateInitialGreeting(): ChatMessage {
    const disclosure = this.businessProfile.disclaimers.aiDisclosure;
    const greeting = this.businessProfile.personality.preferredPhrasing.greeting;

    return {
      id: `msg_init_${Date.now()}`,
      sender: 'assistant',
      text: `${disclosure}\n\n${greeting}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDisclosure: true,
    };
  }

  public processUserInput(
    userInput: string,
    existingMessages: ChatMessage[],
    isAfterHoursOverride?: boolean,
    consentGiven: boolean = false
  ): ConciergeResponse {
    const isAfterHours = isAfterHoursOverride ?? !this.businessProfile.operatingHours.isCurrentlyOpen;
    const evalResult = OfflineRulesAdapter.evaluateMessage(userInput, isAfterHours);
    const phrasing = this.businessProfile.personality.preferredPhrasing;

    const responseMessages: ChatMessage[] = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (evalResult.triageState === 'safety_urgent') {
      responseMessages.push({
        id: `msg_resp_${Date.now()}_1`,
        sender: 'assistant',
        text: `${phrasing.safetyUrgentNote}\n\n${this.businessProfile.disclaimers.emergencyGuidance}`,
        timestamp,
      });
      responseMessages.push({
        id: `msg_resp_${Date.now()}_2`,
        sender: 'assistant',
        text: `I have flagged your situation as URGENT for our team. However, please note that this is an offline demo and not an active emergency dispatch system.`,
        timestamp,
      });
    } else if (evalResult.triageState === 'after_hours') {
      responseMessages.push({
        id: `msg_resp_${Date.now()}_1`,
        sender: 'assistant',
        text: `${phrasing.afterHoursNote}\n\n${phrasing.qualificationPrompt}`,
        timestamp,
      });
    } else {
      responseMessages.push({
        id: `msg_resp_${Date.now()}_1`,
        sender: 'assistant',
        text: `${phrasing.acknowledgment} ${phrasing.qualificationPrompt}`,
        timestamp,
      });
    }

    if (!consentGiven) {
      responseMessages.push({
        id: `msg_resp_${Date.now()}_consent`,
        sender: 'assistant',
        text: `${phrasing.consentRequest}\n\nNotice: ${this.businessProfile.disclaimers.noBookingOrPriceGuarantee}`,
        timestamp,
        requiresConsent: true,
      });
    }

    const allUserTexts = existingMessages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text)
      .concat(userInput);

    const mantisRecord: MantisInteractionRecord = {
      id: `mantis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      businessId: this.businessProfile.id,
      businessName: this.businessProfile.businessName,
      tradeCategory: evalResult.tradeCategory,
      urgencyState: evalResult.triageState,
      requestSummary: userInput,
      userMessages: allUserTexts,
      consentGiven,
      fallbackReason: evalResult.fallbackReason,
      recommendedAction: evalResult.recommendedNextAction,
      tradeQualificationNotes: evalResult.tradeQualificationNotes,
    };

    return {
      messages: responseMessages,
      record: mantisRecord,
    };
  }
}
