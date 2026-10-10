import React, { useState } from 'react';
import { ConciergeView } from './components/ConciergeView';
import { ContractorDashboard } from './components/ContractorDashboard';
import { mockHvacBusinessWarm, mockHvacBusinessFormal, seededScenarios } from './fixtures/ucdFixtures';
import { MantisInteractionRecord } from './types/mantis';
import { BusinessProfile } from './types/ucd';
import { SeededScenario } from './types/concierge';
import { Shield, Sparkles, Building2, RotateCcw, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile>(mockHvacBusinessWarm);
  const [currentScenario, setCurrentScenario] = useState<SeededScenario | null>(null);
  const [capturedRecords, setCapturedRecords] = useState<MantisInteractionRecord[]>([]);

  const handleInteractionCaptured = (record: MantisInteractionRecord) => {
    setCapturedRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [record, ...prev];
    });
  };

  const handleScenarioSelect = (scenario: SeededScenario) => {
    setCurrentScenario(scenario);
  };

  const handleResetDemo = () => {
    setCapturedRecords([]);
    setCurrentScenario(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Application Navbar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-black tracking-wider text-sm flex items-center space-x-1">
              <Shield className="w-5 h-5" />
              <span>BZZY CALLSHIELD</span>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-3">
              <h1 className="text-sm font-bold leading-none">Offline Conversational Concierge</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mantis Evidence &bull; UCD Configuration &bull; Bzzy Bee Operator
              </p>
            </div>
          </div>

          {/* Controls: UCD Personality Selector & Reset Button */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Business / UCD Personality Switcher */}
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-medium">UCD Personality:</span>
              <select
                value={currentBusiness.id}
                onChange={(e) => {
                  if (e.target.value === mockHvacBusinessWarm.id) {
                    setCurrentBusiness(mockHvacBusinessWarm);
                  } else {
                    setCurrentBusiness(mockHvacBusinessFormal);
                  }
                }}
                className="bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value={mockHvacBusinessWarm.id}>
                  Sumchin Family (Warm / Casual)
                </option>
                <option value={mockHvacBusinessFormal.id}>
                  Apex Precision (Formal / Precise)
                </option>
              </select>
            </div>

            {/* Reset State Button */}
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-medium flex items-center space-x-1 transition"
              title="Reset browser-local demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer-Facing Concierge Column */}
        <section className="flex flex-col h-full">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Customer Concierge View</span>
            </h2>
            <span className="text-[11px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-medium">
              AI Assistant Disclosure
            </span>
          </div>

          <ConciergeView
            businessProfile={currentBusiness}
            currentScenario={currentScenario}
            onInteractionCaptured={handleInteractionCaptured}
            onScenarioSelect={handleScenarioSelect}
            scenarios={seededScenarios}
          />
        </section>

        {/* Bzzy Bee Operator Column */}
        <section className="flex flex-col h-full">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>2. Bzzy Bee Queue</span>
            </h2>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
              Mantis Evidence &bull; Mock Adapter
            </span>
          </div>

          <ContractorDashboard
            capturedRecords={capturedRecords}
            onClearRecords={handleResetDemo}
          />
        </section>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-3 text-center text-xs">
        <p>
          BZZY CallShield UX Slice (CALLSHIELD-UX-001) &bull; Offline / Sandboxed Mock Adapters Only &bull; Zero Paid APIs
        </p>
      </footer>
    </div>
  );
};

export default App;
