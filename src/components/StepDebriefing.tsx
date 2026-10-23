import React, { useState } from 'react';
import { WorkshopSession, Participant, VirtueKey, SelfAnswers } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';
import { RadarCompassChart } from './RadarCompassChart';
import { SpeechTimer } from './SpeechTimer';
import { JohariAnalysis } from './JohariAnalysis';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Scroll,
  MessageSquareQuote,
  CheckCircle,
  Download,
  Award,
  Users,
} from 'lucide-react';

interface StepDebriefingProps {
  session: WorkshopSession;
  myParticipant?: Participant;
  onUpdateCommitment: (virtue: VirtueKey, action: string) => void;
  onPrevStep: () => void;
  onOpenPrintModal: () => void;
}

export const StepDebriefing: React.FC<StepDebriefingProps> = ({
  session,
  myParticipant,
  onUpdateCommitment,
  onPrevStep,
  onOpenPrintModal,
}) => {
  // Local independent focus: which participant this screen is currently looking at
  const [activeFocusId, setActiveFocusId] = useState<string>(
    myParticipant?.id || session.participants[0]?.id || ''
  );
  const [revealedStates, setRevealedStates] = useState<Record<string, boolean>>({});
  const [commitmentVirtue, setCommitmentVirtue] = useState<VirtueKey>('temperance');
  const [commitmentText, setCommitmentText] = useState<string>('');

  const focusedParticipant =
    session.participants.find((p) => p.id === activeFocusId) ||
    myParticipant ||
    session.participants[0];

  const isRevealed = focusedParticipant ? (revealedStates[focusedParticipant.id] ?? true) : true;

  const handleToggleReveal = (id: string) => {
    setRevealedStates((prev) => ({
      ...prev,
      [id]: !isRevealed,
    }));
  };

  // Helper to compute self total for a virtue
  const getSelfTotal = (scores?: SelfAnswers) => {
    if (!scores) return 12;
    return (scores.q1 || 0) + (scores.q2 || 0) + (scores.q3 || 0) + (scores.q4 || 0);
  };

  const selfTotals: Record<VirtueKey, number> = {
    prudence: getSelfTotal(focusedParticipant?.selfScores?.prudence),
    temperance: getSelfTotal(focusedParticipant?.selfScores?.temperance),
    fortitude: getSelfTotal(focusedParticipant?.selfScores?.fortitude),
    justice: getSelfTotal(focusedParticipant?.selfScores?.justice),
  };

  // Compute peer averages for this focused participant from all other participants
  const peerReviewsForThisUser = focusedParticipant
    ? session.participants
        .filter((p) => p.id !== focusedParticipant.id)
        .map((evaluator) => ({
          evaluator,
          review: evaluator.peerReviews?.[focusedParticipant.id],
        }))
        .filter((item) => Boolean(item.review))
    : [];

  const peerAverages: Record<VirtueKey, number> = {
    prudence: 0,
    temperance: 0,
    fortitude: 0,
    justice: 0,
  };

  const virtueKeys: VirtueKey[] = ['prudence', 'temperance', 'fortitude', 'justice'];

  if (peerReviewsForThisUser.length > 0) {
    virtueKeys.forEach((key) => {
      const sum = peerReviewsForThisUser.reduce(
        (acc, curr) => acc + (curr.review.scores?.[key] || 0),
        0
      );
      peerAverages[key] = Math.round(sum / peerReviewsForThisUser.length);
    });
  } else {
    // Fallback if no reviews yet
    virtueKeys.forEach((key) => {
      peerAverages[key] = selfTotals[key];
    });
  }

  const isMyProfile = myParticipant && focusedParticipant?.id === myParticipant.id;

  const handleSaveCommitment = () => {
    onUpdateCommitment(
      commitmentVirtue,
      commitmentText.trim() || 'Cultiver la présence d’esprit et l’équilibre au quotidien.'
    );
  };

  if (!focusedParticipant) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 space-y-4">
        <Users className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="font-cinzel text-xl font-bold text-stone-900">
          Aucun participant dans la session
        </h3>
        <p className="text-xs text-stone-600 font-lora">
          Inscrivez au moins un participant pour afficher l'agora du débriefing.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <span>Étape 4 sur 4</span>
          <span aria-hidden="true">·</span>
          <span>Le Moment Fort de l'Atelier</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-stone-900 tracking-tight">
          L'Agora du Débriefing
        </h2>
        <p className="text-stone-600 font-lora text-base max-w-2xl mx-auto leading-relaxed">
          Un tour de table, ami par ami. Révélez les scores,
          analysez les convergences et angles morts, et formulez votre engagement moral pour les mois à venir.
        </p>
      </div>

      {/* Participant Focus Switcher */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Ami examiné sur cet écran :
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {session.participants.map((p) => {
            const isSelected = p.id === focusedParticipant.id;
            const hasCommitment = Boolean(p.commitment);
            const isMe = myParticipant && p.id === myParticipant.id;

            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveFocusId(p.id);
                  if (p.commitment) {
                    setCommitmentVirtue(p.commitment.virtue);
                    setCommitmentText(p.commitment.action);
                  } else {
                    setCommitmentText('');
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.avatarColor }}
                />
                <span className="font-serif">
                  {p.name} {isMe ? '(Moi)' : ''}
                </span>
                {hasCommitment && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus Stage for Current Person */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 md:p-8 space-y-8 shadow-xs">
        {/* Person marquee bar & Reveal toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xs"
              style={{ backgroundColor: focusedParticipant.avatarColor }}
            >
              {focusedParticipant.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider font-mono text-stone-500">
                La Boussole de
              </span>
              <h3 className="text-2xl font-cinzel font-bold text-stone-900">
                {focusedParticipant.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleReveal(focusedParticipant.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                isRevealed
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-stone-900 text-white border-stone-900'
              }`}
            >
              {isRevealed ? (
                <>
                  <EyeOff className="w-4 h-4" /> Masquer les scores des amis
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Révéler le regard des amis (360°)
                </>
              )}
            </button>
          </div>
        </div>

        {/* The Radar Compass Chart & Comparative Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Compass SVG (col 1-6) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
            <RadarCompassChart
              selfScores={selfTotals}
              peerScores={isRevealed && peerReviewsForThisUser.length > 0 ? peerAverages : undefined}
              size={320}
              participantName={focusedParticipant.name}
            />
          </div>

          {/* Detailed Scores Matrix (col 7-12) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-serif font-semibold text-stone-900">
                Comparatif des Scores sur 20
              </h4>
              <span className="text-xs text-stone-400 font-mono">Échelle 0-20</span>
            </div>

            <div className="space-y-3">
              {virtueKeys.map((key) => {
                const v = VIRTUES_DATA[key];
                const selfVal = selfTotals[key];
                const peerVal = peerAverages[key];
                const hasPeerReviews = peerReviewsForThisUser.length > 0;
                const diff = selfVal - peerVal;

                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: v.color.primary }}
                        />
                        <span className="font-serif font-semibold text-stone-900 text-sm">
                          {v.frenchTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                        <div>
                          <span className="text-stone-400 mr-1">Auto:</span>
                          <span className="font-bold text-amber-800">{selfVal}/20</span>
                        </div>
                        {isRevealed && hasPeerReviews && (
                          <>
                            <div>
                              <span className="text-stone-400 mr-1">Amis:</span>
                              <span className="font-bold text-indigo-800">{peerVal}/20</span>
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                                diff > 0
                                  ? 'bg-amber-100 text-amber-900'
                                  : diff < 0
                                  ? 'bg-indigo-100 text-indigo-900'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {diff > 0 ? `+${diff}` : diff}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Comparative Dual Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-700 rounded-full transition-all duration-300"
                          style={{ width: `${(selfVal / 20) * 100}%` }}
                        />
                      </div>
                      {isRevealed && hasPeerReviews && (
                        <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${(peerVal / 20) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Speech Timer for this round */}
        <SpeechTimer participantName={focusedParticipant.name} />

        {/* Johari / Gap Analysis (when peer reviews exist) */}
        {isRevealed && peerReviewsForThisUser.length > 0 && (
          <JohariAnalysis
            selfScores={selfTotals}
            peerScores={peerAverages}
            participantName={focusedParticipant.name}
          />
        )}

        {/* Anecdotes from Friends */}
        {isRevealed && peerReviewsForThisUser.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-amber-700" />
              <h4 className="text-base font-serif font-semibold text-stone-900">
                Témoignages & Souvenirs Reçus par {focusedParticipant.name}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peerReviewsForThisUser.map(({ evaluator, review }) => {
                if (!review.anecdote?.trim()) return null;
                return (
                  <div
                    key={evaluator.id}
                    className="p-4 rounded-xl border border-stone-200/80 bg-[#FAF8F5] relative space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs font-serif font-semibold text-stone-800">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: evaluator.avatarColor }}
                      />
                      <span>Témoignage de {evaluator.name}</span>
                    </div>
                    <p className="font-lora text-stone-700 italic text-sm leading-relaxed">
                      « {review.anecdote} »
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Conclusion Personnelle & Engagement Moral */}
        <div className="pt-6 border-t border-stone-200 space-y-6 bg-stone-50/60 -mx-6 -mb-8 p-6 md:p-8 rounded-b-xl">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-stone-800" />
            <div>
              <h4 className="text-base font-serif font-semibold text-stone-900">
                Conclusion Personnelle de {focusedParticipant.name}
              </h4>
              <p className="text-xs text-stone-500 font-sans">
                « Suite à vos retours, la vertu que j'ai le plus envie de travailler dans les prochains mois est... »
              </p>
            </div>
          </div>

          {/* If looking at my own profile: can edit and scell */}
          {isMyProfile ? (
            <div className="space-y-4">
              {/* Virtue Choice */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {virtueKeys.map((key) => {
                  const v = VIRTUES_DATA[key];
                  const isSelected = commitmentVirtue === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCommitmentVirtue(key)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono opacity-80">{v.latinName}</div>
                      <div className="font-serif font-semibold text-xs mt-0.5">{v.frenchTitle}</div>
                    </button>
                  );
                })}
              </div>

              {/* Action Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                  Mon intention d'entraînement pratique :
                </label>
                <textarea
                  rows={3}
                  value={commitmentText}
                  onChange={(e) => setCommitmentText(e.target.value)}
                  placeholder="Exemple : Dans les situations de tension, marquer une pause de trois respirations avant de répondre ; et écouter sans interrompre."
                  className="w-full p-3.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-800 text-stone-900 font-lora placeholder:text-stone-400"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500 italic">
                  {focusedParticipant.commitment
                    ? 'Votre engagement est enregistré et visible par le groupe.'
                    : 'Validez votre engagement pour le partager avec vos amis.'}
                </span>

                <button
                  onClick={handleSaveCommitment}
                  className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white font-medium text-xs rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Sceller mon engagement</span>
                </button>
              </div>
            </div>
          ) : (
            /* If looking at friend's profile: read-only display */
            <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-2">
              <div className="text-xs text-stone-600">
                Vertu choisie :{' '}
                <strong className="text-stone-900 font-serif">
                  {focusedParticipant.commitment?.virtue
                    ? VIRTUES_DATA[focusedParticipant.commitment.virtue].frenchTitle
                    : 'En cours de réflexion...'}
                </strong>
              </div>
              <p className="font-lora italic text-stone-800 text-sm">
                « {focusedParticipant.commitment?.action || 'Engagement en cours de formulation.'} »
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Workshop Final Summary Ribbon & Print Kit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la notation croisée</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 px-5 py-2.5 border border-stone-300 bg-white text-stone-800 font-medium text-xs rounded-lg hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Imprimer / Exporter le Kit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
