import React from 'react';
import { VirtueKey } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';
import { CheckCircle2, Eye, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface JohariAnalysisProps {
  selfScores: Record<VirtueKey, number>;
  peerScores: Record<VirtueKey, number>;
  participantName: string;
}

export const JohariAnalysis: React.FC<JohariAnalysisProps> = ({
  selfScores,
  peerScores,
  participantName,
}) => {
  const virtueKeys: VirtueKey[] = ['prudence', 'temperance', 'fortitude', 'justice'];

  // Categorize each virtue
  const insights = virtueKeys.map((key) => {
    const selfVal = selfScores[key] || 0;
    const peerVal = peerScores[key] || 0;
    const delta = selfVal - peerVal; // positive means I rate myself higher, negative means friends rate me higher
    const virtue = VIRTUES_DATA[key];

    let category: 'blind_spot' | 'hidden_strength' | 'mutual_high' | 'growth_zone' = 'growth_zone';
    let explanation = '';

    if (delta >= 3) {
      category = 'blind_spot';
      explanation = `Vous vous attribuez ${selfVal}/20 mais vos amis perçoivent ${peerVal}/20. Un possible angle mort ou une différence de sensibilité sur les moments où cette vertu s'exprime.`;
    } else if (delta <= -3) {
      category = 'hidden_strength';
      explanation = `Vos amis vous attribuent ${peerVal}/20, soit bien plus que votre propre note de ${selfVal}/20. Vous êtes peut-être trop sévère envers vous-même : vos proches admirent cette qualité chez vous !`;
    } else if (selfVal >= 14 && peerVal >= 14) {
      category = 'mutual_high';
      explanation = `Accord éclatant (${selfVal}/20 vs ${peerVal}/20) ! Cette vertu constitue un pilier manifeste et reconnu de votre caractère.`;
    } else {
      category = 'growth_zone';
      explanation = `Perceptions convergentes (${selfVal}/20 vs ${peerVal}/20). Une vertu en construction, terrain fertile pour votre prochain plan de progrès personnel.`;
    }

    return {
      key,
      virtue,
      selfVal,
      peerVal,
      delta,
      category,
      explanation,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-serif font-medium text-stone-900">
          Analyse des Écarts de Perception
        </h4>
        <span className="text-xs text-stone-500 font-mono">Miroir 360°</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          let badgeColor = 'bg-stone-100 text-stone-800 border-stone-200';
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
          let label = 'Accord Équilibré';

          if (item.category === 'blind_spot') {
            badgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
            icon = <Eye className="w-4 h-4 text-amber-700 shrink-0" />;
            label = 'Angle Mort Potentiel';
          } else if (item.category === 'hidden_strength') {
            badgeColor = 'bg-indigo-50 text-indigo-900 border-indigo-200';
            icon = <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />;
            label = 'Force Cachée / Modestie';
          } else if (item.category === 'mutual_high') {
            badgeColor = 'bg-emerald-50 text-emerald-900 border-emerald-200';
            icon = <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />;
            label = 'Pilier Reconnu';
          } else {
            badgeColor = 'bg-stone-50 text-stone-700 border-stone-200';
            icon = <CheckCircle2 className="w-4 h-4 text-stone-500 shrink-0" />;
            label = 'Chantier de Croissance';
          }

          return (
            <div
              key={item.key}
              className="bg-white border border-stone-200/90 rounded-lg p-4 space-y-2.5 transition-shadow hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.virtue.color.primary }}
                  />
                  <span className="font-serif font-semibold text-stone-900 text-sm">
                    {item.virtue.frenchTitle}
                  </span>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badgeColor}`}>
                  {label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-stone-600 bg-stone-50 px-3 py-1.5 rounded">
                <div>
                  <span className="text-stone-400 font-sans mr-1">Auto-évaluation:</span>
                  <span className="font-semibold text-stone-900">{item.selfVal}/20</span>
                </div>
                <span className="text-stone-300">|</span>
                <div>
                  <span className="text-stone-400 font-sans mr-1">Regard des amis:</span>
                  <span className="font-semibold text-stone-900">{item.peerVal}/20</span>
                </div>
                <span className="text-stone-300">|</span>
                <div>
                  <span className="text-stone-400 font-sans mr-1">Écart:</span>
                  <span
                    className={`font-semibold ${
                      item.delta > 0
                        ? 'text-amber-800'
                        : item.delta < 0
                        ? 'text-indigo-800'
                        : 'text-stone-600'
                    }`}
                  >
                    {item.delta > 0 ? `+${item.delta}` : item.delta}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
