import React, { useState } from 'react';
import { CONSTITUTIONAL_TENETS } from '../data/mockData';

export const ConstitutionalDoctrine: React.FC = () => {
  const [selectedTenet, setSelectedTenet] = useState(0);

  const comparisonRows = [
    {
      dimension: 'Decision-Making Authority',
      conventional: 'Opaque algorithm calculates single 300–850 score; automated binary reject/accept.',
      rentalmind: 'Epistemic humility: Zero algorithmic scoring. Lenders & SACCOs retain sovereign underwriting judgment.',
    },
    {
      dimension: 'Data Ownership & Consent',
      conventional: 'Data scraped, centralized, and sold to debt collectors and marketing brokers.',
      rentalmind: 'Tenant sovereign vault: Ephemeral, cryptographically signed, scope-limited passes issued by tenant.',
    },
    {
      dimension: 'Dispute Handling ("Pending is not guilty")',
      conventional: 'Withheld payment or open dispute instantly marks tenant delinquent and slashes score.',
      rentalmind: 'Open disputes recorded neutrally showing both perspectives side-by-side with zero score penalty.',
    },
    {
      dimension: 'Informal Cash-and-Mobile Splits',
      conventional: 'Physical cash discarded as non-existent informal noise; only formal bank credit recognized.',
      rentalmind: 'Dual-leg elevation: M-Pesa at Tier C, Cash voucher elevated to Tier B via Caretaker USSD handshake.',
    },
    {
      dimension: 'Verification Transparency',
      conventional: 'Vague marketing badges ("Verified Tenant", "Gold Member") with hidden methodology.',
      rentalmind: 'Strict Provenance Ladder: Every record stamped with Tier (A–D), source interest, and artifact hash.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-[#ECE5D3] p-6 sm:p-8 rounded-lg border border-[#D5CBB0] space-y-3">
        <div className="text-xs uppercase tracking-wider text-[#7C5A2A] font-semibold font-mono">
          System Constraints & Guarantees · Version 1.0
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B16] font-medium">
          The RentalMind Constitutional Doctrine
        </h2>
        <p className="text-sm text-[#55503F] max-w-3xl leading-relaxed">
          These are not marketing aspirations or brand values. They are immutable system architectural constraints. Every feature shipped, every database record stored, and every user interface interaction must rigorously enforce these four commitments.
        </p>
      </div>

      {/* The 4 Non-Negotiable Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CONSTITUTIONAL_TENETS.map((tenet, idx) => {
          const isSelected = selectedTenet === idx;
          return (
            <div
              key={tenet.number}
              onClick={() => setSelectedTenet(idx)}
              className={`p-6 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#7C5A2A] bg-[#FDFBF7] shadow-sm'
                  : 'border-[#D5CBB0] bg-[#F6F2E8] hover:bg-[#FDFBF7]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-serif text-2xl font-normal text-[#7C5A2A]">
                  {tenet.number}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1C1B16]">
                  {tenet.title}
                </h3>
              </div>
              <div className="text-xs font-semibold text-[#7C5A2A] mb-2">
                {tenet.principle}
              </div>
              <p className="text-xs text-[#55503F] leading-relaxed">
                {tenet.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparative Matrix: CRB vs RentalMind */}
      <div className="border border-[#D5CBB0] rounded-lg bg-[#FDFBF7] overflow-hidden">
        <div className="p-5 bg-[#ECE5D3] border-b border-[#D5CBB0]">
          <h3 className="font-serif text-lg font-semibold text-[#1C1B16]">
            Architectural Contrast: Traditional Credit Bureaus vs. RentalMind Protocol
          </h3>
          <p className="text-xs text-[#55503F] mt-0.5">
            Why proprietary credit scoring fails informal African tenancies and how sovereign evidence replaces it:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D5CBB0] bg-[#F6F2E8] text-[#1C1B16]">
                <th className="p-4 font-semibold w-1/4">Operational Dimension</th>
                <th className="p-4 font-semibold w-3/8 text-[#8A3F35]">
                  Conventional CRB / FinTech Scoring
                </th>
                <th className="p-4 font-semibold w-3/8 text-[#12201A]">
                  RentalMind Sovereign Evidence Layer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5CBB0]">
              {comparisonRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#ECE5D3]/40 transition-colors">
                  <td className="p-4 font-semibold text-[#1C1B16] align-top">
                    {row.dimension}
                  </td>
                  <td className="p-4 text-[#55503F] align-top leading-relaxed">
                    {row.conventional}
                  </td>
                  <td className="p-4 text-[#1C1B16] font-medium align-top leading-relaxed bg-[#ECE5D3]/20">
                    {row.rentalmind}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archival Documentary Visual & Epistemic Humility Rulebook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 rounded-md overflow-hidden border border-[#D5CBB0] bg-[#ECE5D3] shadow-md">
          <img
            src="/src/assets/images/provenance_ledger_paper_1791095904183.jpg"
            alt="Archival paper housing records and physical rent vouchers"
            className="w-full h-auto object-cover max-h-[300px]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="p-3 text-[11px] text-[#55503F] italic border-t border-[#D5CBB0] bg-[#FDFBF7]">
            Fig 1: Physical carbon-copy rent vouchers and advocate stamps. Epistemic humility demands honoring paper evidence without fabricating digital infallibility.
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3 text-xs text-[#55503F]">
          <h4 className="font-serif text-lg font-semibold text-[#1C1B16]">
            The Doctrine of Epistemic Humility
          </h4>
          <p className="leading-relaxed">
            In informal markets, systems fail when they attempt to turn noisy, human realities into crisp, artificial certainties. When an AI or automated system extracts an M-Pesa SMS where the phone number is registered under a family member’s name, or where a physical cash voucher has a smudge on the serial number, traditional software either crashes or silently assumes guilt.
          </p>
          <p className="leading-relaxed">
            RentalMind AI adheres to epistemic humility: <strong className="text-[#1C1B16]">We record the exact degree of certainty established, neither more nor less.</strong> A tenant statement remains Tier A until an uninterested party or counterparty validates it. The system never guesses or fabricates scores.
          </p>
          <div className="p-3 bg-[#12201A] text-[#E0C080] rounded text-[11px] leading-relaxed">
            "We do not decide who is trustworthy. We provide the transparent, attributable, immutable trail of how trust was earned."
          </div>
        </div>
      </div>

      {/* Leadership & Architectural Team */}
      <div className="space-y-4 pt-4 border-t border-[#D5CBB0]">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#1C1B16]">
            The Architects Behind the Trust Layer
          </h3>
          <p className="text-xs text-[#55503F]">
            Combining systems engineering, property management, chartered finance, and Kenyan municipal governance:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#12201A] text-[#E0C080] font-serif font-bold grid place-items-center text-sm">
              AM
            </div>
            <div className="font-semibold text-sm text-[#1C1B16]">Alex Munyua</div>
            <div className="text-[11px] text-[#7C5A2A] font-semibold">Founder, Technical Lead & AI Architect</div>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Leads product architecture, AI workflows, and transaction infrastructure. 7+ years turning research into working systems, from energy hubs to community microgrids. Published policy analyst at Tuko.
            </p>
          </div>

          <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#12201A] text-[#E0C080] font-serif font-bold grid place-items-center text-sm">
              RN
            </div>
            <div className="font-semibold text-sm text-[#1C1B16]">Rebeccah Ndegwa</div>
            <div className="text-[11px] text-[#7C5A2A] font-semibold">Strategic Consultant & Pilot Lead</div>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Managing Director of Qwetucasa Real Estates in Nairobi. Manages landlord portfolios, lease negotiations, and property performance reporting. Directs Nairobi field pilot operations.
            </p>
          </div>

          <div className="p-4 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#12201A] text-[#E0C080] font-serif font-bold grid place-items-center text-sm">
              JK
            </div>
            <div className="font-semibold text-sm text-[#1C1B16]">James Kabue, MBA</div>
            <div className="text-[11px] text-[#7C5A2A] font-semibold">Operations & Financial Strategy Lead</div>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              CPA(K) and Executive MBA in Strategic Management. Over a decade of fiscal stewardship across commercial enterprise and public constituency development funds.
            </p>
          </div>

          <div className="p-4 bg-[#FDFBF7] border border-dashed border-[#B8863F] rounded space-y-2">
            <div className="w-10 h-10 rounded-full border border-dashed border-[#7C5A2A] text-[#7C5A2A] font-serif font-bold grid place-items-center text-sm">
              +
            </div>
            <div className="font-semibold text-sm text-[#1C1B16]">Joining Soon</div>
            <div className="text-[11px] text-[#7C5A2A] font-semibold">Policy, Regulatory & Landlord Lead</div>
            <p className="text-[#55503F] text-[11px] leading-relaxed">
              Aligns RentalMind with municipal housing laws, Rent Restriction Tribunal guidelines, and formal landlord association compliance frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
