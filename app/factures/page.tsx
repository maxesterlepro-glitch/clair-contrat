'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Zap, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function FacturesPage() {
  const [utilityType, setUtilityType] = useState('Électricité / Gaz (EDF, Engie...)');
  const [provider, setProvider] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [copied, setCopied] = useState(false);

  const letterText = `Objet : Contestation de facture et demande de régularisation / vérification de compteur\nRéférence légale : Article L224-1 et suivants du Code de la consommation\n\nMadame, Monsieur (${provider || 'Service Client'}),\n\nJe vous adresse la présente réclamation suite au montant anormalement élevé de ma facture de ${utilityType} d'un montant de ${billAmount || '[Montant]'} €.\n\nProblème constaté :\n${issueDesc || '[Description du problème]'}\n\nConformément aux dispositions du Code de la consommation protégeant l'abonné contre les anomalies de facturation et les hausses injustifiées, je vous demande de bien vouloir procéder à une vérification approfondie de ma consommation et de suspendre tout prélèvement contesté dans l'attente d'un diagnostic.\n\nFait le 13/11/2026`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-black uppercase">
            ClairFacture — Audit Énergie & Box
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-yellow-400" /> Scanner & Contestataire de Factures
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Analysez vos factures d&apos;énergie ou de box internet pour repérer les anomalies de taxes, les hausses injustifiées et générer la réclamation officielle.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Type de facture</label>
              <select
                value={utilityType}
                onChange={(e) => setUtilityType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option>Électricité / Gaz (EDF, Engie, TotalEnergies...)</option>
                <option>Box Internet / Forfait Mobile (SFR, Orange, Free, Bouygues)</option>
                <option>Eau / Assainissement</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Fournisseur</label>
                <input
                  type="text"
                  placeholder="Ex : EDF / Free"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Montant facturé (€)</label>
                <input
                  type="number"
                  placeholder="Ex : 240"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Anomalie constatée *</label>
              <textarea
                rows={4}
                placeholder="Ex : Augmentation de 50% sans explication, facture de régularisation excessive..."
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-yellow-400">Courrier de réclamation facture</div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                {letterText}
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(letterText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition"
            >
              {copied ? <><Check className="w-4 h-4" /> Courrier copié !</> : <><Copy className="w-4 h-4" /> Copier la réclamation facture</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
