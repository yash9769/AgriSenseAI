import React, { useState, useRef } from 'react';
import { CloudUpload, AddAPhoto, Close, Analytics, Lightbulb, History } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion } from 'motion/react';
import DiagnosisUploader from '../components/DiagnosisUploader';

export const UploadScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearFile = () => { setSelectedFile(null); setPreview(null); };

  if (useAI) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar title="AI Diagnosis" setScreen={setScreen} />
        <div className="flex-1 overflow-y-auto">
          <button type="button" onClick={() => setUseAI(false)} className="m-6 text-sm text-emerald-700 font-semibold hover:underline flex items-center gap-1">
            ← Back to Upload
          </button>
          <DiagnosisUploader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Analyze Crop Health" setScreen={setScreen} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
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
            {/* Drop zone */}
            <div
              className="relative group"
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            >
              <div className="absolute -inset-1 signature-gradient opacity-10 blur-xl group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div
                className={`relative bg-surface-container-lowest border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 min-h-[400px] flex flex-col items-center justify-center text-center
                  ${dragging ? 'border-emerald-600 bg-emerald-50/30' : 'border-emerald-900/20 hover:border-emerald-800/40'}`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-72 rounded-2xl object-contain shadow-lg" />
                ) : (
                  <>
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                      <CloudUpload className="w-10 h-10 text-emerald-800" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">Drag and drop plant photos</h3>
                    <p className="text-on-surface-variant mb-8 max-w-xs">Supports JPG, PNG up to 10MB. For best results, use natural lighting.</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('UploadScreen: Selecting photo');
                        fileInputRef.current?.click();
                      }}
                      className="signature-gradient text-white px-8 py-4 rounded-full font-headline font-bold flex items-center gap-3 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all active:scale-95"
                    >
                      <AddAPhoto className="w-5 h-5" />
                      Select Plant Photo
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Progress mock (only shown when file selected) */}
            {selectedFile && (
              <div className="bg-surface-container-low rounded-[1.5rem] p-6 flex items-center gap-6 border border-emerald-900/5 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-16 h-16 bg-surface-container-highest rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  {preview && <img src={preview} alt="thumb" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-headline font-semibold text-primary truncate max-w-[200px]">{selectedFile.name}</p>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors active:scale-90"
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8 }} className="h-full signature-gradient rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant/60">
                    <span>{(selectedFile.size / 1024).toFixed(0)} KB · {selectedFile.type}</span>
                    <span className="text-emerald-700">COMPLETED</span>
                  </div>
                </div>
              </div>
            )}

            {/* Use AI Diagnosis button */}
            <button
              type="button"
              onClick={() => setUseAI(true)}
              className="w-full py-4 signature-gradient text-white rounded-2xl font-headline font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              ✨ Run AI Diagnosis Pipeline
            </button>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-emerald-900/5">
              <div className="aspect-square relative group">
                {preview ? (
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={preview} alt="Selected file" />
                ) : (
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=600" alt="Leaf preview" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Filename</span>
                    <p className="text-white font-headline font-bold truncate">{selectedFile?.name ?? 'No file selected'}</p>
                  </div>
                  {selectedFile && (
                    <button type="button" onClick={clearFile} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                      <Close className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Metadata</span>
                  <span className="text-xs text-on-surface-variant">{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '—'}</span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-emerald-800">📍</div>
                    <p className="text-sm text-on-surface">Field Sector A-12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-emerald-800" />
                    <p className="text-sm text-on-surface">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => selectedFile ? setUseAI(true) : fileInputRef.current?.click()}
                  className="w-full py-4 signature-gradient text-white rounded-xl font-headline font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all"
                >
                  <Analytics className="w-6 h-6" />
                  {selectedFile ? 'Analyze' : 'Choose Photo'}
                </button>
              </div>
            </div>

            <div className="bg-tertiary-container rounded-[1.5rem] p-6 text-on-tertiary">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-on-tertiary-container" />
                <h4 className="font-headline font-bold text-on-tertiary-container">Pro Tip</h4>
              </div>
              <p className="text-sm leading-relaxed text-on-tertiary-container/80">
                For highly accurate results, capture both the upper and lower surfaces of the leaf. Ensure there is no direct glare from the sun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
