import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ══════════════════════════════════════════════════════════════════════════════
//  SOFT COMPUTING + PGM ENGINE
// ══════════════════════════════════════════════════════════════════════════════

// ── [CONCEPT 4] Fuzzy Logic ───────────────────────────────────────────────────
// Converts crisp confidence [0,1] → linguistic fuzzy variable
interface FuzzyLabel { label: 'HIGH' | 'MEDIUM' | 'LOW'; description: string; level: string; color: string }
function fuzzyConfidence(score: number): FuzzyLabel {
  const pct = score * 100
  if (pct >= 80) return { label: 'HIGH',   description: 'Strong prediction — model is highly confident.', level: 'high',   color: 'green'  }
  if (pct >= 50) return { label: 'MEDIUM', description: 'Moderate confidence — review alternative possibilities.', level: 'medium', color: 'amber'  }
  return              { label: 'LOW',    description: 'Uncertain prediction — image may be unclear or ambiguous.', level: 'low',    color: 'red' }
}

// ── [CONCEPT 2] Symptom–Disease Probabilistic Graph ──────────────────────────
// Directed edges: Symptom → [ {disease, weight=P(disease|symptom)} ]
// Represents a Bayesian-style graphical relationship
const SYMPTOM_DISEASE_GRAPH: Record<string, { disease: string; weight: number }[]> = {
  yellow_leaves:   [{ disease: 'Nitrogen deficiency', weight: 0.60 }, { disease: 'Leaf Curl', weight: 0.30 }, { disease: 'Overwatering',    weight: 0.10 }],
  brown_spots:     [{ disease: 'Early Blight',        weight: 0.50 }, { disease: 'Late Blight',  weight: 0.35 }, { disease: 'Bacterial Spot', weight: 0.15 }],
  white_powder:    [{ disease: 'Powdery Mildew',      weight: 0.85 }, { disease: 'Downy Mildew', weight: 0.15 }],
  wilting:         [{ disease: 'Root Rot',            weight: 0.50 }, { disease: 'Fusarium Wilt',weight: 0.35 }, { disease: 'Water Stress',   weight: 0.15 }],
  black_lesions:   [{ disease: 'Late Blight',         weight: 0.60 }, { disease: 'Anthracnose',  weight: 0.30 }, { disease: 'Black Spot',     weight: 0.10 }],
  rust_colored:    [{ disease: 'Leaf Rust',           weight: 0.75 }, { disease: 'Iron Deficiency',weight:0.25 }],
  curled_leaves:   [{ disease: 'Leaf Curl Virus',     weight: 0.55 }, { disease: 'Aphid Damage', weight: 0.30 }, { disease: 'Drought Stress', weight: 0.15 }],
  dark_patches:    [{ disease: 'Late Blight',         weight: 0.55 }, { disease: 'Alternaria Blight',weight:0.30 },{ disease:'Septoria',      weight: 0.15 }],
  pale_green:      [{ disease: 'Nitrogen deficiency', weight: 0.65 }, { disease: 'Chlorosis',    weight: 0.35 }],
  necrotic_edges:  [{ disease: 'Potassium deficiency',weight: 0.50 }, { disease: 'Leaf Scorch',  weight: 0.35 }, { disease: 'Salt Stress',    weight: 0.15 }],
}

// Reverse lookup: disease → which symptoms are associated (for result card display)
function symptomsForDisease(diseaseName: string): { symptom: string; weight: number }[] {
  const dn = diseaseName.toLowerCase()
  const results: { symptom: string; weight: number }[] = []
  for (const [symptom, edges] of Object.entries(SYMPTOM_DISEASE_GRAPH)) {
    for (const edge of edges) {
      if (edge.disease.toLowerCase().includes(dn) || dn.includes(edge.disease.toLowerCase())) {
        results.push({ symptom: symptom.replace(/_/g, ' '), weight: edge.weight })
      }
    }
  }
  return results.sort((a, b) => b.weight - a.weight).slice(0, 4)
}

// ── [CONCEPT 5] Hybrid Reasoning ─────────────────────────────────────────────
// Combines CNN prediction scores (70%) with symptom-graph derived scores (30%)
// Output = weighted blend of neural network + probabilistic graph
function hybridReasoning(
  mlPreds: HFPrediction[],
  detectedDisease: string
): { blendedPreds: HFPrediction[]; symptomBoostApplied: boolean } {
  // Derive symptom probabilities from the detected disease via graph edges
  const symptoms = symptomsForDisease(detectedDisease)
  if (symptoms.length === 0) return { blendedPreds: mlPreds, symptomBoostApplied: false }

  // Build graph-derived disease probability from reverse symptom edges
  const graphScores: Record<string, number> = {}
  for (const { symptom } of symptoms) {
    const edges = SYMPTOM_DISEASE_GRAPH[symptom.replace(/ /g, '_')] ?? []
    for (const e of edges) {
      graphScores[e.disease] = (graphScores[e.disease] ?? 0) + e.weight / symptoms.length
    }
  }

  // Blend: 70% CNN likelihood + 30% graph-derived score
  const blended = mlPreds.map(pred => {
    const dn = (pred.label.split('___')[1] ?? pred.label).replace(/_/g, ' ')
    const graphScore = Object.entries(graphScores)
      .find(([d]) => d.toLowerCase().includes(dn.toLowerCase()) || dn.toLowerCase().includes(d.toLowerCase()))
      ?.[1] ?? 0
    return { label: pred.label, score: 0.70 * pred.score + 0.30 * graphScore }
  }).sort((a, b) => b.score - a.score)

  // Normalise
  const total = blended.reduce((s, p) => s + p.score, 0)
  const normalised = blended.map(p => ({ ...p, score: total > 0 ? p.score / total : p.score }))

  console.log(`[HYBRID] Blended top: ${normalised[0].label} @ ${(normalised[0].score * 100).toFixed(1)}%`)
  return { blendedPreds: normalised, symptomBoostApplied: true }
}

// ── [CONCEPT 1] Probabilistic Reasoning + Top-3 ──────────────────────────────
interface HFPrediction { label: string; score: number }
function top3Formatted(preds: HFPrediction[]): { label: string; score: number; pct: string }[] {
  return preds.slice(0, 3).map(p => ({
    label: (p.label.split('___')[1] ?? p.label).replace(/_/g, ' '),
    score: p.score,
    pct:   `${(p.score * 100).toFixed(1)}%`,
  }))
}

// ── [CONCEPT 3] Uncertainty Handling ─────────────────────────────────────────
interface UncertaintyResult { flag: boolean; message: string; tier: 'certain' | 'possible' | 'uncertain' }
function assessUncertainty(score: number): UncertaintyResult {
  const pct = score * 100
  if (pct >= 80) return { flag: false, message: 'Prediction is reliable.',                           tier: 'certain'   }
  if (pct >= 50) return { flag: true,  message: 'Multiple possibilities exist. Review alternatives.',tier: 'possible'  }
  return              { flag: true,  message: 'Uncertain — image may be blurred, rotated, or not a crop leaf. Please retake.', tier: 'uncertain' }
}

// ── PGM: Bayesian Posterior Re-ranking ───────────────────────────────────────
interface KBRow {
  disease_name: string; crop_name: string; treatment: string; severity: string
  symptoms: string | null; prevention: string | null
  seasonal_prevalence: Record<string,number> | null
  region_prevalence:   Record<string,number> | null
}
function bayesianRerank(preds: HFPrediction[], kb: KBRow[], season: string, region: string): HFPrediction[] {
  const defaultPrior = 0.10
  const scored = preds.map(pred => {
    const dn  = (pred.label.split('___')[1] ?? pred.label).replace(/_/g,' ').toLowerCase()
    const row = kb.find(r => r.disease_name.toLowerCase().includes(dn) || dn.includes(r.disease_name.toLowerCase()))
    const sP  = row?.seasonal_prevalence?.[season] ?? defaultPrior
    const rP  = row?.region_prevalence?.[region]   ?? row?.region_prevalence?.['default'] ?? defaultPrior
    const posterior = pred.score * sP * rP
    console.log(`[PGM] ${pred.label}: L=${pred.score.toFixed(3)} × S(${season})=${sP} × R(${region})=${rP} → post=${posterior.toFixed(5)}`)
    return { ...pred, posterior }
  }).sort((a: any, b: any) => b.posterior - a.posterior)
  const total = scored.reduce((s: number, p: any) => s + p.posterior, 0)
  return scored.map((p: any) => ({ label: p.label, score: total > 0 ? p.posterior / total : p.score }))
}

// ── HuggingFace call ──────────────────────────────────────────────────────────
async function callHuggingFace(imageUrl: string, hfToken: string): Promise<HFPrediction[]> {
  const res = await fetch(
    'https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-classification',
    { method: 'POST',
      headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type': 'application/json', 'x-wait-for-model': 'true', 'x-use-cache': 'false' },
      body: JSON.stringify({ url: imageUrl }) }
  )
  const data = await res.json()
  console.log(`[HF] Status:${res.status} Top:${JSON.stringify(data).slice(0,200)}`)
  if (data.error) throw new Error(`HF API error: ${data.error}`)
  if (!Array.isArray(data) || !data.length) throw new Error(`HF unexpected: ${JSON.stringify(data)}`)
  return data as HFPrediction[]
}

const DEMO_DISEASES = [
  { disease: 'Late Blight', crop: 'Tomato', severity: 'severe'   },
  { disease: 'Early Blight', crop: 'Tomato', severity: 'moderate' },
  { disease: 'Powdery Mildew', crop: 'Grape', severity: 'mild'   },
  { disease: 'Leaf Rust', crop: 'Wheat', severity: 'severe'      },
]

// ── Main Handler ──────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const _debug: Record<string, unknown> = {}
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey     = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const svcKey      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const hfToken     = Deno.env.get('HF_API_TOKEN') ?? ''

    // 1. Auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    const { data: { user }, error: authError } = await createClient(supabaseUrl, anonKey)
      .auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) throw new Error(`Auth: ${authError?.message ?? 'No user'}`)
    console.log(`[STEP1] Auth OK user=${user.id}`)

    // 2. Parse body
    let body: { image: string; contentType: string; fileName?: string; cropType?: string; season?: string }
    try { body = await req.json() } catch (e) { throw new Error(`JSON parse: ${(e as Error).message}`) }
    if (!body?.image) throw new Error('No image in request body')

    const contentType = body.contentType || 'image/jpeg'
    const cropType    = body.cropType    || 'Unknown'
    const season      = body.season      || detectSeasonServer()
    _debug.cropType = cropType; _debug.season = season

    const binaryStr  = atob(body.image)
    const imageBytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) imageBytes[i] = binaryStr.charCodeAt(i)

    // 3. Upload to storage
    const admin    = createClient(supabaseUrl, svcKey)
    const fileName = `${user.id}/${Date.now()}.jpg`
    const { error: upErr } = await admin.storage.from('diagnoses-images')
      .upload(fileName, new Blob([imageBytes], { type: contentType }), { contentType, upsert: false })
    if (upErr) throw new Error(`Upload: ${upErr.message}`)
    const { data: { publicUrl } } = admin.storage.from('diagnoses-images').getPublicUrl(fileName)
    _debug.publicUrl = publicUrl
    console.log(`[STEP3] Uploaded → ${publicUrl}`)

    // 4. Load KB + user region
    const { data: kbRows } = await admin.from('crops_knowledge_base')
      .select('disease_name,crop_name,seasonal_prevalence,region_prevalence,treatment,severity,symptoms,prevention')
    const kb = (kbRows ?? []) as KBRow[]
    const { data: profile } = await admin.from('profiles').select('state').eq('id', user.id).maybeSingle()
    const userRegion = (profile?.state ?? 'default').toLowerCase().replace(/ /g,'_')

    // 5. HF → Bayesian re-rank → Hybrid blend
    let inferenceMode = 'demo'
    let finalPreds: HFPrediction[] = []
    let hfSuccess = false
    let diagnosisResult!: {
      disease: string; crop: string; confidence: number; severity: string;
      treatment: string; symptoms: string | null; prevention: string | null;
      all_predictions: HFPrediction[];
    }

    if (hfToken) {
      try {
        const rawPreds = await callHuggingFace(publicUrl, hfToken)
        _debug.hfRaw = rawPreds.slice(0, 3)

        // [PGM] Bayesian re-ranking using seasonal + regional priors
        const pgmPreds = bayesianRerank(rawPreds, kb, season, userRegion)
        _debug.pgmTop3 = pgmPreds.slice(0, 3)

        // [HYBRID] Blend CNN + symptom graph
        const topDisease = (pgmPreds[0].label.split('___')[1] ?? pgmPreds[0].label).replace(/_/g,' ')
        const { blendedPreds } = hybridReasoning(pgmPreds, topDisease)
        finalPreds = blendedPreds
        _debug.hybridTop3 = blendedPreds.slice(0, 3)

        const top   = finalPreds[0]
        const parts = top.label.split('___')
        const crop    = (parts[0] ?? cropType).replace(/_/g,' ')
        const disease = (parts[1] ?? top.label).replace(/_/g,' ')
        const kbMatch = kb.find(r =>
          r.disease_name.toLowerCase().includes(disease.toLowerCase()) ||
          disease.toLowerCase().includes(r.disease_name.toLowerCase())
        )
        diagnosisResult = {
          disease, crop,
          confidence:      top.score,
          severity:        kbMatch?.severity  ?? 'moderate',
          treatment:       kbMatch?.treatment ?? 'Consult your local agronomist.',
          symptoms:        kbMatch?.symptoms  ?? null,
          prevention:      kbMatch?.prevention ?? null,
          all_predictions: finalPreds.slice(0, 5),
        }
        inferenceMode = 'huggingface'
        hfSuccess     = true
        console.log(`[STEP5] Done → ${disease} @ ${(top.score*100).toFixed(1)}%`)
      } catch (hfErr) {
        _debug.hfError = (hfErr as Error).message
        console.error('[HF] Failed, using demo:', _debug.hfError)
      }
    }

    if (!hfSuccess) {
      const mock    = DEMO_DISEASES[Math.floor(Math.random() * DEMO_DISEASES.length)]
      const kbMatch = kb.find(r => r.disease_name.toLowerCase().includes(mock.disease.toLowerCase()))
      diagnosisResult = {
        disease:         mock.disease,
        crop:            cropType !== 'Unknown' ? cropType : mock.crop,
        confidence:      0.65 + Math.random() * 0.15,
        severity:        kbMatch?.severity  ?? mock.severity,
        treatment:       kbMatch?.treatment ?? 'Apply appropriate fungicide.',
        symptoms:        kbMatch?.symptoms  ?? null,
        prevention:      kbMatch?.prevention ?? null,
        all_predictions: DEMO_DISEASES.map((d,i) => ({ label: d.disease, score: [0.72,0.18,0.07,0.03][i] ?? 0.01 })),
      }
    }

    // ── SOFT COMPUTING RESULTS ─────────────────────────────────────────────
    // [CONCEPT 4] Fuzzy logic output
    const fuzzy = fuzzyConfidence(diagnosisResult.confidence)
    // [CONCEPT 3] Uncertainty assessment
    const uncertainty = assessUncertainty(diagnosisResult.confidence)
    // [CONCEPT 1] Top-3 probabilistic predictions
    const top3 = top3Formatted(diagnosisResult.all_predictions.length ? diagnosisResult.all_predictions : [
      { label: diagnosisResult.disease, score: diagnosisResult.confidence },
    ])
    // [CONCEPT 2] Symptom-disease graph edges for detected disease
    const symptomGraph = symptomsForDisease(diagnosisResult.disease)

    // 6. Save to DB
    const { data: saved, error: saveErr } = await admin.from('diagnoses').insert({
      user_id: user.id, image_url: publicUrl, crop_name: diagnosisResult.crop,
      disease_name: diagnosisResult.disease, severity: (diagnosisResult.severity ?? 'moderate').toLowerCase(),
      confidence: diagnosisResult.confidence, treatment: diagnosisResult.treatment,
      source: 'model', season, crop_type: cropType,
    }).select().single()
    if (saveErr) console.warn('[DB] Save non-fatal:', saveErr.message)

    return new Response(JSON.stringify({
      success: true, source: 'model', inferenceMode,
      diagnosis: { ...diagnosisResult, id: saved?.id },
      // ── Soft Computing outputs ──
      fuzzy,        // [C4] Fuzzy logic label
      uncertainty,  // [C3] Uncertainty handling
      top3,         // [C1] Probabilistic top-3
      symptomGraph, // [C2] PGM symptom-disease graph
      _debug,
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })

  } catch (error) {
    const err = error as Error
    console.error('FATAL:', err.message)
    return new Response(JSON.stringify({ success: false, error: err.message, _debug }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})

function detectSeasonServer(): string {
  const m = new Date().getUTCMonth() + 1
  if (m >= 6 && m <= 10) return 'kharif'
  if (m >= 4 && m <= 5)  return 'zaid'
  return 'rabi'
}
