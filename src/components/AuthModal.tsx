import React, { useState } from 'react';
import { CaretakerProfile } from '../types/rentalmind';
import { APARTMENT_COMPLEXES, CARETAKER_STAFF_REGISTRY } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaretakerLogin: (caretaker: CaretakerProfile) => void;
  initialRole?: 'tenant' | 'landlord' | 'caretaker';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onCaretakerLogin,
  initialRole = 'caretaker',
}) => {
  const [activeRole, setActiveRole] = useState<'tenant' | 'landlord' | 'caretaker'>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Caretaker Registration State with all statutory fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regBadgeId, setRegBadgeId] = useState('CT-' + Math.floor(810 + Math.random() * 80));
  const [regSpecialization, setRegSpecialization] = useState('Plumbing & Sanitation');
  const [regCertifications, setRegCertifications] = useState('NITA Grade II Plumbing, EPRA Class C Wireman');
  const [regPropertyId, setRegPropertyId] = useState('c1');
  const [regBlocks, setRegBlocks] = useState('Blocks A & B (Units 1-24)');
  const [regSupervisorCode, setRegSupervisorCode] = useState('SPV-RVS-901');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');

  // General login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handle1ClickCaretakerLogin = (caretaker: CaretakerProfile) => {
    localStorage.setItem('rentalmind_active_caretaker', JSON.stringify(caretaker));
    onCaretakerLogin(caretaker);
    onClose();
  };

  const handleCaretakerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedProperty = APARTMENT_COMPLEXES.find(c => c.id === regPropertyId) || APARTMENT_COMPLEXES[0];
    
    const newCaretaker: CaretakerProfile = {
      id: `ct-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regName || 'Resident Caretaker',
      email: regEmail || 'caretaker@estate.co.ke',
      phone: regPhone || '+254 700 000 000',
      badgeId: regBadgeId,
      nationalId: regNationalId || '30000000',
      tradeSpecialization: regSpecialization,
      certifications: regCertifications.split(',').map(s => s.trim()).filter(Boolean),
      assignedPropertyId: assignedProperty.id,
      assignedPropertyName: assignedProperty.name,
      assignedBlocks: regBlocks,
      supervisorCode: regSupervisorCode,
      emergencyPhone: regEmergencyPhone || regPhone,
      status: 'on_duty',
    };

    localStorage.setItem('rentalmind_active_caretaker', JSON.stringify(newCaretaker));
    setFeedbackMsg(`Caretaker ${newCaretaker.name} (#${newCaretaker.badgeId}) successfully registered and bound to ${newCaretaker.assignedPropertyName}.`);
    
    setTimeout(() => {
      onCaretakerLogin(newCaretaker);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="p-5 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
              RentalMind Authentication & Mandate Gateway
            </div>
            <h3 className="font-serif text-lg font-semibold mt-0.5">
              {activeRole === 'caretaker' ? 'Caretaker Operations & Anti-Sabotage Login' : 'Ecosystem Portal Sign In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#C5CBC0] hover:text-[#F3EEDF] rounded text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 pt-4 border-b border-[#D5CBB0] bg-[#ECE5D3] flex items-center gap-2">
          {[
            { id: 'caretaker', label: 'Caretaker / Maintenance Staff' },
            { id: 'tenant', label: 'Tenant Sovereign Portal' },
            { id: 'landlord', label: 'Landlord & Property Manager' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRole(r.id as any);
                setFeedbackMsg(null);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-t transition-colors ${
                activeRole === r.id
                  ? 'bg-[#F6F2E8] text-[#1C1B16] border-t border-x border-[#D5CBB0]'
                  : 'text-[#55503F] hover:text-[#1C1B16]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#1C1B16]">
          {activeRole === 'caretaker' ? (
            <div className="space-y-5">
              {/* Constitutional Notice */}
              <div className="p-3 bg-[#12201A] text-[#E0C080] rounded border border-[#34483E] text-xs space-y-1">
                <span className="font-serif font-semibold block text-[#F3EEDF]">
                  Anti-Sabotage Property Mandate Policy:
                </span>
                <p className="text-[11px] text-[#C5CBC0] leading-relaxed">
                  Caretakers have zero access to rent ledgers, tenant banking, or landlord financials. Each caretaker is bound to an exclusive apartment complex to prevent tampering or sabotage between staff.
                </p>
              </div>

              {/* 1-Click Demo Login Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1C1B16]">
                    Instant 1-Click Demo Caretaker Logins:
                  </span>
                  <span className="text-[11px] text-[#7C5A2A] font-mono">Bound Mandates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CARETAKER_STAFF_REGISTRY.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => handle1ClickCaretakerLogin(ct)}
                      className="p-2.5 rounded border border-[#D5CBB0] bg-[#FDFBF7] hover:bg-[#ECE5D3] text-left transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-semibold text-[#1C1B16] truncate">{ct.name}</div>
                        <div className="text-[10px] text-[#7C5A2A] font-mono">Badge #{ct.badgeId}</div>
                      </div>
                      <div className="mt-2 pt-1 border-t border-[#D5CBB0] text-[10px] text-[#55503F] truncate">
                        🔒 {ct.assignedPropertyName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Between Login vs Register */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#D5CBB0]">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    authMode === 'login' ? 'border-[#7C5A2A] text-[#1C1B16]' : 'border-transparent text-[#55503F]'
                  }`}
                >
                  Sign In with Staff Badge
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    authMode === 'register' ? 'border-[#7C5A2A] text-[#1C1B16]' : 'border-transparent text-[#55503F]'
                  }`}
                >
                  Register New Caretaker & Choose Mandate
                </button>
              </div>

              {feedbackMsg && (
                <div className="p-3 bg-[#12201A] text-[#E0C080] rounded text-xs font-medium">
                  {feedbackMsg}
                </div>
              )}

              {/* Login Form */}
              {authMode === 'login' ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const match = CARETAKER_STAFF_REGISTRY.find(
                      c => c.badgeId.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
                           c.email.toLowerCase() === loginIdentifier.trim().toLowerCase()
                    );
                    if (match) {
                      handle1ClickCaretakerLogin(match);
                    } else {
                      setFeedbackMsg(`No caretaker found matching "${loginIdentifier}". Use CT-804, CT-805, CT-806 or register below.`);
                    }
                  }}
                  className="space-y-3 pt-2"
                >
                  <div>
                    <label className="block font-semibold mb-1 text-[#1C1B16]">
                      Staff Badge ID (e.g. CT-804) or Work Email
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="CT-804 or juma.otieno@riversideheights.co.ke"
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-[#1C1B16] font-mono text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors shadow-sm"
                  >
                    Authenticate into Caretaker Workspace →
                  </button>
                </form>
              ) : (
                /* Registration Form with All Required Requirements */
                <form onSubmit={handleCaretakerRegister} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Full Legal Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dennis Mutua"
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Staff Badge ID</label>
                      <input
                        type="text"
                        value={regBadgeId}
                        onChange={(e) => setRegBadgeId(e.target.value)}
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Official Phone (M-Pesa registered)</label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Govt National ID / Alien Reg #</label>
                      <input
                        type="text"
                        value={regNationalId}
                        onChange={(e) => setRegNationalId(e.target.value)}
                        placeholder="e.g. 28910482"
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Work Email Address</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="staff@estate.co.ke"
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Trade Specialization</label>
                      <select
                        value={regSpecialization}
                        onChange={(e) => setRegSpecialization(e.target.value)}
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                      >
                        <option value="Senior Estate Superintendent">Senior Estate Superintendent</option>
                        <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                        <option value="Electrical Wireman & Electro-Mechanicals">Electrical Wireman</option>
                        <option value="Carpentry, Glazing & Locks">Carpentry, Glazing & Locks</option>
                        <option value="HVAC & Pump Mechanicals">HVAC & Pump Mechanicals</option>
                        <option value="General Building Maintenance">General Building Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-0.5 text-[#1C1B16]">Technical Licensing & Certifications</label>
                    <input
                      type="text"
                      value={regCertifications}
                      onChange={(e) => setRegCertifications(e.target.value)}
                      placeholder="e.g. NITA Grade II, EPRA Wireman Class C, OSHA"
                      className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                    />
                  </div>

                  {/* MANDATE SELECTION: Choose assigned apartment complex */}
                  <div className="p-3 bg-[#ECE5D3] border border-[#D5CBB0] rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-[#1C1B16]">
                        🔒 Assigned Apartment Mandate (Exclusive Authority)
                      </label>
                      <span className="text-[10px] text-[#7C5A2A] font-mono">Anti-Sabotage Lock</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#55503F] block mb-1">Select Property Complex:</span>
                        <select
                          value={regPropertyId}
                          onChange={(e) => setRegPropertyId(e.target.value)}
                          className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-semibold text-[#1C1B16]"
                        >
                          {APARTMENT_COMPLEXES.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.estate} · {c.totalUnits} Units)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#55503F] block mb-1">Unit Block Scope:</span>
                        <input
                          type="text"
                          value={regBlocks}
                          onChange={(e) => setRegBlocks(e.target.value)}
                          placeholder="e.g. Blocks A & B (Units 1-24)"
                          className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-[#55503F] italic">
                      *You will only be able to view and modify maintenance dispatches for this complex. Other estates will be strictly locked.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Supervisor Auth Code</label>
                      <input
                        type="text"
                        value={regSupervisorCode}
                        onChange={(e) => setRegSupervisorCode(e.target.value)}
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5 text-[#1C1B16]">Emergency Hotline</label>
                      <input
                        type="text"
                        value={regEmergencyPhone}
                        onChange={(e) => setRegEmergencyPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors shadow-sm"
                    >
                      Complete Caretaker Registration & Bind Mandate →
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Tenant / Landlord Simple Auth Placeholder */
            <div className="space-y-4">
              <p className="text-[#55503F] leading-relaxed">
                Log in to your sovereign {activeRole === 'tenant' ? 'Tenant' : 'Landlord'} account to manage rental history, dispute ledgers, or payment verifications.
              </p>
              <div>
                <label className="block font-semibold mb-1 text-[#1C1B16]">
                  {activeRole === 'tenant' ? 'Tenant Phone / National ID' : 'Landlord Email / Company Reg'}
                </label>
                <input
                  type="text"
                  placeholder={activeRole === 'tenant' ? '+254 7XX XXX XXX' : 'manager@property.co.ke'}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                />
              </div>
              <button
                onClick={() => {
                  alert(`Logged in to ${activeRole} workspace.`);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded"
              >
                Access Portal →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
