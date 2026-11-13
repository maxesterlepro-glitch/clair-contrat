'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { CalendarClock, Plus, Trash2, Scissors, Copy, Check, AlertCircle, FolderOpen } from 'lucide-react';

interface SubItem {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  noticeMonth: string;
}

export default function AbonnementsPage() {
  const [userId, setUserId] = useState<string>('guest');
  const [subs, setSubs] = useState<SubItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Salle de sport / Loisirs');
  const [newPrice, setNewPrice] = useState('');
  const [selectedSub, setSelectedSub] = useState<SubItem | null>(null);
  const [userHeader, setUserHeader] = useState('');
  const [copied, setCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Charge uniquement les abonnements créés par CET utilisateur (100% vierge à la création du compte)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id || 'guest';
      setUserId(uid);

      const saved = localStorage.getItem(`claircontrat_subs_${uid}`);
      if (saved) {
        const parsed: SubItem[] = JSON.parse(saved);
        setSubs(parsed);
        if (parsed.length > 0) setSelectedSub(parsed[0]);
      } else {
        setSubs([]);
        setSelectedSub(null);
      }

      const m = session?.user?.user_metadata || {};
      if (m.first_name || m.last_name) {
        setUserHeader(
          `${m.first_name || ''} ${m.last_name || ''}\n${m.address || ''}\n${m.postal_code || ''} ${m.city || ''}\n\n`
        );
      }
    });
  }, [supabase]);

  const saveSubs = (nextList: SubItem[]) => {
    setSubs(nextList);
    localStorage.setItem(`claircontrat_subs_${userId}`, JSON.stringify(nextList));
  };

  const addSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;
    const item: SubItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      category: newCategory,
      monthlyPrice: parseFloat(newPrice),
      noticeMonth: 'Protection Loi Chatel (Art. L215-1) & Loi Hamon',
    };
    const nextList = [item, ...subs];
    saveSubs(nextList);
    setSelectedSub(item);
    setNewName('');
    setNewPrice('');
  };

  const removeSub = (id: string) => {
    const nextList = subs.filter((s) => s.id !== id);
    saveSubs(nextList);
    if (selectedSub?.id === id) {
      setSelectedSub(nextList[0] || null);
    }
  };

  const totalMonthly = subs.reduce((acc, s) => acc + s.monthlyPrice, 0);
  const totalYearly = totalMonthly * 12;

  const letterText = selectedSub
    ? `${userHeader}Objet : Notification officielle de résiliation du contrat « ${selectedSub.name} »\nRéférence légale : Articles L215-1 (Loi Chatel) et L113-15-2 (Loi Hamon) du Code de la consommation\n\nMadame, Monsieur,\n\nPar la présente, je vous notifie ma décision de résilier mon abonnement « ${selectedSub.name} » (${selectedSub.monthlyPrice.toFixed(2)} € / mois).\n\nConformément aux dispositions protectrices du Code de la consommation, je vous demande de prendre acte de cette résiliation dès réception de ce courrier, d'interrompre tout prélèvement SEPA associé et de m'adresser une confirmation écrite de clôture.\n\nFait le ${"13/11/2026"}`
    : '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase">
              Espace Personnel — Radar Loi Chatel & Loi Hamon
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2">
              <CalendarClock className="w-7 h-7 text-purple-400" /> Mes Abonnements & Résiliations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Ajoutez uniquement vos propres abonnements actifs pour calculer votre dépense annuelle réelle et générer vos lettres de résiliation officielles en un clic.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-right shrink-0">
            <div className="text-[10px] font-bold uppercase text-purple-300">Votre coût annuel</div>
            <div className="text-3xl font-black text-white">{totalYearly.toFixed(0)} € / an</div>
            <div className="text-xs text-slate-400">
              {subs.length} abonnement(s) • {totalMonthly.toFixed(2)} € / mois
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={addSub} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-black uppercase text-slate-400">
                Ajouter un abonnement à mon espace
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nom (ex: Assurance, Box, Salle...)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  <option>Salle de sport / Loisirs</option>
                  <option>Assurance Auto / Habitation</option>
                  <option>Box Internet / Forfait Mobile</option>
                  <option>Streaming / Logiciel</option>
                  <option>Autre contrat à reconduction</option>
                </select>
              </div>
              <div className="flex gap-2.5">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Montant mensuel en € (ex: 29.90)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 shrink-0 transition"
                >
                  <Plus className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </form>

            {subs.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-extrabold text-sm text-slate-700">
                  Votre liste d&apos;abonnements est vierge
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Utilisez le formulaire ci-dessus pour ajouter votre premier abonnement et générer automatiquement votre courrier de résiliation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {subs.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSub(s)}
                    className={`p-5 rounded-3xl border cursor-pointer transition flex items-center justify-between ${
                      selectedSub?.id === s.id
                        ? 'bg-purple-50/70 border-purple-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {s.category}
                      </span>
                      <div className="font-extrabold text-sm mt-1">{s.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-purple-600" /> {s.noticeMonth}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-sm">{s.monthlyPrice.toFixed(2)} €/m</div>
                        <div className="text-[11px] font-bold text-rose-600">
                          {(s.monthlyPrice * 12).toFixed(0)} € / an
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSub(s.id);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600"
                        title="Supprimer cet abonnement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4" /> Courrier de Résiliation Express
                </span>
                <span className="text-xs text-slate-400">Pré-rempli avec vos coordonnées</span>
              </div>

              {selectedSub ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                  {letterText}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400">
                  Ajoutez un abonnement à gauche pour générer instantanément son courrier de résiliation officiel.
                </div>
              )}
            </div>

            {selectedSub && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(letterText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Courrier copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copier la lettre de résiliation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
