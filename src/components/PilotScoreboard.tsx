import React, { useState } from 'react';
import { PILOT_NEIGHBORHOODS } from '../data/mockData';

interface PilotScoreboardProps {
  onJoinPilot: () => void;
}

export const PilotScoreboard: React.FC<PilotScoreboardProps> = ({ onJoinPilot }) => {
  const [selectedEstate, setSelectedEstate] = useState(PILOT_NEIGHBORHOODS[0]);

  // Totals calculated from pilot cohorts
  const totalHouseholds = PILOT_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.households, 0);
  const totalRecords = PILOT_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.activeRecords, 0);
  const avgTierB = Math.round(
    PILOT_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.tierBRatio, 0) / PILOT_NEIGHBORHOODS.length
  );
  const avgTierC = Math.round(
    PILOT_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.tierCRatio, 0) / PILOT_NEIGHBORHOODS.length
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-[#ECE5D3] p-6 sm:p-8 rounded-lg border border-[#D5CBB0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#7C5A2A] font-semibold font-mono">
              PILOT 01 · NAIROBI METROPOLITAN REGION
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B16] font-medium mt-1">
              Field Telemetry & Cohort Scoreboard
            </h2>
            <p className="text-sm text-[#55503F] max-w-2xl mt-1 leading-relaxed">
              Hypothesis: Capturing informal housing transactions through source attribution creates portable, institutional-grade trust without forcing tenants into predatory credit bureau scoring models.
            </p>
          </div>

          <button
            onClick={onJoinPilot}
            className="px-5 py-2.5 text-xs font-semibold bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] rounded transition-colors shrink-0 shadow-sm"
          >
            Enrol in Pilot 01 →
          </button>
        </div>

        {/* Five Questions of Pilot 01 */}
        <div className="pt-4 border-t border-[#D5CBB0] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1">
            <span className="font-mono text-[#7C5A2A] font-bold block">01. Capture</span>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Can ordinary rent transactions become structured records without adding work for landlords?
            </p>
          </div>
          <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1">
            <span className="font-mono text-[#7C5A2A] font-bold block">02. Corroboration</span>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Can records move reliably from self-declared (A) to confirmed (B) to independent (C)?
            </p>
          </div>
          <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1">
            <span className="font-mono text-[#7C5A2A] font-bold block">03. Utility</span>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Does a portable record help a tenant prove history to lenders or future landlords?
            </p>
          </div>
          <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1">
            <span className="font-mono text-[#7C5A2A] font-bold block">04. Trust</span>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Do participants accept that open disputes remain non-punitive under Rule 3?
            </p>
          </div>
          <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1">
            <span className="font-mono text-[#7C5A2A] font-bold block">05. Institutional</span>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Will SACCOs and underwriters accept M-Pesa + cash voucher composites for housing loans?
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Scoreboard Figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#FDFBF7] border border-[#D5CBB0] rounded-md space-y-1">
          <span className="text-xs text-[#55503F] block">Participating Households</span>
          <div className="font-serif text-3xl font-normal text-[#7C5A2A] tabular-nums">
            {totalHouseholds}
          </div>
          <span className="text-[11px] text-[#55503F] block">Across 5 Nairobi Neighborhoods</span>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-[#D5CBB0] rounded-md space-y-1">
          <span className="text-xs text-[#55503F] block">Sourced Records Ingested</span>
          <div className="font-serif text-3xl font-normal text-[#7C5A2A] tabular-nums">
            {totalRecords.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#55503F] block">Payments, Utilities, Handshakes</span>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-[#D5CBB0] rounded-md space-y-1">
          <span className="text-xs text-[#55503F] block">Tier B+ Confirmation Rate</span>
          <div className="font-serif text-3xl font-normal text-[#12201A] tabular-nums">
            {avgTierB}%
          </div>
          <span className="text-[11px] text-[#55503F] block">Bilateral Counterparty Endorsed</span>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-[#D5CBB0] rounded-md space-y-1">
          <span className="text-xs text-[#55503F] block">Independent Corroboration</span>
          <div className="font-serif text-3xl font-normal text-[#12201A] tabular-nums">
            {avgTierC}%
          </div>
          <span className="text-[11px] text-[#55503F] block">Safaricom & KPLC Third-Party API</span>
        </div>
      </div>

      {/* Neighborhood Cohort Inspector */}
      <div className="border border-[#D5CBB0] rounded-lg bg-[#FDFBF7] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5CBB0]">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1B16]">
              Nairobi Urban Typology Analysis
            </h3>
            <p className="text-xs text-[#55503F] mt-0.5">
              Select an operational zone to examine specific informal tenancy patterns:
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PILOT_NEIGHBORHOODS.map((est) => (
              <button
                key={est.name}
                onClick={() => setSelectedEstate(est)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  selectedEstate.name === est.name
                    ? 'bg-[#12201A] text-[#F3EEDF] font-semibold'
                    : 'bg-[#ECE5D3] text-[#55503F] hover:text-[#1C1B16]'
                }`}
              >
                {est.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Estate Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono text-[#7C5A2A] font-semibold">
                ZONE PROFILE: {selectedEstate.name.toUpperCase()}
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1C1B16] mt-0.5">
                {selectedEstate.typology}
              </h4>
            </div>

            <div className="p-4 bg-[#F6F2E8] border border-[#D5CBB0] rounded-md space-y-2 text-xs">
              <span className="font-semibold text-[#1C1B16] block">
                Sociological & Informal Housing Realities:
              </span>
              <p className="text-[#55503F] leading-relaxed">
                {selectedEstate.informalDynamics}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#ECE5D3] rounded">
                <span className="text-[#55503F] block text-[11px]">Enrolled Households:</span>
                <span className="text-lg font-mono font-bold text-[#1C1B16]">
                  {selectedEstate.households} Units
                </span>
              </div>
              <div className="p-3 bg-[#ECE5D3] rounded">
                <span className="text-[#55503F] block text-[11px]">Logged Housing Records:</span>
                <span className="text-lg font-mono font-bold text-[#1C1B16]">
                  {selectedEstate.activeRecords} Records
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#12201A] text-[#F3EEDF] p-5 rounded-md space-y-4 border border-[#34483E] text-xs">
            <span className="font-serif text-[#E0C080] font-medium text-sm block">
              Field Implementation Architecture
            </span>

            <div className="space-y-3 text-[11px] text-[#C5CBC0]">
              <div className="flex items-start gap-2.5">
                <span className="text-[#E0C080] font-bold font-mono">01</span>
                <div>
                  <span className="text-[#F3EEDF] font-semibold block">USSD Feature-Phone Bridge (*384*44#):</span>
                  Enables caretakers without smartphones to acknowledge physical cash vouchers in 10 seconds.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#E0C080] font-bold font-mono">02</span>
                <div>
                  <span className="text-[#F3EEDF] font-semibold block">Field Ambassadors:</span>
                  University student leaders & resident estate champions paid KES 500 per verified onboarding cohort.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#E0C080] font-bold font-mono">03</span>
                <div>
                  <span className="text-[#F3EEDF] font-semibold block">Institutional SACCO Integrations:</span>
                  Data structured to Kenya Mortgage Refinance Company (KMRC) single-borrower underwriting templates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
