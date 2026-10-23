import React, { useState } from 'react';
import { WorkshopSession, VirtueKey, SelfAnswers } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';
import { ArrowRight, ArrowLeft, Check, HelpCircle } from 'lucide-react';

interface StepSelfEvalProps {
  session: WorkshopSession;
  myParticipantId?: string;
  onUpdateSession: (session: WorkshopSession) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const SCALE_LABELS = [
  { value: 1, label: 'Très rarement', sub: 'Pas du tout moi' },
  { value: 2, label: 'Rarement', sub: 'Peu fréquent' },
  { value: 3, label: 'Parfois', sub: 'Modérément' },
  { value: 4, label: 'Souvent', sub: 'Régulier' },
  { value: 5, label: 'Très souvent', sub: 'Tout à fait moi' },
];

export const StepSelfEval: React.FC<StepSelfEvalProps> = ({
  session,
  myParticipantId,
  onUpdateSession,
  onNextStep,
  onPrevStep,
}) => {
  const [activeTabVirtue, setActiveTabVirtue] = useState<VirtueKey>('prudence');

  // Default to myParticipantId if recognized, otherwise activeParticipantId or first participant
  const targetId =
    myParticipantId && session.participants.some((p) => p.id === myParticipantId)
      ? (session.activeParticipantId === myParticipantId ? myParticipantId : session.activeParticipantId || myParticipantId)
      : session.activeParticipantId || session.participants[0].id;

  const currentParticipant =
    session.participants.find((p) => p.id === targetId) || session.participants[0];

  const handleSelectParticipant = (id: string) => {
    onUpdateSession({ ...session, activeParticipantId: id });
  };

  const handleScoreChange = (virtueKey: VirtueKey, questionKey: 'q1' | 'q2' | 'q3' | 'q4', value: number) => {
    const updatedParticipants = session.participants.map((p) => {
      if (p.id !== currentParticipant.id) return p;
      const currentVirtueScores = p.selfScores[virtueKey] || { q1: 3, q2: 3, q3: 3, q4: 3 };
      return {
        ...p,
        selfScores: {
          ...p.selfScores,
          [virtueKey]: {
            ...currentVirtueScores,
            [questionKey]: value,
          },
        },
      };
    });

    onUpdateSession({
      ...session,
      participants: updatedParticipants,
    });
  };

  // Calculate totals
  const getVirtueTotal = (scores?: SelfAnswers) => {
    if (!scores) return 0;
    return (scores.q1 || 0) + (scores.q2 || 0) + (scores.q3 || 0) + (scores.q4 || 0);
  };

  const virtueTotals: Record<VirtueKey, number> = {
    prudence: getVirtueTotal(currentParticipant.selfScores.prudence),
    temperance: getVirtueTotal(currentParticipant.selfScores.temperance),
    fortitude: getVirtueTotal(currentParticipant.selfScores.fortitude),
    justice: getVirtueTotal(currentParticipant.selfScores.justice),
  };

  const currentVirtueDef = VIRTUES_DATA[activeTabVirtue];
  const currentAnswers = currentParticipant.selfScores[activeTabVirtue] || { q1: 3, q2: 3, q3: 3, q4: 3 };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <span>Étape 2 sur 4</span>
          <span aria-hidden="true">·</span>
          <span>Introspection Personnelle</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-stone-900 tracking-tight">
          Le Questionnaire d'Auto-Évaluation
        </h2>
        <p className="text-stone-600 font-lora text-base max-w-2xl mx-auto leading-relaxed">
          Pour chaque affirmation, notez-vous avec franchise de 1 à 5.
          Vos scores sur 20 sont calculés automatiquement. Gardez-les secrets pour l'instant !
        </p>
      </div>

      {/* Participant Selector (if multiple) */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Participant en cours d'évaluation :
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {session.participants.map((p) => {
            const isSelected = p.id === currentParticipant.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectParticipant(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.avatarColor }}
                />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Score Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['prudence', 'temperance', 'fortitude', 'justice'] as VirtueKey[]).map((vKey) => {
          const v = VIRTUES_DATA[vKey];
          const total = virtueTotals[vKey];
          const isCurrentTab = vKey === activeTabVirtue;

          return (
            <button
              key={vKey}
              onClick={() => setActiveTabVirtue(vKey)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isCurrentTab
                  ? 'bg-white border-stone-900 shadow-sm ring-1 ring-stone-900'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-mono uppercase">{v.latinName}</span>
                <span className="font-mono text-stone-900 font-bold tabular-nums">
                  {total}/20
                </span>
              </div>
              <div className="font-serif font-semibold text-stone-900 text-sm">
                {v.frenchTitle}
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(total / 20) * 100}%`,
                    backgroundColor: v.color.primary,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Question Card for Selected Virtue */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 md:p-8 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-mono text-stone-500 uppercase">
              Section active · {currentVirtueDef.latinName}
            </span>
            <h3 className="text-2xl font-cinzel font-bold text-stone-900">
              {currentVirtueDef.frenchTitle}
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              {currentVirtueDef.subTitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400 block font-mono">Score de la section</span>
            <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
              {virtueTotals[activeTabVirtue]} <span className="text-sm font-normal text-stone-400">/ 20</span>
            </span>
          </div>
        </div>

        {/* The 4 questions */}
        <div className="space-y-8">
          {currentVirtueDef.questions.map((q, idx) => {
            const qKey = `q${idx + 1}` as 'q1' | 'q2' | 'q3' | 'q4';
            const currentValue = currentAnswers[qKey] || 3;

            return (
              <div key={q.id} className="space-y-3 pb-6 border-b border-stone-100 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-serif text-stone-900 leading-snug">
                      {q.text}
                    </p>
                    {q.subtext && (
                      <span className="text-xs text-stone-500 font-sans mt-0.5 block">
                        {q.subtext}
                      </span>
                    )}
                  </div>
                </div>

                {/* 1 to 5 scale selector buttons */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1 pl-0 sm:pl-8">
                  {SCALE_LABELS.map((item) => {
                    const isSelected = currentValue === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleScoreChange(activeTabVirtue, qKey, item.value)}
                        className={`py-2 px-1 sm:px-2 rounded-lg text-center transition-all border ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        <div className="text-sm sm:text-base font-mono font-bold tabular-nums">
                          {item.value}
                        </div>
                        <div className="text-[10px] hidden sm:block truncate mt-0.5 opacity-90">
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab switch navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div className="text-xs text-stone-500">
            Évaluez les 4 vertus pour compléter le profil de {currentParticipant.name}.
          </div>
          <div className="flex items-center gap-2">
            {(['prudence', 'temperance', 'fortitude', 'justice'] as VirtueKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setActiveTabVirtue(k)}
                className={`w-7 h-7 rounded-full text-xs font-serif font-bold transition-colors ${
                  activeTabVirtue === k
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                title={VIRTUES_DATA[k].frenchTitle}
              >
                {VIRTUES_DATA[k].frenchTitle.charAt(3).toUpperCase() || k.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Le Codex</span>
        </button>

        <button
          onClick={onNextStep}
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
        >
          <span>Passer au Regard des Amis (Étape 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
