'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { KeyRound, Check, Copy, AlertTriangle, Calculator, ShieldCheck, Building2 } from 'lucide-react';

interface DeductionItem {
  id: string;
  label: string;
  amount: number;
  lawExplanation: string;
}

const COMMON_CLAIMS: DeductionItem[] = [
  {
    id: 'peinture',
    label: 'Peinture jaunie / papier peint défraîchi par le temps',
    amount: 450,
    lawExplanation: 'Illégal (Décret n° 2016-382) : l’usure normale et le jaunissement liés au temps relèvent de la vétusté à la charge exclusive du bailleur.',
  },
  {
    id: 'chevilles',
    label: 'Quelques trous de chevilles rebouchés proprement',
    amount: 180,
    lawExplanation: 'Abusif (Jurisprudence constante) : les menus aménagements rebouchés constituent un usage normal de la chose louée.',
  },
  {
    id: 'menage',
    label: 'Forfait ménage facturé sans devis ni facture acquittée',
    amount: 220,
    lawExplanation: 'Illégal (Art. 22 Loi du 6 juillet 1989) : aucune retenue forfaitaire n’est valable sans justificatif (devis ou facture) ET différence explicite entre l’état des lieux d’entrée et de sortie.',
  },
  {
    id: 'joints',
    label: 'Remplacement des joints silicone salle de bain',
    amount: 95,
    lawExplanation: 'Contesté si l’état des lieux d’entrée ne mentionnait pas des joints neufs ou si aucune facture d’artisan n’est produite.',
  },
];

export default function CautionPage() {
  const [depositPaid, setDepositPaid] = useState<number>(800);
  const [monthlyRent, setMonthlyRent] = useState<number>(800);
  const [yearsInFlat, setYearsInFlat] = useState<number>(3);
  const [monthsLate, setMonthsLate] = useState<number>(2);
  const [selectedIds, setSelectedIds] = useState<string[]>(['peinture', 'menage']);
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

  const toggleClaim = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const vetusteDiscount = Math.min(80, yearsInFlat * 12);
  const selectedClaims = COMMON_CLAIMS.filter((c) => selectedIds.includes(c.id));
  const abusiveTotal = selectedClaims.reduce((acc, c) => acc + c.amount, 0);
  const latePenalty = monthsLate * (monthlyRent * 0.1);
  const totalToRecover = depositPaid + latePenalty;

  const letterText = `${userHeader}Objet : Mise en demeure de restituer le dépôt de garantie (${totalToRecover.toFixed(0)} €) — Application de la vétusté et pénalité légale\nLRAR — Article 22 de la Loi n° 89-462 du 6 juillet 1989\n\nMadame, Monsieur,\n\nJe conteste formellement la retenue de ${abusiveTotal} € opérée sur mon dépôt de garantie de ${depositPaid} € après ${yearsInFlat} an(s) d'occupation.\n\n1. Sur la vétusté et les retenues infondées :\n${selectedClaims.map((c) => `- ${c.label} (${c.amount} €) : ${c.lawExplanation}`).join('\n')}\nDe surcroît, après ${yearsInFlat} années d'occupation, un abattement de vétusté de ${vetusteDiscount} % s'applique de plein droit.\n\n2. Sur la majoration légale de retard :\nConformément à l'article 22 alinéa 7 de la loi du 6 juillet 1989, tout retard de restitution entraîne une majoration de 10 % du loyer hors charges (${monthlyRent} €) par mois de retard commencé, soit +${latePenalty.toFixed(0)} € pour ${monthsLate} mois.\n\nJe vous mets donc en demeure de me virer la somme totale de ${totalToRecover.toFixed(0)} € sous 8 jours, avant saisine de la Commission Départementale de Conciliation et du Juge des contentieux de la protection.\n\nFait le ${"13/11/2026"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-950 text-white shadow-2xl border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80"
            alt="Pré-état des lieux et caution immobilière"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase">
                <Building2 className="w-3.5 h-3.5" /> Méthode Pré-État des Lieux par Max Esterle
              </span>
              <h1 className="text-2xl sm:text-4xl font-black flex items-center gap-2.5">
                <KeyRound className="w-8 h-8 text-emerald-400 shrink-0" /> Sauve-Caution & Grille de Vétusté
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Conçu à partir de l&apos;expérience terrain en gestion locative dans l&apos;Ouest Lyonnais : calculez l&apos;abattement de vétusté (Loi ALUR), annulez les retenues non justifiées et exigez les +10 % par mois de retard.
              </p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/15 p-6 rounded-3xl text-right shrink-0">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Somme légale exigible</div>
              <div className="text-3xl font-black text-white mt-1">{totalToRecover.toFixed(0)} €</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Caution ({depositPaid} €) + Pénalité (+{latePenalty.toFixed(0)} €)
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" /> 1. Paramètres de votre location
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Caution versée (€)</label>
                  <input
                    type="number"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Loyer hors charges (€)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Années dans le logement</label>
                  <input
                    type="number"
                    value={yearsInFlat}
                    onChange={(e) => setYearsInFlat(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Mois de retard</label>
                  <input
                    type="number"
                    value={monthsLate}
                    onChange={(e) => setMonthsLate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
                  />
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
                <span>Abattement de vétusté acquis ({yearsInFlat} ans) :</span>
                <span className="text-sm font-black">-{vetusteDiscount} % sur les matériaux</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                2. Cochez les retenues réclamées sur votre caution
              </h2>
              {COMMON_CLAIMS.map((c) => {
                const checked = selectedIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleClaim(c.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                      checked ? 'bg-emerald-50/70 border-emerald-600 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs sm:text-sm">{c.label}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black shrink-0">
                        {c.amount} € contestés
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c.lawExplanation}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Mise en demeure LRAR prête
                </span>
                <span className="text-xs text-slate-400">Art. 22 Loi du 6 juillet 1989</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                {letterText}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Courrier copié dans le presse-papier !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copier la mise en demeure ({totalToRecover.toFixed(0)} €)
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
