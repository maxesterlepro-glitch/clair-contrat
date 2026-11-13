'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import {
  Trash2,
  Eye,
  AlertOctagon,
  TrendingUp,
  Swords,
  Copy,
  Check,
  FileText,
  ScanLine,
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

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');

  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractRow | null>(null);
  const [userHeader, setUserHeader] = useState('');
  const [format, setFormat] = useState<'email' | 'letter'>('email');
  const [copied, setCopied] = useState(false);
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

      const m = session.user.user_metadata || {};
      if (m.first_name || m.last_name) {
        setUserHeader(
          `${m.first_name || ''} ${m.last_name || ''}\n${m.address || ''}\n${m.postal_code || ''} ${m.city || ''}\nEmail : ${session.user.email}\n\n`
        );
      }

      const { data: list } = await supabase
        .from('contracts')
        .select('id, title, contract_type, trust_score, created_at, analysis_result')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (list) {
        const rows = list as ContractRow[];
        setContracts(rows);
        if (initialId) {
          const found = rows.find((r) => r.id === initialId);
          if (found) setSelectedContract(found);
        } else if (rows.length > 0) {
          setSelectedContract(rows[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, [initialId, router, supabase]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('contracts').delete().eq('id', id);
    if (!error) {
      const updated = contracts.filter((c) => c.id !== id);
      setContracts(updated);
      if (selectedContract?.id === id) {
        setSelectedContract(updated[0] || null);
      }
    }
  };

  const handleCopy = () => {
    if (!selectedContract?.analysis_result) return;
    const res = selectedContract.analysis_result;
    const body =
      format === 'email'
        ? res.counterAttack.emailBody
        : `${userHeader}Objet : ${res.counterAttack.subject}\n(Lettre recommandée avec accusé de réception)\n\n${res.counterAttack.recommendedLetterBody}`;
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Chargement de vos scans...</div>;
  }

  const res = selectedContract?.analysis_result;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Historique de mes Scans ({contracts.length})</h1>
            <p className="text-sm text-slate-500">
              Cliquez sur un scan précédent pour revoir le diagnostic complet ou supprimez-le définitivement.
            </p>
          </div>
          <Link
            href="/scan"
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            <ScanLine className="w-4 h-4" /> Nouveau Scan
          </Link>
        </div>

        {contracts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-bold text-base">Aucun scan dans votre historique</div>
            <p className="text-xs text-slate-500">Analysez votre premier contrat ou devis pour le retrouver ici.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Liste à gauche */}
            <div className="lg:col-span-4 space-y-3">
              {contracts.map((c) => {
                const isSelected = selectedContract?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedContract(c)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-[11px] font-semibold text-slate-400">
                        {c.contract_type || 'Document'} • {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="font-bold text-sm truncate mt-0.5">{c.title}</div>
                      {c.trust_score !== null && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-slate-100 text-[11px] font-extrabold">
                          Score : {c.trust_score}/100
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedContract(c)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Ouvrir ce scan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Supprimer ce scan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Détail complet à droite */}
            <div className="lg:col-span-8">
              {res ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {res.documentCategory}
                        </span>
                        <h2 className="text-xl font-extrabold mt-2">{res.documentTitle}</h2>
                      </div>
                      <div className="w-20 h-20 rounded-2xl border-2 border-blue-600 bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0">
                        <span className="text-2xl font-black">{res.trustScore}</span>
                        <span className="text-[10px] font-bold uppercase">/ 100</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                      {res.summaryPoints?.map((pt, i) => (
                        <p key={i} className="text-sm text-slate-700">• {pt}</p>
                      ))}
                    </div>
                  </div>

                  {/* Alertes Rouges */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" /> Alertes Rouges — Pièges juridiques ({res.redAlerts?.length || 0})
                    </h3>
                    {res.redAlerts?.map((a) => (
                      <div key={a.id} className="p-5 rounded-2xl bg-white border-l-4 border-l-red-600 border border-slate-200 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-red-600">CLAUSE ABUSIVE / PIÈGE</span>
                          <span className="text-slate-400">{a.legalReference}</span>
                        </div>
                        <div className="font-bold text-base">{a.title}</div>
                        <blockquote className="p-2.5 rounded-xl bg-red-50/60 text-xs italic text-slate-600">
                          « {a.exactQuote} »
                        </blockquote>
                        <p className="text-sm text-slate-700">{a.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* Alertes Oranges */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> Alertes Oranges — Prix gonflés ({res.orangePriceAlerts?.length || 0})
                    </h3>
                    {res.orangePriceAlerts?.map((p) => (
                      <div key={p.id} className="p-5 rounded-2xl bg-white border-l-4 border-l-amber-500 border border-slate-200 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-amber-700">{p.overchargePercentage} VS MARCHÉ FR</span>
                          <span>Facturé : <strong className="text-red-600">{p.quotedPrice}</strong> (Moyenne : {p.marketAveragePrice})</span>
                        </div>
                        <div className="font-bold text-base">{p.item}</div>
                        <p className="text-sm text-slate-700">{p.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* Contre-attaque */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-orange-400 flex items-center gap-1.5">
                        <Swords className="w-4 h-4" /> Courrier de Contre-attaque pré-rempli
                      </span>
                      <div className="flex rounded-xl bg-slate-800 p-1 text-xs font-bold">
                        <button
                          onClick={() => setFormat('email')}
                          className={`px-3 py-1 rounded-lg ${format === 'email' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
                        >
                          E-mail
                        </button>
                        <button
                          onClick={() => setFormat('letter')}
                          className={`px-3 py-1 rounded-lg ${format === 'letter' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
                        >
                          LRAR avec mon adresse
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800 text-sm whitespace-pre-line leading-relaxed text-slate-100">
                      {format === 'letter' && userHeader}
                      <div className="font-bold text-xs text-orange-300 mb-2">
                        Objet : {res.counterAttack?.subject}
                      </div>
                      {format === 'email' ? res.counterAttack?.emailBody : res.counterAttack?.recommendedLetterBody}
                    </div>

                    <button
                      onClick={handleCopy}
                      className="w-full py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2"
                    >
                      {copied ? <><Check className="w-4 h-4 text-emerald-600" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier ce courrier</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-sm text-slate-500">
                  Sélectionnez un scan à gauche pour afficher ses détails.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <HistoryContent />
    </Suspense>
  );
}
