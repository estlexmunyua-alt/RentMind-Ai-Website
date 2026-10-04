import React, { useState } from 'react';
import { SAMPLE_RECORDS } from '../data/mockData';
import { PROVENANCE_TIERS } from '../types/rentalmind';

interface HeroSectionProps {
  onExplorePassport: () => void;
  onJoinPilot: () => void;
  onOpenSplitReconciler: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePassport,
  onJoinPilot,
  onOpenSplitReconciler,
}) => {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const activeRecord = SAMPLE_RECORDS[selectedRecordIndex];
  const tierConfig = PROVENANCE_TIERS[activeRecord.tier];

  return (
    <section className="bg-[#12201A] text-[#F3EEDF] pt-12 pb-16 lg:pt-18 lg:pb-24 border-b border-[#34483E] relative overflow-hidden">
      {/* Subtle organic radial glow */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 75% 25%, #E0C080 0%, transparent 65%)'
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Thesis & Call to Action */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#E0C080]">
              <span className="w-2 h-2 rounded-full bg-[#E0C080] animate-pulse" />
              <span>PILOT 01 · NAIROBI · ACTIVE PROTOCOL</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.12] tracking-tight text-[#F3EEDF] text-balance">
              Turn informal rental history into trusted economic evidence.
            </h1>

            <p className="text-base sm:text-lg text-[#C5CBC0] max-w-[52ch] leading-relaxed">
              A tenant-controlled trust and evidence layer for Africa’s housing economy. We never assign automated credit scores or turn uncertainty into false certainty. Tenants hold portable, sourced records across Provenance Tiers A through D and choose who audits them.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onJoinPilot}
                className="px-6 py-3 text-sm font-semibold text-[#1C1B16] bg-[#E0C080] hover:bg-[#ECD39B] rounded transition-colors shadow-sm"
              >
                Join Pilot 01 Nairobi
              </button>
              
              <button
                onClick={onExplorePassport}
                className="px-5 py-3 text-sm font-medium text-[#F3EEDF] hover:text-[#E0C080] border border-[#34483E] hover:border-[#7C5A2A] rounded transition-colors"
              >
                Audit Sample Passport
              </button>

              <button
                onClick={onOpenSplitReconciler}
                className="px-4 py-3 text-sm font-medium text-[#C5CBC0] hover:text-[#E0C080] transition-colors underline underline-offset-4 decoration-[#7C5A2A]"
              >
                M-Pesa / Split Reconciler →
              </button>
            </div>

            {/* Nairobi Documentary Photo with Curatorial Caption */}
            <div className="pt-4 border-t border-[#34483E]/70 flex items-center gap-4">
              <div className="w-20 h-14 shrink-0 rounded overflow-hidden border border-[#34483E] bg-[#1B2D25]">
                <img 
                  src="/src/assets/images/hero_nairobi_tenancy_1791095892268.jpg" 
                  alt="Nairobi Kilimani and Roysambu residential architecture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="text-xs text-[#9FA99F] space-y-0.5">
                <p className="text-[#EDE8DA] font-medium">Grounded in Nairobi Operational Realities</p>
                <p>M-Pesa statement hashes · Caretaker cash slips · KPLC tokens · RRT arbitration</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Rental Passport Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#F6F2E8] text-[#1C1B16] rounded-md shadow-2xl border border-[#D5CBB0] overflow-hidden">
              {/* Card Header */}
              <div className="px-5 py-4 bg-[#ECE5D3] border-b border-[#D5CBB0] flex items-center justify-between">
                <div>
                  <div className="font-serif font-semibold text-lg text-[#1C1B16] flex items-center gap-2">
                    <span>Rental Passport</span>
                    <span className="text-xs font-sans font-normal text-[#55503F] px-1.5 py-0.5 border border-[#D5CBB0] rounded">
                      Auditable Ledger
                    </span>
                  </div>
                  <div className="text-xs text-[#55503F] mt-0.5">
                    Tenant: Faith Wanjiku Mwangi · Flat 3B, Kilimani
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#7C5A2A] font-semibold block">
                    93.7% Tier B+
                  </span>
                  <span className="text-[11px] text-[#55503F]">Corroborated Rate</span>
                </div>
              </div>

              {/* Records List (Interactive Tabs) */}
              <div className="divide-y divide-[#D5CBB0] max-h-[260px] overflow-y-auto">
                {SAMPLE_RECORDS.slice(0, 4).map((rec, index) => {
                  const isSelected = selectedRecordIndex === index;
                  const tier = PROVENANCE_TIERS[rec.tier];
                  return (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecordIndex(index)}
                      className={`w-full text-left px-5 py-3 flex items-center justify-between gap-3 transition-colors ${
                        isSelected 
                          ? 'bg-[#ECE5D3] border-l-4 border-[#B8863F]' 
                          : 'hover:bg-[#EFE9D8] bg-transparent'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-semibold text-[#1C1B16] truncate">
                          {rec.title}
                        </div>
                        <div className="text-xs text-[#55503F] truncate">
                          {rec.origin}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {rec.amountKES && (
                          <span className="text-xs font-mono font-medium text-[#1C1B16] tabular-nums">
                            KES {rec.amountKES.toLocaleString()}
                          </span>
                        )}
                        <span 
                          className="px-2 py-0.5 text-xs font-bold font-mono rounded"
                          style={{
                            backgroundColor: tier.badgeBg,
                            color: tier.badgeFg,
                          }}
                        >
                          Tier {rec.tier}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail Pane for Currently Selected Record */}
              <div className="p-5 bg-[#FDFBF7] border-t border-[#D5CBB0] text-xs space-y-3">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <span className="text-[#55503F] block font-medium">Confidence Tier:</span>
                    <span className="text-[#1C1B16] font-semibold">
                      Tier {activeRecord.tier} — {tierConfig.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#55503F] block font-medium">Declared Interest:</span>
                    <span className="text-[#1C1B16] font-semibold">
                      {activeRecord.declaredInterest}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#55503F] block font-medium">Evidentiary Standard:</span>
                    <p className="text-[#1C1B16] text-xs leading-relaxed">
                      {tierConfig.evidentiaryStandard}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#55503F] leading-relaxed">
                  <span className="font-semibold text-[#1C1B16] block mb-0.5">
                    Constitutional Note:
                  </span>
                  {activeRecord.summary}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#55503F] font-mono pt-1">
                  <span className="truncate max-w-[240px]">
                    Hash: {activeRecord.hash.substring(0, 24)}...
                  </span>
                  <button 
                    onClick={onExplorePassport}
                    className="text-[#7C5A2A] font-semibold hover:underline"
                  >
                    View Full Audit Chain →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
