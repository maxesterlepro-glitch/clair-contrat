'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Coins, Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight, Loader2, Wallet } from 'lucide-react';

interface GrantItem {
  id: string;
  title: string;
  organism: string;
  amount: string;
  probability: string;
  whyEligible: string;
  howToClaim: string;
}

interface ClairCashResult {
  totalEstimatedYearly: string;
  profileSummary: string;
  grants: GrantItem[];
}

export default function ClairCashPage() {
  const [age, setAge] = useState<number>(20);
  const [postalCode, setPostalCode] = useState('69000');
  const [city, setCity] = useState('Lyon');
  const [status, setStatus] = useState('Alternant / Apprenti');
  const [housing, setHousing] = useState('Locataire (ou futur locataire)');
  const [transport, setTransport] = useState('Voiture personnelle & Transports');
  const [incomeBracket, setIncomeBracket] = useState('Moins de 1 800 € net / mois');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClairCashResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const m = session?.user?.user_metadata || {};
      if (m.postal_code) setPostalCode(m.postal_code);
      if (m.city) setCity(m.city);
      if (m.birth_date) {
        const birthYear = new Date(m.birth_date).getFullYear();
        const currentYear = 2026;
        if (birthYear > 1920 && birthYear <= currentYear) {
          setAge(currentYear - birthYear);
        }
      }
    });
  }, [supabase]);

  const handleScanCash = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/claircash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          postalCode,
          city,
          status,
          housing,
          transport,
          incomeBracket,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase">
            <Coins className="w-3.5 h-3.5" /> Univers ClairCash — Chasseur de Primes
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Récupérez l&apos;argent et les aides que vous oubliez
          </h1>
          <p className="text-sm text-emerald-100 mt-1">
            Nous croisons automatiquement l&apos;âge et le code postal de votre profil avec votre statut pour débusquer toutes les primes d&apos;État, aides régionales, Mobili-Jeune, chèques énergie et remboursements auxquels vous avez droit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase text-slate-400">
              Données importées de votre profil ClairContrat
            </span>
            <div className="flex items-center gap-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {age} ans
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {postalCode} ({city})
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Votre âge</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Code Postal</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Votre statut actuel</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold"
              >
                <option>Alternant / Apprenti</option>
                <option>Étudiant / Lycéen</option>
                <option>Salarié du privé</option>
                <option>Freelance / Auto-entrepreneur</option>
                <option>En recherche d&apos;emploi</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Situation logement</label>
              <select
                value={housing}
                onChange={(e) => setHousing(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold"
              >
                <option>Locataire (ou futur locataire)</option>
                <option>Hébergé chez les parents</option>
                <option>Propriétaire</option>
                <option>Colocation / Résidence étudiante</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Transport quotidien</label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold"
              >
                <option>Voiture personnelle & Transports</option>
                <option>Transports en commun / Train TER</option>
                <option>En train de passer ou financer le Permis B</option>
                <option>Vélo / Mobilité électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Revenus mensuels</label>
              <select
                value={incomeBracket}
                onChange={(e) => setIncomeBracket(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold"
              >
                <option>Moins de 1 200 € net / mois</option>
                <option>Moins de 1 800 € net / mois</option>
                <option>Entre 1 800 € et 2 500 € net / mois</option>
                <option>Plus de 2 500 € net / mois</option>
              </select>
            </div>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold">{error}</div>}

          <button
            onClick={handleScanCash}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Recherche des aides nationales et locales ({postalCode})...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Scanner toutes mes aides et primes maintenant
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> Potentiel détecté pour votre profil
                </span>
                <p className="text-xs text-slate-300 mt-1">{result.profileSummary}</p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-right shrink-0">
                <div className="text-[10px] font-bold uppercase text-emerald-300">Gain cumulé estimé</div>
                <div className="text-2xl font-black text-emerald-400">{result.totalEstimatedYearly}</div>
              </div>
            </div>

            <div className="grid gap-4">
              {result.grants?.map((g) => (
                <div key={g.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {g.organism}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-black">
                      {g.amount}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{g.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{g.whyEligible}</p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Comment récupérer cette aide : </strong>
                      {g.howToClaim}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
