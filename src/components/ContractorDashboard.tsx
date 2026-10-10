import React, { useState } from 'react';
import { FieldOperatorQueueItem, ReviewStatus } from '../types/fieldOperator';
import { MantisInteractionRecord } from '../types/mantis';
import { ShieldCheck, PhoneCall, Check, Clock, Layers, UserCheck, HardDrive, Filter } from 'lucide-react';

interface ContractorDashboardProps {
  capturedRecords: MantisInteractionRecord[];
  onClearRecords: () => void;
}

export const ContractorDashboard: React.FC<ContractorDashboardProps> = ({
  capturedRecords,
  onClearRecords,
}) => {
  const [queueItems, setQueueItems] = useState<FieldOperatorQueueItem[]>(() =>
    capturedRecords.map((record) => ({
      record,
      reviewStatus: 'pending' as ReviewStatus,
      mockProviderStatus: {
        adapterName: 'OfflineConciergeAdapter / MockProviderAdapter',
        isOfflineMode: true,
        networkCallsPrevented: true,
        credentialsUsed: 'NONE' as const,
        statusMessage: 'Local-only mock queue. Zero outbound telephony/API calls executed.',
      },
    }))
  );

  // Sync prop updates into queue items
  React.useEffect(() => {
    setQueueItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.record.id));
      const newItems = capturedRecords
        .filter((rec) => !existingIds.has(rec.id))
        .map((rec) => ({
          record: rec,
          reviewStatus: 'pending' as ReviewStatus,
          mockProviderStatus: {
            adapterName: 'OfflineConciergeAdapter / MockProviderAdapter',
            isOfflineMode: true,
            networkCallsPrevented: true,
            credentialsUsed: 'NONE' as const,
            statusMessage: 'Local-only mock queue. Zero outbound telephony/API calls executed.',
          },
        }));
      return [...newItems, ...prev];
    });
  }, [capturedRecords]);

  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const handleStatusChange = (recordId: string, newStatus: ReviewStatus) => {
    setQueueItems((items) =>
      items.map((item) => {
        if (item.record.id === recordId) {
          return {
            ...item,
            reviewStatus: newStatus,
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return item;
      })
    );
  };

  const filteredQueue = queueItems.filter((item) => {
    if (filterUrgency === 'all') return true;
    return item.record.urgencyState === filterUrgency;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Bzzy Bee Dashboard Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-lg leading-none">Bzzy Bee Dashboard</h2>
            <p className="text-xs text-slate-300 mt-1">
              Operator Review Queue & Mantis Evidence Records
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClearRecords}
            className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Reset Local Queue
          </button>
        </div>
      </div>

      {/* Mock Provider Status Banner */}
      <div className="bg-emerald-950/90 border-b border-emerald-800 p-3 text-xs text-emerald-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Mock Provider Status:</strong> Offline / Sandboxed &bull; No Network Credentials Used &bull; Local-only Review Actions
          </span>
        </div>
        <span className="font-mono text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">
          CREDENTIALS: NONE
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Filter by Urgency:</span>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Triage States</option>
            <option value="safety_urgent">Safety / Urgent</option>
            <option value="after_hours">After-Hours</option>
            <option value="routine_estimate">Routine Estimate</option>
          </select>
        </div>

        <span className="text-slate-500 font-mono">
          Items in Queue: {filteredQueue.length}
        </span>
      </div>

      {/* Queue Item List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[380px] max-h-[500px]">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <HardDrive className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-medium">No interaction records captured yet.</p>
            <p className="text-xs">Use the Concierge Panel on the left or load a scenario to generate evidence.</p>
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.record.id}
              className={`bg-white rounded-lg border p-4 shadow-sm space-y-3 transition ${
                item.record.urgencyState === 'safety_urgent'
                  ? 'border-red-300 bg-red-50/20'
                  : item.record.urgencyState === 'after_hours'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Item Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                      item.record.urgencyState === 'safety_urgent'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : item.record.urgencyState === 'after_hours'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.record.urgencyState.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {item.record.id.slice(0, 16)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      item.reviewStatus === 'reviewed'
                        ? 'bg-sky-100 text-sky-800'
                        : item.reviewStatus === 'callback_prepared'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Status: {item.reviewStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Request Details & Trade Qualification */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Captured User Request:</span>
                  <p className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-800 mt-0.5">
                    "{item.record.requestSummary}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-600 block">Trade / Category:</span>
                    <span className="text-slate-800 font-medium">{item.record.tradeCategory}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-600 block">Fallback Reason:</span>
                    <span className="text-slate-800 font-medium">{item.record.fallbackReason}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block">Recommended Action:</span>
                  <p className="text-slate-600 italic">{item.record.recommendedAction}</p>
                </div>

                {/* Consent & Contact Details */}
                <div className="bg-slate-100 p-2.5 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>Consent State:</span>
                    </span>
                    {item.record.consentGiven ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        Explicit Consent Granted
                      </span>
                    ) : (
                      <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-[10px]">
                        Consent Pending / Blocked
                      </span>
                    )}
                  </div>

                  {item.record.consentGiven && item.record.contactDetails ? (
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700 font-mono">
                      <div>Name: {item.record.contactDetails.fullName || 'N/A'}</div>
                      <div>Phone: {item.record.contactDetails.phoneNumber || 'N/A'}</div>
                      <div>Email: {item.record.contactDetails.email || 'N/A'}</div>
                      <div>Address: {item.record.contactDetails.serviceAddress || 'N/A'}</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      Contact details hidden/blocked as explicit consent was not provided by user.
                    </p>
                  )}
                </div>
              </div>

              {/* Local-Only Review Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px] italic">
                  Local Actions (Non-sending / Mock Only)
                </span>

                <div className="flex items-center space-x-2">
                  {item.reviewStatus !== 'reviewed' && (
                    <button
                      onClick={() => handleStatusChange(item.record.id, 'reviewed')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium flex items-center space-x-1 transition"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mark Reviewed</span>
                    </button>
                  )}

                  {item.reviewStatus !== 'callback_prepared' && (
                    <button
                      onClick={() => handleStatusChange(item.record.id, 'callback_prepared')}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center space-x-1 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Prepare Callback</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
