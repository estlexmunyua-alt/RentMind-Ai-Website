import React, { useState, useRef, useEffect } from 'react';
import { 
  CaretakerProfile, 
  MaintenanceTicket, 
  MaintenanceEvidencePhoto, 
  DepositLiabilityClassification 
} from '../types/rentalmind';
import { 
  APARTMENT_COMPLEXES, 
  CARETAKER_STAFF_REGISTRY, 
  INITIAL_MAINTENANCE_TICKETS 
} from '../data/mockData';

interface CaretakerAppProps {
  initialCaretaker?: CaretakerProfile;
  onOpenAuthModal: () => void;
}

export const CaretakerApp: React.FC<CaretakerAppProps> = ({
  initialCaretaker,
  onOpenAuthModal,
}) => {
  // Active caretaker profile
  const [caretaker, setCaretaker] = useState<CaretakerProfile>(() => {
    const saved = localStorage.getItem('rentalmind_active_caretaker');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialCaretaker || CARETAKER_STAFF_REGISTRY[0];
  });

  // Maintenance tickets state
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('rentalmind_maintenance_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_MAINTENANCE_TICKETS;
  });

  // Save tickets on change
  useEffect(() => {
    localStorage.setItem('rentalmind_maintenance_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Selected ticket and UI modes
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [showAllEstates, setShowAllEstates] = useState<boolean>(false);
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Panels
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFieldDiscoveryOpen, setIsFieldDiscoveryOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [activeVoucherTicket, setActiveVoucherTicket] = useState<MaintenanceTicket | null>(null);

  // Field Note Drawer State
  const [newFieldNote, setNewFieldNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Completion Form State
  const [completionSummary, setCompletionSummary] = useState('');
  const [completionAction, setCompletionAction] = useState('');
  const [completionParts, setCompletionParts] = useState('');
  const [completionLaborHours, setCompletionLaborHours] = useState('1.5');
  const [completionLiability, setCompletionLiability] = useState<DepositLiabilityClassification>('normal_wear_and_tear');
  const [completionLiabilityNotes, setCompletionLiabilityNotes] = useState('');
  const [witnessTenantConfirmed, setWitnessTenantConfirmed] = useState(true);

  // In-Field Finding State
  const [discoveryUnit, setDiscoveryUnit] = useState('Flat 5B');
  const [discoveryCategory, setDiscoveryCategory] = useState<'Plumbing & Water' | 'Electrical & Power' | 'Locks & Security' | 'Structural & Roofing' | 'Civil & Glazing'>('Plumbing & Water');
  const [discoveryTitle, setDiscoveryTitle] = useState('');
  const [discoveryDescription, setDiscoveryDescription] = useState('');
  const [discoveryUrgency, setDiscoveryUrgency] = useState<'routine' | 'urgent' | 'emergency'>('urgent');
  const [discoveryTenantPhone, setDiscoveryTenantPhone] = useState('+254 722 000 111');
  const [stagedPhotos, setStagedPhotos] = useState<MaintenanceEvidencePhoto[]>([]);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraTargetTicketId, setCameraTargetTicketId] = useState<string | null>(null);
  const [activePhotoCaption, setActivePhotoCaption] = useState('Forensic field inspection evidence');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Lightbox State
  const [lightboxPhoto, setLightboxPhoto] = useState<MaintenanceEvidencePhoto | null>(null);

  // Feedback Notification
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'warning' | 'error', message: string) => {
    setAlertBanner({ type, message });
    setTimeout(() => setAlertBanner(null), 5000);
  };

  // Switch Mandate helper
  const handleSwitchCaretaker = (newCt: CaretakerProfile) => {
    setCaretaker(newCt);
    localStorage.setItem('rentalmind_active_caretaker', JSON.stringify(newCt));
    showAlert('success', `Switched mandate to ${newCt.name} (#${newCt.badgeId}). Active apartment complex: ${newCt.assignedPropertyName}.`);
  };

  // Filtered tickets
  const displayedTickets = tickets.filter((t) => {
    // Anti-sabotage filtering: By default, only show caretaker's assigned property
    if (!showAllEstates && t.propertyId !== caretaker.assignedPropertyId) {
      return false;
    }
    if (urgencyFilter !== 'all' && t.urgency !== urgencyFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || displayedTickets[0] || tickets[0];
  const isSelectedTicketWithinMandate = selectedTicket?.propertyId === caretaker.assignedPropertyId;

  // Camera Management
  const startCamera = async (targetTicketId?: string) => {
    setCameraTargetTicketId(targetTicketId || null);
    setIsCameraActive(true);
    setCameraError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera access not permitted or unavailable on this device. You can still upload photo files directly.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply Staff Forensic Watermark
    ctx.fillStyle = 'rgba(18, 32, 26, 0.75)';
    ctx.fillRect(0, canvas.height - 36, canvas.width, 36);
    ctx.fillStyle = '#E0C080';
    ctx.font = 'bold 12px monospace';
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT';
    ctx.fillText(`STAFF: ${caretaker.badgeId} · ${caretaker.assignedPropertyName} · ${timestampStr}`, 12, canvas.height - 14);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const photoHash = 'SHA256:' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

    const newPhoto: MaintenanceEvidencePhoto = {
      id: `photo-${Date.now()}`,
      dataUrl,
      caption: activePhotoCaption || 'Field camera capture',
      timestamp: timestampStr,
      takenByStaffBadge: caretaker.badgeId,
      origin: 'live_camera',
      hash: photoHash,
    };

    if (cameraTargetTicketId) {
      // Attach to existing ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.id === cameraTargetTicketId ? { ...t, photos: [newPhoto, ...t.photos] } : t
        )
      );
      showAlert('success', `Forensic camera snapshot linked to ticket ${cameraTargetTicketId}.`);
    } else {
      // Stage for in-field finding
      setStagedPhotos((prev) => [newPhoto, ...prev]);
      showAlert('success', 'Camera snapshot captured and staged for field finding.');
    }

    stopCamera();
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetTicketId?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT';
        const photoHash = 'SHA256:' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

        const newPhoto: MaintenanceEvidencePhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          dataUrl,
          caption: file.name,
          timestamp: timestampStr,
          takenByStaffBadge: caretaker.badgeId,
          origin: 'file_upload',
          hash: photoHash,
        };

        if (targetTicketId) {
          setTickets((prev) =>
            prev.map((t) =>
              t.id === targetTicketId ? { ...t, photos: [newPhoto, ...t.photos] } : t
            )
          );
          showAlert('success', `Photo ${file.name} attached to ticket ${targetTicketId}.`);
        } else {
          setStagedPhotos((prev) => [newPhoto, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Anti-Sabotage Action Guard
  const verifyMandateGuard = (ticket: MaintenanceTicket): boolean => {
    if (ticket.propertyId !== caretaker.assignedPropertyId) {
      const assignedComplex = APARTMENT_COMPLEXES.find((c) => c.id === ticket.propertyId);
      const legitimateCaretaker = assignedComplex?.residentCaretakerName || 'Another Caretaker';
      showAlert(
        'error',
        `ANTI-SABOTAGE VIOLATION BLOCKED: ${ticket.propertyName} is exclusively assigned to ${legitimateCaretaker} (${assignedComplex?.residentCaretakerBadge}). Cross-estate alterations are strictly forbidden.`
      );
      return false;
    }
    return true;
  };

  // Ticket Status Transitions
  const handleTransitionStatus = (ticketId: string, nextStatus: 'acknowledged' | 'in_progress') => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || !verifyMandateGuard(target)) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: nextStatus,
            acknowledgedAt: nextStatus === 'acknowledged' ? timestamp : t.acknowledgedAt,
            inProgressAt: nextStatus === 'in_progress' ? timestamp : t.inProgressAt,
            fieldNotes: [
              ...t.fieldNotes,
              {
                id: `fn-${Date.now()}`,
                timestamp,
                staffBadge: caretaker.badgeId,
                note: `Status transitioned to ${nextStatus.toUpperCase()} by ${caretaker.name} (#${caretaker.badgeId}).`,
              },
            ],
          };
        }
        return t;
      })
    );

    showAlert('success', `Ticket ${ticketId} transitioned to ${nextStatus.toUpperCase()}.`);
  };

  // Add Field Note
  const handleAddFieldNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newFieldNote.trim()) return;
    if (!verifyMandateGuard(selectedTicket)) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            fieldNotes: [
              ...t.fieldNotes,
              {
                id: `fn-${Date.now()}`,
                timestamp,
                staffBadge: caretaker.badgeId,
                note: newFieldNote.trim(),
              },
            ],
          };
        }
        return t;
      })
    );

    setNewFieldNote('');
    setIsAddingNote(false);
    showAlert('success', 'Field progress note appended to ticket log.');
  };

  // Submit Completed Ticket with Deposit Liability Categorization
  const handleCompleteTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    if (!verifyMandateGuard(selectedTicket)) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';
    const staffHash =
      'STAFF-SHA256-' +
      Math.random().toString(36).substring(2, 14) +
      Math.random().toString(36).substring(2, 14);

    const updatedTicket: MaintenanceTicket = {
      ...selectedTicket,
      status: 'resolved',
      resolvedAt: timestamp,
      resolutionDetails: {
        summary: completionSummary || 'Maintenance repair executed and verified on site.',
        actionTaken: completionAction || 'Diagnosed, replaced defective components, and tested under working pressure.',
        partsReplaced: completionParts || 'Standard building store consumables',
        laborHours: parseFloat(completionLaborHours) || 1.0,
        depositLiability: completionLiability,
        liabilityNotes: completionLiabilityNotes || 'Physical inspection confirmed root cause of defect.',
        staffAttestationHash: staffHash,
        completedAt: timestamp,
        witnessTenantConfirmed,
      },
      fieldNotes: [
        ...selectedTicket.fieldNotes,
        {
          id: `fn-${Date.now()}`,
          timestamp,
          staffBadge: caretaker.badgeId,
          note: `WORK COMPLETED & STAMPED: ${completionLiability.toUpperCase().replace(/_/g, ' ')}. Attestation Hash: ${staffHash}`,
        },
      ],
    };

    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setIsCompletionModalOpen(false);
    setActiveVoucherTicket(updatedTicket);
    setIsVoucherModalOpen(true);
    showAlert('success', `Ticket ${selectedTicket.id} stamped resolved. Clearance voucher ready.`);
  };

  // Submit New In-Field Discovery
  const handleCreateInFieldFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discoveryTitle.trim() || !discoveryDescription.trim()) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT';
    const newId = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: MaintenanceTicket = {
      id: newId,
      propertyId: caretaker.assignedPropertyId,
      propertyName: caretaker.assignedPropertyName,
      unitNumber: discoveryUnit,
      category: discoveryCategory,
      title: discoveryTitle,
      description: discoveryDescription,
      urgency: discoveryUrgency,
      status: 'reported',
      reportedAt: timestamp,
      tenantContactPhone: discoveryTenantPhone,
      assignedCaretakerBadge: caretaker.badgeId,
      assignedCaretakerName: caretaker.name,
      fieldNotes: [
        {
          id: `fn-disc-${Date.now()}`,
          timestamp,
          staffBadge: caretaker.badgeId,
          note: `In-field discovery logged during daily grounds inspection by ${caretaker.name} (#${caretaker.badgeId}).`,
        },
      ],
      photos: stagedPhotos,
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newId);
    setIsFieldDiscoveryOpen(false);
    setDiscoveryTitle('');
    setDiscoveryDescription('');
    setStagedPhotos([]);
    showAlert('success', `In-field discovery logged for ${caretaker.assignedPropertyName} (${discoveryUnit}).`);
  };

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
      {alertBanner && (
        <div
          className={`p-4 rounded-md text-xs font-semibold flex items-center justify-between shadow-sm transition-all ${
            alertBanner.type === 'error'
              ? 'bg-[#8A3F35] text-white'
              : alertBanner.type === 'warning'
              ? 'bg-[#B8863F] text-[#1C1B16]'
              : 'bg-[#12201A] text-[#E0C080] border border-[#34483E]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{alertBanner.type === 'error' ? '🛑' : '✓'}</span>
            <span>{alertBanner.message}</span>
          </div>
          <button onClick={() => setAlertBanner(null)} className="ml-4 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Top Console Header & Mandate Bar */}
      <div className="bg-[#12201A] text-[#F3EEDF] p-6 sm:p-7 rounded-lg border border-[#34483E] space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#E0C080] text-[#1C1B16] rounded">
                CARETAKER OPERATIONS HUB
              </span>
              <span className="text-xs text-[#C5CBC0] font-mono">
                Badge #{caretaker.badgeId} · {caretaker.tradeSpecialization}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#F3EEDF]">
              {caretaker.name} — On-Duty Staff Terminal
            </h2>
            <div className="text-xs text-[#C5CBC0] flex flex-wrap items-center gap-2">
              <span className="text-[#E0C080] font-semibold">🔒 Exclusive Mandate:</span>
              <span>{caretaker.assignedPropertyName}</span>
              <span>·</span>
              <span>{caretaker.assignedBlocks}</span>
              <span>·</span>
              <span>Supervisor Code: {caretaker.supervisorCode}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsFieldDiscoveryOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-[#E0C080] hover:bg-[#ECD39B] text-[#1C1B16] rounded transition-colors shadow-xs"
            >
              + Log In-Field Finding
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-[#F3EEDF] hover:text-[#E0C080] border border-[#34483E] hover:border-[#7C5A2A] rounded transition-colors"
            >
              Profile & Assigned Apartments
            </button>
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-2 text-xs font-medium text-[#C5CBC0] hover:text-[#F3EEDF] border border-[#34483E] rounded transition-colors"
            >
              Switch Role / Sign Out
            </button>
          </div>
        </div>

        {/* Anti-Sabotage Mandate Switcher & Zero Financials Notice */}
        <div className="pt-3 border-t border-[#34483E] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#C5CBC0]">
            <span className="text-[#E0C080]">🛡️ Zero Financials Exposure:</span>
            <span>Rent amounts, tenant banking, and M-Pesa receipts are shielded by policy.</span>
          </div>

          {/* 1-Click Mandate Switcher for Live Demo */}
          <div className="flex items-center gap-2">
            <span className="text-[#C5CBC0] text-[11px]">Test Anti-Sabotage Mandate:</span>
            <div className="inline-flex rounded border border-[#34483E] bg-[#1B2D25] p-0.5">
              {CARETAKER_STAFF_REGISTRY.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => handleSwitchCaretaker(ct)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    caretaker.badgeId === ct.badgeId
                      ? 'bg-[#E0C080] text-[#1C1B16] font-bold shadow-xs'
                      : 'text-[#C5CBC0] hover:text-[#F3EEDF]'
                  }`}
                  title={`Switch to ${ct.name} (${ct.assignedPropertyName})`}
                >
                  {ct.name.split(' ')[0]} ({ct.assignedPropertyName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Dispatches List on Left, Ticket Inspection & Resolution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 bg-[#FDFBF7] border border-[#D5CBB0] rounded-lg p-5 space-y-4 shadow-sm">
          {/* Queue Filter Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D5CBB0]">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1C1B16]">
                Operational Maintenance Queue
              </h3>
              <p className="text-[11px] text-[#55503F]">
                Showing {displayedTickets.length} dispatch{displayedTickets.length !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Anti-Sabotage Toggle */}
            <div className="text-right">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showAllEstates}
                  onChange={(e) => setShowAllEstates(e.target.checked)}
                  className="accent-[#7C5A2A]"
                />
                <span className="text-[11px] text-[#55503F] font-mono">
                  {showAllEstates ? 'Auditing All Estates' : 'My Mandate Only'}
                </span>
              </label>
            </div>
          </div>

          {/* Sub Filters */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-1.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16] text-[11px]"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="p-1.5 bg-[#F6F2E8] border border-[#D5CBB0] rounded text-[#1C1B16] text-[11px]"
            >
              <option value="all">All Urgency</option>
              <option value="emergency">🚨 Emergency</option>
              <option value="urgent">⚡ Urgent</option>
              <option value="routine">Routine</option>
            </select>
          </div>

          {/* Tickets List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {displayedTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#55503F] border border-dashed border-[#D5CBB0] rounded">
                No maintenance dispatches matching current criteria for {caretaker.assignedPropertyName}.
              </div>
            ) : (
              displayedTickets.map((ticket) => {
                const isSelected = ticket.id === selectedTicket?.id;
                const isMyMandate = ticket.propertyId === caretaker.assignedPropertyId;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'border-[#7C5A2A] bg-[#ECE5D3] ring-1 ring-[#7C5A2A]'
                        : 'border-[#D5CBB0] bg-[#F6F2E8] hover:bg-[#ECE5D3]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[#7C5A2A] font-bold text-[11px]">
                          {ticket.id}
                        </span>
                        {!isMyMandate && (
                          <span className="px-1.5 py-0.2 bg-[#8A3F35]/20 text-[#8A3F35] font-mono text-[9px] font-bold rounded">
                            🔒 Other Mandate
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {ticket.urgency === 'emergency' && (
                          <span className="px-1.5 py-0.5 bg-[#8A3F35] text-white font-mono text-[10px] font-bold rounded animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                        {ticket.urgency === 'urgent' && (
                          <span className="px-1.5 py-0.5 bg-[#B8863F] text-white font-mono text-[10px] font-bold rounded">
                            URGENT
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 font-mono text-[10px] rounded uppercase ${
                            ticket.status === 'resolved'
                              ? 'bg-[#12201A] text-[#E0C080]'
                              : ticket.status === 'in_progress'
                              ? 'bg-[#B79A5A] text-white'
                              : 'bg-[#D6C79A] text-[#1C1B16]'
                          }`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="font-serif font-semibold text-sm text-[#1C1B16] line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-[#55503F] flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#1C1B16]">
                          {ticket.propertyName} · {ticket.unitNumber}
                        </span>
                        <span>·</span>
                        <span>{ticket.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#55503F] pt-1 border-t border-[#D5CBB0]/50 font-mono">
                      <span>{ticket.reportedAt}</span>
                      <span>📷 {ticket.photos.length} Photo{ticket.photos.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Detail, Anti-Sabotage Gate, Field Notes, Camera, and Clearance */}
        <div className="lg:col-span-7 space-y-6">
          {selectedTicket ? (
            <div className="bg-[#FDFBF7] border border-[#D5CBB0] rounded-lg p-6 space-y-6 shadow-sm">
              
              {/* Anti-Sabotage Warning if viewing outside mandate */}
              {!isSelectedTicketWithinMandate && (
                <div className="p-4 bg-[#8A3F35]/15 border border-[#8A3F35] rounded-md space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#8A3F35]">
                    <span>🔒 ANTI-SABOTAGE QUARANTINE: CROSS-ESTATE LOCK ACTIVE</span>
                  </div>
                  <p className="text-[#55503F] leading-relaxed text-[11px]">
                    This dispatch belongs to <strong>{selectedTicket.propertyName}</strong>, which is exclusively assigned to <strong>{selectedTicket.assignedCaretakerName} (#{selectedTicket.assignedCaretakerBadge})</strong>. As Caretaker of {caretaker.assignedPropertyName}, all modifications, field note entries, photo attachments, and status stamping are disabled on this ticket to eliminate tampering and sabotage between staff.
                  </p>
                </div>
              )}

              {/* Ticket Main Header */}
              <div className="space-y-2 pb-4 border-b border-[#D5CBB0]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#7C5A2A]">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs text-[#55503F]">·</span>
                    <span className="font-semibold text-xs text-[#1C1B16]">
                      {selectedTicket.category}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 font-mono text-xs font-bold rounded uppercase ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-[#12201A] text-[#E0C080]'
                        : selectedTicket.status === 'in_progress'
                        ? 'bg-[#B79A5A] text-white'
                        : 'bg-[#D6C79A] text-[#1C1B16]'
                    }`}
                  >
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1B16]">
                  {selectedTicket.title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2 bg-[#F6F2E8] rounded">
                    <span className="text-[10px] text-[#55503F] block">Location / Unit:</span>
                    <span className="font-semibold text-[#1C1B16]">
                      {selectedTicket.propertyName} · {selectedTicket.unitNumber}
                    </span>
                  </div>
                  <div className="p-2 bg-[#F6F2E8] rounded">
                    <span className="text-[10px] text-[#55503F] block">Tenant Access Phone:</span>
                    <span className="font-mono font-semibold text-[#1C1B16]">
                      {selectedTicket.tenantContactPhone}
                    </span>
                  </div>
                  <div className="p-2 bg-[#F6F2E8] rounded col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#55503F] block">Reported Timestamp:</span>
                    <span className="font-mono text-[#55503F] text-[11px]">
                      {selectedTicket.reportedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-2">
                <h4 className="font-serif font-semibold text-sm text-[#1C1B16]">
                  Incident Description & Defect Scope
                </h4>
                <p className="text-xs text-[#55503F] leading-relaxed bg-[#F6F2E8] p-3.5 rounded border border-[#D5CBB0]">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Status Transition & Workflow Controller */}
              <div className="p-4 bg-[#ECE5D3] rounded-md border border-[#D5CBB0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-semibold text-sm text-[#1C1B16]">
                    Repair Lifecycle & Field Handshake
                  </span>
                  <span className="text-[11px] text-[#7C5A2A] font-mono">
                    Staff Authority: {caretaker.badgeId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedTicket.status === 'reported' && (
                    <button
                      disabled={!isSelectedTicketWithinMandate}
                      onClick={() => handleTransitionStatus(selectedTicket.id, 'acknowledged')}
                      className="px-4 py-2 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ✓ Acknowledge Dispatch
                    </button>
                  )}

                  {selectedTicket.status === 'acknowledged' && (
                    <button
                      disabled={!isSelectedTicketWithinMandate}
                      onClick={() => handleTransitionStatus(selectedTicket.id, 'in_progress')}
                      className="px-4 py-2 bg-[#7C5A2A] hover:bg-[#B8863F] text-white font-semibold text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ⚡ Transition to In Progress (On-Site)
                    </button>
                  )}

                  {selectedTicket.status !== 'resolved' && (
                    <button
                      disabled={!isSelectedTicketWithinMandate}
                      onClick={() => setIsCompletionModalOpen(true)}
                      className="px-4 py-2 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                    >
                      🏁 Complete & Stamp Deposit Resolution →
                    </button>
                  )}

                  {selectedTicket.status === 'resolved' && (
                    <button
                      onClick={() => {
                        setActiveVoucherTicket(selectedTicket);
                        setIsVoucherModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded transition-colors"
                    >
                      📄 View Constitutional Clearance Voucher
                    </button>
                  )}
                </div>
              </div>

              {/* Photographic Forensic Evidence Section */}
              <div className="space-y-3 pt-2 border-t border-[#D5CBB0]">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-semibold text-sm text-[#1C1B16]">
                      Photographic Forensic Evidence Records
                    </h4>
                    <p className="text-[11px] text-[#55503F]">
                      Captured on site with staff badge watermarks for deposit dispute protection
                    </p>
                  </div>

                  {/* Camera & Upload Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={!isSelectedTicketWithinMandate}
                      onClick={() => startCamera(selectedTicket.id)}
                      className="px-3 py-1.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] text-xs font-semibold rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                    >
                      <span>📷 Live Camera</span>
                    </button>

                    <label
                      className={`px-3 py-1.5 bg-[#ECE5D3] hover:bg-[#D6C79A] text-[#1C1B16] text-xs font-semibold rounded border border-[#D5CBB0] cursor-pointer flex items-center gap-1 ${
                        !isSelectedTicketWithinMandate ? 'opacity-40 pointer-events-none' : ''
                      }`}
                    >
                      <span>📁 Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, selectedTicket.id)}
                        disabled={!isSelectedTicketWithinMandate}
                      />
                    </label>
                  </div>
                </div>

                {/* Photo Gallery Grid */}
                {selectedTicket.photos.length === 0 ? (
                  <div className="p-4 bg-[#F6F2E8] border border-dashed border-[#D5CBB0] rounded text-center text-xs text-[#55503F]">
                    No photographic evidence linked yet. Snap live forensic camera photos to corroborate defect.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {selectedTicket.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setLightboxPhoto(photo)}
                        className="group relative rounded border border-[#D5CBB0] overflow-hidden bg-[#12201A] cursor-pointer shadow-xs"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.caption}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="p-2 bg-[#FDFBF7] text-[10px] space-y-0.5">
                          <p className="font-semibold text-[#1C1B16] truncate">{photo.caption}</p>
                          <p className="text-[#55503F] font-mono truncate">{photo.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Field Progress Logs */}
              <div className="space-y-3 pt-2 border-t border-[#D5CBB0]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-semibold text-sm text-[#1C1B16]">
                    Field Progress Logs & Operational Notes
                  </h4>
                  <button
                    disabled={!isSelectedTicketWithinMandate}
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    className="text-xs text-[#7C5A2A] hover:underline font-semibold disabled:opacity-40"
                  >
                    {isAddingNote ? 'Cancel' : '+ Append Field Note'}
                  </button>
                </div>

                {/* Add Note Form */}
                {isAddingNote && (
                  <form onSubmit={handleAddFieldNote} className="space-y-2 p-3 bg-[#F6F2E8] rounded border border-[#D5CBB0]">
                    <textarea
                      value={newFieldNote}
                      onChange={(e) => setNewFieldNote(e.target.value)}
                      placeholder="Enter field notes (e.g. Diagnosis, hardware procured, contractor contacted)..."
                      rows={2}
                      className="w-full p-2 text-xs bg-[#FDFBF7] border border-[#D5CBB0] rounded resize-none text-[#1C1B16]"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#12201A] text-[#E0C080] text-xs font-semibold rounded"
                      >
                        Post Note
                      </button>
                    </div>
                  </form>
                )}

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedTicket.fieldNotes.map((fn) => (
                    <div key={fn.id} className="p-2.5 bg-[#F6F2E8] border-l-2 border-[#7C5A2A] rounded-r text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#55503F] font-mono">
                        <span className="font-semibold text-[#1C1B16]">Staff #{fn.staffBadge}</span>
                        <span>{fn.timestamp}</span>
                      </div>
                      <p className="text-[#55503F] text-[11px] leading-relaxed">{fn.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authoritative Resolution Card (if resolved) */}
              {selectedTicket.resolutionDetails && (
                <div className="p-4 bg-[#12201A] text-[#F3EEDF] rounded-md space-y-3 border border-[#34483E]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#34483E]">
                    <span className="font-serif text-[#E0C080] font-semibold text-sm">
                      Constitutional Deposit Liability Determination
                    </span>
                    <span className="px-2 py-0.5 bg-[#E0C080] text-[#1C1B16] text-[10px] font-mono font-bold rounded uppercase">
                      {selectedTicket.resolutionDetails.depositLiability.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#C5CBC0] leading-relaxed">
                    {selectedTicket.resolutionDetails.liabilityNotes}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#C5CBC0] pt-1">
                    <div>
                      <span className="block text-[#9FA99F]">Parts Consumed:</span>
                      <span className="text-[#F3EEDF] font-medium">{selectedTicket.resolutionDetails.partsReplaced}</span>
                    </div>
                    <div>
                      <span className="block text-[#9FA99F]">Labor Spent:</span>
                      <span className="text-[#F3EEDF] font-mono">{selectedTicket.resolutionDetails.laborHours} Hours</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#34483E] text-[10px] font-mono text-[#E0C080] flex items-center justify-between">
                    <span className="truncate pr-2">{selectedTicket.resolutionDetails.staffAttestationHash}</span>
                    <span className="shrink-0">Tier B Staff Attested</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#55503F] bg-[#FDFBF7] rounded border border-[#D5CBB0]">
              Select a maintenance dispatch to inspect.
            </div>
          )}
        </div>

      </div>

      {/* ============================================================== */}
      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {/* ============================================================== */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#12201A] border border-[#34483E] rounded-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-[#1B2D25] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-serif text-sm font-semibold text-[#E0C080]">
                  Forensic Staff Camera Viewfinder
                </span>
              </div>
              <button onClick={stopCamera} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {cameraError ? (
                <div className="p-4 bg-[#8A3F35]/20 border border-[#8A3F35] text-[#F3EEDF] text-xs rounded space-y-2">
                  <p>{cameraError}</p>
                  <label className="inline-block px-4 py-2 bg-[#E0C080] text-[#1C1B16] font-semibold text-xs rounded cursor-pointer">
                    📁 Select Photo from Files
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        handleFileUpload(e, cameraTargetTicketId || undefined);
                        stopCamera();
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative rounded overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Live Staff Badge Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 p-2 rounded text-[10px] font-mono text-[#E0C080] flex items-center justify-between">
                    <span>STAFF: {caretaker.badgeId} · {caretaker.assignedPropertyName}</span>
                    <span>LIVE REC</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#F3EEDF] mb-1">
                  Evidence Caption / Tag
                </label>
                <input
                  type="text"
                  value={activePhotoCaption}
                  onChange={(e) => setActivePhotoCaption(e.target.value)}
                  placeholder="e.g. Fractured pipe, burnt breaker, pre-existing tile scratch..."
                  className="w-full p-2 bg-[#1B2D25] border border-[#34483E] rounded text-xs text-[#F3EEDF]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCameraFacing(cameraFacing === 'environment' ? 'user' : 'environment')}
                  className="px-3 py-1.5 text-xs text-[#C5CBC0] hover:text-[#F3EEDF] border border-[#34483E] rounded"
                >
                  🔄 Flip Camera ({cameraFacing})
                </button>

                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-5 py-2.5 bg-[#E0C080] hover:bg-[#ECD39B] text-[#1C1B16] font-bold text-xs rounded shadow-lg flex items-center gap-2"
                >
                  <span>📸 Snap Evidence</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EVIDENCE LIGHTBOX MODAL */}
      {/* ============================================================== */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#12201A] border border-[#34483E] rounded-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-[#1B2D25] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#E0C080]">
                  {lightboxPhoto.caption}
                </h4>
                <div className="text-[11px] text-[#C5CBC0] font-mono">
                  Timestamp: {lightboxPhoto.timestamp} · Author: Staff #{lightboxPhoto.takenByStaffBadge}
                </div>
              </div>
              <button onClick={() => setLightboxPhoto(null)} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={lightboxPhoto.dataUrl}
                alt={lightboxPhoto.caption}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="p-3.5 bg-[#1B2D25] text-[11px] font-mono text-[#E0C080] flex items-center justify-between border-t border-[#34483E]">
              <span className="truncate pr-4">Integrity Checksum: {lightboxPhoto.hash}</span>
              <a
                href={lightboxPhoto.dataUrl}
                download={`rentalmind-evidence-${lightboxPhoto.id}.jpg`}
                className="text-[#E0C080] hover:underline font-semibold shrink-0"
              >
                Download Evidence File
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* IN-FIELD DISCOVERY MODAL */}
      {/* ============================================================== */}
      {isFieldDiscoveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
                  In-Field Discovery Logger
                </div>
                <h3 className="font-serif text-base font-semibold mt-0.5">
                  Log On-Site Inspection Defect
                </h3>
              </div>
              <button onClick={() => setIsFieldDiscoveryOpen(false)} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInFieldFinding} className="p-6 overflow-y-auto space-y-4 text-xs text-[#1C1B16]">
              {/* Anti-Sabotage Lockdown Info */}
              <div className="p-2.5 bg-[#ECE5D3] rounded border border-[#D5CBB0] text-[11px] text-[#55503F]">
                🔒 <strong>Mandate Locked:</strong> This finding will be registered directly under your assigned complex: <strong>{caretaker.assignedPropertyName}</strong>.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit Number / Common Area</label>
                  <input
                    type="text"
                    value={discoveryUnit}
                    onChange={(e) => setDiscoveryUnit(e.target.value)}
                    placeholder="e.g. Unit 3A or Stairwell Block B"
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Trade Category</label>
                  <select
                    value={discoveryCategory}
                    onChange={(e) => setDiscoveryCategory(e.target.value as any)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  >
                    <option value="Plumbing & Water">Plumbing & Water</option>
                    <option value="Electrical & Power">Electrical & Power</option>
                    <option value="Locks & Security">Locks & Security</option>
                    <option value="Structural & Roofing">Structural & Roofing</option>
                    <option value="Civil & Glazing">Civil & Glazing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Issue Title / Defect Summary</label>
                <input
                  type="text"
                  value={discoveryTitle}
                  onChange={(e) => setDiscoveryTitle(e.target.value)}
                  placeholder="e.g. Broken stopcock leaking under washroom basin"
                  className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Findings & Physical Inspection</label>
                <textarea
                  value={discoveryDescription}
                  onChange={(e) => setDiscoveryDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail observations, root cause, and immediate safety measures..."
                  className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Urgency</label>
                  <select
                    value={discoveryUrgency}
                    onChange={(e) => setDiscoveryUrgency(e.target.value as any)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">⚡ Urgent</option>
                    <option value="emergency">🚨 Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tenant Phone (if occupied)</label>
                  <input
                    type="text"
                    value={discoveryTenantPhone}
                    onChange={(e) => setDiscoveryTenantPhone(e.target.value)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                  />
                </div>
              </div>

              {/* Photo Evidence in In-Field Finding */}
              <div className="space-y-2 pt-2 border-t border-[#D5CBB0]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Forensic Photos ({stagedPhotos.length} Staged)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-2.5 py-1 bg-[#12201A] text-[#E0C080] rounded text-[11px] font-semibold"
                    >
                      📷 Camera
                    </button>
                    <label className="px-2.5 py-1 bg-[#ECE5D3] rounded border border-[#D5CBB0] text-[11px] font-semibold cursor-pointer">
                      📁 Files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </label>
                  </div>
                </div>

                {stagedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {stagedPhotos.map((p) => (
                      <div key={p.id} className="relative rounded overflow-hidden border border-[#D5CBB0] h-16 bg-black">
                        <img src={p.dataUrl} alt={p.caption} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFieldDiscoveryOpen(false)}
                  className="px-4 py-2 text-xs text-[#55503F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded"
                >
                  Register In-Field Finding →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TICKET COMPLETION & DEPOSIT LIABILITY DETERMINATION MODAL */}
      {/* ============================================================== */}
      {isCompletionModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
                  Authoritative Staff Stamp
                </div>
                <h3 className="font-serif text-base font-semibold mt-0.5">
                  Complete Repair & Determine Deposit Liability
                </h3>
              </div>
              <button onClick={() => setIsCompletionModalOpen(false)} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteTicket} className="p-6 overflow-y-auto space-y-4 text-xs text-[#1C1B16]">
              <div className="p-2.5 bg-[#ECE5D3] rounded border border-[#D5CBB0] text-[11px] text-[#55503F]">
                Dispatch: <strong>{selectedTicket.id}</strong> · {selectedTicket.propertyName} ({selectedTicket.unitNumber})
              </div>

              <div>
                <label className="block font-semibold mb-1">Work Completion Summary</label>
                <input
                  type="text"
                  value={completionSummary}
                  onChange={(e) => setCompletionSummary(e.target.value)}
                  placeholder="e.g. Spliced damaged pipe, replaced fitting, pressure tested 2.5 bar"
                  className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Materials / Consumables Replaced</label>
                  <input
                    type="text"
                    value={completionParts}
                    onChange={(e) => setCompletionParts(e.target.value)}
                    placeholder="e.g. 1x PPR PN20 Elbow, Teflon tape"
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Labor Spent (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={completionLaborHours}
                    onChange={(e) => setCompletionLaborHours(e.target.value)}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded font-mono"
                  />
                </div>
              </div>

              {/* CRITICAL: Deposit Liability Categorization */}
              <div className="p-3.5 bg-[#ECE5D3] rounded-md border border-[#D5CBB0] space-y-3">
                <div>
                  <label className="block font-serif font-semibold text-sm text-[#1C1B16] mb-0.5">
                    Deposit Liability Determination (Constitutional Standard)
                  </label>
                  <p className="text-[11px] text-[#55503F]">
                    This categorization is non-repudiable and establishes whether move-out deposit withholding is legally permissible.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 'normal_wear_and_tear',
                      label: 'Normal Wear & Tear',
                      desc: '100% building expense. Tenant security deposit is legally shielded from deduction.',
                    },
                    {
                      id: 'pre_existing_defect',
                      label: 'Pre-existing Structural / Plumbing Defect',
                      desc: 'Landlord capital expenditure. Attributable to aging infrastructure, not resident action.',
                    },
                    {
                      id: 'tenant_negligence',
                      label: 'Tenant Negligence / Accidental Damage',
                      desc: 'Eligible for itemized deposit deduction with attached photo proof.',
                    },
                    {
                      id: 'routine_servicing',
                      label: 'Routine Preventive Servicing',
                      desc: 'Scheduled estate maintenance cycle. Fully absorbed by property operations.',
                    },
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className={`block p-2.5 rounded border transition-colors cursor-pointer ${
                        completionLiability === cat.id
                          ? 'bg-[#12201A] text-[#F3EEDF] border-[#12201A]'
                          : 'bg-[#FDFBF7] text-[#1C1B16] border-[#D5CBB0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="depositLiability"
                          value={cat.id}
                          checked={completionLiability === cat.id}
                          onChange={() => setCompletionLiability(cat.id as any)}
                          className="accent-[#E0C080]"
                        />
                        <span className="font-semibold text-xs">{cat.label}</span>
                      </div>
                      <p className={`text-[10px] pl-5 mt-0.5 ${completionLiability === cat.id ? 'text-[#C5CBC0]' : 'text-[#55503F]'}`}>
                        {cat.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Staff Technical Justification & Notes</label>
                <textarea
                  value={completionLiabilityNotes}
                  onChange={(e) => setCompletionLiabilityNotes(e.target.value)}
                  rows={2}
                  placeholder="Detail physical inspection evidence supporting this liability finding..."
                  className="w-full p-2 bg-[#FDFBF7] border border-[#D5CBB0] rounded resize-none"
                  required
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={witnessTenantConfirmed}
                  onChange={(e) => setWitnessTenantConfirmed(e.target.checked)}
                  className="accent-[#7C5A2A]"
                />
                <span className="text-[11px] text-[#1C1B16]">
                  Tenant witnessed physical restoration and agreed issue is cleared.
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D5CBB0]">
                <button
                  type="button"
                  onClick={() => setIsCompletionModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#55503F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#12201A] hover:bg-[#1B2D25] text-[#E0C080] font-semibold text-xs rounded shadow-sm"
                >
                  Apply Staff Stamp & Generate Clearance Voucher →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONSTITUTIONAL CLEARANCE VOUCHER MODAL */}
      {/* ============================================================== */}
      {isVoucherModalOpen && activeVoucherTicket && activeVoucherTicket.resolutionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-semibold text-[#E0C080]">
                  Constitutional Maintenance Clearance Voucher
                </span>
                <span className="px-1.5 py-0.2 bg-[#E0C080] text-[#1C1B16] text-[10px] font-mono font-bold rounded">
                  Tier B Stamp
                </span>
              </div>
              <button onClick={() => setIsVoucherModalOpen(false)} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#1C1B16]">
              {/* Voucher Printable Frame */}
              <div className="p-5 bg-[#FDFBF7] border-2 border-double border-[#7C5A2A] rounded-md space-y-4">
                <div className="text-center space-y-1 pb-3 border-b border-[#D5CBB0]">
                  <div className="font-serif text-lg font-bold text-[#1C1B16]">
                    RentalMind Constitutional Evidence Voucher
                  </div>
                  <div className="text-[11px] text-[#7C5A2A] font-mono">
                    DISPATCH REF: {activeVoucherTicket.id} · PROPERTY: {activeVoucherTicket.propertyName} ({activeVoucherTicket.unitNumber})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#55503F] text-[10px] block">Attesting Caretaker:</span>
                    <span className="font-semibold text-[#1C1B16]">{activeVoucherTicket.assignedCaretakerName}</span>
                    <span className="text-[#7C5A2A] font-mono block text-[10px]">Badge #{activeVoucherTicket.assignedCaretakerBadge}</span>
                  </div>
                  <div>
                    <span className="text-[#55503F] text-[10px] block">Execution Timestamp:</span>
                    <span className="font-mono text-[#1C1B16]">{activeVoucherTicket.resolutionDetails.completedAt}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#55503F] text-[10px] block">Resolution Summary:</span>
                  <p className="font-medium text-[#1C1B16]">{activeVoucherTicket.resolutionDetails.summary}</p>
                </div>

                {/* Liability determination highlighted */}
                <div className="p-3 bg-[#12201A] text-[#F3EEDF] rounded space-y-1">
                  <span className="text-[10px] font-mono text-[#E0C080] block">
                    DEPOSIT LIABILITY DETERMINATION:
                  </span>
                  <div className="font-serif text-base font-bold text-[#F3EEDF] uppercase">
                    {activeVoucherTicket.resolutionDetails.depositLiability.replace(/_/g, ' ')}
                  </div>
                  <p className="text-[11px] text-[#C5CBC0]">
                    {activeVoucherTicket.resolutionDetails.liabilityNotes}
                  </p>
                </div>

                {/* Cryptographic hash */}
                <div className="p-2 bg-[#ECE5D3] rounded font-mono text-[10px] text-[#7C5A2A] break-all">
                  STAMP HASH: {activeVoucherTicket.resolutionDetails.staffAttestationHash}
                </div>

                <div className="text-[10px] text-[#55503F] text-center italic">
                  *This document constitutes Tier B authoritative counterparty evidence for Rent Restriction Tribunal (RRT) deposit escrow hearings.
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#ECE5D3] border-t border-[#D5CBB0] flex items-center justify-between">
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="px-4 py-2 text-xs text-[#55503F]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#12201A] text-[#E0C080] font-semibold text-xs rounded hover:bg-[#1B2D25]"
              >
                🖨️ Print Clearance Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PROFILE & ASSIGNED APARTMENTS MODAL */}
      {/* ============================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#F6F2E8] border border-[#D5CBB0] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#12201A] text-[#F3EEDF] flex items-center justify-between border-b border-[#34483E]">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#E0C080] font-mono">
                  Caretaker Credentials & Mandate Scope
                </div>
                <h3 className="font-serif text-base font-semibold mt-0.5">
                  My Profile & Assigned Apartments
                </h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-[#C5CBC0] hover:text-[#F3EEDF] text-lg">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#1C1B16]">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#D5CBB0]">
                <div>
                  <span className="text-[#55503F] text-[10px] block">Full Name:</span>
                  <span className="font-semibold text-sm">{caretaker.name}</span>
                </div>
                <div>
                  <span className="text-[#55503F] text-[10px] block">Staff Badge ID:</span>
                  <span className="font-mono font-bold text-[#7C5A2A] text-sm">#{caretaker.badgeId}</span>
                </div>
                <div>
                  <span className="text-[#55503F] text-[10px] block">Government National ID:</span>
                  <span className="font-mono text-[#1C1B16]">{caretaker.nationalId}</span>
                </div>
                <div>
                  <span className="text-[#55503F] text-[10px] block">M-Pesa Official Phone:</span>
                  <span className="font-mono text-[#1C1B16]">{caretaker.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[#55503F] text-[10px] block">Technical Specialization:</span>
                <span className="font-medium text-[#1C1B16]">{caretaker.tradeSpecialization}</span>
              </div>

              <div>
                <span className="text-[#55503F] text-[10px] block">Certifications & Licensing:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {caretaker.certifications.map((cert, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 bg-[#ECE5D3] border border-[#D5CBB0] rounded text-[11px] font-mono">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apartment Mandate Switcher/Re-assigner */}
              <div className="p-3.5 bg-[#12201A] text-[#F3EEDF] rounded-md space-y-2">
                <span className="text-xs font-serif font-semibold text-[#E0C080] block">
                  Assigned Property Mandate (Anti-Sabotage Lock)
                </span>
                <p className="text-[11px] text-[#C5CBC0]">
                  Currently bound to: <strong>{caretaker.assignedPropertyName}</strong> ({caretaker.assignedBlocks})
                </p>

                <div className="pt-2">
                  <label className="block text-[11px] text-[#9FA99F] mb-1">
                    Re-scope Assigned Complex:
                  </label>
                  <select
                    value={caretaker.assignedPropertyId}
                    onChange={(e) => {
                      const selected = APARTMENT_COMPLEXES.find(c => c.id === e.target.value);
                      if (selected) {
                        const updated: CaretakerProfile = {
                          ...caretaker,
                          assignedPropertyId: selected.id,
                          assignedPropertyName: selected.name,
                        };
                        setCaretaker(updated);
                        localStorage.setItem('rentalmind_active_caretaker', JSON.stringify(updated));
                        showAlert('success', `Assigned property updated to ${selected.name}. Workspace re-scoped.`);
                      }
                    }}
                    className="w-full p-2 bg-[#1B2D25] border border-[#34483E] rounded text-xs text-[#E0C080] font-semibold"
                  >
                    {APARTMENT_COMPLEXES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.estate} · {c.totalUnits} Units)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#ECE5D3] border-t border-[#D5CBB0] flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-[#12201A] text-[#E0C080] font-semibold text-xs rounded hover:bg-[#1B2D25]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
