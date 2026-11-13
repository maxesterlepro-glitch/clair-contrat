import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  ArrowRight,
  ScanLine,
  KeyRound,
  Coins,
  GitCompare,
  Award,
  Flame,
  CheckCircle2,
  MapPin,
  Building2,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28">
      <Navbar />

      {/* HERO SECTION PREMIUM AVEC IMAGE HAUTE DÉFINITION */}
      <section className="relative overflow-hidden pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>LegalTech & FinTech Française • Fondée par Max Esterle</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
              Ne signez plus jamais un contrat ou un devis{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                à l&apos;aveugle.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Née dans l&apos;Ouest Lyonnais d&apos;une expérience directe sur le terrain immobilier et commercial, <strong>ClairContrat</strong> analyse vos contrats, baux, états des lieux et devis d&apos;artisans en 5 secondes pour neutraliser les clauses abusives et les surfacturations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/scan"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm inline-flex items-center gap-2.5 shadow-2xl shadow-blue-600/30 transition"
              >
                <ScanLine className="w-5 h-5" />
                <span>Lancer un diagnostic gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/fondateur"
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm inline-flex items-center gap-2 transition"
              >
                <span>Découvrir Max Esterle & notre mission</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">5 sec</div>
                <div className="text-xs text-slate-400">Diagnostic IA & Code civil</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">14 univers</div>
                <div className="text-xs text-slate-400">Immo, Auto, Devis, Cash & LRAR</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400">100 %</div>
                <div className="text-xs text-slate-400">Droit français (ALUR, Chatel)</div>
              </div>
            </div>
          </div>

          {/* Visuel Hero avec cartes superposées */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2.2rem] overflow-hidden border border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85"
                alt="Analyse juridique et immobilière ClairContrat"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase">
                    Alerte Rouge détectée
                  </span>
                  <span className="text-xs font-black text-emerald-400">Économie : 650 €</span>
                </div>
                <div className="text-sm font-black">
                  Retenue sur caution & devis plomberie (+48 % vs marché FR)
                </div>
                <p className="text-xs text-slate-300">
                  Courrier recommandé LRAR généré automatiquement avec l&apos;article 22 de la Loi du 6 juillet 1989.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FONDATEUR : MAX ESTERLE */}
      <section className="py-16 px-4 bg-slate-900/70 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
                alt="Immobilier et architecture Ouest Lyonnais"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-amber-400">Fondateur & Créateur</div>
                  <div className="text-lg font-black">Max Esterle</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Lyon / Ouest Lyonnais
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black uppercase">
              Pourquoi j&apos;ai créé ClairContrat
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              « Sur le terrain immobilier dans l&apos;Ouest Lyonnais, j&apos;ai vu trop de locataires, d&apos;acheteurs et de particuliers perdre des centaines d&apos;euros faute de connaître leurs droits. »
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Je m&apos;appelle <strong>Max Esterle</strong>. En travaillant au quotidien au cœur des transactions immobilières, de la location, de la gestion locative et des pré-états des lieux dans la région lyonnaise (Tassin-la-Demi-Lune, Marcy-l&apos;Étoile et l&apos;Ouest Lyonnais), j&apos;ai constaté une asymétrie flagrante : face à un contrat complexe, un état des lieux de sortie sévère ou un devis d&apos;artisan gonflé, le particulier est souvent démuni.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              J&apos;ai conçu <strong>ClairContrat</strong> pour mettre dans la poche de chacun un bouclier immédiat : une plateforme capable de décoder n&apos;importe quel document en 5 secondes, de vérifier les prix réels du marché français et de rédiger la riposte juridique exacte.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/fondateur"
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition"
              >
                <span>Lire l&apos;histoire complète de Max Esterle</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/caution"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 transition"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Tester l&apos;Arbitre de Caution & Pré-État des Lieux</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE VISUELLE DES UNIVERS DU SITE */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">
            Un Écosystème Complet
          </span>
          <h2 className="text-3xl font-black">Tous vos outils de défense réunis</h2>
          <p className="text-sm text-slate-400">
            Ouvrez la barre des tâches à tout moment avec le bouton en haut à droite (ou <kbd className="px-1.5 py-0.5 rounded bg-white/10">⌘K</kbd>) pour basculer entre nos univers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/scan" className="group rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-blue-500 transition flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
              alt="Scan de devis et contrats"
              className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                  1. Diagnostic 5 Secondes
                </span>
                <h3 className="text-lg font-black mt-2">Scanner IA Contrats & Devis</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Importez un PDF ou une photo : obtenez le Score sur 100, les Alertes Rouges (clauses illégales), les Alertes Oranges (prix gonflés) et le courrier de contre-attaque.
                </p>
              </div>
              <div className="pt-3 text-xs font-black text-blue-400 flex items-center gap-1">
                Ouvrir le Scanner <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          <Link href="/caution" className="group rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500 transition flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80"
              alt="Protection caution et bail immobilier"
              className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  2. Spécial Immobilier & Location
                </span>
                <h3 className="text-lg font-black mt-2">Sauve-Caution & Pré-État des Lieux</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Inspiré de la pratique immobilière : calculez la vétusté légale (Loi ALUR), contestez les retenues abusives et exigez les +10 % par mois de retard.
                </p>
              </div>
              <div className="pt-3 text-xs font-black text-emerald-400 flex items-center gap-1">
                Protéger mon dépôt de garantie <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          <Link href="/claircash" className="group rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-500 transition flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
              alt="Chasseur de primes ClairCash"
              className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  3. Pouvoir d&apos;Achat
                </span>
                <h3 className="text-lg font-black mt-2">ClairCash & Stop-Abonnements</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Croisez votre âge et votre code postal pour débloquer jusqu&apos;à 2 480 €/an d&apos;aides (Mobili-Jeune, permis, CAF) et résiliez vos abonnements Loi Chatel.
                </p>
              </div>
              <div className="pt-3 text-xs font-black text-amber-400 flex items-center gap-1">
                Calculer mes aides <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
