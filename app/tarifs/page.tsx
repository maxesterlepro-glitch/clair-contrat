'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Coins, Sparkles, Check, Zap, ExternalLink, X, ShieldCheck, Mail } from 'lucide-react';

export default function TarifsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<{ credits: number; price: number; name: string } | null>(null);
  const [orderSent, setOrderSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUserEmail(session.user.email || null);
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', session.user.id)
        .single();
      if (profile) setCurrentCredits(profile.credits_balance);
    }
    loadUser();
  }, [router, supabase]);

  const handleOpenPayPal = () => {
    if (!selectedPlan || !userEmail) return;
    
    // URL PayPal.me officielle avec le montant exact
    const paypalUrl = `https://paypal.me/667shop/${selectedPlan.price}EUR`;
    
    // Ouvre PayPal dans un nouvel onglet
    window.open(paypalUrl, '_blank');
    setOrderSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-black uppercase">
            Boutique Officielle — Redirection PayPal (@667shop)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Achetez des Crédits d&apos;Analyse
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Le paiement s&apos;effectue directement sur ton PayPal <strong>@667shop</strong>. Dès que Max valide les fonds, les crédits sont ajoutés à ton compte. Solde actuel : <strong className="text-blue-600">{currentCredits} crédit(s)</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pack 5 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-400">Pack Essentiel</span>
                <Coins className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-black">5 Crédits</div>
                <div className="text-xs text-slate-400 mt-0.5">Idéal pour un contrôle ponctuel</div>
              </div>
              <div className="text-2xl font-black text-blue-600">4,99 €</div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 5 analyses complètes</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Validation manuelle par Max</li>
              </ul>
            </div>
            <button
              onClick={() => { setSelectedPlan({ credits: 5, price: 4.99, name: 'Pack Essentiel (5 Crédits)' }); setOrderSent(false); }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-xs transition"
            >
              Payer 4,99 € via PayPal
            </button>
          </div>

          {/* Pack 20 */}
          <div className="bg-slate-950 text-white p-7 rounded-3xl shadow-xl border-2 border-blue-600 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-black uppercase">
              LE + POPULAIRE
            </span>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-blue-400">Pack Pro</span>
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-3xl font-black">20 Crédits</div>
                <div className="text-xs text-slate-400 mt-0.5">Pour sécuriser tous vos baux & devis</div>
              </div>
              <div className="text-2xl font-black text-amber-400">14,99 €</div>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 20 analyses complètes</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Validation manuelle par Max</li>
              </ul>
            </div>
            <button
              onClick={() => { setSelectedPlan({ credits: 20, price: 14.99, name: 'Pack Pro (20 Crédits)' }); setOrderSent(false); }}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-lg shadow-blue-600/30"
            >
              Payer 14,99 € via PayPal
            </button>
          </div>

          {/* Pack 50 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-400">Pack Expert</span>
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-black">50 Crédits</div>
                <div className="text-xs text-slate-400 mt-0.5">Pour les pros & gros dossiers</div>
              </div>
              <div className="text-2xl font-black text-emerald-600">29,99 €</div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 50 analyses complètes</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Validation manuelle par Max</li>
              </ul>
            </div>
            <button
              onClick={() => { setSelectedPlan({ credits: 50, price: 29.99, name: 'Pack Expert (50 Crédits)' }); setOrderSent(false); }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition"
            >
              Payer 29,99 € via PayPal
            </button>
          </div>
        </div>

        {/* MODALE DE REDIRECTION PAYPAL */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-slate-950 border border-white/20 text-white rounded-[2.5rem] p-8 shadow-2xl relative space-y-6">
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-400">Redirection PayPal.me</span>
                  <h3 className="text-xl font-black">{selectedPlan.name}</h3>
                </div>
                <div className="text-xl font-black text-emerald-400">{selectedPlan.price} €</div>
              </div>

              {!orderSent ? (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                    <p>En cliquant ci-dessous, tu vas être redirigé vers le PayPal sécurisé de <strong>@667shop</strong>.</p>
                    <p className="text-amber-300 font-bold">Important : Mets bien ton email ({userEmail}) en commentaire du paiement PayPal pour que Max te crédite rapidement !</p>
                  </div>

                  <button
                    onClick={handleOpenPayPal}
                    className="w-full py-4 rounded-2xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition"
                  >
                    <ExternalLink className="w-4 h-4" /> Ouvrir PayPal.me/667shop ({selectedPlan.price} €)
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-bold text-sm">Redirection PayPal effectuée !</p>
                    <p>Dès que Max aura vérifié l&apos;arrivée des fonds sur <strong>@667shop</strong>, tes <strong>{selectedPlan.credits} crédits</strong> apparaîtront sur ton compte.</p>
                  </div>

                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                  >
                    Fermer cette fenêtre
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
