import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { age = 20, postalCode = '69000', city = 'Lyon', status = 'Alternant / Apprenti', housing = 'Locataire', transport = 'Voiture' } = body;

  const fallbackResult = {
    totalEstimatedYearly: '2 480 € / an',
    profileSummary: `Profil ${status} (${age} ans) résidant à ${city} (${postalCode}) — Situation : ${housing}`,
    grants: [
      {
        id: '1',
        title: 'Aide Mobili-Jeune (Spécial Alternant / Apprenti)',
        organism: 'Action Logement',
        amount: 'Jusqu’à 1 100 € / an (100 € / mois)',
        probability: 'ÉLEVÉE',
        whyEligible: `Vous avez ${age} ans (moins de 30 ans) et êtes en contrat d’alternance/apprentissage avec un loyer ou une charge de logement.`,
        howToClaim: 'Créez votre dossier sur mobilijeune.actionlogement.fr avec votre contrat d’alternance et votre bail ou quittance.',
      },
      {
        id: '2',
        title: 'Aide nationale au financement du Permis B',
        organism: 'État / Opco / CFA',
        amount: '500 € versés directement',
        probability: 'ÉLEVÉE',
        whyEligible: 'Aide forfaitaire accordée aux apprentis et alternants majeurs pour financer ou rembourser le permis de conduire.',
        howToClaim: 'Transmettez la facture de l’auto-école et votre pièce d’identité au secrétariat de votre CFA / école.',
      },
      {
        id: '3',
        title: 'Prime d’Activité & Complément Jeune Actif',
        organism: 'CAF (Caisse d’Allocations Familiales)',
        amount: 'Environ 160 € à 240 € / mois',
        probability: 'ÉLEVÉE',
        whyEligible: 'Complément de revenus versé dès que vos revenus mensuels dépassent 78 % du SMIC net (sans frais d’imposition).',
        howToClaim: 'Faites la simulation et la demande en 5 minutes sur caf.fr (effet rétroactif sur le mois en cours).',
      },
      {
        id: '4',
        title: `Aides Régionales & Mobilité (${postalCode} - ${city})`,
        organism: 'Région & Employeur (Prise en charge 50 % + Forfait Mobilité)',
        amount: 'Jusqu’à 680 € / an',
        probability: 'ÉLEVÉE',
        whyEligible: `Remboursement obligatoire par l’employeur de 50 % des abonnements de transport (${city}) ou prime transport carburant exonérée.`,
        howToClaim: 'Présentez votre justificatif d’abonnement ou demandez l’activation du Forfait Mobilités Durables au service RH.',
      },
    ],
  };

  try {
    const prompt = `Tu es ClairCash, expert en aides financières en France.
Profil : ${age} ans, ${postalCode} ${city}, Statut: ${status}, Logement: ${housing}, Transport: ${transport}.
Réponds UNIQUEMENT en JSON valide (sans markdown) avec 4 aides concrètes :
{
  "totalEstimatedYearly": "ex: 2 350 € / an",
  "profileSummary": "Résumé court du profil",
  "grants": [
    {
      "id": "1",
      "title": "Nom de l'aide",
      "organism": "Organisme (CAF, Action Logement, Région, etc.)",
      "amount": "Montant (ex: 1 000 € / an)",
      "probability": "ÉLEVÉE",
      "whyEligible": "Pourquoi ce profil y a droit",
      "howToClaim": "Démarche précise pour toucher l'argent"
    }
  ]
}`;

    const apiKey = process.env.GEMINI_API_KEY!;
    const models = ['models/gemini-2.5-flash', 'models/gemini-2.0-flash', 'models/gemini-2.5-flash-lite'];

    for (const model of models) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
            }),
          }
        );
        clearTimeout(timeout);
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (res.ok && raw) {
          const match = raw.match(/\{[\s\S]*\}/);
          return NextResponse.json({ result: JSON.parse(match ? match[0] : raw) });
        }
      } catch {
        clearTimeout(timeout);
      }
    }

    return NextResponse.json({ result: fallbackResult });
  } catch {
    return NextResponse.json({ result: fallbackResult });
  }
}
