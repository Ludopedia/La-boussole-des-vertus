import React, { useState } from 'react';
import { WorkshopSession, VirtueKey } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';
import { Printer, X, FileText, Check } from 'lucide-react';

interface PrintKitModalProps {
  session: WorkshopSession;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintKitModal: React.FC<PrintKitModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const [printMode, setPrintMode] = useState<'blank' | 'completed'>('completed');

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  const virtueKeys: VirtueKey[] = ['prudence', 'temperance', 'fortitude', 'justice'];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="no-print p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5] rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-mono">
              <FileText className="w-4 h-4 text-stone-700" />
              <span>Édition Papier & Archivage</span>
            </div>
            <h3 className="text-xl font-cinzel font-bold text-stone-900">
              Kit de l'Atelier « La Boussole des Vertus »
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode switch */}
            <div className="flex items-center gap-1 p-1 bg-stone-200 rounded-lg text-xs font-medium">
              <button
                onClick={() => setPrintMode('completed')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  printMode === 'completed'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Rapport Rempli
              </button>
              <button
                onClick={() => setPrintMode('blank')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  printMode === 'blank'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Fiches Vierges (À Imprimer)
              </button>
            </div>

            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              title="Fermer"
              aria-label="Fermer la fenêtre d'impression"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-10 overflow-y-auto space-y-8 font-lora text-stone-900 bg-white leading-relaxed text-sm">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-stone-900 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Atelier d'Introspection & de Concorde Amicale
            </span>
            <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-stone-900">
              La Boussole des Vertus
            </h1>
            <p className="text-xs text-stone-600 italic">
              {printMode === 'completed'
                ? `Session du ${session.date} · Participants : ${session.participants.map((p) => p.name).join(', ')}`
                : 'Fiche d’atelier prête à l’emploi · Durée : 1h à 1h30'}
            </p>
          </div>

          {/* Golden Rule */}
          <div className="p-4 border border-stone-300 rounded bg-stone-50/50 space-y-2">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-900">
              Règle d'or avant de commencer (À lire à voix haute)
            </h4>
            <p className="italic text-stone-800 text-xs">
              « Cet exercice n'est pas un tribunal, mais un miroir bienveillant. Personne n'est parfait.
              L'objectif n'est pas de pointer nos défauts pour nous rabaisser, mais de comprendre comment nous
              nous voyons nous-mêmes par rapport à la façon dont nos amis nous perçoivent, afin de grandir ensemble. »
            </p>
          </div>

          {/* Foundational Pillars */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              Étape 1 : Le Texte de Référence
            </h3>
            <p className="text-xs text-stone-700">
              Le mot « cardinal » vient du latin <em>cardo</em> (charnière, pivot).
              Dans la tradition philosophique (Platon, Aristote, les Stoïciens), ces quatre vertus sont des
              habitudes quotidiennes, un « muscle » de l'esprit que l'on entraîne.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {virtueKeys.map((key) => {
                const v = VIRTUES_DATA[key];
                return (
                  <div key={key} className="p-3 border border-stone-200 rounded space-y-1">
                    <strong className="font-serif block text-sm text-stone-900">
                      {v.frenchTitle} ({v.latinName})
                    </strong>
                    <p className="text-stone-700">{v.essence}</p>
                    <p className="text-stone-500 italic text-[11px]">{v.falseFriends}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questionnaire Grid */}
          <div className="space-y-6 page-break-after">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              Étape 2 : Le Questionnaire d'Évaluation (Notation 1 à 5)
            </h3>
            <p className="text-xs text-stone-600">
              Échelle : 1 (Très rarement / Pas du tout moi) · 2 (Rarement) · 3 (Parfois / Modérément) · 4 (Souvent) · 5 (Très souvent / Tout à fait moi)
            </p>

            <div className="space-y-4">
              {virtueKeys.map((key) => {
                const v = VIRTUES_DATA[key];
                return (
                  <div key={key} className="border border-stone-200 rounded p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-1">
                      <strong className="font-serif text-sm text-stone-900">
                        {v.frenchTitle} — {v.subTitle}
                      </strong>
                      <span className="font-mono text-xs font-semibold">Score : ___ / 20</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {v.questions.map((q, qIdx) => (
                        <div key={q.id} className="flex items-start justify-between gap-4 py-1">
                          <span className="text-stone-800">
                            <strong>Q{qIdx + 1}.</strong> {q.text}
                          </span>
                          <span className="font-mono text-stone-400 shrink-0 font-bold">
                            [ &nbsp; / 5 ]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Peer matrix */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              Étape 3 : Le Regard des Amis (Tableau de notation croisée sur 20)
            </h3>
            <table className="w-full text-xs text-left border border-stone-300">
              <thead className="bg-stone-100 font-mono uppercase">
                <tr className="border-b border-stone-300">
                  <th className="p-2 border-r border-stone-300">Vertu (Note sur 20)</th>
                  <th className="p-2 border-r border-stone-300 text-center">Moi-même</th>
                  {session.participants.map((p) => (
                    <th key={p.id} className="p-2 border-r border-stone-300 text-center">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                {virtueKeys.map((key) => {
                  const v = VIRTUES_DATA[key];
                  return (
                    <tr key={key}>
                      <td className="p-2 border-r border-stone-300 font-serif font-semibold">
                        {v.frenchTitle}
                      </td>
                      <td className="p-2 border-r border-stone-300 text-center text-stone-500">
                        {printMode === 'completed'
                          ? `${session.participants[0]?.selfScores[key] ? (session.participants[0].selfScores[key].q1 + session.participants[0].selfScores[key].q2 + session.participants[0].selfScores[key].q3 + session.participants[0].selfScores[key].q4) : 14}/20`
                          : '/ 20'}
                      </td>
                      {session.participants.map((p) => (
                        <td key={p.id} className="p-2 border-r border-stone-300 text-center text-stone-500">
                          {printMode === 'completed' ? 'Évalué' : '/ 20'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Step 4: Debriefing & Commitments */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              Étape 4 : Débriefing & Engagements Moraux
            </h3>
            <div className="space-y-2 text-xs text-stone-700">
              <p>1. Annonce des 4 scores personnels puis révélation des scores attribués par les amis.</p>
              <p>2. Analyse bienveillante des écarts (accord, sur-estimation ou modestie excessive).</p>
              <p>3. Justification par des anecdotes précises.</p>
              <p>
                4. Conclusion : « Suite à vos retours, la vertu que j'ai le plus envie de travailler dans les
                prochains mois est... »
              </p>
            </div>

            {printMode === 'completed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {session.participants.map((p) => (
                  <div key={p.id} className="p-3 border border-stone-300 rounded bg-stone-50/40 space-y-1 text-xs">
                    <strong className="font-serif block text-stone-900">
                      Engagement de {p.name}
                    </strong>
                    <div className="text-stone-600">
                      Vertu choisie : <span className="font-semibold text-stone-900">{p.commitment?.virtue ? VIRTUES_DATA[p.commitment.virtue].frenchTitle : 'En réflexion'}</span>
                    </div>
                    <p className="italic text-stone-700">
                      « {p.commitment?.action || 'Exercer ma volonté avec discernement et fidélité.'} »
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
