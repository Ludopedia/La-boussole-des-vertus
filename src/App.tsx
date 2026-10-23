import React, { useState } from 'react';
import { useRealtimeSession } from './hooks/useRealtimeSession';
import { WelcomeJoinScreen } from './components/WelcomeJoinScreen';
import { StepSetup } from './components/StepSetup';
import { StepCodex } from './components/StepCodex';
import { StepSelfEval } from './components/StepSelfEval';
import { StepPeerMatrix } from './components/StepPeerMatrix';
import { StepDebriefing } from './components/StepDebriefing';
import { PrintKitModal } from './components/PrintKitModal';
import { WifiShareModal } from './components/WifiShareModal';
import { IdentitySelectorModal } from './components/IdentitySelectorModal';
import { Printer, Compass, RotateCcw, Wifi, User, LogOut } from 'lucide-react';

export default function App() {
  const {
    session,
    myParticipantId,
    myParticipant,
    joinSession,
    selectExistingParticipant,
    updateSession,
    updateMySelfScores,
    updateMyPeerReview,
    updateMyCommitment,
    resetSession,
    isConnected,
    onlineParticipants,
    connectedClientsCount,
    networkInfo,
  } = useRealtimeSession();

  // Local, independent navigation for THIS screen/client
  const [localStep, setLocalStep] = useState<number>(0);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);

  const handleStepChange = (step: number) => {
    setLocalStep(Math.max(0, Math.min(4, step)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navSteps = [
    { step: 0, label: 'Le Cercle' },
    { step: 1, label: 'Le Codex' },
    { step: 2, label: 'Mon Auto-Éval' },
    { step: 3, label: 'Notations 360°' },
    { step: 4, label: "L'Agora Débrief" },
  ];

  // If user hasn't chosen a name/participant yet, show the initial Join Screen
  if (!myParticipant) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-950">
        <header className="bg-[#FAF8F5]/95 border-b border-stone-200/90 py-4 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="text-lg font-cinzel font-bold text-stone-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-700" />
              <span>La Boussole des Vertus</span>
            </div>
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Wi-Fi ({connectedClientsCount} en ligne)</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <WelcomeJoinScreen
            participants={session.participants}
            onlineParticipants={onlineParticipants}
            connectedClientsCount={connectedClientsCount}
            onJoin={joinSession}
            onSelectExisting={selectExistingParticipant}
            onOpenWifiModal={() => setIsWifiModalOpen(true)}
          />
        </main>

        <WifiShareModal
          isOpen={isWifiModalOpen}
          onClose={() => setIsWifiModalOpen(false)}
          networkInfo={networkInfo}
          connectedClientsCount={connectedClientsCount}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-950">
      {/* Top Bar Contract (Strict 3-zone layout) */}
      <header className="no-print bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-stone-200/90 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 md:gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <a
            href="#cercle"
            onClick={(e) => {
              e.preventDefault();
              handleStepChange(0);
            }}
            className="text-lg font-cinzel font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors flex items-center gap-2"
          >
            <Compass className="w-5 h-5 text-amber-700 shrink-0" />
            <span>La Boussole des Vertus</span>
          </a>

          {/* Zone 2: 4-5 Clean Nav Links (Independent navigation for this user) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-stone-600">
            {navSteps.map((item) => {
              const isActive = localStep === item.step;
              return (
                <button
                  key={item.step}
                  onClick={() => handleStepChange(item.step)}
                  className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                    isActive
                      ? 'border-stone-900 text-stone-900 font-semibold'
                      : 'border-transparent text-stone-500'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Wi-Fi status, Identity & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wi-Fi presence indicator button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
              }`}
              title="Inviter des amis ou voir les connexions Wi-Fi"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Wi-Fi :</span>
              <span className="font-mono tabular-nums font-semibold">
                {connectedClientsCount}
              </span>
            </button>

            {/* Current user badge & switcher */}
            <button
              onClick={() => setIsIdentityModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-200"
              title="Changer d'utilisateur sur cet écran"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: myParticipant.avatarColor }}
              />
              <span className="max-w-[85px] truncate font-serif font-semibold">
                {myParticipant.name}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kit Imprimable</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-stone-100/80 border-t border-stone-200 overflow-x-auto text-[11px] gap-2">
          {navSteps.map((item) => (
            <button
              key={item.step}
              onClick={() => handleStepChange(item.step)}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium transition-colors ${
                localStep === item.step
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Reading & Interactive Canvas (Local to this user) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {localStep === 0 && (
          <StepSetup
            session={session}
            onUpdateSession={updateSession}
            onNextStep={() => handleStepChange(1)}
            onOpenWifiModal={() => setIsWifiModalOpen(true)}
            connectedClientsCount={connectedClientsCount}
          />
        )}

        {localStep === 1 && (
          <StepCodex
            onNextStep={() => handleStepChange(2)}
            onPrevStep={() => handleStepChange(0)}
          />
        )}

        {localStep === 2 && (
          <StepSelfEval
            session={session}
            myParticipant={myParticipant}
            onUpdateScore={updateMySelfScores}
            onNextStep={() => handleStepChange(3)}
            onPrevStep={() => handleStepChange(1)}
          />
        )}

        {localStep === 3 && (
          <StepPeerMatrix
            session={session}
            myParticipant={myParticipant}
            onUpdatePeerReview={updateMyPeerReview}
            onNextStep={() => handleStepChange(4)}
            onPrevStep={() => handleStepChange(2)}
            onOpenWifiModal={() => setIsWifiModalOpen(true)}
          />
        )}

        {localStep === 4 && (
          <StepDebriefing
            session={session}
            myParticipant={myParticipant}
            onUpdateCommitment={updateMyCommitment}
            onPrevStep={() => handleStepChange(3)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}
      </main>

      {/* Editorial Footer (No demo buttons) */}
      <footer className="no-print border-t border-stone-200 bg-stone-100/60 py-8 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-stone-800">
              La Boussole des Vertus
            </span>
            <span aria-hidden="true">·</span>
            <span>Atelier philosophique collaboratif en direct</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="hover:text-stone-800 transition-colors flex items-center gap-1 text-emerald-800 font-medium"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inviter sur le Wi-Fi</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir réinitialiser l'atelier pour un nouveau groupe ?")) {
                  resetSession();
                }
              }}
              className="hover:text-red-700 transition-colors flex items-center gap-1 text-stone-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nouvel atelier vierge</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Wi-Fi Share & QR Code Modal */}
      <WifiShareModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        networkInfo={networkInfo}
        connectedClientsCount={connectedClientsCount}
      />

      {/* Device Identity Selection Modal */}
      <IdentitySelectorModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        participants={session.participants}
        myParticipantId={myParticipantId}
        onSelectParticipant={selectExistingParticipant}
      />

      {/* Modal for Ready-to-Print Kit */}
      <PrintKitModal
        session={session}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
