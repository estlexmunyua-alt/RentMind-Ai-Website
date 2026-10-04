import React, { useState } from 'react';
import { PRIMARY_PROFILE } from '../data/mockData';

interface SelectiveDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelectiveDisclosureModal: React.FC<SelectiveDisclosureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [recipient, setRecipient] = useState('Stima SACCO Credit Evaluation Committee');
  const [timeframe, setTimeframe] = useState<'6m' | '12m' | 'full'>('12m');
  const [includePayments, setIncludePayments] = useState(true);
  const [includeUtilities, setIncludeUtilities] = useState(true);
  const [includeDisputes, setIncludeDisputes] = useState(false);
  const [includeSplitBreakdown, setIncludeSplitBreakdown] = useState(true);
  const [minTier, setMinTier] = useState<'B' | 'C'>('B');
  const [expiryHours, setExpiryHours] = useState('72');

  const [generatedPass, setGeneratedPass] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePass = () => {
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `RM-PASS-${randomHash}-NBI`;
    setGeneratedPass(token);
    setPreviewMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="p-5 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
              Tenant Data Sovereignty Protocol
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold mt-0.5">
              Selective Disclosure & Cryptographic Audit Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#C5CBC0] hover:text-[#F3EEDF] rounded text-lg leading-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#1C1B16]">
          {!previewMode ? (
            <div className="space-y-4">
              <p className="text-[#55503F] leading-relaxed">
                Under the RentalMind Constitution, your housing record is never polled, scored, or sold behind your back. You issue an ephemeral, signed cryptographic pass restricted strictly to the categories and recipient you authorize.
              </p>

              {/* Recipient Input */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1B16]">
                  Designated Recipient / Auditing Entity
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16]"
                >
                  <option value="Stima SACCO Credit Evaluation Committee">Stima SACCO Credit Evaluation Committee</option>
                  <option value="Harambee SACCO Asset Financing">Harambee SACCO Asset Financing</option>
                  <option value="Kenya Commercial Bank (KCB) Housing Desk">Kenya Commercial Bank (KCB) Housing Desk</option>
                  <option value="Prospective Landlord / Agency (Kilimani Unit Handover)">Prospective Landlord / Agency (Kilimani Unit Handover)</option>
                  <option value="Custom Third-Party Auditor">Custom Third-Party Auditor</option>
                </select>
              </div>

              {/* Scope Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#D5CBB0]">
                <span className="font-semibold block text-[#1C1B16]">
                  Scoped Evidentiary Entitlements:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePayments}
                      onChange={(e) => setIncludePayments(e.target.checked)}
                      className="accent-[#7C5A2A]"
                    />
                    <span>12-Month Rent Clearance Records</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSplitBreakdown}
                      onChange={(e) => setIncludeSplitBreakdown(e.target.checked)}
                      className="accent-[#7C5A2A]"
                    />
                    <span>Sourced Split Payments (M-Pesa + Cash)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeUtilities}
                      onChange={(e) => setIncludeUtilities(e.target.checked)}
                      className="accent-[#7C5A2A]"
                    />
                    <span>KPLC Prepaid Stima & Water Ledgers</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDisputes}
                      onChange={(e) => setIncludeDisputes(e.target.checked)}
                      className="accent-[#7C5A2A]"
                    />
                    <span className="text-[#8A3F35] font-medium">Include Neutral Dispute Dockets</span>
                  </label>
                </div>
              </div>

              {/* Timeframe & Minimum Tier Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-semibold mb-1 text-[#1C1B16]">Historical Window</label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  >
                    <option value="6m">Last 6 Months</option>
                    <option value="12m">Last 12 Months</option>
                    <option value="full">Full Tenancy ({PRIMARY_PROFILE.durationMonths} Mos)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C1B16]">Minimum Confidence Tier</label>
                  <select
                    value={minTier}
                    onChange={(e) => setMinTier(e.target.value as any)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  >
                    <option value="B">Tier B (Counterparty Confirmed)</option>
                    <option value="C">Tier C (Independently Corroborated Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C1B16]">Pass Expiration</label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                  >
                    <option value="24">24 Hours</option>
                    <option value="72">72 Hours (3 Days)</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Auditor Preview View */
            <div className="space-y-4">
              <div className="p-3 bg-[#12201A] text-[#E0C080] rounded border border-[#34483E] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>TOKEN: {generatedPass}</span>
                  <span>EXPIRES: In {expiryHours} hours</span>
                </div>
                <div className="text-[11px] text-[#C5CBC0]">
                  Authorized for single-origin audit by: {recipient}
                </div>
              </div>

              <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-3">
                <span className="font-serif font-semibold text-sm text-[#1C1B16] block">
                  Simulated Underwriter View (What Stima SACCO Sees)
                </span>
                
                <div className="space-y-2 text-xs divide-y divide-[#D5CBB0]">
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[#55503F]">Tenant Attestation:</span>
                    <span className="font-semibold text-[#1C1B16]">{PRIMARY_PROFILE.tenantName}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[#55503F]">Audited Tenancy Duration:</span>
                    <span className="font-mono text-[#1C1B16]">{timeframe === '6m' ? '6 Months' : '12 Months'} Continuous Lease</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[#55503F]">Corroborated Monthly Rent:</span>
                    <span className="font-mono font-bold text-[#1C1B16]">KES {PRIMARY_PROFILE.monthlyRentKES.toLocaleString()} / mo</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[#55503F]">Minimum Evidence Threshold:</span>
                    <span className="font-mono text-[#7C5A2A] font-semibold">Tier {minTier} or higher</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[#55503F]">Private WhatsApp Logs & Disputes:</span>
                    <span className="text-[#7C5A2A] font-mono">
                      {includeDisputes ? 'Included neutrally' : 'REDACTED (Sovereign Choice)'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#ECE5D3] rounded text-[11px] text-[#55503F]">
                  ✓ All records verified through SHA-256 integrity hashes. No third-party data broker involvement.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-[#ECE5D3] border-t border-[#D5CBB0] flex items-center justify-between">
          {previewMode ? (
            <>
              <button
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 text-xs font-medium text-[#55503F] hover:text-[#1C1B16]"
              >
                ← Adjust Scope
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://rentalmind.ai/audit/${generatedPass}`);
                    alert(`Audit pass link copied to clipboard!\nShare token: ${generatedPass}`);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#12201A] text-[#E0C080] rounded hover:bg-[#1B2D25] transition-colors"
                >
                  Copy Cryptographic Link
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-semibold bg-[#E0C080] text-[#1C1B16] rounded hover:bg-[#ECD39B]"
                >
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#55503F] hover:text-[#1C1B16]"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePass}
                className="px-5 py-2.5 text-xs font-semibold bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] rounded transition-colors shadow-sm"
              >
                Issue Scoped Pass & Preview →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
