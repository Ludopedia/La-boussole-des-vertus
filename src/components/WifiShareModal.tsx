import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { NetworkInfo } from '../hooks/useRealtimeSession';
import { Wifi, X, Copy, Check, Laptop, Smartphone, Users, Globe } from 'lucide-react';

interface WifiShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkInfo: NetworkInfo | null;
  connectedClientsCount: number;
}

export const WifiShareModal: React.FC<WifiShareModalProps> = ({
  isOpen,
  onClose,
  networkInfo,
  connectedClientsCount,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Primary share URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const port = networkInfo?.port || 3000;

  // Local IP url (e.g. http://192.168.1.42:3000)
  const localIpUrl =
    networkInfo && networkInfo.localIps.length > 0
      ? `http://${networkInfo.localIps[0]}:${port}`
      : currentOrigin;

  // Active URL to show in QR code
  const activeShareUrl = localIpUrl.startsWith('http://127.0.0.1') || localIpUrl.startsWith('http://localhost')
    ? currentOrigin
    : localIpUrl;

  useEffect(() => {
    if (activeShareUrl) {
      QRCode.toDataURL(activeShareUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#1C1917',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [activeShareUrl]);

  if (!isOpen) return null;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-stone-500">
                <span>Multi-Appareils</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-emerald-700">
                  {connectedClientsCount} appareil{connectedClientsCount > 1 ? 's' : ''} en ligne
                </span>
              </div>
              <h3 className="text-xl font-cinzel font-bold text-stone-900">
                Partager sur le même Wi-Fi
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
            title="Fermer"
            aria-label="Fermer la fenêtre de partage"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="space-y-4">
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Pour que chacun participe depuis son propre ordinateur ou smartphone en même temps :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <Wifi className="w-3.5 h-3.5 text-amber-700" />
                <span>1. Même Wi-Fi</span>
              </div>
              <p className="text-stone-500 text-[11px] leading-snug">
                Connectez tous vos ordinateurs/smartphones à la même box ou point d'accès.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <Globe className="w-3.5 h-3.5 text-indigo-700" />
                <span>2. Ouvrir le lien</span>
              </div>
              <p className="text-stone-500 text-[11px] leading-snug">
                Vos amis tapent l'adresse ci-dessous dans leur navigateur (Chrome, Safari...).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>3. Choisir son nom</span>
              </div>
              <p className="text-stone-500 text-[11px] leading-snug">
                Chacun sélectionne son prénom et répond aux questions en direct !
              </p>
            </div>
          </div>
        </div>

        {/* QR Code and Local Wi-Fi Address */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200">
          {/* QR Code */}
          <div className="bg-white p-2 rounded-lg border border-stone-200 shrink-0 shadow-xs">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code pour se connecter à l'atelier"
                className="w-32 h-32 sm:w-36 sm:h-36"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center text-xs text-stone-400 font-mono">
                Génération...
              </div>
            )}
            <span className="text-[10px] text-stone-500 block text-center mt-1 font-mono">
              Scanner avec mobile
            </span>
          </div>

          {/* Direct Address links */}
          <div className="space-y-3 flex-1 w-full">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                Adresse Wi-Fi locale pour les ordinateurs :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={localIpUrl}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg text-stone-800 select-all"
                />
                <button
                  onClick={() => handleCopy(localIpUrl)}
                  className="px-3 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedUrl === localIpUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* If there are additional local IP addresses */}
            {networkInfo && networkInfo.localIps.length > 1 && (
              <div className="space-y-1">
                <span className="text-[11px] text-stone-500 block">
                  Autre adresse IP détectée :
                </span>
                {networkInfo.localIps.slice(1).map((ip) => {
                  const altUrl = `http://${ip}:${port}`;
                  return (
                    <div key={ip} className="flex items-center justify-between text-xs font-mono text-stone-600 bg-white px-2 py-1 rounded border border-stone-200">
                      <span>{altUrl}</span>
                      <button
                        onClick={() => handleCopy(altUrl)}
                        className="text-stone-400 hover:text-stone-800 text-[11px]"
                      >
                        Copier
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Current window url if distinct */}
            {currentOrigin !== localIpUrl && (
              <div className="pt-1">
                <span className="text-[11px] text-stone-500 block mb-1">
                  Ou lien direct du navigateur :
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentOrigin}
                    className="flex-1 px-2.5 py-1 text-xs font-mono bg-white border border-stone-200 rounded text-stone-600 select-all truncate"
                  />
                  <button
                    onClick={() => handleCopy(currentOrigin)}
                    className="px-2 py-1 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors shrink-0"
                  >
                    Copier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-stone-500">
          Toutes les modifications faites par chaque ami (scores, notes, anecdotes) sont synchronisées instantanément entre tous les écrans en temps réel.
        </div>
      </div>
    </div>
  );
};
