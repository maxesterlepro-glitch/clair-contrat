'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Car, Home, SearchCheck, AlertTriangle, HelpCircle, BadgeEuro, Loader2, Sparkles } from 'lucide-react';

interface AdResult {
  title: string;
  verdict: string;
  reliabilityScore: number;
  estimatedMarketPrice: string;
  hiddenTraps: string[];
  questionsToAsk: string[];
  negotiationArgument: string;
}

export default function AnnoncesPage() {
  const [category, setCategory] = useState<'auto' | 'immo'>('auto');
  const [price, setPrice] = useState('');
  const [adText, setAdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!adText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/annonces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, price, adText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l’analyse');
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l’inspection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Univers ClairCheck — Avant l&apos;achat
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Inspecteur d&apos;Annonces Auto & Immobilier
          </h1>
          <p className="text-sm text-indigo-100 mt-1">
            Collez le texte d&apos;une annonce Leboncoin, La Centrale ou SeLoger : l&apos;IA débusque les non-dits, les pannes connues du modèle et vous prépare les questions qui font baisser le prix.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCategory('auto')}
              className={`p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm transition ${
                category === 'auto'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Car className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div>Voiture / Moto d&apos;occasion</div>
                <div className="text-[11px] font-normal text-slate-500">Fiabilité moteur, cote & vices cachés</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('immo')}
              className={`p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm transition ${
                category === 'immo'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Home className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div>Immobilier (Location / Achat)</div>
                <div className="text-[11px] font-normal text-slate-500">Charges, DPE, quartier & prix au m²</div>
              </div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Prix affiché dans l&apos;annonce (optionnel)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={category === 'auto' ? 'Ex : 12 900 €' : 'Ex : 850 € / mois ou 240 000 €'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Description complète de l&apos;annonce *
            </label>
            <textarea
              rows={4}
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
              placeholder={
                category === 'auto'
                  ? 'Ex : Peugeot 208 1.2 PureTech 110ch 2018, 92 000 km, suivi garage, vendue en l’état sans CT...'
                  : 'Ex : T2 42m² refait à neuf, DPE E, charges 150€/mois, bail meublé...'
              }
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm"
            />
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold">{error}</div>}

          <button
            onClick={handleCheck}
            disabled={loading || !adText.trim()}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Inspection de l&apos;annonce en cours...
              </>
            ) : (
              <>
                <SearchCheck className="w-5 h-5" /> Passer l&apos;annonce au détecteur de mensonges
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                  Verdict : {result.verdict}
                </span>
                <h2 className="text-xl font-extrabold mt-2">{result.title}</h2>
                <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <BadgeEuro className="w-4 h-4" /> Vraie valeur estimée : {result.estimatedMarketPrice}
                </p>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-black">{result.reliabilityScore}</span>
                <span className="text-[10px] uppercase">/ 100</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-red-200 space-y-3 shadow-sm">
                <h3 className="text-xs font-black uppercase text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Loups cachés & points de méfiance
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.hiddenTraps?.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-indigo-200 space-y-3 shadow-sm">
                <h3 className="text-xs font-black uppercase text-indigo-600 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Questions pièges à poser au vendeur
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.questionsToAsk?.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-1.5 shadow-lg">
              <div className="text-xs font-black uppercase text-amber-400">
                Argument massue pour négocier le prix
              </div>
              <p className="text-sm leading-relaxed">{result.negotiationArgument}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
