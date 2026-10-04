import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVault: () => void;
  onJoinPilot: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenVault,
  onJoinPilot,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'passport', label: 'Rental Passport' },
    { id: 'caretaker', label: 'Caretaker Ops' },
    { id: 'reconciler', label: 'Split Reconciler' },
    { id: 'disputes', label: 'Neutral Disputes' },
    { id: 'pilot', label: 'Pilot 01 Nairobi' },
    { id: 'constitution', label: 'Constitution' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#12201A] text-[#F3EEDF] border-b border-[#34483E]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#top" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('passport');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#F3EEDF] hover:text-[#E0C080] transition-colors"
        >
          Rental<span className="italic text-[#E0C080] font-normal">Mind</span> AI
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#C5CBC0]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#E0C080] font-semibold'
                    : 'text-[#C5CBC0] hover:text-[#F3EEDF]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0C080]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('caretaker')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
              activeTab === 'caretaker'
                ? 'bg-[#E0C080] text-[#1C1B16] border-[#E0C080]'
                : 'text-[#E0C080] border-[#7C5A2A] hover:bg-[#1B2D25]'
            }`}
            title="Caretaker & Maintenance Operations Console"
          >
            <span>🔧 Staff Portal</span>
          </button>

          <button
            onClick={onOpenVault}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C5CBC0] hover:text-[#F3EEDF] border border-[#34483E] hover:border-[#7C5A2A] rounded transition-colors whitespace-nowrap"
            title="Generate time-bound scoped disclosure pass for lenders"
          >
            <span>Selective Share</span>
          </button>

          <button
            onClick={onJoinPilot}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#1C1B16] bg-[#E0C080] hover:bg-[#ECD39B] rounded transition-colors whitespace-nowrap shadow-sm"
          >
            Join Pilot 01
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#C5CBC0] hover:text-[#F3EEDF]"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1B2D25] border-b border-[#34483E] px-4 py-3 space-y-2 text-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-2 rounded ${
                activeTab === link.id
                  ? 'bg-[#12201A] text-[#E0C080] font-semibold'
                  : 'text-[#C5CBC0] hover:bg-[#12201A] hover:text-[#F3EEDF]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#34483E]">
            <button
              onClick={() => {
                onOpenVault();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-2 text-[#E0C080] text-xs font-medium"
            >
              Selective Share / Vault Pass
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
