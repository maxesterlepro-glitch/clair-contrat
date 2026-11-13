import Navbar from '@/components/Navbar';
import { Scale, ShieldAlert, Lock, FileCheck, UserCheck } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Scale className="w-7 h-7 text-blue-600" />
            <div>
              <h1 className="text-2xl font-extrabold">Mentions Légales, CGU & Avertissement Juridique</h1>
              <p className="text-xs text-slate-500">Conformité Loi n° 2004-575 (LCEN), RGPD et Loi du 31 décembre 1971</p>
            </div>
          </div>

          <section className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5">
            <h2 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Éditeur & Fondateur de la plateforme
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              La plateforme web et application <strong>ClairContrat</strong> est éditée et développée par <strong>Max Esterle</strong> (Fondateur et Directeur de la publication), Région Auvergne-Rhône-Alpes — Grand Lyon / Ouest Lyonnais, France.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <h2 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> 1. Avertissement important : Absence de consultation juridique (Loi du 31 décembre 1971)
            </h2>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              L&apos;application <strong>ClairContrat</strong> est un outil technologique d&apos;analyse documentaire automatisée par intelligence artificielle et de vulgarisation d&apos;informations juridiques publiques. Conformément aux articles 54 et suivants de la loi n° 71-1130 du 31 décembre 1971, <strong>ClairContrat n&apos;est pas un cabinet d&apos;avocats</strong>, ne délivre aucune consultation juridique personnalisée et ne rédige pas d&apos;actes sous seing privé pour autrui. Les scores, alertes et modèles de courriers générés le sont à titre strictement informatif et indicatif. Pour tout litige complexe ou procédure judiciaire, l&apos;utilisateur est invité à consulter un avocat inscrit au Barreau.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" /> 2. Limitation de responsabilité sur les comparaisons de prix
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Les « Alertes Oranges » comparent les montants figurant sur les devis soumis avec des moyennes statistiques nationales estimées par intelligence artificielle. Ces estimations ne tiennent pas compte des spécificités techniques locales, de l&apos;urgence de l&apos;intervention ou de la complexité particulière du chantier, et ne sauraient engager la responsabilité de l&apos;éditeur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" /> 3. Protection des données personnelles (RGPD)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Les informations collectées lors de l&apos;inscription (Nom, Prénom, Date de naissance, Adresse postale, Code postal, Email) sont utilisées exclusivement pour la gestion du compte utilisateur et le pré-remplissage automatique des modèles de courriers. L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de modification (via la page « Mon Profil ») et de suppression immédiate de ses documents scannés (via la page « Mes Dossiers »), conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
