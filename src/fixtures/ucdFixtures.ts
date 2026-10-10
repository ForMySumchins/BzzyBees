import { BusinessProfile } from '../types/ucd';
import { SeededScenario } from '../types/concierge';

export const mockHvacBusinessWarm: BusinessProfile = {
  id: 'biz_sumchin_hvac_01',
  businessName: 'Sumchin Family Heating & Air',
  tradeType: 'HVAC / Heating & Cooling',
  operatingHours: {
    timezone: 'America/New_York',
    weekday: '08:00 - 17:00 EST',
    isCurrentlyOpen: true,
  },
  contactEmail: 'dispatch@sumchinhvac.mock',
  contactPhoneMock: '(555) 019-2831',
  personality: {
    formality: 'casual',
    warmth: 'high',
    initiative: 'proactive',
    preferredPhrasing: {
      greeting: "Hello there! Welcome to Sumchin Family Heating & Air. I'm your AI assistant, here to assist with your HVAC questions.",
      qualificationPrompt: "We'd love to help! Could you share what kind of equipment (heat pump, furnace, AC) is acting up and what symptoms you're seeing?",
      consentRequest: "To pass your details to our technician for a human callback, I'll need your explicit consent first.",
      acknowledgment: "Thank you! I've noted down all the details for our team.",
      afterHoursNote: "Our shop is currently closed for standard service, but I'll log this interaction for early priority review.",
      safetyUrgentNote: "IMPORTANT SAFETY WARNING: If you smell gas, see smoke, or suspect carbon monoxide, please evacuate immediately and call 911 or your local gas utility!",
    },
  },
  serviceCapabilities: [
    'Residential AC Maintenance & Repair',
    'Furnace & Heat Pump Inspection',
    'Ductless Mini-Split Installation Estimates',
    'Filter Replacement Guidance',
  ],
  disclaimers: {
    aiDisclosure: 'I am an AI assistant for Sumchin Family Heating & Air.',
    offlineNotice: 'Mock / Offline Demo: No real phone call, SMS, or dispatch will be triggered.',
    emergencyGuidance: 'This AI assistant does not replace emergency services. In case of immediate safety threats, gas leaks, or fire, call 911 or your local emergency utility directly.',
    noBookingOrPriceGuarantee: 'I cannot confirm exact dispatch times, final repair pricing, or remote diagnoses. Our team will review your record.',
  },
};

export const mockHvacBusinessFormal: BusinessProfile = {
  ...mockHvacBusinessWarm,
  id: 'biz_sumchin_hvac_02',
  businessName: 'Apex Precision HVAC Solutions',
  personality: {
    formality: 'formal',
    warmth: 'low',
    initiative: 'guided',
    preferredPhrasing: {
      greeting: "Good day. You have reached Apex Precision HVAC Solutions. I am an AI assistant designed to guide your service intake.",
      qualificationPrompt: "Please specify the nature of your request, including system model, age, and observed issue.",
      consentRequest: "Prior to capturing contact records for contractor review, explicit consent is required under our privacy protocol.",
      acknowledgment: "Your information has been logged into the review queue for contractor analysis.",
      afterHoursNote: "Please note that Apex operating hours have concluded for today. This submission will be queued for review next business day.",
      safetyUrgentNote: "CRITICAL SAFETY NOTICE: In the event of gas odor, fire hazard, or CO alarm activation, evacuate premises and contact emergency services immediately.",
    },
  },
};

export const seededScenarios: SeededScenario[] = [
  {
    id: 'scenario_safety_urgent',
    name: 'Safety / Gas Smell (Urgent)',
    description: 'Customer reports smelling gas or rotten egg odor near the furnace unit.',
    expectedTriage: 'safety_urgent',
    initialUserMessage: 'I smell a strong gas odor near my basement furnace and the alarm is chirping!',
    isAfterHours: false,
    simulatedInputCategory: 'gas_leak_safety',
  },
  {
    id: 'scenario_after_hours',
    name: 'After-Hours AC Outage',
    description: 'Customer reports AC unit stopped blowing cold air at 9 PM on a weekend.',
    expectedTriage: 'after_hours',
    initialUserMessage: 'Our air conditioner stopped cooling tonight around 9 PM and it is getting warm inside.',
    isAfterHours: true,
    simulatedInputCategory: 'hvac_cooling',
  },
  {
    id: 'scenario_routine_estimate',
    name: 'Routine Estimate / Maintenance',
    description: 'Customer wants a quote for an annual heating tune-up and filter replacement.',
    expectedTriage: 'routine_estimate',
    initialUserMessage: 'Hi, I would like to schedule a routine seasonal tune-up for my heat pump before winter.',
    isAfterHours: false,
    simulatedInputCategory: 'hvac_heating',
  },
];
