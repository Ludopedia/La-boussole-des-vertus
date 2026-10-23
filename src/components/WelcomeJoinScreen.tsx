import React, { useState } from 'react';
import { Participant } from '../types/workshop';
import { AVATAR_PALETTE, NetworkInfo } from '../hooks/useRealtimeSession';
import { Compass, UserPlus, Users, Wifi, ArrowRight, Heart, Sparkles } from 'lucide-react';

interface WelcomeJoinScreenProps {
  participants: Participant[];
  onlineParticipants: string[];
  connectedClientsCount: number;
  onJoin: (name: string, color: string) => void;
  onSelectExisting: (id: string) => void;
  onOpenWifiModal: () => void;
}

export const WelcomeJoinScreen: React.FC<WelcomeJoinScreenProps> = ({
  participants,
  onlineParticipants,
  connectedClientsCount,
  onJoin,
  onSelectExisting,
  onOpenWifiModal,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(
    AVATAR_PALETTE[participants.length % AVATAR_PALETTE.length]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim(), selectedColor);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Title & Introduction */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <Compass className="w-4 h-4 text-amber-700" />
          <span>Atelier Philosophique & Introspection 360°</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-stone-900 tracking-tight text-balance">
          La Boussole des Vertus
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto font-lora text-base leading-relaxed">
          Chaque participant rejoint l'atelier depuis son propre écran. Vos navigations sont libres
          et indépendantes, tandis que vos auto-évaluations et regards croisés se synchronisent en direct.
        </p>
      </div>

      {/* Main Join Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-cinzel font-bold text-stone-900">
              Rejoindre la Session
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Indiquez votre prénom pour entrer dans le cercle des participants.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenWifiModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors self-start sm:self-auto border border-stone-200"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-700" />
            <span>Partager le Wi-Fi (QR Code)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Votre Prénom :
            </label>
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0"
                style={{ backgroundColor: selectedColor }}
              >
                {name.trim() ? name.trim().charAt(0).toUpperCase() : '?'}
              </span>
              <input
                type="text"
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Camille, Alexandre, Thomas..."
                className="flex-1 px-4 py-2.5 text-base bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-hidden focus:border-stone-900 focus:bg-white text-stone-900 placeholder:text-stone-400 transition-colors"
              />
            </div>
          </div>

          {/* Avatar Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Choisissez votre teinte :
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {AVATAR_PALETTE.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      isSelected ? 'ring-2 ring-stone-900 ring-offset-2 scale-110' : 'hover:scale-105 opacity-80'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Choisir la couleur ${color}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-white font-medium text-sm rounded-xl hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Entrer dans l'Atelier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Existing Participants in the room */}
        {participants.length > 0 && (
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
              <span className="flex items-center gap-1.5 font-sans font-semibold uppercase tracking-wider text-stone-700">
                <Users className="w-3.5 h-3.5" />
                Déjà dans la session ({participants.length}) :
              </span>
              <span>{connectedClientsCount} appareil{connectedClientsCount > 1 ? 's' : ''} connecté{connectedClientsCount > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map((p) => {
                const isOnline = onlineParticipants.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectExisting(p.id)}
                    className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-white text-left transition-colors flex items-center justify-between gap-2"
                    title={`Reprendre le profil de ${p.name}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-xs font-serif font-semibold text-stone-800 truncate">
                        {p.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 font-sans hover:text-stone-700 underline shrink-0">
                      C'est moi
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Golden rule preview */}
      <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-xl p-5 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-cinzel font-bold text-amber-900 uppercase tracking-wider">
          <Heart className="w-4 h-4 text-amber-700" />
          <span>Règle d'or de l'atelier</span>
        </div>
        <p className="font-lora italic text-stone-700 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
          « Cet exercice n'est pas un tribunal, mais un miroir bienveillant. L'objectif est de comprendre
          comment nous nous voyons nous-mêmes par rapport à la façon dont nos amis nous perçoivent,
          afin de grandir ensemble. »
        </p>
      </div>
    </div>
  );
};
