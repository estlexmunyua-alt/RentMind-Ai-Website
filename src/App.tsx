/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PassportExplorer } from './components/PassportExplorer';
import { SplitPaymentReconciler } from './components/SplitPaymentReconciler';
import { NeutralDisputes } from './components/NeutralDisputes';
import { PilotScoreboard } from './components/PilotScoreboard';
import { ConstitutionalDoctrine } from './components/ConstitutionalDoctrine';
import { CaretakerApp } from './components/CaretakerApp';
import { SelectiveDisclosureModal } from './components/SelectiveDisclosureModal';
import { JoinPilotModal } from './components/JoinPilotModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CaretakerProfile } from './types/rentalmind';
import { CARETAKER_STAFF_REGISTRY } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('passport');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCaretaker, setActiveCaretaker] = useState<CaretakerProfile>(() => {
    const saved = localStorage.getItem('rentalmind_active_caretaker');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return CARETAKER_STAFF_REGISTRY[0];
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F2E8] text-[#1C1B16] selection:bg-[#E0C080]/30 selection:text-[#12201A]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVault={() => setIsVaultOpen(true)}
        onJoinPilot={() => setIsPilotModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onExplorePassport={() => {
          setActiveTab('passport');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onJoinPilot={() => setIsPilotModalOpen(true)}
        onOpenSplitReconciler={() => {
          setActiveTab('reconciler');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Interactive Work Area */}
      <main id="main-content" className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-10">
        
        {/* Navigation Rail / Secondary Chapter Selector */}
        <div className="flex items-center justify-between border-b border-[#D5CBB0] pb-3 overflow-x-auto gap-4">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {[
              { id: 'passport', label: '1. Rental Passport' },
              { id: 'caretaker', label: '2. Caretaker Operations 🔒' },
              { id: 'reconciler', label: '3. Split Reconciler' },
              { id: 'disputes', label: '4. Neutral Disputes' },
              { id: 'pilot', label: '5. Pilot 01 Nairobi' },
              { id: 'constitution', label: '6. Constitution' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-3 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#12201A] text-[#F3EEDF] shadow-xs'
                    : 'text-[#55503F] hover:text-[#1C1B16] hover:bg-[#ECE5D3]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="shrink-0 hidden md:flex items-center gap-2 text-xs text-[#7C5A2A] font-mono">
            <span>PROVENANCE: TIERS A → D</span>
          </div>
        </div>

        {/* Tab View Switching */}
        {activeTab === 'passport' && (
          <PassportExplorer
            onOpenVault={() => setIsVaultOpen(true)}
            onOpenSplitReconciler={() => setActiveTab('reconciler')}
          />
        )}

        {activeTab === 'caretaker' && (
          <CaretakerApp
            initialCaretaker={activeCaretaker}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'reconciler' && (
          <SplitPaymentReconciler
            onRecordCreated={(title) => {
              setActiveTab('passport');
              alert(`Success: "${title}" elevated and recorded to active Rental Passport ledger!`);
            }}
          />
        )}

        {activeTab === 'disputes' && <NeutralDisputes />}

        {activeTab === 'pilot' && (
          <PilotScoreboard onJoinPilot={() => setIsPilotModalOpen(true)} />
        )}

        {activeTab === 'constitution' && <ConstitutionalDoctrine />}

      </main>

      {/* Selective Disclosure Modal */}
      <SelectiveDisclosureModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* Join Pilot 01 Modal */}
      <JoinPilotModal
        isOpen={isPilotModalOpen}
        onClose={() => setIsPilotModalOpen(false)}
      />

      {/* Caretaker Authentication & Mandate Gateway Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onCaretakerLogin={(ct) => {
          setActiveCaretaker(ct);
          setActiveTab('caretaker');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onJoinPilot={() => setIsPilotModalOpen(true)}
      />
    </div>
  );
}
