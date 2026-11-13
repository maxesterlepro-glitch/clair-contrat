import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { category = 'auto', adText = '', price = '' } = body;

  if (!adText.trim()) {
    return NextResponse.json({ error: 'Collez le texte ou les détails de l’annonce.' }, { status: 400 });
  }

  const fallbackResult =
    category === 'auto'
      ? {
          title: 'Diagnostic Véhicule d’Occasion',
          verdict: 'PRUDENCE — VÉRIFICATIONS REQUISES',
          reliabilityScore: 62,
          estimatedMarketPrice: price ? `${price} (Négociable de -10 % à -15 %)` : 'À négocier selon carnet et factures',
          hiddenTraps: [
            'Vérifier la présence des factures d’entretien datées (courroie de distribution / chaîne, vidanges respectées).',
            'Attention aux mentions de type « vendu en l’état » qui n’exonèrent pas le vendeur de la garantie légale des vices cachés (Art. 1641 du Code civil).',
            'Contrôle technique de moins de 6 mois obligatoire avant la vente à un particulier.',
          ],
          questionsToAsk: [
            'Avez-vous les factures détaillées des 3 dernières révisions et non uniquement le carnet tamponné ?',
            'La distribution et la pompe à eau ont-elles déjà été remplacées (facture à l’appui) ?',
            'Le rapport Histovec complet et le procès-verbal du contrôle technique sont-ils disponibles immédiatement ?',
          ],
          negotiationArgument:
            'En l’absence de justificatifs complets sur les grosses échéances mécaniques à venir, demandez une baisse immédiate de 800 € à 1 200 € correspondant au coût préventif de remise à niveau.',
        }
      : {
          title: 'Diagnostic Annonce Immobilière',
          verdict: 'VIGILANCE SUR LES CHARGES & DIAGNOSTICS',
          reliabilityScore: 68,
          estimatedMarketPrice: price ? `${price} (Marge de négociation ~5 % à 8 %)` : 'Comparer au prix moyen du m² du secteur',
          hiddenTraps: [
            'Vérifier la répartition exacte des charges (chauffage collectif ou individuel, régularisation annuelle).',
            'Exiger le DPE complet (Diagnostic de Performance Énergétique) : interdiction progressive de location et gel des loyers pour les passoires thermiques (F et G).',
            'En achat : vérifier les 3 derniers procès-verbaux d’Assemblée Générale pour détecter d’éventuels gros travaux votés ou à venir (ravalement, toiture).',
          ],
          questionsToAsk: [
            'Quel est le montant réel de la régularisation annuelle des charges sur les 2 dernières années ?',
            'Pouvez-vous me transmettre le DPE complet ainsi que l’état des risques et pollutions ?',
            'Des travaux de copropriété ou d’isolation sont-ils à l’ordre du jour de la prochaine Assemblée Générale ?',
          ],
          negotiationArgument:
            'Appuyez-vous sur la classe énergétique (DPE) et le coût réel des charges ou travaux de rafraîchissement pour justifier une baisse immédiate du prix ou l’inclusion d’équipements.',
        };

  try {
    const prompt = `Tu es ClairCheck, expert indépendant en inspection d'annonces (${
      category === 'auto' ? 'voitures d’occasion et mécanique' : 'immobilier, location et achat'
    }) en France.
Analyse cette annonce (Prix affiché : ${price || 'Non précisé'}) :
"""
${adText}
"""
Réponds UNIQUEMENT avec un objet JSON strict (sans markdown) suivant ce format :
{
  "title": "Titre résumé du bien ou véhicule",
  "verdict": "BONNE AFFAIRE / PRUDENCE / À FUIR",
  "reliabilityScore": 72,
  "estimatedMarketPrice": "Estimation de la vraie valeur sur le marché français",
  "hiddenTraps": [
    "Piège ou vice caché potentiel n°1",
    "Piège ou point de vigilance n°2",
    "Piège ou point de vigilance n°3"
  ],
  "questionsToAsk": [
    "Question piège précise n°1 à poser au vendeur/propriétaire",
    "Question piège précise n°2",
    "Question piège précise n°3"
  ],
  "negotiationArgument": "L'argument massue à utiliser sur place pour faire baisser le prix immédiatement"
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
              generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
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
