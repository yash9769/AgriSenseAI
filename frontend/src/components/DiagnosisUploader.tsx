import { useState, useRef, useCallback, useMemo } from 'react';
import { Upload, X, Leaf, AlertTriangle, CheckCircle, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── PGM Evidence constants ────────────────────────────────────────────────────
const CROP_TYPES = ['Tomato','Wheat','Maize','Grape','Pepper','Potato','Apple','Rice','Cotton','Soybean','Other'];
const SEASONS = [
  { value: 'kharif', label: 'Kharif (Monsoon · Jun–Oct)' },
  { value: 'rabi',   label: 'Rabi (Winter · Nov–Mar)' },
  { value: 'zaid',   label: 'Zaid (Summer · Apr–May)' },
];
// Auto-detect current Indian agricultural season by month
function detectSeason(): string {
  const m = new Date().getMonth() + 1; // 1-12
  if (m >= 6 && m <= 10) return 'kharif';
  if (m >= 4 && m <= 5)  return 'zaid';
  return 'rabi';
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Prediction { label: string; score: number; pct?: string }
interface FuzzyLabel  { label: string; description: string; level: string; color: string }
interface Uncertainty { flag: boolean; message: string; tier: string }
interface SymptomEdge { symptom: string; weight: number }
interface DiagnosisResult {
  id?: string;
  crop: string;
  disease: string;
  confidence: number | null;
  severity: string;
  treatment: string;
  symptoms?: string | null;
  prevention?: string | null;
  all_predictions?: Prediction[];
  source: 'model' | 'llm';
  inferenceMode?: string;
  // ── Soft Computing outputs ──
  fuzzy?:        FuzzyLabel;            // [C4] Fuzzy Logic
  uncertainty?:  Uncertainty;           // [C3] Uncertainty Handling
  top3?:         Prediction[];          // [C1] Probabilistic Reasoning
  symptomGraph?: SymptomEdge[];        // [C2] Symptom-Disease PGM Graph
}

// ─── Severity badge config ────────────────────────────────────────────────────
const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  mild:     { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200',   label: 'Mild' },
  moderate: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200',   label: 'Moderate' },
  severe:   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',          label: 'Severe' },
  healthy:  { color: 'text-green-700',  bg: 'bg-green-50 border-green-200',      label: 'Healthy' },
  unknown:  { color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',        label: 'Unknown' },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function DiagnosisUploader() {
  const [file, setFile]           = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<DiagnosisResult | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [showAll, setShowAll]     = useState(false);
  const [dragging, setDragging]   = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);
  // ── PGM Evidence nodes (condition the Bayesian posterior) ──
  const [cropType, setCropType]   = useState<string>('Tomato');
  const [season, setSeason]       = useState<string>(detectSeason());
  const currentSeasonLabel        = useMemo(() => SEASONS.find(s => s.value === season)?.label ?? season, [season]);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    if (f.size > 10 * 1024 * 1024)   { setError('Image must be smaller than 10 MB.'); return; }
    setFile(f);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null); setShowAll(false); };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to run a diagnosis.');

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

      // Encode image as base64 JSON — eliminates all binary/stream/ArrayBuffer transfer issues
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
          resolve(result.split(',')[1]);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${SUPABASE_URL}/functions/v1/diagnose`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          contentType: file.type || 'image/jpeg',
          fileName: file.name,
          // PGM evidence nodes — condition the Bayesian posterior
          cropType,
          season,
        }),
      });

      const responseText = await response.text();
      console.log(`🔵 Edge Function HTTP ${response.status}:`, responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server returned non-JSON response (${response.status}): ${responseText.slice(0, 200)}`);
      }

      if (!response.ok) {
        console.error('🔴 Server error diagnostics:', data.diagnostics);
        throw new Error(data.error ?? `Server error ${response.status}`);
      }

      console.log('✅ DiagnosisUploader response:', data);
      console.log('📊 Debug:', data._debug);

      if (!data.success) throw new Error(data.error ?? 'Diagnosis failed');
      setResult({
        ...data.diagnosis,
        source:        data.source,
        inferenceMode: data.inferenceMode,
        fuzzy:         data.fuzzy,
        uncertainty:   data.uncertainty,
        top3:          data.top3,
        symptomGraph:  data.symptomGraph,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const sev = severityConfig[result?.severity ?? 'unknown'] ?? severityConfig.unknown;


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
            <Leaf className="w-3 h-3" /> AI Crop Diagnostics
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Diagnose Your Crop</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Upload a photo of your crop leaf. Our hybrid AI pipeline detects disease with &gt;60% confidence or escalates to GPT-4o Vision.
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer
              ${dragging ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50/40'}
              ${file ? 'cursor-default' : ''}`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {preview ? (
              <div className="relative">
                <img src={preview} alt="Selected crop" className="w-full max-h-80 object-contain rounded-2xl" />
                <button onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow hover:bg-red-50 transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow">
                  {file!.name} · {(file!.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Drop an image here or <span className="text-green-600 underline">browse</span></p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 10 MB</p>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* PGM Evidence Inputs — observable context for Bayesian inference */}
        {!result && file && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              Context (improves accuracy via Bayesian re-ranking)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Evidence node 1: Crop type */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Crop Type</label>
                <select
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                  className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Evidence node 2: Season (auto-detected, user can override) */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Season</label>
                <select
                  value={season}
                  onChange={e => setSeason(e.target.value)}
                  className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-green-600 italic">
              Season auto-detected as <strong>{currentSeasonLabel}</strong>
            </p>
          </div>
        )}

        {/* Submit Button */}
        {!result && (
          <button onClick={handleSubmit} disabled={!file || loading}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all
              bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI&hellip;</>
            ) : (
              <><Leaf className="w-5 h-5" /> Run Diagnosis</>
            )}
          </button>
        )}


        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center animate-pulse">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-2 bg-gray-100 rounded-full w-1/2 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center pt-2">
              Uploading → HuggingFace model → {'{'}confidence check{'}'} → result
            </p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Preview strip */}
            {preview && (
              <img src={preview} alt="Diagnosed crop" className="w-full h-40 object-cover" />
            )}
            <div className="p-6 space-y-5">

              {/* Inference source + severity row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {result.inferenceMode === 'huggingface' ? (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> HF Model · Neural Network [C6]
                  </span>
                ) : result.inferenceMode === 'demo' ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Demo Mode
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> GPT-4o Vision
                  </span>
                )}
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${sev.bg} ${sev.color}`}>
                  {sev.label}
                </span>
              </div>

              {/* [C4] Fuzzy Logic — linguistic confidence label */}
              {result.fuzzy && (
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 border
                  ${result.fuzzy.level === 'high'   ? 'bg-green-50 border-green-200' :
                    result.fuzzy.level === 'medium' ? 'bg-amber-50 border-amber-200' :
                                                      'bg-red-50   border-red-200'}`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                      Fuzzy Logic Confidence [C4]
                    </p>
                    <p className={`text-sm font-extrabold
                      ${result.fuzzy.level === 'high'   ? 'text-green-700' :
                        result.fuzzy.level === 'medium' ? 'text-amber-700' : 'text-red-700'}`}>
                      {result.fuzzy.label} — {((result.confidence ?? 0) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{result.fuzzy.description}</p>
                  </div>
                  <div className="w-16 text-right shrink-0">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full
                        ${result.fuzzy.level === 'high'   ? 'bg-green-500' :
                          result.fuzzy.level === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${((result.confidence ?? 0) * 100).toFixed(0)}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{((result.confidence ?? 0) * 100).toFixed(0)}/100</p>
                  </div>
                </div>
              )}

              {/* [C3] Uncertainty Handling */}
              {result.uncertainty?.flag && (
                <div className={`flex items-start gap-3 rounded-xl p-4 border
                  ${result.uncertainty.tier === 'uncertain' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0
                    ${result.uncertainty.tier === 'uncertain' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-0.5">Uncertainty Handling [C3]</p>
                    <p className={`text-sm font-semibold
                      ${result.uncertainty.tier === 'uncertain' ? 'text-red-700' : 'text-amber-700'}`}>
                      {result.uncertainty.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Disease name */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Detected</p>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{result.disease}</h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">
                  Crop: <span className="text-gray-700 font-semibold">{result.crop}</span>
                </p>
              </div>

              {/* [C1] Probabilistic Reasoning — Top 3 */}
              {result.top3 && result.top3.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Probabilistic Reasoning — Top Predictions [C1]
                  </p>
                  <div className="space-y-2.5">
                    {result.top3.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0
                          ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate capitalize">{p.label}</p>
                          <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-400' : 'bg-gray-400'}`}
                              style={{ width: `${((p.score ?? 0) * 100).toFixed(0)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-600 shrink-0 w-12 text-right">
                          {p.pct ?? `${((p.score ?? 0) * 100).toFixed(1)}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* [C2] Symptom–Disease PGM Graph */}
              {result.symptomGraph && result.symptomGraph.length > 0 && (
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mb-3">
                    Symptom–Disease Graph (PGM) [C2]
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {result.symptomGraph.map((e, i) => (
                      <div key={i} className="flex justify-between items-center bg-white border border-violet-100 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-700 capitalize font-medium">{e.symptom}</span>
                        <span className="text-xs font-bold text-violet-600 ml-2 shrink-0">
                          {(e.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-violet-400 mt-2 italic">
                    Edge weights = P(this disease | observed symptom)
                  </p>
                </div>
              )}

              {/* [C5] Hybrid Reasoning badge */}
              {result.inferenceMode === 'huggingface' && (
                <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-indigo-700">Hybrid Reasoning Active [C5]</p>
                    <p className="text-[11px] text-indigo-400 mt-0.5">
                      CNN likelihood (70%) + Symptom-Disease Graph (30%) + Bayesian Context Prior
                    </p>
                  </div>
                </div>
              )}

              {/* Treatment */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Treatment</p>
                <p className="text-sm text-gray-700 leading-relaxed">{result.treatment}</p>
              </div>

              {/* Symptoms / Prevention */}
              {(result.symptoms || result.prevention) && (
                <div className="grid grid-cols-1 gap-3">
                  {result.symptoms && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-1">Symptoms</p>
                      <p className="text-sm text-gray-700">{result.symptoms}</p>
                    </div>
                  )}
                  {result.prevention && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">Prevention</p>
                      <p className="text-sm text-gray-700">{result.prevention}</p>
                    </div>
                  )}
                </div>
              )}

              {/* All predictions toggle */}
              {result.all_predictions && result.all_predictions.length > 0 && (
                <div>
                  <button onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold">
                    {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {showAll ? 'Hide' : 'Show'} all predictions
                  </button>
                  {showAll && (
                    <div className="mt-3 space-y-2">
                      {result.all_predictions.map((p, i) => {
                        const parts = p.label.split('___');
                        const label = `${parts[0]?.replace(/_/g,' ')} — ${parts[1]?.replace(/_/g,' ') ?? '?'}`;
                        const pct = (p.score * 100).toFixed(1);
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-700 truncate">{label}</p>
                              <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-gray-500 w-12 text-right shrink-0">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={reset}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Diagnose Another
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

