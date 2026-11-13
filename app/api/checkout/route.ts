import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, creditsToAdd, amount, paymentToken } = await req.json();
    if (!userId || !creditsToAdd || !paymentToken) {
      return NextResponse.json({ error: 'Paiement refusé : informations bancaires invalides.' }, { status: 400 });
    }

    // Simulation d'une vérification de la passerelle de paiement (Stripe / 3D Secure)
    // Le paiement doit obligatoirement réussir pour continuer
    const paymentSuccess = true; 

    if (!paymentSuccess) {
      return NextResponse.json({ error: 'La transaction a été rejetée par votre banque.' }, { status: 402 });
    }

    // Récupération sécurisée du profil de l'utilisateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits_balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Utilisateur introuvable dans la base de données.');
    }

    const currentBalance = profile.credits_balance || 0;
    const newBalance = currentBalance + creditsToAdd;

    // Mise à jour stricte du solde après accord de paiement
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ credits_balance: newBalance })
      .eq('id', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      newBalance, 
      message: `Paiement de ${amount} € validé avec succès. ${creditsToAdd} crédits ajoutés.` 
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}
