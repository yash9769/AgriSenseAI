import React, { useRef, useState } from 'react';
import { CloudUpload, AddAPhoto, Close, Analytics, Lightbulb, History } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion } from 'motion/react';

interface UploadScreenProps {
  setScreen: (s: Screen) => void;
  setSelectedImg: (img: string | null) => void;
  setAnalysisResult: (res: any) => void;
}

export const UploadScreen = ({ setScreen, setSelectedImg, setAnalysisResult }: UploadScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setSelectedImg(result);
      };
      reader.readAsDataURL(f);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/disease/detect', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.statusText}`);
      }

      const data = await resp.json();
      setAnalysisResult(data);
      setScreen('analysis');
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Analyze Crop Health" activeScreen="crop-health" setScreen={setScreen} />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full scrollbar-hide">
        <div className="mb-12">
          <span className="text-xs font-bold text-on-tertiary-container uppercase tracking-[0.2em] mb-2 block">Visual Diagnosis</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-4">Analyze Crop Health</h2>
          <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
            Upload a high-resolution photo of your plant's foliage. Our AI models will detect nutrient deficiencies, pests, and hydration levels in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute -inset-1 signature-gradient opacity-10 blur-xl group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-surface-container-lowest border-2 border-dashed border-emerald-900/20 rounded-[2rem] p-12 transition-all duration-300 hover:border-emerald-800/40 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CloudUpload className="w-10 h-10 text-emerald-800" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-2">Drag and drop plant photos</h3>
                <p className="text-on-surface-variant mb-8 max-w-xs">Supports JPG, PNG up to 10MB. For best results, use natural lighting.</p>
                <button className="signature-gradient text-white px-8 py-4 rounded-full font-headline font-bold flex items-center gap-3 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all active:scale-95 pointer-events-none">
                  <AddAPhoto className="w-5 h-5" />
                  Select Plant Photo
                </button>
              </div>
            </div>

            {loading && (
              <div className="bg-surface-container-low rounded-[1.5rem] p-6 flex items-center gap-6 border border-emerald-900/5">
                <div className="w-16 h-16 bg-surface-container-highest rounded-xl overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-emerald-100/50 animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-headline font-semibold text-primary">Analyzing plant health...</p>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full animate-pulse">Processing</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <motion.div 
                      key="progress"
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 10 }}
                      className="h-full signature-gradient rounded-full shadow-[0_0_10px_rgba(27,67,50,0.4)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-sm font-bold flex items-center gap-3">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-emerald-900/5">
              <div className="aspect-square relative group">
                {preview ? (
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={preview} 
                    alt="Leaf preview" 
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant/20 italic text-sm">No image selected</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                {preview && (
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Preview</span>
                      <p className="text-white font-headline font-bold truncate">{file?.name}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setSelectedImg(null); }}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                      <Close className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Metadata</span>
                  <span className="text-xs text-on-surface-variant">{file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '-'}</span>
                </div>
                
                <button 
                  disabled={!file || loading}
                  onClick={handleAnalyze}
                  className="w-full py-4 signature-gradient text-white rounded-xl font-headline font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <Analytics className="w-6 h-6" />
                  {loading ? 'Analyzing...' : 'Analyze Now'}
                </button>
              </div>
            </div>

            <div className="bg-tertiary-container rounded-[1.5rem] p-6 text-on-tertiary">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-on-tertiary-container" />
                <h4 className="font-headline font-bold text-on-tertiary-container">Pro Tip</h4>
              </div>
              <p className="text-sm leading-relaxed text-on-tertiary-container/80">
                Gemini 1.5 Pro performs best with clear, focused shots of the infected area. Ensure good lighting for higher confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
