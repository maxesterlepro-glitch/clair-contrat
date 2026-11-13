'use content';
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ShieldAlert, Copy, Check, AlertTriangle } from 'lucide-react';

export default function RecouvrementPage() {
  const [agencyName, setAgencyName] = useState('');
  const [threatType, setThreatType] = useState('Appels répétés / SMS comminatoires / Menaces de saisie sans titre exécutoire');
  const [copied, setCopied] = useState(false);

  const letterText = `Objet : MISE EN DEMEURE CESSATION DE PRESSIONS ILLÉGALES ET HARCÈLEMENT\nRéférence légale : Article 32-1 de la Loi n° 91-650 du 22 juillet 1991 & Article 222-16 du Code pénal\n\nMadame, Monsieur (${agencyName || 'Société de recouvrement'}),\n\nVous multipliez à mon encontre des méthodes comminatoires contraires à la loi française. Je vous rappelle qu'en l'absence de titre exécutoire délivré par un juge, aucune saisie ne peut être pratiquée.\n\nDe surcroît, l'application de frais de recouvrement non prévus dans le contrat initial est formellement interdite par la loi (Art. L111-8 du Code des procédures civiles d'exécution).\n\nPar la présente, je vous mets en demeure de cesser immédiatement toute pression, appel ou courrier intimidant, sous peine de porter plainte auprès du Procureur de la République pour harcèlement et méthodes illégales.\n\nFait le 13/11/2026`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase">
            Bouclier Anti-Harcèlement & Recouvrement Abusif
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-rose-400" /> Contre les Pressions & Frais Illégaux
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Générez une mise en demeure sous peine de poursuites pénales face aux sociétés de recouvrement ou créanciers violant la loi de 1991.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nom de l&apos;organisme / société</label>
              <input
                type="text"
                placeholder="Ex : Intrum, MCS et Associés..."
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Méthode abusive constatée</label>
              <select
                value={threatType}
                onChange={(e) => setThreatType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option>Appels répétés / SMS comminatoires / Menaces de saisie sans juge</option>
                <option>Facturation illégale de frais de recouvrement</option>
                <option>Harcèlement au domicile ou lieu de travail</option>
              </select>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
              <strong className="block font-black">Rappel juridique :</strong>
              <span>Aucune société de recouvrement n&apos;a le droit de vous facturer des frais de mise en demeure. Seul un huissier muni d&apos;un jugement peut pratiquer une saisie.</span>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-rose-400">Mise en demeure cessation de harcèlement</div>
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
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 transition"
            >
              {copied ? <><Check className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier la mise en demeure pénale</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
