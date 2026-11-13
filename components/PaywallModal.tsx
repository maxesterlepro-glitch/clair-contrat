'use client';

import Link from 'next/link';
import { Coins, Sparkles, ArrowRight, X } from 'lucide-react';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
}

export default function PaywallModal({ isOpen, onClose }: PaywallProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-white/20 text-white rounded-[2.5rem] p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Coins className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
            Barrière de Paiement (Paywall)
          </span>
          <h2 className="text-2xl font-black tracking-tight">Crédits insuffisants</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Vous avez épuisé vos crédits d&apos;analyse. Pour protéger vos contrats et générer vos courriers juridiques, veuillez recharger votre compte.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/tarifs"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Recharger mes crédits (Packs dès 4,99 €)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
