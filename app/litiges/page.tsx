'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Gavel, Copy, Check } from 'lucide-react';

export default function LitigesPage() {
  const [targetType, setTargetType] = useState('Artisan / Travaux non terminés');
  const [opponentName, setOpponentName] = useState('');
  const [facts, setFacts] = useState('');
  const [amountClaimed, setAmountClaimed] = useState('');
  const [userHeader, setUserHeader] = useState('');
  const [copied, setCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const m = session?.user?.user_metadata || {};
      if (m.first_name || m.last_name) {
        setUserHeader(
          `${m.first_name || ''} ${m.last_name || ''}\n${m.address || ''}\n${m.postal_code || ''} ${m.city || ''}\n\n`
        );
      }
    });
  }, [supabase]);

  const formalNotice = `${userHeader}Destinataire : ${opponentName || '[Nom de la société / du destinataire]'}\nObjet : MISE EN DEMEURE AVANT SAISINE JUDICIAIRE (${targetType})\nLRAR — Articles 1217, 1231-1 et 1344 du Code civil\n\nMadame, Monsieur,\n\nJe vous adresse la présente mise en demeure concernant le litige suivant :\n${facts || '[Décrivez les faits à gauche pour compléter automatiquement ce paragraphe]'}\n\nEn vertu des articles 1103 et 1217 du Code civil, les contrats légalement formés tiennent lieu de loi à ceux qui les ont faits, et toute inexécution ou mauvaise exécution engage la responsabilité contractuelle de son auteur.\n\nPar conséquent, je vous mets formellement en demeure de régulariser la situation${
    amountClaimed ? ` et de procéder au règlement / remboursement de la somme de ${amountClaimed} €` : ''
  } dans un délai strict de 8 jours francs à compter de la réception de la présente.\n\nÀ défaut d'exécution dans ce délai, je saisirai sans nouvel avis le conciliateur de justice ainsi que la juridiction compétente aux fins d'obtenir l'exécution forcée ainsi que des dommages et intérêts.\n\nFait le ${"13/11/2026"}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase">
            Constructeur de Mise en Demeure sur mesure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <Gavel className="w-7 h-7 text-rose-400" /> Générateur de Dossier de Litige (Artisan, Syndic, Livraison)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Rédigez une mise en demeure officielle (Article 1344 du Code civil) à partir de vos propres faits pour contraindre un professionnel ou un tiers à s&apos;exécuter sous 8 jours.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Type de litige</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option>Artisan / Travaux non terminés ou malfaçons</option>
                <option>Syndic de copropriété / Bailleur inactif</option>
                <option>Vendeur automobile / Vice caché (Art. 1641 Code civil)</option>
                <option>Retard de livraison / Commande non remboursée</option>
                <option>Trouble anormal de voisinage</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Nom de l&apos;entreprise ou adversaire
                </label>
                <input
                  type="text"
                  placeholder="Ex : Société RénovPlus / Garage..."
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Somme réclamée en € (optionnel)
                </label>
                <input
                  type="number"
                  placeholder="Ex : 450"
                  value={amountClaimed}
                  onChange={(e) => setAmountClaimed(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Résumé des faits (dates, problème constaté) *
              </label>
              <textarea
                rows={4}
                placeholder="Ex : Malgré le versement d'un acompte le 12/09 et plusieurs relances, l'intervention prévue n'a pas été finalisée..."
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-rose-400">
                Aperçu en direct de votre Mise en Demeure
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                {formalNotice}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(formalNotice);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm flex items-center justify-center gap-2 transition"
            >
              {copied ? <><Check className="w-4 h-4" /> Mise en demeure copiée !</> : <><Copy className="w-4 h-4" /> Copier la mise en demeure officielle</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
