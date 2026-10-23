import React, { useState } from 'react';
import { WorkshopSession, Participant, VirtueKey } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';
import { ArrowRight, ArrowLeft, Users, MessageSquareQuote, Check, Wifi } from 'lucide-react';

interface StepPeerMatrixProps {
  session: WorkshopSession;
  myParticipant?: Participant;
  onUpdatePeerReview: (targetParticipantId: string, scores: Record<VirtueKey, number>, anecdote?: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onOpenWifiModal?: () => void;
}

export const StepPeerMatrix: React.FC<StepPeerMatrixProps> = ({
  session,
  myParticipant,
  onUpdatePeerReview,
  onNextStep,
  onPrevStep,
  onOpenWifiModal,
}) => {
  const currentParticipant = myParticipant || session.participants[0];
  const peersToEvaluate = session.participants.filter((p) => p.id !== currentParticipant?.id);

  const [activeTargetId, setActiveTargetId] = useState<string>(peersToEvaluate[0]?.id || '');

  // Keep target valid if list changes
  const targetParticipant =
    session.participants.find((p) => p.id === activeTargetId) || peersToEvaluate[0];

  const virtueKeys: VirtueKey[] = ['prudence', 'temperance', 'fortitude', 'justice'];

  const currentReview =
    (targetParticipant && currentParticipant?.peerReviews?.[targetParticipant.id]) || {
      scores: { prudence: 14, temperance: 14, fortitude: 14, justice: 14 },
      anecdote: '',
    };

  const handleScoreChange = (virtueKey: VirtueKey, score: number) => {
    if (!targetParticipant) return;
    const currentScores = currentReview.scores || {
      prudence: 14,
      temperance: 14,
      fortitude: 14,
      justice: 14,
    };
    const updatedScores = {
      ...currentScores,
      [virtueKey]: Math.max(0, Math.min(20, score)),
    };
    onUpdatePeerReview(targetParticipant.id, updatedScores, currentReview.anecdote);
  };

  const handleAnecdoteChange = (anecdote: string) => {
    if (!targetParticipant) return;
    onUpdatePeerReview(targetParticipant.id, currentReview.scores, anecdote);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <span>Étape 3 sur 4</span>
          <span aria-hidden="true">·</span>
          <span>Le Regard des Amis (360°)</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-stone-900 tracking-tight">
          La Notation Croisée
        </h2>
        <p className="text-stone-600 font-lora text-base max-w-2xl mx-auto leading-relaxed">
          Sur votre écran, attribuez une note globale sur 20 à chacun de vos amis pour chaque vertu.
          Ajoutez une anecdote concrète pour justifier votre regard bienveillant.
        </p>
      </div>

      {/* Evaluator identity reminder */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: currentParticipant?.avatarColor || '#B45309' }}
          >
            {currentParticipant?.name.charAt(0).toUpperCase() || 'M'}
          </span>
          <div className="text-xs">
            <span className="text-stone-500">Vous évaluez en tant que : </span>
            <strong className="text-stone-900 font-serif">{currentParticipant?.name || 'Moi'}</strong>
          </div>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          {Object.keys(currentParticipant?.peerReviews || {}).length} sur {peersToEvaluate.length} ami(s) noté(s)
        </div>
      </div>

      {/* When waiting for peers */}
      {peersToEvaluate.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-cinzel font-bold text-stone-900 text-lg">
              En attente d'autres participants
            </h3>
            <p className="text-xs text-stone-600 font-lora max-w-md mx-auto">
              Vous êtes actuellement seul dans la session. Vos amis doivent rejoindre l'atelier depuis leur ordinateur ou téléphone pour que vous puissiez les évaluer.
            </p>
          </div>
          {onOpenWifiModal && (
            <button
              onClick={onOpenWifiModal}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Afficher le QR Code Wi-Fi pour les inviter</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Target Friends Tab */}
          <div className="space-y-4">
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
              Sélectionnez un ami à évaluer :
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {peersToEvaluate.map((peer) => {
                const isCurrent = peer.id === targetParticipant?.id;
                const hasReview = Boolean(currentParticipant?.peerReviews?.[peer.id]);

                return (
                  <button
                    key={peer.id}
                    onClick={() => setActiveTargetId(peer.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-white border-stone-900 shadow-xs ring-1 ring-stone-900'
                        : 'bg-stone-50/70 border-stone-200 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: peer.avatarColor }}
                        />
                        <span className="font-serif font-semibold text-sm truncate">
                          {peer.name}
                        </span>
                      </div>
                      {hasReview && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evaluation Form for Active Friend */}
          {targetParticipant && (
            <div className="bg-white border border-stone-200/90 rounded-xl p-6 md:p-8 space-y-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-mono">
                    Votre regard bienveillant pour
                  </span>
                  <h3 className="text-2xl font-cinzel font-bold text-stone-900 flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block"
                      style={{ backgroundColor: targetParticipant.avatarColor }}
                    />
                    {targetParticipant.name}
                  </h3>
                </div>
                <span className="text-xs text-stone-500 italic font-lora">
                  Notez de 0 à 20 selon votre sentiment d'ami(e).
                </span>
              </div>

              {/* 4 Virtues Sliders */}
              <div className="space-y-6">
                {virtueKeys.map((key) => {
                  const v = VIRTUES_DATA[key];
                  const score =
                    currentReview.scores?.[key] !== undefined ? currentReview.scores[key] : 14;

                  return (
                    <div key={key} className="space-y-2 p-4 rounded-lg bg-stone-50/60 border border-stone-200/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-serif font-semibold text-stone-900 text-sm">
                            {v.frenchTitle}
                          </span>
                          <span className="text-xs text-stone-500 ml-2 font-sans hidden sm:inline">
                            ({v.subTitle})
                          </span>
                        </div>
                        <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                          {score} <span className="text-xs font-normal text-stone-400">/ 20</span>
                        </div>
                      </div>

                      {/* Range Slider */}
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-[11px] font-mono text-stone-400">0</span>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={score}
                          onChange={(e) => handleScoreChange(key, parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                        />
                        <span className="text-[11px] font-mono text-stone-400">20</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Anecdote input */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
                  <MessageSquareQuote className="w-4 h-4 text-amber-700" />
                  <span>Une anecdote ou un souvenir marquant pour {targetParticipant.name} :</span>
                </label>
                <textarea
                  rows={3}
                  value={currentReview.anecdote || ''}
                  onChange={(e) => handleAnecdoteChange(e.target.value)}
                  placeholder={`« Je t'ai mis cette note en Force parce que la façon dont tu as agi l'an dernier... »`}
                  className="w-full p-3 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-800 text-stone-900 placeholder:text-stone-400 font-lora"
                />
              </div>
            </div>
          )}

          {/* Group Overview Table */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              Synthèse en Direct du Groupe
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-mono uppercase">
                    <th className="py-2 pr-4 font-normal">Vertu</th>
                    {session.participants.map((p) => (
                      <th key={p.id} className="py-2 px-3 text-center font-normal">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {virtueKeys.map((key) => {
                    const v = VIRTUES_DATA[key];
                    return (
                      <tr key={key} className="hover:bg-stone-50/50">
                        <td className="py-2.5 pr-4 font-serif font-medium text-stone-900">
                          {v.frenchTitle}
                        </td>
                        {session.participants.map((p) => {
                          let total = 0;
                          let count = 0;
                          session.participants.forEach((evaluator) => {
                            if (evaluator.id !== p.id && evaluator.peerReviews?.[p.id]) {
                              total += evaluator.peerReviews[p.id].scores?.[key] || 0;
                              count++;
                            }
                          });
                          const avg = count > 0 ? Math.round(total / count) : '-';

                          return (
                            <td key={p.id} className="py-2.5 px-3 text-center tabular-nums text-stone-700">
                              {avg !== '-' ? `${avg}/20` : 'En cours'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Step Navigation (Independent) */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mon Auto-évaluation</span>
        </button>

        <button
          onClick={onNextStep}
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
        >
          <span>Ouvrir l'Agora du Débriefing (Étape 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
