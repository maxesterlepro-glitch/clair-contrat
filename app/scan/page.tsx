'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  Camera,
  FileText,
  Link2,
  Trash2,
  Loader2,
  Zap,
  AlertOctagon,
  TrendingUp,
  Swords,
  Copy,
  Check,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { ContractAnalysisResult } from '@/types/analysis.types';

export default function ScanPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [linkOrText, setLinkOrText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContractAnalysisResult | null>(null);
  const [showCounterAttack, setShowCounterAttack] = useState(false);
  const [format, setFormat] = useState<'email' | 'letter'>('email');
  const [copied, setCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && !linkOrText.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const uploadedPaths: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('contracts-docs').upload(path, file);
        if (uploadErr) throw new Error("Échec de l'envoi du fichier.");
        uploadedPaths.push(path);
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ filePaths: uploadedPaths, linkOrText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'analyse");

      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyCounterAttack = () => {
    if (!result) return;
    const body = format === 'email' ? result.counterAttack.emailBody : result.counterAttack.recommendedLetterBody;
    navigator.clipboard.writeText(`Objet : ${result.counterAttack.subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result) {
    const scoreStyle =
      result.trustScore >= 75
        ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
        : result.trustScore >= 45
        ? 'text-amber-600 border-amber-500 bg-amber-50'
        : 'text-red-600 border-red-500 bg-red-50';

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
        <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600">
              <ArrowLeft className="w-4 h-4" /> Tableau de bord
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setFiles([]);
                setLinkOrText('');
                setShowCounterAttack(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Scanner un autre document
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {result.documentCategory}
                </span>
                <h1 className="text-xl font-extrabold mt-2 leading-snug">{result.documentTitle}</h1>
              </div>
              <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreStyle}`}>
                <span className="text-2xl font-black">{result.trustScore}</span>
                <span className="text-[10px] font-bold uppercase">/ 100</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              {result.summaryPoints.map((pt, i) => (
                <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{pt}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" /> 1. Alertes Rouges — Pièges juridiques ({result.redAlerts.length})
            </h2>

            {result.redAlerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                Aucune clause abusive ou piège juridique détecté.
              </div>
            ) : (
              result.redAlerts.map((alert) => (
                <div key={alert.id} className="p-5 rounded-2xl bg-white border-l-4 border-l-red-600 border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[11px] font-extrabold">
                      CLAUSE ABUSIVE / PIÈGE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{alert.legalReference}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{alert.title}</h3>
                  <blockquote className="p-2.5 rounded-xl bg-red-50/60 text-xs italic text-slate-600">
                    « {alert.exactQuote} »
                  </blockquote>
                  <p className="text-sm text-slate-700 leading-relaxed">{alert.explanation}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 2. Alertes Oranges — Prix gonflés ({result.orangePriceAlerts.length})
            </h2>

            {result.orangePriceAlerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500">
                Aucun prix gonflé détecté par rapport à la moyenne nationale en France.
              </div>
            ) : (
              result.orangePriceAlerts.map((price) => (
                <div key={price.id} className="p-5 rounded-2xl bg-white border-l-4 border-l-amber-500 border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-extrabold">
                      {price.overchargePercentage} VS MARCHÉ FR
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Devis : <span className="text-red-600">{price.quotedPrice}</span> (Moyenne : {price.marketAveragePrice})
                    </span>
                  </div>
                  <h3 className="font-bold text-base">{price.item}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{price.explanation}</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowCounterAttack(!showCounterAttack)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/25 active:scale-[0.99] transition"
            >
              <Swords className="w-5 h-5" />
              <span>3. Contre-attaquer (Générer le courrier)</span>
            </button>
          </div>

          {showCounterAttack && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Courrier juridique prêt
                </span>
                <div className="flex rounded-xl bg-slate-800 p-1 text-xs font-bold">
                  <button
                    onClick={() => setFormat('email')}
                    className={`px-3 py-1 rounded-lg transition ${format === 'email' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
                  >
                    E-mail
                  </button>
                  <button
                    onClick={() => setFormat('letter')}
                    className={`px-3 py-1 rounded-lg transition ${format === 'letter' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
                  >
                    Recommandé LRAR
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm whitespace-pre-line leading-relaxed text-slate-100">
                <div className="text-xs font-bold text-slate-400 mb-2">
                  Objet : {result.counterAttack.subject}
                </div>
                {format === 'email' ? result.counterAttack.emailBody : result.counterAttack.recommendedLetterBody}
              </div>

              <button
                onClick={copyCounterAttack}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier le courrier</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Mes analyses
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Vérifier un contrat ou devis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Devis de garage, bail d&apos;habitation, salle de sport, assurance auto, contrat freelance ou facture d&apos;énergie.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/50 cursor-pointer active:scale-95 transition">
            <Camera className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-bold text-blue-700 text-center">Prendre en photo</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
          </label>

          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white cursor-pointer active:scale-95 transition">
            <FileText className="w-8 h-8 text-slate-700 mb-2" />
            <span className="text-sm font-bold text-center">Importer un PDF</span>
            <input type="file" accept="image/*,application/pdf" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" /> Ou collez un lien / texte de devis
          </label>
          <textarea
            rows={3}
            value={linkOrText}
            onChange={(e) => setLinkOrText(e.target.value)}
            placeholder="Collez un lien ou le texte d'un devis / contrat..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-sm font-medium truncate pr-2">{f.name}</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={(files.length === 0 && !linkOrText.trim()) || isAnalyzing}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Diagnostic IA en cours...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Lancer le diagnostic (1 crédit)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
