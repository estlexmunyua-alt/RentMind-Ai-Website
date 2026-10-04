export type ProvenanceTier = 'A' | 'B' | 'C' | 'D';

export interface ProvenanceDetails {
  tier: ProvenanceTier;
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeFg: string;
  description: string;
  evidentiaryStandard: string;
}

export const PROVENANCE_TIERS: Record<ProvenanceTier, ProvenanceDetails> = {
  A: {
    tier: 'A',
    title: 'Self-Declared',
    subtitle: 'Single-Party Declaration',
    badgeBg: '#D6C79A',
    badgeFg: '#2A2210',
    description: 'Submitted by one party to the tenancy. Uncorroborated, recorded with explicit declared interest.',
    evidentiaryStandard: 'Tenant self-log, unverified paper note, or initial oral claim.',
  },
  B: {
    tier: 'B',
    title: 'Counterparty Confirmed',
    subtitle: 'Bilateral Tenancy Acknowledged',
    badgeBg: '#B79A5A',
    badgeFg: '#1A1608',
    description: 'Acknowledged and validated by the other party to the tenancy (landlord, caretaker, or tenant).',
    evidentiaryStandard: 'SMS confirmation, WhatsApp bilateral agreement, signed paper receipt counter-signature.',
  },
  C: {
    tier: 'C',
    title: 'Independently Corroborated',
    subtitle: 'Third-Party Auditable Record',
    badgeBg: '#8C6E33',
    badgeFg: '#FFFFFF',
    description: 'Independently corroborated by an uninterested institutional third party.',
    evidentiaryStandard: 'Safaricom M-Pesa transaction ledger, KPLC token API, bank settlement record, registered lease.',
  },
  D: {
    tier: 'D',
    title: 'Authoritatively Determined',
    subtitle: 'Institutional Legal Decree',
    badgeBg: '#2C2C55',
    badgeFg: '#FFFFFF',
    description: 'Final legal or regulatory determination rendered by a recognized dispute body.',
    evidentiaryStandard: 'Rent Restriction Tribunal (RRT), Business Premises Rent Tribunal, Court Ruling, Chief’s baraza settlement.',
  },
};

export type RecordCategory = 
  | 'rent_payment' 
  | 'split_payment' 
  | 'utility_clearance' 
  | 'maintenance_event' 
  | 'tenancy_agreement' 
  | 'neutral_dispute';

export interface AuditLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  previousTier?: ProvenanceTier;
  newTier?: ProvenanceTier;
  evidenceRef: string;
}

export interface RentalRecord {
  id: string;
  title: string;
  date: string;
  category: RecordCategory;
  tier: ProvenanceTier;
  amountKES?: number;
  origin: string;
  declaredInterest: 'Interested party (Tenant)' | 'Interested party (Landlord/Caretaker)' | 'Neutral third-party' | 'Statutory Authority';
  summary: string;
  details: string;
  counterparty: string;
  estate: string;
  unit: string;
  hash: string;
  splitBreakdown?: {
    mpesaAmount: number;
    mpesaRef: string;
    mpesaStatus: ProvenanceTier;
    cashAmount: number;
    cashReceiptNumber: string;
    cashStatus: ProvenanceTier;
    caretakerSignee: string;
  };
  disputeData?: {
    disputeId: string;
    tenantPosition: string;
    landlordPosition: string;
    status: 'Active - Bilateral Review' | 'Pending Evidence Corroboration' | 'Settled with Mutual Release';
    monetaryContentionKES?: number;
    zeroPenaltyAttestation: boolean;
  };
  auditTrail: AuditLogEntry[];
}

export interface TenancyProfile {
  id: string;
  tenantName: string;
  property: string;
  estate: string;
  county: string;
  unitNumber: string;
  monthlyRentKES: number;
  securityDepositKES: number;
  landlordName: string;
  caretakerName: string;
  startDate: string;
  durationMonths: number;
  totalRecordsCount: number;
  corroborationRatePct: number; // Tier B or higher
}

export interface DisclosureScope {
  includePayments: boolean;
  includeUtilities: boolean;
  includeMaintenance: boolean;
  includeDisputes: boolean;
  minTier: ProvenanceTier;
  timeframeMonths: number;
  recipientInstitution: string;
  expiresInHours: number;
}

export type DepositLiabilityClassification = 
  | 'normal_wear_and_tear'
  | 'pre_existing_defect'
  | 'tenant_negligence'
  | 'routine_servicing';

export interface MaintenanceEvidencePhoto {
  id: string;
  dataUrl: string;
  caption: string;
  timestamp: string;
  takenByStaffBadge: string;
  origin: 'live_camera' | 'file_upload';
  hash: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  category: 'Plumbing & Water' | 'Electrical & Power' | 'Locks & Security' | 'Structural & Roofing' | 'Civil & Glazing';
  title: string;
  description: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  reportedAt: string;
  tenantContactPhone: string;
  acknowledgedAt?: string;
  inProgressAt?: string;
  resolvedAt?: string;
  assignedCaretakerBadge: string;
  assignedCaretakerName: string;
  fieldNotes: Array<{
    id: string;
    timestamp: string;
    staffBadge: string;
    note: string;
  }>;
  photos: MaintenanceEvidencePhoto[];
  resolutionDetails?: {
    summary: string;
    actionTaken: string;
    partsReplaced?: string;
    laborHours: number;
    depositLiability: DepositLiabilityClassification;
    liabilityNotes: string;
    staffAttestationHash: string;
    completedAt: string;
    witnessTenantConfirmed?: boolean;
  };
}

export interface CaretakerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  badgeId: string;
  nationalId: string;
  tradeSpecialization: string;
  certifications: string[];
  assignedPropertyId: string;
  assignedPropertyName: string;
  assignedBlocks: string;
  supervisorCode: string;
  emergencyPhone: string;
  status: 'active' | 'on_duty' | 'off_duty';
}

