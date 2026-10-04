import React, { useState } from 'react';

interface DisputeItem {
  id: string;
  estate: string;
  category: string;
  subject: string;
  tenantName: string;
  tenantStatement: string;
  tenantArtifact: string;
  landlordName: string;
  landlordStatement: string;
  landlordArtifact: string;
  monetaryValueKES?: number;
  status: 'Bilateral Review' | 'Mediation via Caretaker' | 'Authoritative Tribunal Referral';
  lastActivity: string;
}

const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: 'DISP-NBI-2026-044',
    estate: 'Kilimani, Nairobi',
    category: 'Essential Utility & Maintenance Offset',
    subject: 'Borehole Stator Failure & Commercial Water Bowser Deduction',
    tenantName: 'Faith Wanjiku Mwangi (Unit 3B)',
    tenantStatement: 'Building borehole pump remained broken for 9 consecutive days (July 12–21). Despite 3 written WhatsApp alerts to caretaker, zero emergency water was delivered. Tenant paid KES 3,200 for a private 5,000-litre clean water tanker and deducted from July utility ledger.',
    tenantArtifact: 'Receipt #NW-8902 from Nairobi Clean Water Bowser Ltd + WhatsApp Chat Export',
    landlordName: 'Mzee Peter Kamau (Property Owner)',
    landlordStatement: 'Landlord acknowledges pump stator burned out due to Kenya Power phase drop. However, building lease clause 6 stipulates tenants must notify management 48 hours prior to hiring external commercial tankers. Landlord offers KES 1,600 (50%) credit offset.',
    landlordArtifact: 'Electrician Diagnostic Report by Stima Electricals + Lease Clause 6',
    monetaryValueKES: 3200,
    status: 'Bilateral Review',
    lastActivity: '2026-07-23 16:45 EAT',
  },
  {
    id: 'DISP-NBI-2026-019',
    estate: 'Roysambu, Nairobi',
    category: 'Move-in Condition vs Security Deposit',
    subject: 'Balcony Hairline Floor Tile Cracks vs Move-Out Reconditioning',
    tenantName: 'Kevin Otieno (Unit C2)',
    tenantStatement: 'Move-out inspection caretaker deducted KES 5,000 from security deposit for cracked balcony tiles. Tenant submitted geo-tagged photo taken on move-in day (14-Aug-2024) showing cracks existed prior to occupancy.',
    tenantArtifact: 'EXIF Metadata Geo-tagged Image (IMG_20240814_1102.jpg) timestamped move-in',
    landlordName: 'Greenwood Properties Ltd (Agent)',
    landlordStatement: 'Move-in handover sheet was signed without written defect exceptions. Agency requires either mutual photographic review with caretaker or advocate escrow clearance.',
    landlordArtifact: 'Original Handover Checklist dated 14-Aug-2024',
    monetaryValueKES: 5000,
    status: 'Mediation via Caretaker',
    lastActivity: '2026-08-10 11:20 EAT',
  },
  {
    id: 'DISP-NBI-2026-082',
    estate: 'Pipeline (Embakasi)',
    category: 'Submeter Power Tariff Multi-Tenancy Dispute',
    subject: 'Single Primary Meter Shared Between 6 Units with Disproportionate Charges',
    tenantName: 'Beatrice Atieno (Flat 14)',
    tenantStatement: 'Landlord calculates submeter rate at KES 38 per unit while official KPLC domestic lifeline tariff is KES 22 per unit. Tenant requests reconciliation against official KPLC token purchases.',
    tenantArtifact: 'Photos of Submeter #4010 + 6 months payment receipts',
    landlordName: 'Maji Mazuri Investments',
    landlordStatement: 'Total master meter consumption includes common stairwell lighting and booster pump running 4 hours daily. Extra KES 16 covers common area share across all 6 units.',
    landlordArtifact: 'Master Meter Stima Token Breakdown',
    monetaryValueKES: 1800,
    status: 'Bilateral Review',
    lastActivity: '2026-09-15 09:10 EAT',
  },
];

export const NeutralDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeItem[]>(INITIAL_DISPUTES);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New dispute form state
  const [newSubject, setNewSubject] = useState('');
  const [newEstate, setNewEstate] = useState('Kilimani');
  const [newStatement, setNewStatement] = useState('');
  const [newContentionKES, setNewContentionKES] = useState('');
  const [newArtifact, setNewArtifact] = useState('');

  const handleSubmitNewDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newStatement) return;

    const newEntry: DisputeItem = {
      id: `DISP-NBI-2026-${Math.floor(100 + Math.random() * 900)}`,
      estate: `${newEstate}, Nairobi`,
      category: 'Tenancy Operational Contention',
      subject: newSubject,
      tenantName: 'Faith Wanjiku Mwangi (Active Tenant)',
      tenantStatement: newStatement,
      tenantArtifact: newArtifact || 'Self-declared tenant statement (Tier A)',
      landlordName: 'Landlord / Caretaker (Pending Counter-Statement)',
      landlordStatement: 'Docket opened. Notification dispatched to landlord counterparty via SMS bridge. Awaiting bilateral response.',
      landlordArtifact: 'Awaiting submission',
      monetaryValueKES: parseFloat(newContentionKES) || 0,
      status: 'Bilateral Review',
      lastActivity: 'Just now (EAT)',
    };

    setDisputes([newEntry, ...disputes]);
    setIsFormOpen(false);
    setNewSubject('');
    setNewStatement('');
    setNewContentionKES('');
    setNewArtifact('');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#ECE5D3] p-6 sm:p-8 rounded-lg border border-[#D5CBB0] space-y-3">
        <div className="text-xs uppercase tracking-wider text-[#7C5A2A] font-semibold">
          Constitutional Rule 3 · Epistemic Humility
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B16] font-medium">
          Pending is Not Guilty: Neutral Dispute Ledger
        </h2>
        <p className="text-sm text-[#55503F] max-w-3xl leading-relaxed">
          Traditional credit bureaus treat any formal dispute or withheld payment as an immediate default, penalizing tenants with punitive credit score cuts. In Africa’s informal rental ecosystem, maintenance lapses, broken water pumps, and deposit conflicts are standard operational occurrences. RentalMind records every dispute neutrally—showing both positions side-by-side with zero score penalty.
        </p>

        <div className="pt-3 border-t border-[#D5CBB0] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#1C1B16] font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8863F]" />
            <span>Active Disputes: {disputes.length} dockets under neutral review</span>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 text-xs font-semibold text-[#F3EEDF] bg-[#12201A] hover:bg-[#1B2D25] rounded transition-colors"
          >
            {isFormOpen ? 'Close Form' : '+ Open Neutral Tenancy Docket'}
          </button>
        </div>
      </div>

      {/* New Dispute Intake Drawer */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmitNewDispute}
          className="p-6 bg-[#FDFBF7] border border-[#D5CBB0] rounded-md space-y-4 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#D5CBB0]">
            <h3 className="font-serif text-base font-semibold text-[#1C1B16]">
              Record a Neutral Tenancy Dialogue
            </h3>
            <span className="text-[11px] text-[#7C5A2A] font-mono">
              Protected by Constitutional Rule 3 (Zero Score Penalty)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C1B16] font-semibold mb-1">
                Dispute Subject / Issue Title
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Water tank outage deduction, Roof leak repair sharing..."
                className="w-full p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C1B16] font-semibold mb-1">
                Neighborhood / Estate Context
              </label>
              <select
                value={newEstate}
                onChange={(e) => setNewEstate(e.target.value)}
                className="w-full p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
              >
                <option value="Kilimani">Kilimani</option>
                <option value="Roysambu">Roysambu</option>
                <option value="Pipeline (Embakasi)">Pipeline (Embakasi)</option>
                <option value="South B">South B</option>
                <option value="Rongai">Rongai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#1C1B16] font-semibold mb-1">
              Your Factual Statement (What happened, dates, and actions taken)
            </label>
            <textarea
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              rows={3}
              placeholder="State facts calmly and clearly. The landlord will be invited to supply their perspective in the adjacent docket column."
              className="w-full p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16] leading-relaxed resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C1B16] font-semibold mb-1">
                Contested Monetary Amount (KES) — Optional
              </label>
              <input
                type="number"
                value={newContentionKES}
                onChange={(e) => setNewContentionKES(e.target.value)}
                placeholder="e.g. 3200"
                className="w-full p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16] font-mono"
              />
            </div>
            <div>
              <label className="block text-[#1C1B16] font-semibold mb-1">
                Supporting Evidence Artifact Description
              </label>
              <input
                type="text"
                value={newArtifact}
                onChange={(e) => setNewArtifact(e.target.value)}
                placeholder="e.g. Hardware purchase receipt #890, WhatsApp screenshot, photo..."
                className="w-full p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#55503F] italic">
              *The other party is notified via SMS/WhatsApp with a link to submit their statement.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors"
            >
              Post Neutral Docket →
            </button>
          </div>
        </form>
      )}

      {/* Disputes Dockets Grid */}
      <div className="space-y-6">
        {disputes.map((item) => (
          <div
            key={item.id}
            className="border border-[#D5CBB0] rounded-lg bg-[#FDFBF7] overflow-hidden"
          >
            {/* Docket Header */}
            <div className="p-4 sm:p-5 bg-[#ECE5D3] border-b border-[#D5CBB0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[#7C5A2A] font-semibold">{item.id}</span>
                  <span>·</span>
                  <span className="text-[#55503F]">{item.estate}</span>
                  <span>·</span>
                  <span className="text-[#55503F]">{item.category}</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1B16] mt-0.5">
                  {item.subject}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.monetaryValueKES && (
                  <div className="text-right">
                    <span className="text-[10px] text-[#55503F] block font-mono">Contested Value</span>
                    <span className="text-sm font-mono font-bold text-[#1C1B16]">
                      KES {item.monetaryValueKES.toLocaleString()}
                    </span>
                  </div>
                )}
                <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-[#F6F2E8] border border-[#D5CBB0] text-[#7C5A2A]">
                  {item.status}
                </span>
              </div>
            </div>

            {/* Side-by-Side Bilateral Positions */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D5CBB0] p-5 sm:p-6 gap-6 text-xs">
              {/* Tenant Position */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#D5CBB0]/60">
                  <span className="font-semibold text-[#1C1B16]">
                    Tenant Position · {item.tenantName}
                  </span>
                  <span className="px-2 py-0.5 bg-[#D6C79A] text-[#2A2210] font-mono text-[10px] font-bold rounded">
                    Tier A
                  </span>
                </div>
                <p className="text-[#55503F] leading-relaxed text-xs">
                  {item.tenantStatement}
                </p>
                <div className="p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[11px] text-[#7C5A2A] font-mono">
                  Artifact: {item.tenantArtifact}
                </div>
              </div>

              {/* Landlord Position */}
              <div className="space-y-3 pt-4 md:pt-0">
                <div className="flex items-center justify-between pb-2 border-b border-[#D5CBB0]/60">
                  <span className="font-semibold text-[#1C1B16]">
                    Landlord Position · {item.landlordName}
                  </span>
                  <span className="px-2 py-0.5 bg-[#B79A5A] text-[#1A1608] font-mono text-[10px] font-bold rounded">
                    Tier B
                  </span>
                </div>
                <p className="text-[#55503F] leading-relaxed text-xs">
                  {item.landlordStatement}
                </p>
                <div className="p-2.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[11px] text-[#7C5A2A] font-mono">
                  Artifact: {item.landlordArtifact}
                </div>
              </div>
            </div>

            {/* Docket Footer: Constitutional Guarantees */}
            <div className="px-5 py-3 bg-[#F6F2E8] border-t border-[#D5CBB0] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#55503F] gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#7C5A2A] font-semibold">Doctrine Guarantee:</span>
                <span>Active negotiation status · Zero credit blacklist · Both sides preserved</span>
              </div>
              <div className="font-mono text-[10px] text-[#55503F]">
                Last logged action: {item.lastActivity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
