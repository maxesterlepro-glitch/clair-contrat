'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import {
  ScanLine,
  AlertOctagon,
  TrendingUp,
  History,
  SearchCheck,
  Coins,
  CalendarClock,
  Award,
  Flame,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { ContractAnalysisResult } from '@/types/analysis.types';

interface ContractRow {
  id: string;
  title: string;
  contract_type: string | null;
  trust_score: number | null;
  created_at: string;
  analysis_result: ContractAnalysisResult | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [credits, setCredits] = useState<number>(0);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const meta = session.user.user_metadata || {};
      setUserName(meta.first_name ? `${meta.first_name} ${meta.last_name || ''}` : session.user.email || '');
      if (meta.city) setUserCity(`${meta.postal_code || ''} ${meta.city}`);

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', session.user.id)
        .single();
      if (profile) setCredits(profile.credits_balance);

      const { data: list } = await supabase
        .from('contracts')
        .select('id, title, contract_type, trust_score, created_at, analysis_result')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (list) setContracts(list as ContractRow[]);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const totalRedAlerts = contracts.reduce((acc, c) => acc + (c.analysis_result?.redAlerts?.length || 0), 0);
  const totalOrangeAlerts = contracts.reduce((acc, c) => acc + (c.analysis_result?.orangePriceAlerts?.length || 0), 0);
  const estimatedSavings = totalRedAlerts * 180 + totalOrangeAlerts * 140;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold">
        Chargement de votre cockpit ClairContrat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {/* HERO BENTO SOMBRE PREMIUM */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protection Juridique Active {userCity ? `• ${userCity}` : ''}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ravi de vous revoir, {userName}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Votre bouclier anti-arnaques : scannez vos contrats et devis, débusquez vos aides d&apos;État cachées, inspectez les annonces auto/immo et résiliez vos abonnements inutiles.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/scan"
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm inline-flex items-center gap-2 shadow-xl shadow-blue-600/30 transition"
                >
                  <ScanLine className="w-4 h-4" /> Scanner un document ou devis
                </Link>
                <Link
                  href="/claircash"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm inline-flex items-center gap-2 transition"
                >
                  <Coins className="w-4 h-4 text-emerald-400" /> Chasseur de Primes ClairCash
                </Link>
              </div>
            </div>

            {/* Carte Portefeuille de Protection */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 min-w-[260px] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Économies protégées</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {credits} crédits
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-white">~ {estimatedSavings} €</div>
                <div className="text-xs text-slate-400 mt-0.5">Sur {contracts.length} dossier(s) analysé(s)</div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-rose-400 font-black">{totalRedAlerts}</span> pièges rouges
                </div>
                <div>
                  <span className="text-amber-400 font-black">{totalOrangeAlerts}</span> prix gonflés
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRILLE BENTO DES 6 UNIVERS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Vos 6 super-pouvoirs ClairContrat
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/scan"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-600 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">Scanner Contrat & Devis</h3>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Détectez en 5s les clauses abusives (Alertes Rouges), les surfacturations (Alertes Oranges) et générez votre LRAR.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-blue-600">
                Ouvrir le scanner IA →
              </div>
            </Link>

            <Link
              href="/claircash"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-600 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Coins className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">ClairCash — Chasseur d&apos;Aides</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    POPULAIRE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Croise votre âge, votre code postal et votre statut pour lister toutes les primes d&apos;État et aides locales oubliées.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-emerald-600">
                Calculer mes aides (~2 480 €/an) →
              </div>
            </Link>

            <Link
              href="/abonnements"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-600 shadow-sm hover:shadow-xl hover:shadow-purple-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">Radar Stop-Abonnements</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                    LOI CHATEL
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Traquez vos abonnements dormants (salle de sport, assurance, box) et générez la résiliation sans frais en 1 clic.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-purple-600">
                Gérer et résilier mes abos →
              </div>
            </Link>

            <Link
              href="/annonces"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-600 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <SearchCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black">Inspecteur d&apos;Annonces Auto/Immo</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Collez une annonce Leboncoin ou SeLoger : l&apos;IA détecte les vices cachés et prépare les questions pièges.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-indigo-600">
                Vérifier une annonce →
              </div>
            </Link>

            <Link
              href="/mur"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-rose-600 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">Le Mur de la Honte</h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                    COMMUNAUTÉ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Découvrez les devis les plus lunaires postés par la communauté en France, votez et publiez vos propres pépites.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-rose-600">
                Voir le classement des abus →
              </div>
            </Link>

            <Link
              href="/dojo"
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-orange-600 shadow-sm hover:shadow-xl hover:shadow-orange-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black">Le Dojo de Négociation</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Entraînez-vous en direct face à un propriétaire ou un garagiste de mauvaise foi jusqu&apos;au K.O. juridique.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-orange-600">
                Entrer dans l&apos;arène →
              </div>
            </Link>
          </div>
        </div>

        {/* HISTORIQUE RAPIDE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" /> Vos derniers dossiers analysés
              </h3>
              <p className="text-xs text-slate-500">Cliquez sur un dossier pour revoir les alertes ou supprimer le scan.</p>
            </div>
            <Link href="/history" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold transition">
              Tout gérer ({contracts.length})
            </Link>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-600">Aucun document dans vos archives</p>
              <Link href="/scan" className="inline-block mt-2 text-xs font-extrabold text-blue-600 hover:underline">
                Scanner mon premier document maintenant →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {contracts.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  href={`/history?id=${c.id}`}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>{c.contract_type || 'Document'}</span>
                      <span>{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="font-extrabold text-sm mt-1 line-clamp-1">{c.title}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-black text-blue-600">
                      Score : {c.trust_score ?? 70}/100
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
