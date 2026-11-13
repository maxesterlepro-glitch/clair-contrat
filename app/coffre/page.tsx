'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '@/components/Navbar';
import { Vault, Plus, ShieldCheck, Copy, Check, Trash2, Sparkles, FolderOpen } from 'lucide-react';

interface WarrantyItem {
  id: string;
  product: string;
  store: string;
  price: string;
  purchaseDate: string;
}

export default function CoffrePage() {
  const [userId, setUserId] = useState<string>('guest');
  const [items, setItems] = useState<WarrantyItem[]>([]);
  const [product, setProduct] = useState('');
  const [store, setStore] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState("2026-11-13");
  const [selected, setSelected] = useState<WarrantyItem | null>(null);
  const [userHeader, setUserHeader] = useState('');
  const [copied, setCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Démarre 100% vierge pour chaque nouvel utilisateur
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id || 'guest';
      setUserId(uid);

      const saved = localStorage.getItem(`claircontrat_warranties_${uid}`);
      if (saved) {
        const parsed: WarrantyItem[] = JSON.parse(saved);
        setItems(parsed);
        if (parsed.length > 0) setSelected(parsed[0]);
      } else {
        setItems([]);
        setSelected(null);
      }

      const m = session?.user?.user_metadata || {};
      if (m.first_name || m.last_name) {
        setUserHeader(
          `${m.first_name || ''} ${m.last_name || ''}\n${m.address || ''}\n${m.postal_code || ''} ${m.city || ''}\n\n`
        );
      }
    });
  }, [supabase]);

  const saveItems = (nextList: WarrantyItem[]) => {
    setItems(nextList);
    localStorage.setItem(`claircontrat_warranties_${userId}`, JSON.stringify(nextList));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) return;
    const next: WarrantyItem = {
      id: Date.now().toString(),
      product: product.trim(),
      store: store.trim() || 'Vendeur professionnel',
      price: price ? `${price} €` : 'Prix sur facture',
      purchaseDate,
    };
    const nextList = [next, ...items];
    saveItems(nextList);
    setSelected(next);
    setProduct('');
    setStore('');
    setPrice('');
  };

  const removeItem = (id: string) => {
    const nextList = items.filter((i) => i.id !== id);
    saveItems(nextList);
    if (selected?.id === id) {
      setSelected(nextList[0] || null);
    }
  };

  const savLetter = selected
    ? `${userHeader}Objet : Mise en demeure d'appliquer la Garantie Légale de Conformité (24 mois) — ${selected.product}\nLRAR — Articles L217-3 à L217-20 du Code de la consommation\n\nMadame, Monsieur (${selected.store}),\n\nMon produit « ${selected.product} » acquis le ${selected.purchaseDate} (${selected.price}) présente un défaut de conformité apparu dans le délai légal de 24 mois.\n\nConformément à l'article L217-7 du Code de la consommation, tout défaut apparaissant dans un délai de 24 mois à compter de la délivrance du bien est présumé exister au moment de la délivrance, sans que j'aie à en rapporter la preuve technique.\n\nEn application de l'article L217-8, je vous mets en demeure de procéder sans aucun frais (ni de pièces, ni de main-d'œuvre, ni d'expédition) à la réparation ou au remplacement à neuf de mon bien sous 30 jours, ou à défaut, à son remboursement intégral.\n\nFait le ${"13/11/2026"}`
    : '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-slate-950 text-white p-8 rounded-[2.2rem] shadow-xl border border-slate-800">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Espace Personnel — Garantie Légale de 2 Ans (Art. L217-3)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2.5">
            <Vault className="w-7 h-7 text-amber-400 shrink-0" /> Mon Coffre-Fort des Garanties SAV
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Enregistrez vos achats importants (électroménager, informatique, équipement) pour suivre leur période de garantie obligatoire de 24 mois et générer une mise en demeure de remplacement à neuf en cas de panne.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={addItem} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-black uppercase text-slate-400">
                Enregistrer un nouvel achat sous garantie
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nom de l'appareil / bien *"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Enseigne / Vendeur"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-2.5">
                <input
                  type="number"
                  placeholder="Prix d'achat (€)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 transition"
                >
                  <Plus className="w-4 h-4" /> Protéger
                </button>
              </div>
            </form>

            {items.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-extrabold text-sm text-slate-700">
                  Votre coffre de garanties est vierge
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ajoutez un appareil ci-dessus pour activer le suivi de garantie légale de 24 mois et débloquer le courrier SAV.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`p-5 rounded-3xl border cursor-pointer transition flex items-center justify-between ${
                      selected?.id === item.id ? 'bg-amber-50/80 border-amber-500 shadow-sm' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-sm">{item.product}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.store} • Achat : {item.purchaseDate} • {item.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 24 mois
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600"
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
              <div className="text-xs font-black uppercase text-amber-400">
                Mise en demeure SAV & Remplacement à neuf (Art. L217-3)
              </div>
              {selected ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                  {savLetter}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400">
                  Enregistrez un produit à gauche pour générer automatiquement votre mise en demeure SAV.
                </div>
              )}
            </div>
            {selected && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(savLetter);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition"
              >
                {copied ? <><Check className="w-4 h-4" /> Courrier SAV copié !</> : <><Copy className="w-4 h-4" /> Copier la réclamation SAV gratuite</>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
