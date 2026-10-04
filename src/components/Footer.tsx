import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onJoinPilot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onJoinPilot }) => {
  return (
    <footer className="bg-[#12201A] text-[#9FA99F] border-t border-[#34483E] pt-12 pb-14 text-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Tier: Brand, Mission, Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 space-y-3">
            <div className="font-serif text-xl text-[#F3EEDF] font-semibold">
              Rental<span className="italic text-[#E0C080]">Mind</span> AI
            </div>
            <p className="text-xs text-[#C5CBC0] max-w-md leading-relaxed">
              A tenant-controlled trust and evidence layer for Africa’s informal rental economy. Grounded in Nairobi municipal housing reality, M-Pesa transaction flows, and unwavering epistemic humility.
            </p>
            <div className="text-[11px] text-[#7C5A2A] font-mono">
              Constitutional Doctrine v1.0 · Fixed Intent. Adaptive Mechanism. Traceable Always.
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="font-serif text-[#F3EEDF] font-medium text-sm">
              Protocol Modules
            </div>
            <ul className="space-y-1.5 text-xs text-[#C5CBC0]">
              <li>
                <button
                  onClick={() => onNavigate('passport')}
                  className="hover:text-[#E0C080] transition-colors"
                >
                  Sovereign Rental Passport
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reconciler')}
                  className="hover:text-[#E0C080] transition-colors"
                >
                  Split-Payment Reconciler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disputes')}
                  className="hover:text-[#E0C080] transition-colors"
                >
                  Neutral Dispute Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pilot')}
                  className="hover:text-[#E0C080] transition-colors"
                >
                  Pilot 01 Nairobi Telemetry
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="font-serif text-[#F3EEDF] font-medium text-sm">
              Institutional Engagement
            </div>
            <p className="text-[11px] text-[#C5CBC0] leading-relaxed">
              SACCOs, commercial banks, and impact investors seeking structured, audit-ready informal housing evidence for Pilot 01:
            </p>
            <button
              onClick={onJoinPilot}
              className="inline-block mt-1 text-[#E0C080] hover:underline font-semibold"
            >
              Partner with Pilot 01 →
            </button>
          </div>
        </div>

        {/* Disclaimer / Non-Negotiable Limits */}
        <div className="pt-6 border-t border-[#34483E] text-[11px] text-[#9FA99F] space-y-2">
          <p>
            <strong className="text-[#EDE8DA]">What RentalMind is not:</strong> We are not a credit reference bureau (CRB), financial lender, SACCO, debt collection agency, or property manager. We never calculate credit scores or make lending decisions. Lenders and courts preserve their own independent discretion.
          </p>
          <p>
            <strong className="text-[#EDE8DA]">What we will never do:</strong> We will never sell tenant rental records, turn pending disputes into punitive marks, present self-reported declarations as independently corroborated, or allow an AI algorithm to silently dictate housing eligibility.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="pt-4 border-t border-[#34483E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#9FA99F]">
          <div>© {new Date().getFullYear()} RentalMind AI. Nairobi, Kenya. All rights reserved.</div>
          <div className="font-mono text-[10px]">
            SHA-256 Protocol Anchor: rm_genesis_nbi_2026_01
          </div>
        </div>

      </div>
    </footer>
  );
};
