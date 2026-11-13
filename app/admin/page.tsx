'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { ShieldAlert, ShieldCheck, Users, Coins, Check, AlertTriangle, Lock } from 'lucide-react';

interface ProfileUser {
  id: string;
  credits_balance: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function verifyAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const email = session.user.email || '';
      // RESTRICTION STRICTE : Uniquement maxesterle.pro@gmail.com
      if (email.toLowerCase() === 'maxesterle.pro@gmail.com') {
        setIsAuthorized(true);

        // Chargement global de tous les profils de la plateforme
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');

        if (profiles) {
          setUsers(profiles as ProfileUser[]);
        }
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    }
    verifyAdmin();
  }, [router, supabase]);

  const handleUpdateCredits = async (userId: string, newBalance: number) => {
    const { error } = await supabase
      .from('profiles')
      .update({ credits_balance: newBalance })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, credits_balance: newBalance } : u));
      setMessage('Crédits mis à jour avec succès sur le profil utilisateur !');
      setTimeout(() => setMessage(null), 2500);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold">Vérification des droits administrateur...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black">Accès Restreint & Sécurisé</h1>
        <p className="text-sm text-slate-400 max-w-md">
          Cette zone d&apos;administration globale de ClairContrat est strictement réservée au créateur de la plateforme (<strong className="text-amber-400">maxesterle.pro@gmail.com</strong>).
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs"
        >
          Retourner au Tableau de Bord
        </button>
      </div>
    );
  }

  const totalCredits = users.reduce((acc, u) => acc + (u.credits_balance || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase">
              Panneau Administrateur Global — Max Esterle
            </span>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-amber-400" /> Administration ClairContrat OS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Gestion centralisée des utilisateurs, supervision des comptes et validation des recharges de crédits suite aux paiements PayPal (@667shop).
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Total Inscrits</div>
              <div className="text-2xl font-black text-white">{users.length}</div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <div className="text-[10px] font-bold uppercase text-slate-400">Crédits en circulation</div>
              <div className="text-2xl font-black text-amber-400">{totalCredits}</div>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> {message}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Base de données des utilisateurs ({users.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div>
                  <div className="text-xs text-slate-400 font-mono">ID Unique : {u.id}</div>
                  <div className="font-extrabold text-sm mt-0.5 text-slate-900">Compte Utilisateur actif</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-600">Crédits :</span>
                    <input
                      type="number"
                      value={u.credits_balance}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setUsers(users.map(item => item.id === u.id ? { ...item, credits_balance: val } : item));
                      }}
                      className="w-24 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-black text-center"
                    />
                  </div>

                  <button
                    onClick={() => handleUpdateCredits(u.id, u.credits_balance)}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-black text-xs transition shadow-sm"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
