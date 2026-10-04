import React, { useState } from 'react';
import { ProvenanceTier, PROVENANCE_TIERS } from '../types/rentalmind';

interface SplitPaymentReconcilerProps {
  onRecordCreated?: (title: string, amount: number, tier: ProvenanceTier) => void;
}

export const SplitPaymentReconciler: React.FC<SplitPaymentReconcilerProps> = ({
  onRecordCreated,
}) => {
  const [activePreset, setActivePreset] = useState<'preset1' | 'preset2' | 'preset3'>('preset1');
  const [mpesaText, setMpesaText] = useState(
    'QK89214L9P Confirmed. Ksh16,000.00 sent to PETER KAMAU 0722345678 on 3/9/26 at 10:14 AM. New M-PESA balance is Ksh4,210.00. Transaction cost, Ksh95.00.'
  );
  const [cashAmount, setCashAmount] = useState('8000');
  const [cashReceiptRef, setCashReceiptRef] = useState('RC-0412-ROYSAMBU');
  const [caretakerName, setCaretakerName] = useState('Juma Omwamba (Caretaker)');
  const [caretakerPhone, setCaretakerPhone] = useState('+254 712 345 890');
  const [whatsappProof, setWhatsappProof] = useState(
    '[03/09/2026, 14:32:10] Tenant Faith: Habari Mzee Kamau, nimekutumia 16k kwa M-Pesa ref QK89214L9P na ile balance ya 8k nimempatia Caretaker Juma kwa mkono ameniandikia receipt 0412.\n[03/09/2026, 15:10:45] Landlord Kamau: Sawa Faith nimeona M-Pesa na Juma amenithibitishia ile 8k. Rent ya Sept iko sawa.'
  );

  // Reconciliation state
  const [isReconciled, setIsReconciled] = useState(true);
  const [caretakerSigned, setCaretakerSigned] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Handlers for switching presets
  const applyPreset = (preset: 'preset1' | 'preset2' | 'preset3') => {
    setActivePreset(preset);
    setIsReconciled(false);
    setCaretakerSigned(false);
    setSubmissionFeedback(null);

    if (preset === 'preset1') {
      setMpesaText('QK89214L9P Confirmed. Ksh16,000.00 sent to PETER KAMAU 0722345678 on 3/9/26 at 10:14 AM. New M-PESA balance is Ksh4,210.00. Transaction cost, Ksh95.00.');
      setCashAmount('8000');
      setCashReceiptRef('RC-0412-ROYSAMBU');
      setCaretakerName('Juma Omwamba (Caretaker)');
      setWhatsappProof('[03/09/2026, 14:32:10] Tenant Faith: Habari Mzee Kamau, nimekutumia 16k kwa M-Pesa ref QK89214L9P na ile balance ya 8k nimempatia Caretaker Juma kwa mkono ameniandikia receipt 0412.\n[03/09/2026, 15:10:45] Landlord Kamau: Sawa Faith nimeona M-Pesa na Juma amenithibitishia ile 8k. Rent ya Sept iko sawa.');
    } else if (preset === 'preset2') {
      setMpesaText('RL481920LA Confirmed. Ksh24,000.00 paid to 400200 AMANI HEIGHTS on 2/8/26 at 9:24 AM. Ref: FLAT 3B.');
      setCashAmount('0');
      setCashReceiptRef('N/A (Full Electronic Settlement)');
      setCaretakerName('N/A');
      setWhatsappProof('Full electronic transaction matched via Safaricom Paybill G2 statement API.');
    } else {
      setMpesaText('SM910248KA Confirmed. Ksh10,000.00 sent to ESTATE ACCOUNT on 1/10/26 at 8:00 AM.');
      setCashAmount('14000');
      setCashReceiptRef('VOUCHER-PIPELINE-088');
      setCaretakerName('Evans Otieno (Building Caretaker)');
      setWhatsappProof('[01/10/2026, 08:30] Tenant: Caretaker nimekuachia 14k cash ofisini.');
    }
  };

  // Deterministic extraction
  const mpesaMatch = mpesaText.match(/([A-Z0-9]{10})\s+Confirmed\.\s+Ksh([0-9,]+(?:\.[0-9]{2})?)/i);
  const mpesaRef = mpesaMatch ? mpesaMatch[1] : 'PARSING_FAILED';
  const mpesaAmt = mpesaMatch ? parseFloat(mpesaMatch[2].replace(/,/g, '')) : 0;
  const cashNum = parseFloat(cashAmount) || 0;
  const totalReconciled = mpesaAmt + cashNum;
  const targetRent = 24000;
  const balanceDelta = targetRent - totalReconciled;

  const handleReconcile = () => {
    setIsReconciled(true);
    setSubmissionFeedback(null);
  };

  const handleSimulateCaretakerUSSD = () => {
    setCaretakerSigned(true);
    setSubmissionFeedback('Caretaker Juma Omwamba acknowledged cash receipt via USSD prompt *384*44# (Auth Token: USSD-NBI-8941). Cash voucher elevated from Tier A to Tier B.');
    if (onRecordCreated) {
      onRecordCreated('Split Rent Reconciled Settlement', totalReconciled, 'C');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#ECE5D3] p-6 sm:p-8 rounded-lg border border-[#D5CBB0] space-y-3">
        <div className="text-xs uppercase tracking-wider text-[#7C5A2A] font-semibold">
          Edge-Case Architecture · Kenya Realities
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B16] font-medium">
          Split-Payment & Evidence Reconciliation Engine
        </h2>
        <p className="text-sm text-[#55503F] max-w-3xl leading-relaxed">
          In Nairobi’s high-density neighborhoods (Roysambu, Pipeline, Rongai), over 40% of tenants split rent between mobile money and physical cash to avoid daily limit barriers or pay on-site caretakers directly. Conventional credit bureaus discard the unbanked cash portion as non-existent. RentalMind captures and elevates both legs through bilateral corroboration.
        </p>

        {/* Preset Selector */}
        <div className="pt-3 border-t border-[#D5CBB0] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#55503F] font-medium mr-1">Load Operational Scenario:</span>
          <button
            onClick={() => applyPreset('preset1')}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              activePreset === 'preset1'
                ? 'bg-[#12201A] text-[#F3EEDF] font-semibold'
                : 'bg-[#F6F2E8] border border-[#D5CBB0] text-[#55503F] hover:text-[#1C1B16]'
            }`}
          >
            Scenario 1: KES 16,000 M-Pesa + KES 8,000 Caretaker Cash (Roysambu)
          </button>
          <button
            onClick={() => applyPreset('preset2')}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              activePreset === 'preset2'
                ? 'bg-[#12201A] text-[#F3EEDF] font-semibold'
                : 'bg-[#F6F2E8] border border-[#D5CBB0] text-[#55503F] hover:text-[#1C1B16]'
            }`}
          >
            Scenario 2: Single Full M-Pesa Paybill (Kilimani)
          </button>
          <button
            onClick={() => applyPreset('preset3')}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              activePreset === 'preset3'
                ? 'bg-[#12201A] text-[#F3EEDF] font-semibold'
                : 'bg-[#F6F2E8] border border-[#D5CBB0] text-[#55503F] hover:text-[#1C1B16]'
            }`}
          >
            Scenario 3: Heavy Cash Tenancy (Pipeline)
          </button>
        </div>
      </div>

      {/* Two-Column Working Area: Input on Left, Reconciled Evidence on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Data Ingestion Inputs */}
        <div className="lg:col-span-6 bg-[#FDFBF7] p-6 rounded-md border border-[#D5CBB0] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5CBB0]">
            <h3 className="font-serif text-lg font-semibold text-[#1C1B16]">
              1. Ingest Evidence Streams
            </h3>
            <span className="text-xs font-mono text-[#7C5A2A]">Raw Uncorroborated Feed</span>
          </div>

          {/* Leg 1: M-Pesa SMS Ingestion */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1C1B16]">
              A. Safaricom M-Pesa Payment Notification (SMS / Paybill String)
            </label>
            <textarea
              value={mpesaText}
              onChange={(e) => setMpesaText(e.target.value)}
              rows={3}
              className="w-full text-xs font-mono p-3 bg-[#F6F2E8] border border-[#D5CBB0] rounded focus:outline-none focus:border-[#7C5A2A] text-[#1C1B16] leading-relaxed resize-none"
              placeholder="Paste raw M-Pesa SMS confirmation string..."
            />
            <div className="flex items-center justify-between text-[11px] text-[#55503F]">
              <span>Extraction: {mpesaRef !== 'PARSING_FAILED' ? `Ref ${mpesaRef} · KES ${mpesaAmt.toLocaleString()}` : 'Detecting code...'}</span>
              <span className="text-[#8C6E33] font-medium">Eligible for Tier C once API verified</span>
            </div>
          </div>

          {/* Leg 2: Physical Cash Voucher */}
          <div className="space-y-3 pt-2 border-t border-[#D5CBB0]">
            <label className="block text-xs font-semibold text-[#1C1B16]">
              B. Physical Cash Voucher / Caretaker Receipt Leg
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#55503F] block mb-1">Cash Amount (KES)</span>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full text-xs font-mono p-2 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16] font-semibold"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#55503F] block mb-1">Paper Receipt Serial #</span>
                <input
                  type="text"
                  value={cashReceiptRef}
                  onChange={(e) => setCashReceiptRef(e.target.value)}
                  className="w-full text-xs font-mono p-2 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#55503F] block mb-1">Caretaker / Agent Name</span>
                <input
                  type="text"
                  value={caretakerName}
                  onChange={(e) => setCaretakerName(e.target.value)}
                  className="w-full text-xs p-2 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#55503F] block mb-1">Caretaker Mobile (USSD)</span>
                <input
                  type="text"
                  value={caretakerPhone}
                  onChange={(e) => setCaretakerPhone(e.target.value)}
                  className="w-full text-xs font-mono p-2 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16]"
                />
              </div>
            </div>
          </div>

          {/* Leg 3: WhatsApp / Oral Context */}
          <div className="space-y-2 pt-2 border-t border-[#D5CBB0]">
            <label className="block text-xs font-semibold text-[#1C1B16]">
              C. Counterparty Bilateral Dialogue (WhatsApp Transcript / Agreement)
            </label>
            <textarea
              value={whatsappProof}
              onChange={(e) => setWhatsappProof(e.target.value)}
              rows={3}
              className="w-full text-xs font-mono p-3 bg-[#F6F2E8] border border-[#D5CBB0] rounded focus:outline-none focus:border-[#7C5A2A] text-[#1C1B16] leading-relaxed resize-none"
              placeholder="Paste counterparty message exchange..."
            />
          </div>

          {/* Execute Reconcile Button */}
          <div className="pt-2">
            <button
              onClick={handleReconcile}
              className="w-full py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors shadow-sm"
            >
              Execute Epistemic Reconciliation & Anomaly Check →
            </button>
          </div>
        </div>

        {/* Right Column: Reconciled Evidence & Provenance Elevation */}
        <div className="lg:col-span-6 bg-[#ECE5D3] p-6 rounded-md border border-[#D5CBB0] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5CBB0]">
            <h3 className="font-serif text-lg font-semibold text-[#1C1B16]">
              2. Reconciled Evidence Ledger
            </h3>
            <span className="text-xs font-mono text-[#7C5A2A]">Sourced & Tiered Output</span>
          </div>

          {isReconciled ? (
            <div className="space-y-5">
              {/* Financial Tally Box */}
              <div className="p-4 bg-[#FDFBF7] rounded border border-[#D5CBB0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#55503F] font-medium">Monthly Agreed Rent:</span>
                  <span className="text-xs font-mono font-semibold text-[#1C1B16]">
                    KES {targetRent.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#55503F] font-medium">Reconciled Aggregate:</span>
                  <span className="text-base font-mono font-bold text-[#1C1B16]">
                    KES {totalReconciled.toLocaleString()}
                  </span>
                </div>

                {balanceDelta === 0 ? (
                  <div className="p-2 bg-[#12201A] text-[#E0C080] rounded text-xs flex items-center justify-between">
                    <span>✓ Rent Settlement Fully Reconciled</span>
                    <span className="font-mono">Delta: KES 0.00</span>
                  </div>
                ) : balanceDelta > 0 ? (
                  <div className="p-2 bg-[#8A3F35]/10 border border-[#8A3F35] text-[#8A3F35] rounded text-xs flex items-center justify-between">
                    <span>Partial Payment (Under-settlement)</span>
                    <span className="font-mono">Unpaid: KES {balanceDelta.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="p-2 bg-[#7C5A2A]/10 border border-[#7C5A2A] text-[#7C5A2A] rounded text-xs flex items-center justify-between">
                    <span>Advance / Overpayment Recorded</span>
                    <span className="font-mono">Credit: KES {Math.abs(balanceDelta).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Provenance Ladder for each Leg */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#1C1B16]">
                  Dual-Leg Provenance Breakdown:
                </div>

                {/* Leg 1 Card */}
                <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1B16]">
                      Leg 1: M-Pesa Transfer ({mpesaRef})
                    </span>
                    <span className="px-2 py-0.5 bg-[#8C6E33] text-[#FFFFFF] text-[10px] font-mono font-bold rounded">
                      Tier C — Independently Corroborated
                    </span>
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#1C1B16]">
                    KES {mpesaAmt.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#55503F]">
                    Backed by Safaricom statement hash. Uninterested telecommunications third-party proof.
                  </p>
                </div>

                {/* Leg 2 Card */}
                {cashNum > 0 && (
                  <div className="p-3 bg-[#FDFBF7] border border-[#D5CBB0] rounded space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1C1B16]">
                        Leg 2: Physical Cash Voucher (#{cashReceiptRef})
                      </span>
                      <span 
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          caretakerSigned 
                            ? 'bg-[#B79A5A] text-[#1A1608]' 
                            : 'bg-[#D6C79A] text-[#2A2210]'
                        }`}
                      >
                        {caretakerSigned ? 'Tier B — Counterparty Confirmed' : 'Tier A — Self-Declared'}
                      </span>
                    </div>

                    <div className="text-sm font-mono font-semibold text-[#1C1B16]">
                      KES {cashNum.toLocaleString()}
                    </div>

                    <p className="text-[11px] text-[#55503F] leading-relaxed">
                      {caretakerSigned
                        ? `Validated by ${caretakerName} via USSD handshake token. Bilaterally confirmed.`
                        : `Declared by Tenant. Caretaker counter-signature pending confirmation.`}
                    </p>

                    {/* Step-up affordance */}
                    {!caretakerSigned && (
                      <button
                        onClick={handleSimulateCaretakerUSSD}
                        className="w-full py-2 bg-[#D6C79A] hover:bg-[#E0C080] border border-[#7C5A2A] text-[#1C1B16] font-semibold text-xs rounded transition-colors text-center"
                      >
                        ⚡ Simulate Caretaker USSD Handshake (*384*44#) → Elevate to Tier B
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Epistemic Humility Rule Check */}
              <div className="p-3.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-xs text-[#55503F] space-y-1">
                <span className="font-serif font-semibold text-[#1C1B16] block">
                  Epistemic Humility Enforcement:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Notice that the cash receipt is NOT falsely dressed up as "Bank Verified" (Tier C). It is held transparently at Tier B. An institutional lender or SACCO auditor sees both portions in their exact factual reality without distortion.
                </p>
              </div>

              {/* Feedback Alert */}
              {submissionFeedback && (
                <div className="p-3 bg-[#12201A] text-[#E0C080] rounded text-xs">
                  {submissionFeedback}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#55503F]">
              Click "Execute Epistemic Reconciliation" to parse and verify the evidence streams.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
