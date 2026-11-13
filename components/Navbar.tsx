'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  ShieldCheck,
  LayoutGrid,
  X,
  Home,
  LayoutDashboard,
  ScanLine,
  History,
  FileSpreadsheet,
  SearchCheck,
  Flame,
  Coins,
  CalendarClock,
  Award,
  KeyRound,
  GitCompare,
  Vault,
  User,
  Scale,
  LogOut,
  Sparkles,
  ChevronUp,
  BadgeCheck,
  Building,
  Gavel,
  Zap,
  ShieldAlert,
  ShoppingCart,
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allApps = [
    { href: "/admin", label: "Administration", desc: "Contrôle global & Crédits", icon: ShieldCheck, color: "from-amber-600 to-red-700", badge: "ADMIN" },
    { href: '/', label: 'Vitrine Accueil', desc: 'Présentation & Vision', icon: Home, color: 'from-slate-700 to-slate-950' },
    { href: '/fondateur', label: 'Max Esterle', desc: 'Fondateur & Histoire', icon: BadgeCheck, color: 'from-amber-500 to-yellow-600', badge: 'FONDATEUR' },
    { href: '/dashboard', label: 'Cockpit Global', desc: 'Tableau de bord', icon: LayoutDashboard, color: 'from-blue-600 to-indigo-800' },
    { href: '/scan', label: 'Scanner IA', desc: 'Contrats & Devis en 5s', icon: ScanLine, color: 'from-blue-500 to-blue-700', badge: 'IA' },
    { href: '/history', label: 'Mes Dossiers', desc: 'Archives personnelles', icon: History, color: 'from-cyan-600 to-blue-700' },
    { href: '/factures', label: 'ClairFacture', desc: 'Audit factures énergie & box', icon: Zap, color: 'from-yellow-500 to-amber-700', badge: 'NEW' },
    { href: '/recouvrement', label: 'Anti-Harcèlement', desc: 'Bouclier recouvrement abusif', icon: ShieldAlert, color: 'from-rose-600 to-red-800', badge: 'PRO' },
    { href: '/cgv-check', label: 'Audit CGV E-shop', desc: 'Détecteur pièges e-commerce', icon: ShoppingCart, color: 'from-indigo-600 to-violet-800', badge: 'WEB' },
    { href: '/caution', label: 'Sauve-Caution', desc: 'Vétusté & +10%/mois', icon: KeyRound, color: 'from-emerald-600 to-teal-700', badge: 'IMMO' },
    { href: '/loyer', label: 'Audit Loyer & Agence', desc: 'Plafond ALUR & DPE', icon: Building, color: 'from-teal-500 to-cyan-700' },
    { href: '/comparateur', label: 'Duel de Devis', desc: 'Devis A vs Devis B', icon: GitCompare, color: 'from-violet-600 to-purple-700' },
    { href: '/annonces', label: 'ClairCheck Annonces', desc: 'Auto & Immobilier', icon: SearchCheck, color: 'from-indigo-600 to-blue-700' },
    { href: '/claircash', label: 'ClairCash Aides', desc: 'Chasseur de primes', icon: Coins, color: 'from-emerald-500 to-green-700', badge: '€€' },
    { href: '/abonnements', label: 'Stop-Abos', desc: 'Espace vierge Loi Chatel', icon: CalendarClock, color: 'from-fuchsia-600 to-purple-700' },
    { href: '/coffre', label: 'Coffre Garanties', desc: 'SAV 2 ans personnel', icon: Vault, color: 'from-amber-600 to-orange-600' },
    { href: '/litiges', label: 'Dossier Litiges', desc: 'Artisan, Syndic, Voisin', icon: Gavel, color: 'from-red-600 to-rose-800' },
    { href: '/tarifs', label: 'Boutique Crédits', desc: 'Recharger mon compte', icon: Coins, color: 'from-amber-500 to-amber-700', badge: 'PAY' },
    { href: '/modeles', label: 'Modèles LRAR', desc: 'Courriers officiels', icon: FileSpreadsheet, color: 'from-slate-600 to-slate-800' },
  ];

  const currentApp = allApps.find((a) => pathname === a.href) || allApps[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <div className="sticky top-0 z-40 px-4 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 text-white backdrop-blur-xl border border-white/15 shadow-xl hover:scale-[1.02] transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-sm tracking-tight block">
                Clair<span className="text-blue-400">Contrat</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 block">
                Par Max Esterle
              </span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">{currentApp.label}</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="pointer-events-auto inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-slate-950/90 hover:bg-blue-600 text-white backdrop-blur-xl border border-white/15 text-xs font-black shadow-xl transition-all active:scale-95"
          >
            {isOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4 text-amber-400" />}
            <span>{isOpen ? 'Fermer le Menu' : 'Menu & Univers (19)'}</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-slate-300 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {!isOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950/95 hover:bg-blue-600 text-white backdrop-blur-2xl border border-white/20 shadow-2xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition" />
            <span className="text-xs font-black tracking-wide">Barre des Tâches (19 univers)</span>
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:-translate-y-0.5 transition" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex-1" onClick={() => setIsOpen(false)} />

          <div className="w-full max-w-7xl mx-auto px-4 pb-6">
            <div className="rounded-[2.2rem] bg-slate-950/95 border border-white/15 text-white p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <LayoutGrid className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-black tracking-tight">
                      Barre des Tâches Horizontale — ClairContrat OS
                    </div>
                    <div className="text-xs text-slate-400">
                      Faites défiler horizontalement et cliquez sur une application
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/fondateur"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1.5 transition"
                  >
                    <BadgeCheck className="w-4 h-4" /> Max Esterle
                  </Link>
                  <Link
                    href="/profil"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" /> Mon Profil
                  </Link>
                  <Link
                    href="/mentions-legales"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-400" /> Mentions Légales
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sortir
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-2">
                {allApps.map((app) => {
                  const Icon = app.icon;
                  const active = pathname === app.href;
                  return (
                    <Link
                      key={app.href}
                      href={app.href}
                      onClick={() => setIsOpen(false)}
                      className={`group relative flex flex-col items-center justify-center min-w-[115px] p-4 rounded-2xl border transition-all shrink-0 ${
                        active
                          ? 'bg-white text-slate-950 border-white scale-105 shadow-xl'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 hover:-translate-y-1'
                      }`}
                    >
                      {app.badge && (
                        <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow">
                          {app.badge}
                        </span>
                      )}
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center mb-2.5 shadow-lg group-hover:scale-110 transition`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-center leading-tight">
                        {app.label}
                      </span>
                      <span
                        className={`text-[10px] mt-1 text-center line-clamp-1 ${
                          active ? 'text-slate-600 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {app.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
