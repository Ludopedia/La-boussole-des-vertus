import React from 'react';
import { Participant } from '../types/workshop';
import { UserCheck, Laptop } from 'lucide-react';

interface IdentitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  myParticipantId: string;
  onSelectParticipant: (id: string) => void;
}

export const IdentitySelectorModal: React.FC<IdentitySelectorModalProps> = ({
  isOpen,
  onClose,
  participants,
  myParticipantId,
  onSelectParticipant,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto">
          <Laptop className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Connexion au cercle
          </span>
          <h3 className="text-xl font-cinzel font-bold text-stone-900">
            Qui êtes-vous sur cet écran ?
          </h3>
          <p className="text-xs text-stone-600 font-lora">
            Choisissez votre profil pour que vos réponses et évaluations vous soient attribuées en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {participants.map((p) => {
            const isSelected = p.id === myParticipantId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectParticipant(p.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-800 border-stone-200 hover:bg-white hover:border-stone-400'
                }`}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-serif font-semibold text-sm truncate flex-1">
                  {p.name}
                </span>
                {isSelected && <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-stone-200">
          <button
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-800 font-medium"
          >
            Continuer comme observateur / Hôte de séance
          </button>
        </div>
      </div>
    </div>
  );
};
