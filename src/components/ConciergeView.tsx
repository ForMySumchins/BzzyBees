import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types/ucd';
import { ChatMessage, SeededScenario } from '../types/concierge';
import { MantisInteractionRecord, ContactFields } from '../types/mantis';
import { OfflineConciergeAdapter } from '../adapters/offlineConciergeAdapter';
import { Shield, AlertTriangle, Send, CheckCircle2, PhoneCall, Info, Lock, Clock, MessageSquare, ListFilter } from 'lucide-react';

interface ConciergeViewProps {
  businessProfile: BusinessProfile;
  currentScenario?: SeededScenario | null;
  onInteractionCaptured: (record: MantisInteractionRecord) => void;
  onScenarioSelect: (scenario: SeededScenario) => void;
  scenarios: SeededScenario[];
}

export const ConciergeView: React.FC<ConciergeViewProps> = ({
  businessProfile,
  currentScenario,
  onInteractionCaptured,
  onScenarioSelect,
  scenarios,
}) => {
  const [adapter] = useState(() => new OfflineConciergeAdapter(businessProfile));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [viewMode, setViewMode] = useState<'conversational' | 'structured'>('conversational');

  // Consent & Contact details state
  const [hasConsent, setHasConsent] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactFields>({
    fullName: '',
    phoneNumber: '',
    email: '',
    serviceAddress: '',
  });

  // Fallback states
  const [activeFallback, setActiveFallback] = useState<'none' | 'callback' | 'message' | 'emergency'>('none');
  const [fallbackSubmitted, setFallbackSubmitted] = useState(false);
  const [lastCapturedRecord, setLastCapturedRecord] = useState<MantisInteractionRecord | null>(null);

  // Re-initialize when businessProfile changes
  useEffect(() => {
    adapter.setBusinessProfile(businessProfile);
    const initialGreeting = adapter.generateInitialGreeting();
    setMessages([initialGreeting]);
    setHasConsent(false);
    setFallbackSubmitted(false);
    setActiveFallback('none');
  }, [businessProfile, adapter]);

  // Handle scenario selection from prop
  useEffect(() => {
    if (currentScenario) {
      handleScenarioTrigger(currentScenario);
    }
  }, [currentScenario]);

  const handleScenarioTrigger = (scenario: SeededScenario) => {
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: scenario.initialUserMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [adapter.generateInitialGreeting(), userMsg];
    const conciergeResponse = adapter.processUserInput(
      scenario.initialUserMessage,
      newMessages,
      scenario.isAfterHours,
      hasConsent
    );

    const updatedMessages = [...newMessages, ...conciergeResponse.messages];
    setMessages(updatedMessages);

    const record: MantisInteractionRecord = {
      ...conciergeResponse.record,
      consentGiven: hasConsent,
      contactDetails: hasConsent ? contactDetails : undefined,
    };

    setLastCapturedRecord(record);
    onInteractionCaptured(record);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMsgs = [...messages, userMsg];
    setMessages(currentMsgs);

    const conciergeResponse = adapter.processUserInput(
      userText,
      currentMsgs,
      undefined,
      hasConsent
    );

    const updatedMessages = [...currentMsgs, ...conciergeResponse.messages];
    setMessages(updatedMessages);

    const record: MantisInteractionRecord = {
      ...conciergeResponse.record,
      consentGiven: hasConsent,
      contactDetails: hasConsent ? contactDetails : undefined,
    };

    setLastCapturedRecord(record);
    onInteractionCaptured(record);
  };

  const handleConsentToggle = (checked: boolean) => {
    setHasConsent(checked);
    if (lastCapturedRecord) {
      const updatedRecord: MantisInteractionRecord = {
        ...lastCapturedRecord,
        consentGiven: checked,
        consentTimestamp: checked ? new Date().toISOString() : undefined,
        contactDetails: checked ? contactDetails : undefined,
      };
      setLastCapturedRecord(updatedRecord);
      onInteractionCaptured(updatedRecord);
    }
  };

  const handleContactChange = (field: keyof ContactFields, value: string) => {
    const updated = { ...contactDetails, [field]: value };
    setContactDetails(updated);

    if (hasConsent && lastCapturedRecord) {
      const updatedRecord: MantisInteractionRecord = {
        ...lastCapturedRecord,
        contactDetails: updated,
      };
      setLastCapturedRecord(updatedRecord);
      onInteractionCaptured(updatedRecord);
    }
  };

  const handleFallbackSubmit = (type: string) => {
    setFallbackSubmitted(true);
    if (lastCapturedRecord) {
      const updatedRecord: MantisInteractionRecord = {
        ...lastCapturedRecord,
        fallbackReason: `User selected fallback path: ${type}`,
      };
      setLastCapturedRecord(updatedRecord);
      onInteractionCaptured(updatedRecord);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header with Disclosure & Business Info */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-lg">{businessProfile.businessName}</h2>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                {businessProfile.tradeType}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-sky-400 inline" />
              <span>{businessProfile.disclaimers.aiDisclosure}</span>
            </p>
          </div>

          {/* Mode Switcher & Seeded Scenario Pickers */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'conversational' ? 'structured' : 'conversational')}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition"
            >
              {viewMode === 'conversational' ? (
                <>
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Structured Intake View</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Conversational View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Offline Demo Banner */}
        <div className="mt-3 bg-amber-950/80 border border-amber-500/40 rounded p-2 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Demo Mode:</strong> No real calls, SMS, or live emergency dispatches will occur.
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Trigger Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600">Load Seeded Scenario:</span>
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onScenarioSelect(sc)}
            className={`px-2.5 py-1 rounded text-xs transition border font-medium ${
              currentScenario?.id === sc.id
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[380px] max-h-[500px]">
        {/* Safety Disclaimer Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-900 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Safety & Emergency Notice</p>
            <p>{businessProfile.disclaimers.emergencyGuidance}</p>
          </div>
        </div>

        {/* Conversational View vs Structured View */}
        {viewMode === 'conversational' ? (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : msg.isDisclosure
                      ? 'bg-sky-50 border border-sky-200 text-sky-950'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {msg.isDisclosure && (
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800 mb-1 border-b border-sky-200 pb-1">
                      <Shield className="w-3.5 h-3.5 text-sky-600" />
                      <span>AI Assistant Initial Disclosure</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Structured Intake View */
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
              <ListFilter className="w-4 h-4 text-amber-500" />
              <span>Structured Intake Overview (Mantis Evidence)</span>
            </h3>

            {lastCapturedRecord ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Trade Category:</span>
                    <span className="font-semibold text-slate-800">{lastCapturedRecord.tradeCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Triage State:</span>
                    <span className={`font-semibold ${
                      lastCapturedRecord.urgencyState === 'safety_urgent' ? 'text-red-600' : 'text-slate-800'
                    }`}>
                      {lastCapturedRecord.urgencyState}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-semibold">User Request Summary:</span>
                  <p className="p-2 bg-slate-50 rounded border text-slate-700">{lastCapturedRecord.requestSummary}</p>
                </div>

                <div>
                  <span className="text-slate-500 block font-semibold">Trade Qualification Notes:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {lastCapturedRecord.tradeQualificationNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">No interaction recorded yet. Send a message or load a scenario.</p>
            )}
          </div>
        )}

        {/* Explicit Consent & Contact Fields Section */}
        <div className="bg-slate-100 rounded-lg p-3.5 border border-slate-200 space-y-3">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={hasConsent}
              onChange={(e) => handleConsentToggle(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="consent-checkbox" className="text-xs text-slate-700 leading-relaxed">
              <strong>Explicit Consent Required:</strong> I agree to allow {businessProfile.businessName} to log my request and details for human review and potential callback. I understand this system is an <strong>AI assistant</strong> demo operating offline with zero live communications.
            </label>
          </div>

          {/* Contact Fields - Gated by Consent */}
          <div className={`space-y-2.5 pt-2 border-t border-slate-200 transition-opacity ${
            hasConsent ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Contact Information (Mock Callback Handoff)</span>
              {!hasConsent && <span className="text-amber-600 font-normal">(Blocked until consent checked)</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={contactDetails.fullName}
                disabled={!hasConsent}
                onChange={(e) => handleContactChange('fullName', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border rounded bg-white text-slate-800 disabled:bg-slate-100"
              />
              <input
                type="text"
                placeholder="Phone Number (Mock)"
                value={contactDetails.phoneNumber}
                disabled={!hasConsent}
                onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border rounded bg-white text-slate-800 disabled:bg-slate-100"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="Email Address"
                value={contactDetails.email}
                disabled={!hasConsent}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border rounded bg-white text-slate-800 disabled:bg-slate-100"
              />
              <input
                type="text"
                placeholder="Service Address / City"
                value={contactDetails.serviceAddress}
                disabled={!hasConsent}
                onChange={(e) => handleContactChange('serviceAddress', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border rounded bg-white text-slate-800 disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Visible Fallback Paths */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
          <span className="text-xs font-bold text-amber-900 block">Alternative Visible Fallback Options:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setActiveFallback('callback')}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded text-amber-900 font-medium hover:bg-amber-100 flex items-center space-x-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>Human Callback Request</span>
            </button>
            <button
              onClick={() => setActiveFallback('message')}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded text-amber-900 font-medium hover:bg-amber-100 flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Message Capture</span>
            </button>
            <button
              onClick={() => setActiveFallback('emergency')}
              className="px-2.5 py-1 bg-red-100 border border-red-300 rounded text-red-900 font-medium hover:bg-red-200 flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Emergency / Safety Guidance</span>
            </button>
          </div>

          {activeFallback === 'callback' && (
            <div className="mt-2 bg-white p-2.5 rounded border border-amber-200 text-xs space-y-2">
              <p className="font-semibold text-slate-800">Request Human Callback (Offline Mock):</p>
              <p className="text-slate-600">Clicking below queues a mock callback request in the contractor Field Operator panel without sending any SMS/call.</p>
              {!fallbackSubmitted ? (
                <button
                  onClick={() => handleFallbackSubmit('human_callback')}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400"
                >
                  Confirm Callback Request
                </button>
              ) : (
                <p className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Callback requested! Queued for Field Operator review.</span>
                </p>
              )}
            </div>
          )}

          {activeFallback === 'message' && (
            <div className="mt-2 bg-white p-2.5 rounded border border-amber-200 text-xs space-y-2">
              <p className="font-semibold text-slate-800">Leave Direct Message:</p>
              <p className="text-slate-600">Your message will be logged directly into the Mantis evidence record for contractor follow-up.</p>
              {!fallbackSubmitted ? (
                <button
                  onClick={() => handleFallbackSubmit('direct_message')}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400"
                >
                  Log Message to Mantis Record
                </button>
              ) : (
                <p className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message captured in Mantis record!</span>
                </p>
              )}
            </div>
          )}

          {activeFallback === 'emergency' && (
            <div className="mt-2 bg-red-100 border border-red-300 p-2.5 rounded text-xs space-y-1.5 text-red-950">
              <p className="font-bold flex items-center space-x-1 text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Emergency Safety Protocol</span>
              </p>
              <p>For gas leaks, active fire, or severe safety hazards:</p>
              <ol className="list-decimal list-inside font-semibold space-y-0.5">
                <li>Evacuate all occupants immediately.</li>
                <li>Do NOT operate electrical switches or open flames.</li>
                <li>Call 911 or your local natural gas emergency line.</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your HVAC inquiry or issue..."
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center space-x-1 transition shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
