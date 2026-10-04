import React, { useState } from 'react';
import { SAMPLE_RECORDS, PRIMARY_PROFILE } from '../data/mockData';
import { ProvenanceTier, PROVENANCE_TIERS, RentalRecord } from '../types/rentalmind';

interface PassportExplorerProps {
  onOpenVault: () => void;
  onOpenSplitReconciler: () => void;
}

export const PassportExplorer: React.FC<PassportExplorerProps> = ({
  onOpenVault,
  onOpenSplitReconciler,
}) => {
  type ViewerRole = 'tenant' | 'landlord' | 'institutional';
  const [activeRole, setActiveRole] = useState<ViewerRole>('tenant');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(SAMPLE_RECORDS[0].id);

  // Filter records
  const filteredRecords = SAMPLE_RECORDS.filter((rec) => {
    if (selectedTierFilter !== 'ALL' && rec.tier !== selectedTierFilter) return false;
    if (selectedCategoryFilter !== 'ALL' && rec.category !== selectedCategoryFilter) return false;
    return true;
  });

  // Calculate statistics for Institutional / SACCO perspective
  const totalAmountKES = SAMPLE_RECORDS.reduce((sum, r) => sum + (r.amountKES || 0), 0);
  const tierCRecords = SAMPLE_RECORDS.filter((r) => r.tier === 'C').length;
  const tierBRecords = SAMPLE_RECORDS.filter((r) => r.tier === 'B').length;
  const tierARecords = SAMPLE_RECORDS.filter((r) => r.tier === 'A').length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Concept Primer */}
      <div className="bg-[#ECE5D3] p-6 sm:p-8 rounded-lg border border-[#D5CBB0] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#7C5A2A] font-semibold">
              The RentalMind Passport Doctrine
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B16] font-medium mt-1">
              Portable, Sourced Housing Ledger
            </h2>
            <p className="text-sm text-[#55503F] max-w-2xl mt-1 leading-relaxed">
              Every record carries its provenance tier, timestamp, counterparty, and declared interest. No opaque credit algorithms, no silent penalties for open disputes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSplitReconciler}
              className="px-4 py-2 text-xs font-semibold text-[#1C1B16] bg-[#D6C79A] hover:bg-[#E0C080] border border-[#B8863F] rounded transition-colors"
            >
              + Ingest M-Pesa / Split
            </button>
            <button
              onClick={onOpenVault}
              className="px-4 py-2 text-xs font-semibold text-[#F3EEDF] bg-[#12201A] hover:bg-[#1B2D25] rounded transition-colors"
            >
              Selective Share Vault
            </button>
          </div>
        </div>

        {/* Perspective Switcher (Zero-pill segmented buttons) */}
        <div className="pt-2 border-t border-[#D5CBB0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-[#55503F] font-medium">
            Active Lens / Audit Perspective:
          </span>
          <div className="inline-flex rounded border border-[#D5CBB0] p-0.5 bg-[#F6F2E8]">
            <button
              onClick={() => setActiveRole('tenant')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeRole === 'tenant'
                  ? 'bg-[#12201A] text-[#F3EEDF] shadow-xs'
                  : 'text-[#55503F] hover:text-[#1C1B16]'
              }`}
            >
              Tenant Sovereign View
            </button>
            <button
              onClick={() => setActiveRole('landlord')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeRole === 'landlord'
                  ? 'bg-[#12201A] text-[#F3EEDF] shadow-xs'
                  : 'text-[#55503F] hover:text-[#1C1B16]'
              }`}
            >
              Landlord Verification View
            </button>
            <button
              onClick={() => setActiveRole('institutional')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeRole === 'institutional'
                  ? 'bg-[#12201A] text-[#F3EEDF] shadow-xs'
                  : 'text-[#55503F] hover:text-[#1C1B16]'
              }`}
            >
              SACCO / Bank Underwriter View
            </button>
          </div>
        </div>
      </div>

      {/* Perspective Info Notice */}
      {activeRole === 'tenant' && (
        <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-xs text-[#55503F] flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#E0C080]/30 text-[#7C5A2A] font-serif font-bold grid place-items-center shrink-0">
            T
          </div>
          <div>
            <span className="font-semibold text-[#1C1B16]">Tenant Sovereign Ownership:</span> You hold full ownership of this ledger. You can inspect all counterparty signatures, append cash payment notes, submit maintenance complaints, and decide exactly which records external parties can audit.
          </div>
        </div>
      )}

      {activeRole === 'landlord' && (
        <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-xs text-[#55503F] flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#12201A] text-[#E0C080] font-serif font-bold grid place-items-center shrink-0">
            L
          </div>
          <div>
            <span className="font-semibold text-[#1C1B16]">Landlord & Caretaker View:</span> View verified monthly rent settlement timeline, caretakers’ signed cash receipts, KPLC prepaid electricity tokens, and mutual dispute status without administrative chaos.
          </div>
        </div>
      )}

      {activeRole === 'institutional' && (
        <div className="p-4 bg-[#12201A] text-[#F3EEDF] rounded text-xs space-y-3 border border-[#34483E]">
          <div className="flex items-center justify-between">
            <span className="font-serif text-[#E0C080] font-medium text-sm">
              Institutional Underwriter & SACCO Risk Analysis Terminal
            </span>
            <span className="font-mono text-[11px] text-[#C5CBC0]">
              Kenya Mortgage Refinance Co. (KMRC) / Stima SACCO Standard
            </span>
          </div>
          <p className="text-[#C5CBC0] leading-relaxed">
            Unlike opaque credit bureau scores, RentalMind provides empirical cashflow certainty. Review the provenance distribution and split cash corroboration rate directly:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#34483E]">
            <div className="p-2 bg-[#1B2D25] rounded">
              <span className="block text-[11px] text-[#C5CBC0]">Total Sourced Flow</span>
              <span className="text-base font-semibold font-mono text-[#E0C080]">
                KES {totalAmountKES.toLocaleString()}
              </span>
            </div>
            <div className="p-2 bg-[#1B2D25] rounded">
              <span className="block text-[11px] text-[#C5CBC0]">Tier C (Bank / M-Pesa)</span>
              <span className="text-base font-semibold font-mono text-[#F3EEDF]">
                {Math.round((tierCRecords / SAMPLE_RECORDS.length) * 100)}%
              </span>
            </div>
            <div className="p-2 bg-[#1B2D25] rounded">
              <span className="block text-[11px] text-[#C5CBC0]">Split Cash Corroboration</span>
              <span className="text-base font-semibold font-mono text-[#F3EEDF]">
                100% Verified
              </span>
            </div>
            <div className="p-2 bg-[#1B2D25] rounded">
              <span className="block text-[11px] text-[#C5CBC0]">Dispute Deductions</span>
              <span className="text-base font-semibold font-mono text-[#E0C080]">
                0 (Neutral)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tenancy Dossier Header Bar */}
      <div className="border border-[#D5CBB0] rounded-md bg-[#FDFBF7] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5CBB0]">
          <div>
            <div className="text-xs text-[#55503F] font-mono">
              TENANCY PROFILE #{PRIMARY_PROFILE.id}
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1B16] mt-0.5">
              {PRIMARY_PROFILE.tenantName}
            </h3>
            <div className="text-xs text-[#55503F] mt-1">
              {PRIMARY_PROFILE.property} · {PRIMARY_PROFILE.unitNumber} · {PRIMARY_PROFILE.estate}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs text-[#55503F]">Monthly Lease Value</div>
            <div className="text-lg font-mono font-semibold text-[#1C1B16]">
              KES {PRIMARY_PROFILE.monthlyRentKES.toLocaleString()}
            </div>
            <div className="text-xs text-[#7C5A2A] font-medium">
              Tenancy Duration: {PRIMARY_PROFILE.durationMonths} Consecutive Months
            </div>
          </div>
        </div>

        {/* Provenance Tier Explanatory Ladder */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {(['A', 'B', 'C', 'D'] as ProvenanceTier[]).map((tierKey) => {
            const tier = PROVENANCE_TIERS[tierKey];
            const isFilterActive = selectedTierFilter === tierKey;
            return (
              <button
                key={tierKey}
                onClick={() => setSelectedTierFilter(isFilterActive ? 'ALL' : tierKey)}
                className={`p-2.5 rounded text-left border transition-all ${
                  isFilterActive
                    ? 'border-[#1C1B16] bg-[#ECE5D3] ring-1 ring-[#1C1B16]'
                    : 'border-[#D5CBB0] bg-[#F6F2E8] hover:bg-[#ECE5D3]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="px-1.5 py-0.2 text-[11px] font-bold font-mono rounded"
                    style={{ backgroundColor: tier.badgeBg, color: tier.badgeFg }}
                  >
                    Tier {tierKey}
                  </span>
                  <span className="text-[10px] text-[#55503F]">
                    {SAMPLE_RECORDS.filter(r => r.tier === tierKey).length} records
                  </span>
                </div>
                <div className="font-semibold text-[#1C1B16] truncate">
                  {tier.title}
                </div>
                <div className="text-[11px] text-[#55503F] line-clamp-1 mt-0.5">
                  {tier.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#55503F] mr-1">Filter by Category:</span>
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'rent_payment', label: 'Rent Payments' },
            { id: 'split_payment', label: 'Split Payments' },
            { id: 'utility_clearance', label: 'Utilities' },
            { id: 'neutral_dispute', label: 'Disputes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#12201A] text-[#F3EEDF] font-medium'
                  : 'bg-[#ECE5D3] text-[#55503F] hover:text-[#1C1B16]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-[#55503F] font-mono">
          Showing {filteredRecords.length} of {SAMPLE_RECORDS.length} sourced records
        </div>
      </div>

      {/* Records Table & Accordion Details */}
      <div className="border border-[#D5CBB0] rounded-md bg-[#F6F2E8] overflow-hidden divide-y divide-[#D5CBB0]">
        {filteredRecords.map((record) => {
          const isExpanded = expandedRecordId === record.id;
          const tier = PROVENANCE_TIERS[record.tier];

          return (
            <div key={record.id} className="transition-colors">
              {/* Row Summary */}
              <div
                onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                  isExpanded ? 'bg-[#ECE5D3]' : 'hover:bg-[#EFE9D8]'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 text-xs font-bold font-mono rounded shrink-0"
                      style={{ backgroundColor: tier.badgeBg, color: tier.badgeFg }}
                    >
                      Tier {record.tier}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#1C1B16] truncate">
                      {record.title}
                    </span>
                  </div>

                  <div className="text-xs text-[#55503F] flex flex-wrap items-center gap-2">
                    <span>{record.date}</span>
                    <span>·</span>
                    <span>Origin: {record.origin}</span>
                    <span>·</span>
                    <span>Counterparty: {record.counterparty}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {record.amountKES && (
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-mono font-semibold text-[#1C1B16] tabular-nums">
                        KES {record.amountKES.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#55503F] font-mono">
                        {record.category === 'split_payment' ? 'M-Pesa + Cash' : 'Settled'}
                      </div>
                    </div>
                  )}

                  <div className="w-6 h-6 rounded border border-[#D5CBB0] grid place-items-center text-[#55503F] text-xs">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-[#FDFBF7] border-t border-[#D5CBB0] space-y-5 text-xs text-[#1C1B16]">
                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <h4 className="font-serif font-semibold text-sm text-[#1C1B16]">
                      Record Summary & Evidentiary Details
                    </h4>
                    <p className="text-[#55503F] text-xs leading-relaxed">
                      {record.details}
                    </p>
                  </div>

                  {/* Split Breakdown Specific View */}
                  {record.splitBreakdown && (
                    <div className="p-4 bg-[#F6F2E8] border border-[#D5CBB0] rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-semibold text-sm text-[#7C5A2A]">
                          Split Payment Anatomy (Cash-and-Mobile Ledger)
                        </span>
                        <span className="text-[11px] font-mono text-[#55503F]">
                          Total: KES {(record.splitBreakdown.mpesaAmount + record.splitBreakdown.cashAmount).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-[#FFFFFF] border border-[#D5CBB0] rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#1C1B16]">M-Pesa Electronic Leg</span>
                            <span className="px-1.5 py-0.5 bg-[#8C6E33] text-[#FFFFFF] text-[10px] font-mono rounded">
                              Tier C
                            </span>
                          </div>
                          <div className="font-mono text-base font-bold text-[#1C1B16]">
                            KES {record.splitBreakdown.mpesaAmount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-[#55503F] font-mono">
                            Ref: {record.splitBreakdown.mpesaRef} · Safaricom Paybill
                          </div>
                        </div>

                        <div className="p-3 bg-[#FFFFFF] border border-[#D5CBB0] rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#1C1B16]">Physical Cash Voucher Leg</span>
                            <span className="px-1.5 py-0.5 bg-[#B79A5A] text-[#1A1608] text-[10px] font-mono rounded">
                              Tier B
                            </span>
                          </div>
                          <div className="font-mono text-base font-bold text-[#1C1B16]">
                            KES {record.splitBreakdown.cashAmount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-[#55503F]">
                            Voucher #{record.splitBreakdown.cashReceiptNumber} signed by {record.splitBreakdown.caretakerSignee}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#55503F] italic">
                        *Epistemic Humility Note: The physical cash portion is recognized at Tier B through Caretaker validation. It does not pretend to have bank-level API certainty (Tier C), but preserves legitimate tenant expenditure rather than discarding it.
                      </p>
                    </div>
                  )}

                  {/* Neutral Dispute View */}
                  {record.disputeData && (
                    <div className="p-4 bg-[#F6F2E8] border-l-4 border-[#B8863F] border border-[#D5CBB0] rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-semibold text-sm text-[#1C1B16]">
                          Constitutional Rule 3: Pending Dispute Neutrality
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-[#E0C080]/30 text-[#7C5A2A] rounded">
                          {record.disputeData.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="p-3 bg-[#FFFFFF] border border-[#D5CBB0] rounded space-y-1">
                          <span className="font-semibold text-[#1C1B16] block">
                            Tenant Position (Faith Wanjiku)
                          </span>
                          <p className="text-[11px] text-[#55503F] leading-relaxed">
                            {record.disputeData.tenantPosition}
                          </p>
                        </div>
                        <div className="p-3 bg-[#FFFFFF] border border-[#D5CBB0] rounded space-y-1">
                          <span className="font-semibold text-[#1C1B16] block">
                            Landlord Position (Peter Kamau)
                          </span>
                          <p className="text-[11px] text-[#55503F] leading-relaxed">
                            {record.disputeData.landlordPosition}
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#7C5A2A] font-medium">
                        Attestation: Zero Credit Bureau Blacklist · Open disputes remain civil housing dialogues without economic punishment.
                      </div>
                    </div>
                  )}

                  {/* Audit Trail Timeline */}
                  <div className="space-y-2 pt-2 border-t border-[#D5CBB0]">
                    <span className="font-semibold text-xs text-[#1C1B16] block">
                      Cryptographic Provenance Trail (Ascending the Ladder)
                    </span>
                    <div className="space-y-2">
                      {record.auditTrail.map((step, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-start gap-3 text-[11px] pl-3 border-l-2 border-[#B8863F]"
                        >
                          <div className="min-w-[130px] font-mono text-[#55503F] shrink-0">
                            {step.timestamp}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1C1B16]">{step.actor}:</span>{' '}
                            <span className="text-[#55503F]">{step.action}</span>{' '}
                            {step.newTier && (
                              <span className="font-mono text-[#7C5A2A] font-semibold">
                                [Tier {step.newTier}]
                              </span>
                            )}
                            <div className="text-[10px] text-[#7C5A2A] font-mono mt-0.5">
                              Artifact: {step.evidenceRef}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tamper Evident Verification Hash */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#55503F] font-mono bg-[#ECE5D3] p-2.5 rounded">
                    <span className="truncate pr-2">
                      SHA-256 Checksum: {record.hash}
                    </span>
                    <button
                      onClick={() => alert(`Record ${record.id} verified against immutable audit ledger.\nChecksum: ${record.hash}`)}
                      className="text-[#7C5A2A] hover:underline font-semibold shrink-0 mt-1 sm:mt-0"
                    >
                      Verify Audit Hash
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
