'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { GitCompare, Trophy, Loader2, Copy, Check } from 'lucide-react';

interface CompareResult {
  winner: string;
  savingsAmount: string;
  verdictSummary: string;
  negotiationMessage: string;
}

export default function ComparateurPage() {
  const [quoteA, setQuoteA] = useState('');
  const [quoteB, setQuoteB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCompare = async () => {
    if (!quoteA.trim() || !quoteB.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comparateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteA, quoteB }),
      });
      const data = await res.json();
      setResult(data.result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-black uppercase">
            Arbitrage Concurrentiel IA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2">
            <GitCompare className="w-7 h-7 text-violet-400" /> Duel de 2 Devis (Devis A vs Devis B)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Comparez deux garagistes, deux artisans ou deux contrats d&apos;assurance et générez le message de mise en concurrence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-sm">
            <label className="text-xs font-black uppercase text-violet-600">Devis Concurrent A</label>
            <textarea
              rows={5}
              value={quoteA}
              onChange={(e) => setQuoteA(e.target.value)}
              placeholder="Ex : Garage A — Kit distribution + pompe à eau 890 € TTC..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-sm">
            <label className="text-xs font-black uppercase text-emerald-600">Devis Concurrent B</label>
            <textarea
              rows={5}
              value={quoteB}
              onChange={(e) => setQuoteB(e.target.value)}
              placeholder="Ex : Garage B — Kit distribution 640 € TTC..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || !quoteA.trim() || !quoteB.trim()}
          className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Confrontation en cours...</> : <><GitCompare className="w-5 h-5" /> Lancer le Duel des 2 Devis</>}
        </button>

        {result && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border-2 border-violet-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  <Trophy className="w-3.5 h-3.5" /> Gagnant : {result.winner}
                </span>
                <p className="text-sm text-slate-700 mt-2">{result.verdictSummary}</p>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-950 text-white text-right shrink-0">
                <div className="text-[10px] uppercase text-violet-300 font-bold">Écart détecté</div>
                <div className="text-lg font-black">{result.savingsAmount}</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-3">
              <div className="text-xs font-black uppercase text-violet-400">Message de négociation</div>
              <p className="text-sm bg-slate-900 p-4 rounded-2xl leading-relaxed">{result.negotiationMessage}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.negotiationMessage);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-5 py-3 rounded-xl bg-white text-slate-950 font-black text-xs inline-flex items-center gap-2"
              >
                {copied ? <><Check className="w-4 h-4 text-emerald-600" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le message</>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
