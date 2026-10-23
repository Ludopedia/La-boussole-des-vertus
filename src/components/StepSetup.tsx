import React, { useState } from 'react';
import { WorkshopSession, Participant } from '../types/workshop';
import { INITIAL_DEMO_SESSION, DEFAULT_BLANK_SESSION } from '../data/virtuesData';
import { UserPlus, Trash2, ArrowRight, BookOpen, Heart, Users, Sparkles, Wifi } from 'lucide-react';

interface StepSetupProps {
  session: WorkshopSession;
  onUpdateSession: (session: WorkshopSession) => void;
  onNextStep: () => void;
  onOpenWifiModal?: () => void;
  connectedClientsCount?: number;
}

const AVATAR_PALETTE = ['#B45309', '#0F766E', '#B91C1C', '#4338CA', '#78350F', '#047857', '#9333EA'];

export const StepSetup: React.FC<StepSetupProps> = ({
  session,
  onUpdateSession,
  onNextStep,
  onOpenWifiModal,
  connectedClientsCount = 1,
}) => {
  const [newFriendName, setNewFriendName] = useState('');
  const [goldenRuleAccepted, setGoldenRuleAccepted] = useState(true);

  const handleAddParticipant = () => {
    if (!newFriendName.trim()) return;
    const colorIndex = session.participants.length % AVATAR_PALETTE.length;
    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      name: newFriendName.trim(),
      avatarColor: AVATAR_PALETTE[colorIndex],
      selfScores: {
        prudence: { q1: 4, q2: 4, q3: 3, q4: 4 },
        temperance: { q1: 3, q2: 3, q3: 3, q4: 3 },
        fortitude: { q1: 4, q2: 3, q3: 4, q4: 3 },
        justice: { q1: 4, q2: 4, q3: 4, q4: 4 },
      },
      peerReviews: {},
    };
    onUpdateSession({
      ...session,
      participants: [...session.participants, newParticipant],
    });
    setNewFriendName('');
  };

  const handleRemoveParticipant = (id: string) => {
    if (session.participants.length <= 2) {
      alert("L'atelier requiert au minimum 2 participants pour le regard croisé.");
      return;
    }
    const updated = session.participants.filter((p) => p.id !== id);
    onUpdateSession({
      ...session,
      participants: updated,
      activeParticipantId: updated[0].id,
    });
  };

  const handleUpdateName = (id: string, name: string) => {
    const updated = session.participants.map((p) => (p.id === id ? { ...p, name } : p));
    onUpdateSession({ ...session, participants: updated });
  };

  const handleLoadDemo = () => {
    onUpdateSession(JSON.parse(JSON.stringify(INITIAL_DEMO_SESSION)));
  };

  const handleResetBlank = () => {
    onUpdateSession(JSON.parse(JSON.stringify(DEFAULT_BLANK_SESSION)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">
          Exercice d'Introspection & de Concorde Amicale
        </span>
        <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-stone-900 tracking-tight text-balance">
          La Boussole des Vertus
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto font-lora text-base leading-relaxed">
          Un atelier philosophique inspiré de la tradition antique pour évaluer nos vertus,
          confronter notre regard à celui de nos amis dans un cadre 100% bienveillant, et grandir ensemble.
        </p>
      </div>

      {/* Règle d'Or (Golden Rule) */}
      <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-xl p-6 md:p-8 relative shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-amber-700" />
          <h2 className="font-cinzel text-base md:text-lg font-bold text-stone-900">
            Règle d'or avant de commencer (À lire à voix haute)
          </h2>
        </div>

        <blockquote className="font-lora italic text-stone-800 text-base md:text-lg leading-relaxed pl-4 border-l-2 border-amber-600 my-4">
          « Cet exercice n'est pas un tribunal, mais un miroir bienveillant. Personne n'est parfait.
          L'objectif n'est pas de pointer nos défauts pour nous rabaisser, mais de comprendre comment nous
          nous voyons nous-mêmes par rapport à la façon dont nos amis nous perçoivent, afin de grandir ensemble. »
        </blockquote>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs text-stone-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={goldenRuleAccepted}
              onChange={(e) => setGoldenRuleAccepted(e.target.checked)}
              className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 border-stone-300"
            />
            <span className="font-medium text-stone-800">
              Le groupe a pris connaissance de la règle d'or et s'engage à la bienveillance.
            </span>
          </label>

          <span className="text-stone-400 font-mono">Durée suggérée : 1h à 1h30</span>
        </div>
      </div>

      {/* Wi-Fi & Multi-device connection banner */}
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-amber-800 shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-stone-900 text-sm">
              Participer à plusieurs sur le même Wi-Fi
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Chaque ami peut ouvrir l'atelier sur son propre ordinateur ou téléphone. Vos réponses et notations sont synchronisées en direct.
            </p>
          </div>
        </div>

        {onOpenWifiModal && (
          <button
            onClick={onOpenWifiModal}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shrink-0 shadow-xs"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Afficher le QR code & Lien Wi-Fi</span>
          </button>
        )}
      </div>

      {/* Configuration du Cercle de Participants */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-stone-700" />
              Le Cercle des Participants ({session.participants.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Inscrivez les personnes présentes à l'atelier (2 à 8 amis).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemo}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Charger un exemple complet de débriefing"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Exemple pré-rempli
            </button>
            <button
              onClick={handleResetBlank}
              className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* List of current participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {session.participants.map((participant, idx) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 rounded-lg border border-stone-200/80 bg-stone-50/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: participant.avatarColor }}
                >
                  {participant.name.charAt(0).toUpperCase() || (idx + 1)}
                </span>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => handleUpdateName(participant.id, e.target.value)}
                  placeholder="Nom de l'ami"
                  className="text-sm font-medium text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-800 focus:outline-hidden px-1 py-0.5 w-full truncate"
                />
              </div>

              {session.participants.length > 2 && (
                <button
                  onClick={() => handleRemoveParticipant(participant.id)}
                  className="text-stone-400 hover:text-red-700 p-1 transition-colors"
                  title="Retirer ce participant"
                  aria-label={`Retirer ${participant.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new friend input */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
            placeholder="Ajouter un ami (ex: Émilie, David...)"
            className="flex-1 px-4 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-800 text-stone-900 placeholder:text-stone-400"
          />
          <button
            onClick={handleAddParticipant}
            disabled={!newFriendName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter au cercle
          </button>
        </div>
      </div>

      {/* Flow overview & Next step */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <div className="text-xs text-stone-500 font-sans">
          Prochaine étape : Lecture commune du texte de référence et des 4 vertus cardinales.
        </div>

        <button
          onClick={onNextStep}
          disabled={!goldenRuleAccepted || session.participants.length < 2}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium text-sm rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          <span>Ouvrir le Codex des Vertus (Étape 1)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
