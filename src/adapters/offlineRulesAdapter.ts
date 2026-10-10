import { TriageState, TradeCategory } from '../types/mantis';

export interface RuleEvaluationResult {
  triageState: TriageState;
  tradeCategory: TradeCategory;
  urgencyScore: number; // 0 to 10
  fallbackReason: string;
  recommendedNextAction: string;
  tradeQualificationNotes: string[];
}

/**
 * Deterministic offline rules adapter.
 * Uses exact keyword matching and rules without any remote network calls or LLM dependencies.
 */
export class OfflineRulesAdapter {
  public static evaluateMessage(
    userMessage: string,
    isAfterHoursContext: boolean = false
  ): RuleEvaluationResult {
    const textLower = userMessage.toLowerCase();

    // 1. Check Safety / Urgent triggers
    const safetyKeywords = ['gas', 'smell', 'odor', 'rotten egg', 'smoke', 'fire', 'co alarm', 'carbon monoxide', 'sparks', 'sparking', 'leak', 'hissing'];
    const matchesSafety = safetyKeywords.some((kw) => textLower.includes(kw));

    if (matchesSafety) {
      return {
        triageState: 'safety_urgent',
        tradeCategory: textLower.includes('gas') ? 'gas_leak_safety' : 'hvac_heating',
        urgencyScore: 10,
        fallbackReason: 'Safety critical condition detected requiring immediate emergency/utility guidance.',
        recommendedNextAction: 'Instruct customer to evacuate if gas odor present and contact local utility / 911. Queue priority alert for contractor.',
        tradeQualificationNotes: [
          'Safety protocol triggered due to hazardous hazard keywords.',
          'No remote diagnosis or repair attempted.',
          'Advised evacuation and emergency service escalation.',
        ],
      };
    }

    // 2. Check After-Hours Context
    if (isAfterHoursContext) {
      const isCooling = textLower.includes('ac') || textLower.includes('cooling') || textLower.includes('air conditioner');
      return {
        triageState: 'after_hours',
        tradeCategory: isCooling ? 'hvac_cooling' : 'hvac_heating',
        urgencyScore: 6,
        fallbackReason: 'Inquiry received outside standard business hours.',
        recommendedNextAction: 'Record structured intake and queue for first-thing morning callback review.',
        tradeQualificationNotes: [
          'Non-emergency after-hours inquiry.',
          'Captured system symptoms for contractor review.',
          'Promised no immediate dispatch or live call.',
        ],
      };
    }

    // 3. Routine / General Estimate
    const isHeating = textLower.includes('heat') || textLower.includes('furnace') || textLower.includes('boiler');
    const isCooling = textLower.includes('ac') || textLower.includes('cool') || textLower.includes('air conditioning');

    let tradeCategory: TradeCategory = 'general_inquiry';
    if (isHeating) tradeCategory = 'hvac_heating';
    else if (isCooling) tradeCategory = 'hvac_cooling';

    return {
      triageState: 'routine_estimate',
      tradeCategory,
      urgencyScore: 3,
      fallbackReason: 'Standard routine service or estimate request during operating hours.',
      recommendedNextAction: 'Contractor to review system requirements and prepare follow-up estimate details.',
      tradeQualificationNotes: [
        'Routine request qualified for equipment type and symptoms.',
        'No price or schedule binding commitments made.',
      ],
    };
  }
}
