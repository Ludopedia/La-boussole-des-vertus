import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Clock } from 'lucide-react';

interface SpeechTimerProps {
  participantName: string;
}

export const SpeechTimer: React.FC<SpeechTimerProps> = ({ participantName }) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState<number>(10 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);

  const prompts = [
    "La révélation : Laissez d'abord la personne exprimer ce qu'elle ressent en découvrant ses scores.",
    "L'analyse des convergences : Où les amis et l'intéressé(e) sont-ils en parfait accord ?",
    "L'exploration des écarts : Pourquoi un tel écart de perception ? Partagez des situations concrètes.",
    "La boîte à anecdotes : Quel geste ou décision passée a marqué un ami sous l'angle de cette vertu ?",
    "L'engagement : Vers quelle vertu la personne choisit-elle de diriger son effort pour grandir ?",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play soft synthesized chime via Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch {
        // Audio fallback
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const handleSelectMinutes = (mins: number) => {
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="bg-[#FBF9F5] border border-stone-200 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            <span>Tour de table chronométré</span>
            <span aria-hidden="true">·</span>
            <span>Écoute bienveillante</span>
          </div>
          <h4 className="text-base font-serif font-medium text-stone-900">
            Temps dédié à {participantName}
          </h4>
        </div>

        {/* Duration selector tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg self-start sm:self-auto">
          {[5, 10, 15].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                durationMinutes === mins
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      <div className="py-6 flex flex-col items-center">
        {/* Timer display */}
        <div className="text-5xl font-mono tabular-nums font-light tracking-tight text-stone-900 mb-2">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-1.5 bg-stone-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-amber-700 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isRunning
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Suspendre
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Lancer l'écoute
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Réinitialiser le minuteur"
            aria-label="Réinitialiser le minuteur"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Relance / Philosophical Guide Prompt */}
      <div className="mt-2 pt-4 border-t border-stone-200/80 bg-stone-100/60 -mx-6 -mb-6 p-4 rounded-b-xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-0.5">
            Fil conducteur de l'échange ({currentPromptIndex + 1}/{prompts.length})
          </div>
          <p className="text-xs text-stone-700 font-serif leading-relaxed italic">
            "{prompts[currentPromptIndex]}"
          </p>
        </div>
        <button
          onClick={() => setCurrentPromptIndex((prev) => (prev + 1) % prompts.length)}
          className="text-xs text-amber-800 hover:text-amber-900 font-medium underline shrink-0 whitespace-nowrap"
        >
          Autre relance
        </button>
      </div>
    </div>
  );
};
