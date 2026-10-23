import React, { useState } from 'react';
import { VIRTUES_DATA } from '../data/virtuesData';
import { VirtueKey } from '../types/workshop';
import { Compass, BookOpen, ArrowRight, ArrowLeft, AlertCircle, Quote } from 'lucide-react';

interface StepCodexProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepCodex: React.FC<StepCodexProps> = ({ onNextStep, onPrevStep }) => {
  const [selectedVirtueKey, setSelectedVirtueKey] = useState<VirtueKey>('prudence');
  const virtues = Object.values(VIRTUES_DATA);
  const selectedVirtue = VIRTUES_DATA[selectedVirtueKey];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Chapter header */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <span>Étape 1 sur 4</span>
          <span aria-hidden="true">·</span>
          <span>Fondations Philosophiques</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-stone-900 tracking-tight">
          Le Texte de Référence
        </h2>
        <p className="text-stone-600 font-lora italic text-base">
          À lire ensemble à voix haute avant d'aborder les questionnaires.
        </p>
      </div>

      {/* Foundational Essay Block with Drop Cap */}
      <article className="bg-white border border-stone-200/90 rounded-xl p-6 md:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-stone-200 text-xs font-mono text-stone-500">
          <BookOpen className="w-4 h-4 text-stone-700" />
          <span>ORIGINES LATINES & STOÏCIENNES</span>
          <span aria-hidden="true">·</span>
          <span>PLATON · ARISTOTE · SÉNÈQUE</span>
        </div>

        <div className="font-lora text-stone-800 leading-relaxed space-y-5 text-base md:text-lg">
          <p className="first-letter:text-5xl first-letter:font-cinzel first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-stone-900 first-letter:leading-none">
            Le mot « cardinal » vient du latin <em>cardo</em>, qui signifie « charnière » ou « pivot ».
            Dans la philosophie antique (Platon dans <em>La République</em>, Aristote dans <em>L'Éthique à Nicomaque</em>,
            les Stoïciens comme Marc Aurèle ou Épictète) puis dans la tradition humaniste, les quatre vertus
            cardinales sont les piliers sur lesquels repose une vie bonne, équilibrée et féconde.
          </p>

          <p>
            Contrairement au <strong>talent</strong> qui est en grande partie inné ou accidentel, une
            <strong> vertu</strong> est une disposition acquise, une habitude choisie : un véritable
            « muscle » de l'esprit que l'on exerce et entraîne au quotidien. Une vertu n'est jamais figée ;
            elle s'affine à chaque arbitrage, à chaque prise de parole, à chaque tentation surmontée.
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 py-2 text-stone-300">
          <span className="w-16 h-px bg-stone-200" />
          <Compass className="w-4 h-4 text-stone-400" />
          <span className="w-16 h-px bg-stone-200" />
        </div>

        {/* The 4 Virtues Segmented selector */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 text-center">
            Explorez les 4 piliers antiques
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {virtues.map((v) => {
              const isSelected = v.key === selectedVirtueKey;
              return (
                <button
                  key={v.key}
                  onClick={() => setSelectedVirtueKey(v.key)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-70 font-mono">
                    {v.latinName}
                  </div>
                  <div className="font-serif font-semibold text-sm leading-tight mt-0.5">
                    {v.frenchTitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Virtue Deep Dive Card */}
        <div className="mt-6 p-6 rounded-xl border border-stone-200/90 bg-[#FAF8F5] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <span className="text-xs font-mono text-stone-500">
                {selectedVirtue.latinName} · {selectedVirtue.greekName}
              </span>
              <h3 className="text-2xl font-cinzel font-bold text-stone-900">
                {selectedVirtue.frenchTitle}
              </h3>
            </div>
            <div className="text-xs font-medium text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200 self-start">
              {selectedVirtue.subTitle}
            </div>
          </div>

          {/* Role & Essence */}
          <div className="space-y-3">
            <p className="font-serif text-stone-900 font-semibold text-sm italic">
              {selectedVirtue.cardinalRole}
            </p>
            <p className="text-stone-700 font-lora leading-relaxed text-sm md:text-base">
              {selectedVirtue.essence}
            </p>
          </div>

          {/* Faux-Amis Notice */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50/80 border border-amber-200 text-xs md:text-sm text-amber-950 font-sans">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block mb-0.5">Éclairage sur les faux-amis :</strong>
              {selectedVirtue.falseFriends}
            </div>
          </div>

          {/* Antique Quote */}
          <div className="pt-2">
            <blockquote className="relative p-4 rounded-lg bg-white border border-stone-200/80 text-stone-800 font-lora italic text-sm leading-relaxed">
              <Quote className="w-5 h-5 text-stone-300 absolute top-2 right-2" />
              « {selectedVirtue.antiqueQuote.text} »
              <footer className="text-xs font-sans not-italic text-stone-500 font-medium mt-2">
                — {selectedVirtue.antiqueQuote.author}
                {selectedVirtue.antiqueQuote.work && `, ${selectedVirtue.antiqueQuote.work}`}
              </footer>
            </blockquote>
          </div>
        </div>
      </article>

      {/* Navigation bar between steps */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au cercle</span>
        </button>

        <button
          onClick={onNextStep}
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
        >
          <span>Passer au Questionnaire (Étape 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
