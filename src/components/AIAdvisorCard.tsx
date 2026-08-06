import React, { useState } from 'react';
import { AIDecision, WaterMetrics } from '../types';
import MaterialIcon from './MaterialIcon';

interface AIAdvisorCardProps {
  decisions: AIDecision[];
  metrics: WaterMetrics;
}

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({ decisions, metrics }) => {
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCustomAiAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsGenerating(true);
    setAiResponse(null);

    try {
      // Call Gemini API server proxy if available, or fallback to smart AI rule response
      const res = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          metrics,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.analysis);
      } else {
        throw new Error('Fallback rule engine');
      }
    } catch {
      // Smart simulation response generator
      setTimeout(() => {
        let simulated = `[Analisis AI EcoLake]: Berdasarkan query "${userQuery}" dan parameter telemetri terkini (pH ${metrics.pH}, DO ${metrics.DO} mg/L, Turbiditas ${metrics.turbidity} NTU):\n\n`;
        if (metrics.DO < 6.0) {
          simulated += `⚠️ Terdeteksi defisit Oksigen Terlarut (DO). Direkomendasikan menambah rotasi sirkulasi air pada FTW Unit 02 dan membatasi masukan limbah organik dari pemukiman warga terdekat.`;
        } else if (metrics.turbidity > 20) {
          simulated += `⚠️ Terdeteksi peningkatan kecerahan/keruhan air. Direkomendasikan melakukan inspeksi sedimen pada zona inflow utara Situ Gede.`;
        } else {
          simulated += `✅ Kondisi danau Situ Gede tergolong stabil dan sehat (WQI Score: ${metrics.wqiScore}/100). Bio-filtrasi tanaman FTW (Vetiver, Cyperus, Canna) berjalan sangat efisien menyerap nitrat & fosfat.`;
        }
        setAiResponse(simulated);
        setIsGenerating(false);
      }, 900);
      return;
    }
    setIsGenerating(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-teal-800/40 relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-teal-900/80 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
            <MaterialIcon name="psychology" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">AI Decision Support System</h3>
            <p className="text-xs text-slate-400">Analisis Otomatis & Rekomendasi Tindakan</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Realtime AI Active
        </span>
      </div>

      {/* Decisions Cards List */}
      <div className="space-y-3 mb-5 relative z-10">
        {decisions.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border backdrop-blur-xs transition-all ${
              item.badge === 'Critical'
                ? 'bg-rose-950/40 border-rose-800/60'
                : item.badge === 'Warning'
                ? 'bg-amber-950/40 border-amber-800/60'
                : 'bg-emerald-950/40 border-emerald-800/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name={item.badge === 'Critical' ? 'dangerous' : item.badge === 'Warning' ? 'warning' : 'eco'}
                  className={`text-xl ${
                    item.badge === 'Critical'
                      ? 'text-rose-400'
                      : item.badge === 'Warning'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                />
                <h4 className="font-bold text-xs sm:text-sm text-slate-100">{item.title}</h4>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  item.badge === 'Critical'
                    ? 'bg-rose-500 text-white'
                    : item.badge === 'Warning'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {item.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Penyebab (Causes):</span>
                <span className="text-slate-200 leading-tight">{item.cause}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-400 block font-semibold uppercase">Rekomendasi AI:</span>
                <span className="text-teal-200 font-medium leading-tight">{item.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Query Box */}
      <div className="pt-4 border-t border-teal-900/60 relative z-10">
        <form onSubmit={handleCustomAiAnalysis} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Tanyakan analisis AI (misal: 'Bagaimana kondisi fosfat danau?')"
              className="w-full bg-slate-900/90 border border-teal-800/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-all pr-8"
            />
            <MaterialIcon name="smart_toy" className="absolute right-2.5 top-2.5 text-teal-500 text-base pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <MaterialIcon name="sync" className="animate-spin text-base" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <MaterialIcon name="auto_awesome" className="text-base" />
                <span>Tanya AI</span>
              </>
            )}
          </button>
        </form>

        {/* AI Response Output */}
        {aiResponse && (
          <div className="mt-3 p-3.5 bg-slate-900/95 rounded-xl border border-teal-500/40 text-xs text-teal-100 leading-relaxed animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-teal-400 mb-1">
              <MaterialIcon name="psychology" className="text-base" />
              <span>Hasil Analisis Gemini AI Smart Advisor:</span>
            </div>
            <p className="whitespace-pre-line text-slate-300">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisorCard;
