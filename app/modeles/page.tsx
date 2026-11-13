'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Copy, Check, FileSpreadsheet } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'caution',
    title: 'Mise en demeure : Restitution du dépôt de garantie (Bail)',
    law: 'Article 22 de la Loi du 6 juillet 1989',
    subject: 'Mise en demeure de restituer le dépôt de garantie (majoration légale de 10%)',
    body: `Madame, Monsieur,\n\nSuite à l'état des lieux de sortie réalisé contradictoirement, le délai légal de restitution de mon dépôt de garantie prévu par l'article 22 de la loi n° 89-462 du 6 juillet 1989 est aujourd'hui dépassé.\n\nJe vous rappelle qu'à défaut de restitution dans les délais, le dépôt de garantie restant dû au locataire est majoré d'une somme égale à 10 % du loyer mensuel en principal, pour chaque période mensuelle commencée en retard.\n\nPar la présente, je vous mets en demeure de procéder au virement intégral sous 8 jours.`,
  },
  {
    id: 'chatel',
    title: 'Résiliation immédiate pour défaut d’information (Loi Chatel)',
    law: 'Article L215-1 du Code de la consommation',
    subject: 'Résiliation de plein droit pour non-respect de l’obligation d’information (Article L215-1)',
    body: `Madame, Monsieur,\n\nConformément à l'article L215-1 du Code de la consommation (Loi Chatel), vous aviez l'obligation de m'informer par écrit, au plus tôt 3 mois et au plus tard 1 mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire mon contrat.\n\nN'ayant pas reçu cet avis dans les délais légaux, je vous notifie par la présente la résiliation immédiate et sans frais de mon abonnement à compter de ce jour, et vous demande le remboursement des sommes prélevées postérieurement.`,
  },
  {
    id: 'devis',
    title: 'Contestation de surfacturation / Travaux non autorisés sur devis',
    law: 'Article L111-1 du Code de la consommation & Art. 1103 du Code civil',
    subject: 'Contestation de facturation excessive et absence d’accord préalable',
    body: `Madame, Monsieur,\n\nJe fais suite à la réception de votre document financier dont plusieurs lignes présentent un écart manifeste avec les tarifs moyens pratiqués ou n'ont pas fait l'objet d'un devis détaillé préalablement signé par mes soins.\n\nEn vertu de l'article L111-1 du Code de la consommation, aucune somme ne peut être exigée sans information précontractuelle loyale et accord exprès du client.\n\nJe vous demande par conséquent de bien vouloir réviser ce montant conformément aux prix usuels du marché.`,
  },
];

export default function ModelesPage() {
  const [selected, setSelected] = useState(TEMPLATES[0]);
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

  const fullText = `${userHeader}Objet : ${selected.subject}\nRéférence légale : ${selected.law}\n\n${selected.body}\n\nFait le ${"13/11/2026"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" /> Bibliothèque de Modèles LRAR pré-remplis
          </h1>
          <p className="text-sm text-slate-500">
            Modèles juridiques prêts à l&apos;emploi, automatiquement complétés avec vos coordonnées de profil.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  selected.id === t.id
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] font-bold text-blue-600">{t.law}</div>
                <div className="font-bold text-sm mt-1">{t.title}</div>
              </button>
            ))}
          </div>

          <div className="md:col-span-7 bg-slate-900 text-white p-6 rounded-3xl space-y-4">
            <div className="text-xs font-bold uppercase text-orange-400">Aperçu du courrier officiel</div>
            <div className="p-4 rounded-2xl bg-slate-800 text-sm whitespace-pre-line leading-relaxed text-slate-100">
              {fullText}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2"
            >
              {copied ? <><Check className="w-4 h-4 text-emerald-600" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le courrier complet</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
