import React, { useState } from 'react';

interface JoinPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinPilotModal: React.FC<JoinPilotModalProps> = ({ isOpen, onClose }) => {
  type RoleType = 'tenant' | 'landlord' | 'ambassador' | 'institutional';
  const [role, setRole] = useState<RoleType>('tenant');
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [estate, setEstate] = useState('Roysambu');
  const [unitCount, setUnitCount] = useState('1');
  const [orgName, setOrgName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
              Pilot 01 · Nairobi Field Cohort
            </div>
            <h3 className="font-serif text-lg font-semibold mt-0.5">
              Enrol in RentalMind Trust Network
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

        <div className="p-6 overflow-y-auto text-xs text-[#1C1B16] space-y-4">
          {submitted ? (
            <div className="p-6 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#12201A] text-[#E0C080] text-xl font-bold grid place-items-center">
                ✓
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1C1B16]">
                Enrolment Intent Received
              </h4>
              <p className="text-[#55503F] leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Our Nairobi field pilot coordinator (Rebeccah Ndegwa & Team) will contact you at <strong>{phoneOrEmail}</strong> for baseline verification in {estate}.
              </p>
              <div className="p-3 bg-[#ECE5D3] rounded text-[11px] text-[#55503F]">
                Reference ID: RM-PILOT-NBI-{Math.floor(1000 + Math.random() * 9000)} · Protected by Constitutional Sovereignty
              </div>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 text-xs font-semibold bg-[#12201A] text-[#E0C080] rounded hover:bg-[#1B2D25]"
              >
                Return to Ledger
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[#55503F] leading-relaxed">
                Join our first controlled learning cohort in Nairobi. We are onboarding individual tenants, small-scale caretakers, property managers, and SACCO lending partners.
              </p>

              {/* Role Selector */}
              <div>
                <label className="block font-semibold mb-1 text-[#1C1B16]">Your Role in the Tenancy Ecosystem</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'tenant', label: 'Tenant (Resident)' },
                    { id: 'landlord', label: 'Landlord / Caretaker' },
                    { id: 'ambassador', label: 'Field Ambassador' },
                    { id: 'institutional', label: 'SACCO / Lender' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`p-2 rounded text-left border transition-colors ${
                        role === r.id
                          ? 'border-[#12201A] bg-[#ECE5D3] font-semibold text-[#1C1B16]'
                          : 'border-[#D5CBB0] bg-[#FDFBF7] text-[#55503F] hover:text-[#1C1B16]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#1C1B16]">Full Legal or Trading Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Grace Nyambura"
                    className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C1B16]">Mobile Number (Safaricom M-Pesa / WhatsApp) or Email</label>
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="+254 7XX XXX XXX or name@domain.com"
                    className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16] font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[#1C1B16]">Nairobi Estate / Area</label>
                    <select
                      value={estate}
                      onChange={(e) => setEstate(e.target.value)}
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16]"
                    >
                      <option value="Roysambu">Roysambu</option>
                      <option value="Kilimani">Kilimani</option>
                      <option value="Pipeline (Embakasi)">Pipeline (Embakasi)</option>
                      <option value="South B">South B</option>
                      <option value="Rongai">Rongai</option>
                      <option value="Westlands">Westlands</option>
                      <option value="Pangani">Pangani</option>
                      <option value="Kahawa West">Kahawa West</option>
                    </select>
                  </div>

                  {role === 'landlord' ? (
                    <div>
                      <label className="block font-semibold mb-1 text-[#1C1B16]">Units Under Management</label>
                      <input
                        type="number"
                        value={unitCount}
                        onChange={(e) => setUnitCount(e.target.value)}
                        className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16] font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold mb-1 text-[#1C1B16]">Organization (Optional)</label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. Qwetucasa / Self"
                        className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors shadow-sm"
                >
                  Submit Enrolment Request →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
