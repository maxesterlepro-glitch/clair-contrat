'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Building, Check, Copy, AlertOctagon, CheckCircle2, Calculator } from 'lucide-react';

export default function LoyerPage() {
  const [surface, setSurface] = useState<string>('');
  const [zone, setZone] = useState<'tr_tendue' | 'tendue' | 'reste'>('tendue');
  const [agencyFeesPaid, setAgencyFeesPaid] = useState<string>('');
  const [dpe, setDpe] = useState<'A_E' | 'F_G'>('A_E');
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

  const surfNum = parseFloat(surface) || 0;
  const feesNum = parseFloat(agencyFeesPaid) || 0;

  // Plafonds Loi ALUR : 12€/m² (zone très tendue) + 3€/m² EDL = 15€/m² max
  // Zone tendue (ex: Lyon / Villeurbanne / Tassin) : 10€/m² + 3€/m² EDL = 13€/m² max
  // Reste de la France : 8€/m² + 3€/m² EDL = 11€/m² max
  const ratePerSqm = zone === 'tr_tendue' ? 15 : zone === 'tendue' ? 13 : 11;
  const legalMaxFees = surfNum * ratePerSqm;
  const overchargedFees = Math.max(0, feesNum - legalMaxFees);

  const letterText = `${userHeader}Objet : Demande de remboursement du trop-perçu d'honoraires de location (Plafond Loi ALUR)${
    dpe === 'F_G' ? ' et contestation de révision de loyer (Passoire énergétique DPE F/G)' : ''
  }\nRéférence légale : Article 5 de la Loi n° 89-462 du 6 juillet 1989 & Décret n° 2014-890\n\nMadame, Monsieur,\n\nLors de la signature du bail pour mon logement d'une surface habitable de ${surfNum} m², vous m'avez facturé la somme de ${feesNum.toFixed(2)} € TTC au titre des honoraires de location et d'état des lieux.\n\nOr, conformément au décret n° 2014-890 pris en application de la loi ALUR, le plafond légal maximal applicable à ma zone géographique (${ratePerSqm} € TTC / m² état des lieux inclus) s'élève à ${legalMaxFees.toFixed(2)} € TTC.\n\nJe constate donc un dépassement illégal de ${overchargedFees.toFixed(2)} € TTC dont je vous demande le remboursement intégral sous 8 jours.${
    dpe === 'F_G'
      ? `\n\nPar ailleurs, le logement étant classé ${dpe.replace('_', ' ou ')} au DPE, je vous rappelle qu'en application de l'article 17-1 III de la loi du 6 juillet 1989 (Loi Climat et Résilience), toute révision ou augmentation annuelle du loyer (IRL) est formellement interdite.`
      : ''
  }\n\nFait le ${"13/11/2026"}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase">
            Audit Immobilier — Loi ALUR & Loi Climat
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <Building className="w-7 h-7 text-cyan-400" /> Vérificateur de Frais d&apos;Agence & Gel des Loyers (DPE)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Vérifiez en 10 secondes si votre agence immobilière a dépassé le plafond légal au m² (Loi ALUR) ou si votre propriétaire augmente illégalement un logement classé F ou G.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-cyan-600" /> Entrez les données de votre bail
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Surface habitable (m²) *</label>
                <input
                  type="number"
                  placeholder="Ex : 45"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Frais d&apos;agence payés (€) *</label>
                <input
                  type="number"
                  placeholder="Ex : 720"
                  value={agencyFeesPaid}
                  onChange={(e) => setAgencyFeesPaid(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Zone géographique du logement</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as 'tr_tendue' | 'tendue' | 'reste')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option value="tendue">Zone Tendue — Lyon, Ouest Lyonnais, Bordeaux, Nantes... (Max 13 €/m²)</option>
                <option value="tr_tendue">Zone Très Tendue — Paris & Île-de-France (Max 15 €/m²)</option>
                <option value="reste">Reste de la France (Max 11 €/m²)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Classe énergétique DPE du logement</label>
              <select
                value={dpe}
                onChange={(e) => setDpe(e.target.value as 'A_E' | 'F_G')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option value="A_E">Classe A, B, C, D ou E (Logement conforme)</option>
                <option value="F_G">Classe F ou G — Passoire thermique (Gel total des loyers obligatoire)</option>
              </select>
            </div>

            {surfNum > 0 && feesNum > 0 && (
              <div
                className={`p-4 rounded-2xl border ${
                  overchargedFees > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                {overchargedFees > 0 ? (
                  <div className="flex items-start gap-2.5">
                    <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-black text-sm">
                        Trop-perçu illégal détecté : +{overchargedFees.toFixed(2)} € !
                      </div>
                      <p>
                        Pour {surfNum} m², le plafond légal maximal (visite, dossier, rédaction de bail et état des lieux inclus) est de <strong>{legalMaxFees.toFixed(2)} €</strong>. Vous pouvez exiger le remboursement immédiat.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Les frais d&apos;agence respectent le plafond légal ALUR ({legalMaxFees.toFixed(2)} € max).</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-cyan-400">
                Courrier de réclamation Loi ALUR / DPE
              </div>
              {surfNum > 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                  {letterText}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400">
                  Renseignez la surface en m² et les frais payés à gauche pour calculer automatiquement le plafond légal et générer votre courrier.
                </div>
              )}
            </div>

            {surfNum > 0 && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(letterText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition"
              >
                {copied ? <><Check className="w-4 h-4" /> Courrier copié !</> : <><Copy className="w-4 h-4" /> Copier la demande de remboursement</>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
