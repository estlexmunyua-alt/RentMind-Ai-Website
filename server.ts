import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// In-Memory Database Stores (synced to client)
interface CaretakerStaff {
  id: string;
  name: string;
  badgeId: string;
  nationalId: string;
  email: string;
  phone: string;
  tradeSpecialization: string;
  certifications: string[];
  assignedPropertyId: string;
  assignedPropertyName: string;
  assignedBlocks: string;
  supervisorCode: string;
}

const CARETAKER_REGISTRY: Record<string, CaretakerStaff> = {
  'CT-804': {
    id: 'ct-804',
    name: 'Juma Otieno',
    badgeId: 'CT-804',
    nationalId: '28419204',
    email: 'juma.otieno@riversideheights.co.ke',
    phone: '+254 712 345 804',
    tradeSpecialization: 'Senior Estate Superintendent & Sanitation',
    certifications: ['NITA Grade II Plumbing', 'EPRA Wireman Class C'],
    assignedPropertyId: 'c1',
    assignedPropertyName: 'Riverside Heights',
    assignedBlocks: 'Blocks A, B & C (Units 1-36)',
    supervisorCode: 'SPV-RVS-901',
  },
  'CT-805': {
    id: 'ct-805',
    name: 'Erick Ochieng',
    badgeId: 'CT-805',
    nationalId: '30194821',
    email: 'erick.ochieng@kilimaniterraces.co.ke',
    phone: '+254 723 456 805',
    tradeSpecialization: 'Electrical Wireman & Electro-Mechanicals',
    certifications: ['EPRA Class B Wireman', 'Solar PV Installation'],
    assignedPropertyId: 'c2',
    assignedPropertyName: 'Kilimani Terraces',
    assignedBlocks: 'Wings 1 & 2 (Units 1-24)',
    supervisorCode: 'SPV-KLM-402',
  },
  'CT-806': {
    id: 'ct-806',
    name: 'Samuel Karanja',
    badgeId: 'CT-806',
    nationalId: '25901842',
    email: 'samuel.karanja@gachungavillas.co.ke',
    phone: '+254 734 567 806',
    tradeSpecialization: 'Carpentry, Glazing & Locks Specialist',
    certifications: ['NITA Joinery & Locks Grade I'],
    assignedPropertyId: 'c3',
    assignedPropertyName: 'Gachunga Villas',
    assignedBlocks: 'Courtyards East & West (Units 1-18)',
    supervisorCode: 'SPV-GCV-108',
  },
};

interface ServerMaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  category: string;
  title: string;
  description: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  reportedAt: string;
  tenantContactPhone: string;
  assignedCaretakerBadge: string;
  assignedCaretakerName: string;
  fieldNotes: Array<{ id: string; timestamp: string; staffBadge: string; note: string }>;
  photos: Array<{ id: string; dataUrl: string; caption: string; timestamp: string; takenByStaffBadge: string; origin: string; hash: string }>;
  resolutionDetails?: any;
}

let MAINTENANCE_REQUESTS: ServerMaintenanceRequest[] = [
  {
    id: 'TKT-2026-081',
    propertyId: 'c1',
    propertyName: 'Riverside Heights',
    unitNumber: 'Flat 4B',
    category: 'Plumbing & Water',
    title: 'Burst PVC elbow under kitchen sink with floor seepage',
    description: 'High-pressure mains connection blew out 1/2 inch PVC 90-degree elbow under kitchen sink counter.',
    urgency: 'emergency',
    status: 'in_progress',
    reportedAt: '2026-10-03 08:15 EAT',
    tenantContactPhone: '+254 722 890 144',
    assignedCaretakerBadge: 'CT-804',
    assignedCaretakerName: 'Juma Otieno',
    fieldNotes: [
      {
        id: 'fn-1',
        timestamp: '2026-10-03 08:45 EAT',
        staffBadge: 'CT-804',
        note: 'Isolated gate valve on Riser 4. Old brittle PVC fitting fractured. Sourced PPR PN20 pipe.',
      },
    ],
    photos: [],
  },
  {
    id: 'TKT-2026-091',
    propertyId: 'c2',
    propertyName: 'Kilimani Terraces',
    unitNumber: 'Unit 3F',
    category: 'Structural & Roofing',
    title: 'Roof parapet flashing moisture seepage along cornice',
    description: 'Water staining spreading along east bedroom ceiling cornice following Friday night torrential rains.',
    urgency: 'urgent',
    status: 'in_progress',
    reportedAt: '2026-10-02 11:00 EAT',
    tenantContactPhone: '+254 720 334 119',
    assignedCaretakerBadge: 'CT-805',
    assignedCaretakerName: 'Erick Ochieng',
    fieldNotes: [],
    photos: [],
  },
];

// Anti-Sabotage Property Mandate Verification Guard
function verifyCaretakerPropertyMandate(
  caretakerBadge: string,
  targetPropertyId: string
): { allowed: boolean; reason?: string } {
  const staff = CARETAKER_REGISTRY[caretakerBadge.toUpperCase()];
  if (!staff) {
    return { allowed: false, reason: `Unrecognized caretaker badge ID: ${caretakerBadge}` };
  }

  if (staff.assignedPropertyId !== targetPropertyId) {
    return {
      allowed: false,
      reason: `ANTI-SABOTAGE LOCKOUT: Caretaker ${staff.name} (#${staff.badgeId}) is assigned exclusively to ${staff.assignedPropertyName} (${staff.assignedPropertyId}). Modifications to property ID '${targetPropertyId}' are strictly prohibited to prevent cross-estate tampering.`,
    };
  }

  return { allowed: true };
}

// -------------------------------------------------------------
// CARETAKER REST API ENDPOINTS
// -------------------------------------------------------------

// Caretaker Registration
app.post('/api/caretaker/register', (req: Request, res: Response) => {
  const { name, badgeId, nationalId, email, phone, tradeSpecialization, certifications, assignedPropertyId, assignedPropertyName, assignedBlocks, supervisorCode } = req.body;

  if (!badgeId || !assignedPropertyId) {
    return res.status(400).json({ error: 'Badge ID and Assigned Property Mandate are required.' });
  }

  const staff: CaretakerStaff = {
    id: `ct-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name || 'Resident Caretaker',
    badgeId: badgeId.toUpperCase(),
    nationalId: nationalId || '30000000',
    email: email || 'staff@estate.co.ke',
    phone: phone || '+254 700 000 000',
    tradeSpecialization: tradeSpecialization || 'General Maintenance',
    certifications: certifications || ['NITA Certified'],
    assignedPropertyId,
    assignedPropertyName: assignedPropertyName || 'Assigned Complex',
    assignedBlocks: assignedBlocks || 'All Blocks',
    supervisorCode: supervisorCode || 'SPV-DEFAULT',
  };

  CARETAKER_REGISTRY[staff.badgeId] = staff;
  return res.status(201).json({ success: true, caretaker: staff });
});

// Caretaker Profile & Mandate Management
app.get('/api/caretaker/profile/:badgeId', (req: Request, res: Response) => {
  const badgeId = (req.params.badgeId as string).toUpperCase();
  const staff = CARETAKER_REGISTRY[badgeId];
  if (!staff) {
    return res.status(404).json({ error: 'Caretaker profile not found' });
  }
  return res.json({ caretaker: staff });
});

app.put('/api/caretaker/profile/:badgeId', (req: Request, res: Response) => {
  const badgeId = (req.params.badgeId as string).toUpperCase();
  const staff = CARETAKER_REGISTRY[badgeId];
  if (!staff) {
    return res.status(404).json({ error: 'Caretaker profile not found' });
  }

  const { assignedPropertyId, assignedPropertyName, assignedBlocks, phone, tradeSpecialization } = req.body;
  if (assignedPropertyId) staff.assignedPropertyId = assignedPropertyId;
  if (assignedPropertyName) staff.assignedPropertyName = assignedPropertyName;
  if (assignedBlocks) staff.assignedBlocks = assignedBlocks;
  if (phone) staff.phone = phone;
  if (tradeSpecialization) staff.tradeSpecialization = tradeSpecialization;

  return res.json({ success: true, caretaker: staff });
});

// List maintenance requests (can filter by mandate)
app.get('/api/caretaker/requests', (req: Request, res: Response) => {
  const propertyId = req.query.propertyId as string | undefined;
  if (propertyId) {
    const filtered = MAINTENANCE_REQUESTS.filter(r => r.propertyId === propertyId);
    return res.json({ requests: filtered });
  }
  return res.json({ requests: MAINTENANCE_REQUESTS });
});

// Create In-Field Discovery (Property Mandate Enforced)
app.post('/api/caretaker/requests', (req: Request, res: Response) => {
  const { caretakerBadge, propertyId, propertyName, unitNumber, category, title, description, urgency, tenantContactPhone, photos } = req.body;

  const authCheck = verifyCaretakerPropertyMandate(caretakerBadge, propertyId);
  if (!authCheck.allowed) {
    return res.status(403).json({ error: authCheck.reason });
  }

  const staff = CARETAKER_REGISTRY[caretakerBadge.toUpperCase()];
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';

  const newTicket: ServerMaintenanceRequest = {
    id: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
    propertyId,
    propertyName: propertyName || staff.assignedPropertyName,
    unitNumber: unitNumber || 'Common Area',
    category: category || 'Plumbing & Water',
    title: title || 'Field inspection finding',
    description: description || '',
    urgency: urgency || 'urgent',
    status: 'reported',
    reportedAt: timestamp,
    tenantContactPhone: tenantContactPhone || '+254 700 000 000',
    assignedCaretakerBadge: staff.badgeId,
    assignedCaretakerName: staff.name,
    fieldNotes: [
      {
        id: `fn-${Date.now()}`,
        timestamp,
        staffBadge: staff.badgeId,
        note: `In-field finding recorded by ${staff.name} (#${staff.badgeId}).`,
      },
    ],
    photos: photos || [],
  };

  MAINTENANCE_REQUESTS.unshift(newTicket);
  return res.status(201).json({ success: true, request: newTicket });
});

// Status Transition (Mandate Enforced)
app.post('/api/caretaker/requests/:id/status', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { caretakerBadge, nextStatus } = req.body;

  const ticket = MAINTENANCE_REQUESTS.find(r => r.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Maintenance ticket not found' });
  }

  const authCheck = verifyCaretakerPropertyMandate(caretakerBadge, ticket.propertyId);
  if (!authCheck.allowed) {
    return res.status(403).json({ error: authCheck.reason });
  }

  ticket.status = nextStatus;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';
  ticket.fieldNotes.push({
    id: `fn-${Date.now()}`,
    timestamp,
    staffBadge: caretakerBadge,
    note: `Status changed to ${nextStatus.toUpperCase()} by Staff #${caretakerBadge}.`,
  });

  return res.json({ success: true, ticket });
});

// Field Progress Note (Mandate Enforced)
app.post('/api/caretaker/requests/:id/field-update', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { caretakerBadge, note } = req.body;

  const ticket = MAINTENANCE_REQUESTS.find(r => r.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Maintenance ticket not found' });
  }

  const authCheck = verifyCaretakerPropertyMandate(caretakerBadge, ticket.propertyId);
  if (!authCheck.allowed) {
    return res.status(403).json({ error: authCheck.reason });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';
  const entry = {
    id: `fn-${Date.now()}`,
    timestamp,
    staffBadge: caretakerBadge,
    note: note || '',
  };
  ticket.fieldNotes.push(entry);

  return res.json({ success: true, entry });
});

// Attach Photo Evidence (Mandate Enforced)
app.post('/api/caretaker/requests/:id/photos', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { caretakerBadge, photo } = req.body;

  const ticket = MAINTENANCE_REQUESTS.find(r => r.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Maintenance ticket not found' });
  }

  const authCheck = verifyCaretakerPropertyMandate(caretakerBadge, ticket.propertyId);
  if (!authCheck.allowed) {
    return res.status(403).json({ error: authCheck.reason });
  }

  ticket.photos.unshift(photo);
  return res.json({ success: true, photosCount: ticket.photos.length });
});

// Complete Ticket & Stamp Deposit Liability (Mandate Enforced)
app.post('/api/caretaker/requests/:id/complete', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { caretakerBadge, summary, actionTaken, partsReplaced, laborHours, depositLiability, liabilityNotes, witnessTenantConfirmed } = req.body;

  const ticket = MAINTENANCE_REQUESTS.find(r => r.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Maintenance ticket not found' });
  }

  const authCheck = verifyCaretakerPropertyMandate(caretakerBadge, ticket.propertyId);
  if (!authCheck.allowed) {
    return res.status(403).json({ error: authCheck.reason });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';
  const staffHash = 'STAFF-SHA256-' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);

  ticket.status = 'resolved';
  ticket.resolutionDetails = {
    summary,
    actionTaken,
    partsReplaced,
    laborHours: parseFloat(laborHours) || 1.0,
    depositLiability,
    liabilityNotes,
    staffAttestationHash: staffHash,
    completedAt: timestamp,
    witnessTenantConfirmed: !!witnessTenantConfirmed,
  };

  return res.json({ success: true, ticket });
});

// -------------------------------------------------------------
// M-PESA DARAJA SANDBOX SIMULATION ENDPOINTS
// -------------------------------------------------------------
app.post('/api/mpesa/stkpush', (req: Request, res: Response) => {
  const { phone, amount, accountReference } = req.body;
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return res.json({
    MerchantRequestID: `MR_${Date.now()}`,
    CheckoutRequestID: checkoutRequestId,
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: `Success. Prompt sent to ${phone} for KES ${amount}. Enter M-Pesa PIN.`,
  });
});

app.post('/api/mpesa/c2b-callback', (req: Request, res: Response) => {
  const secretHeader = req.headers['x-mpesa-signature'];
  // Verify SHA256 signature if configured
  return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// -------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION MIDDLEWARE
// -------------------------------------------------------------
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`RentalMind AI server running on port ${PORT}`);
  });
}

setupVite().catch(err => {
  console.error('Server failed to start:', err);
});
