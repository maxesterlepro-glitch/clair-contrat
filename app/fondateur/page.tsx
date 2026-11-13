import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  BadgeCheck,
  MapPin,
  Building2,
  Scale,
  ShieldCheck,
  KeyRound,
  ScanLine,
  ArrowRight,
  Award,
  Sparkles,
} from 'lucide-react';

export default function FondateurPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-10">
        {/* CARTE HERO FONDATEUR */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 text-white shadow-2xl border border-slate-800">
          <div className="grid md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-full">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85"
                alt="Architecture Lyon et Ouest Lyonnais"
                className="w-full h-80 md:h-full object-cover"
              />
            </div>
            <div className="md:col-span-7 p-8 sm:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black">
                <BadgeCheck className="w-4 h-4" /> Fondateur de ClairContrat
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Max Esterle
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Lyon & Ouest Lyonnais (Tassin-la-Demi-Lune • Marcy-l&apos;Étoile)
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Passionné par l&apos;immobilier, le commerce et l&apos;innovation digitale, j&apos;ai fondé <strong>ClairContrat</strong> avec une conviction simple : le droit et la transparence des prix ne doivent plus être réservés à ceux qui ont les moyens de payer un expert.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/scan"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs inline-flex items-center gap-2 transition"
                >
                  <ScanLine className="w-4 h-4" /> Tester le Scanner IA
                </Link>
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 transition"
                >
                  Accéder au Cockpit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* LES 3 PILIERS DE L'HISTOIRE */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black">1. L&apos;expérience du terrain immobilier</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              En évoluant directement dans les métiers de la vente, de la location et de la gestion locative dans l&apos;Ouest Lyonnais, j&apos;ai accompagné de nombreux locataires et propriétaires sur des sujets sensibles : baux d&apos;habitation, avis de valeur et surtout la mise en place de <strong>pré-états des lieux de sortie</strong> pour permettre aux locataires de récupérer 100 % de leur dépôt de garantie.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black">2. Le déclic face aux abus du quotidien</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Qu&apos;il s&apos;agisse d&apos;une retenue abusive sur caution pour une peinture jaunie par le temps, d&apos;un devis de garage gonflé de 40 % ou d&apos;un abonnement reconduit tacitement sans préavis (Loi Chatel), les particuliers signent ou paient trop souvent par crainte ou méconnaissance des textes légaux.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black">3. La réponse technologique ClairContrat</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Avec ClairContrat, j&apos;ai voulu réunir en une seule interface ultra-rapide un scanner de contrats, un comparateur de devis, un arbitre de caution immobilière, un inspecteur d&apos;annonces auto/immo et un générateur automatique de courriers recommandés (LRAR) pré-remplis.
            </p>
          </div>
        </div>

        {/* BANNIÈRE CITATION & ENGAGEMENT */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-black uppercase text-blue-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> L&apos;engagement ClairContrat par Max Esterle
            </div>
            <h3 className="text-xl font-black">
              Une plateforme claire, directe et tournée vers l&apos;action concrète.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pas de jargon théorique interminable : chaque outil de la plateforme est conçu pour vous donner un score immédiat, le texte de loi précis et le courrier prêt à envoyer en moins de 5 secondes.
            </p>
          </div>
          <Link
            href="/caution"
            className="px-6 py-4 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-black text-xs inline-flex items-center gap-2 shrink-0 transition"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Découvrir le module Sauve-Caution</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
