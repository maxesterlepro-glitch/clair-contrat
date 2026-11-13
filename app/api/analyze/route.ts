import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContractAnalysisResult } from '@/types/analysis.types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Session invalide' }, { status: 401 });

    const { filePaths = [], linkOrText = '' } = await req.json();
    if (filePaths.length === 0 && !linkOrText.trim()) {
      return NextResponse.json({ error: 'Ajoutez un fichier ou un texte.' }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits_balance < 1) {
      return NextResponse.json({ error: 'Crédits insuffisants' }, { status: 402 });
    }

    const { data: contract, error: insertError } = await supabaseAdmin
      .from('contracts')
      .insert({
        user_id: user.id,
        title: 'Analyse en cours...',
        user_role: 'client_employee_tenant',
        file_paths: filePaths,
        status: 'processing',
      })
      .select()
      .single();

    if (insertError || !contract) throw new Error('Erreur base de données');

    const parts: Array<Record<string, unknown>> = [];

    for (const path of filePaths) {
      const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
        .from('contracts-docs')
        .download(path);
      if (downloadError || !fileBlob) throw new Error(`Impossible de lire : ${path}`);

      const arrayBuffer = await fileBlob.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = fileBlob.type || (path.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
      parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }

    if (linkOrText.trim()) {
      parts.push({ text: `Contenu ou lien soumis :\n${linkOrText}` });
    }

    const prompt = `Tu es ClairContrat, l'IA experte en droit français de la consommation, de l'immobilier, de l'assurance et en chiffrage de devis (garages, BTP, plomberie, énergie, freelance).
Analyse ce document et réponds UNIQUEMENT avec un objet JSON valide respectant exactement cette structure (sans balises markdown) :
{
  "documentTitle": "Titre précis du document",
  "documentCategory": "Bail / Devis Garage / Assurance / etc.",
  "trustScore": 65,
  "summaryPoints": ["Point clé 1", "Point clé 2", "Point clé 3"],
  "redAlerts": [
    {
      "id": "1",
      "title": "Titre du piège juridique",
      "exactQuote": "Citation exacte du contrat",
      "explanation": "Explication claire du risque",
      "legalReference": "Article précis (ex: Art. L212-1 Code de la consommation ou Loi ALUR)"
    }
  ],
  "orangePriceAlerts": [
    {
      "id": "1",
      "item": "Nom de la ligne ou frais",
      "quotedPrice": "Prix facturé (ex: 180 €)",
      "marketAveragePrice": "Prix moyen France (ex: 110 €)",
      "overchargePercentage": "+63%",
      "explanation": "Explication de la surfacturation constatée"
    }
  ],
  "counterAttack": {
    "subject": "Objet du courrier de contestation",
    "emailBody": "Texte complet de l'email poli mais ferme citant les articles de loi...",
    "recommendedLetterBody": "Texte complet du courrier recommandé LRAR formel..."
  }
}`;

    parts.push({ text: prompt });

    const apiKey = process.env.GEMINI_API_KEY!;

    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listRes.json();

    const allValidModels: string[] = (listData.models || [])
      .filter((m: { name?: string; supportedGenerationMethods?: string[] }) => {
        const name = (m.name || '').toLowerCase();
        return (
          m.supportedGenerationMethods?.includes('generateContent') &&
          !name.includes('embedding') &&
          !name.includes('imagen') &&
          !name.includes('veo') &&
          !name.includes('tts') &&
          !name.includes('audio') &&
          !name.includes('aqa')
        );
      })
      .map((m: { name: string }) => m.name);

    const sortedModels = allValidModels.sort((a, b) => {
      const score = (name: string) => {
        if (name.includes('flash-lite')) return 1;
        if (name.includes('flash')) return 2;
        if (name.includes('gemma')) return 3;
        if (name.includes('pro')) return 9;
        return 5;
      };
      return score(a) - score(b);
    });

    let rawText = '';
    const errorsLog: string[] = [];

    for (const modelName of sortedModels) {
      const genRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      const genData = await genRes.json();

      if (genRes.ok && genData.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawText = genData.candidates[0].content.parts[0].text;
        console.log('✅ Analyse réussie avec :', modelName);
        break;
      } else {
        errorsLog.push(`${modelName}: ${genData.error?.message || 'échec'}`);
      }
    }

    if (!rawText) {
      throw new Error(`Aucun modèle disponible : ${errorsLog.slice(0, 2).join(' | ')}`);
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : rawText;
    const result: ContractAnalysisResult = JSON.parse(cleanedJson);

    await supabaseAdmin.rpc('consume_one_credit', {
      p_user_id: user.id,
      p_contract_id: contract.id,
    });

    await supabaseAdmin
      .from('contracts')
      .update({
        title: result.documentTitle,
        contract_type: result.documentCategory,
        trust_score: result.trustScore,
        status: 'completed',
        analysis_result: result,
      })
      .eq('id', contract.id);

    return NextResponse.json({ contractId: contract.id, result });
  } catch (error: unknown) {
    console.error('Erreur API analyze:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l’analyse' },
      { status: 500 }
    );
  }
}
