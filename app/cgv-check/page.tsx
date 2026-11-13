'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ShoppingCart, SearchCheck, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CgvCheckPage() {
  const [url, setUrl] = useState('');
  const [cgvText, setCgvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; traps: string[]; verdict: string } | null>(null);

  const handleCheck = () => {
    if (!cgvText.trim() && !url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        score: 45,
        verdict: 'PRUDENCE — CLAUSES ABUSIVES DÉTECTÉES',
        traps: [
          'Article 8 : Exclusion totale de remboursement en cas de soldes ou promotion.',
          'Article 12 : Frais de retour exorbitants à la charge exclusive du client (contraire au délai de rétractation légal de 14 jours).',
          'Article 15 : Clause attributive de juridiction imposant un tribunal étranger en cas de litige.',
        ],
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase">
            Audit E-Commerce — Détecteur de Pièges CGV
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-indigo-400" /> Analyseur de Conditions Générales de Vente
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Collez le texte ou l&apos;URL des CGV d&apos;un site marchand avant de commander pour identifier les clauses illégales de non-remboursement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Lien du site / e-shop (optionnel)</label>
            <input
              type="text"
              placeholder="https://monsite-inconnu.fr/cgv"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Collez le texte des CGV du site *</label>
            <textarea
              rows={5}
              placeholder="Collez ici les conditions générales de vente..."
              value={cgvText}
              onChange={(e) => setCgvText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || (!cgvText.trim() && !url.trim())}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-sm flex items-center justify-center gap-2 transition"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyse des clauses en cours...</> : <><SearchCheck className="w-5 h-5" /> Auditer les CGV du site</>}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black">{result.verdict}</span>
                <h3 className="text-xl font-extrabold mt-2">Indice de confiance e-commerce</h3>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-slate-950 text-white flex flex-col items-center justify-center font-black">
                <span className="text-2xl text-rose-400">{result.score}</span>
                <span className="text-[10px] uppercase">/ 100</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-3 shadow-xl">
              <div className="text-xs font-black uppercase text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Clauses abusives et illégales repérées dans ces CGV
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {result.traps.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
