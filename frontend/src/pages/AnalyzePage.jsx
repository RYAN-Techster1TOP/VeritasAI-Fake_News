import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeImage, analyzeText, analyzeUrl } from '../services/analysisService.js';
import VerdictBadge from '../components/VerdictBadge.jsx';

const tabs = [
  { id: 'text', label: 'Text Claim' },
  { id: 'url', label: 'Article URL' },
  { id: 'image', label: 'Image Screenshot' },
];

export default function AnalyzePage() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      let response;
      if (mode === 'text') {
        if (!text.trim()) throw new Error('Please enter article or claim text');
        response = await analyzeText(text);
      } else if (mode === 'url') {
        if (!url.trim()) throw new Error('Please enter a valid web URL');
        response = await analyzeUrl(url);
      } else if (mode === 'image') {
        if (!file) throw new Error('Please select an image file to analyze');
        response = await analyzeImage(file);
      }
      setResult(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Analyze claim</h1>
      <p className="mt-2 text-ink-300">
        Submit raw text, a public news article URL, or an image screenshot for AI credibility verification.
      </p>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === tab.id
                ? 'bg-ink-500 text-white shadow-sm'
                : 'bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.form
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="panel mt-4 space-y-4 p-6"
      >
        {mode === 'text' && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-300">
              Claim or Article Text
            </label>
            <textarea
              required
              rows={7}
              placeholder="Paste news article excerpt or viral post text..."
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-ink-400 focus:ring-1 focus:ring-ink-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}

        {mode === 'url' && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-300">
              Article Web Address (URL)
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/news/article-slug"
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-ink-400 focus:ring-1 focus:ring-ink-400"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        {mode === 'image' && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-300">
              Image File (Screenshot / Clipping)
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-ink-200 file:mr-4 file:rounded-xl file:border-0 file:bg-ink-500 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-ink-400"
            />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-signal-fake/20 p-3.5 text-sm text-red-200 border border-signal-fake/30">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Running AI model & OCR...
            </span>
          ) : (
            'Run credibility analysis'
          )}
        </button>
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel mt-6 space-y-4 p-6"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold">Verification Verdict</h2>
              <p className="text-xs text-ink-300 mt-0.5">Input type: {result.inputType}</p>
            </div>
            <VerdictBadge verdict={result.verdict} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4">
              <span className="text-xs uppercase text-ink-300 font-medium">Confidence Rating</span>
              <p className="mt-1 font-display text-2xl font-bold text-white">
                {(Number(result.confidence || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <span className="text-xs uppercase text-ink-300 font-medium">Model Recommendation</span>
              <p className="mt-1 text-sm font-medium text-ink-100 capitalize">
                {result.verdict === 'real'
                  ? 'Highly Credible Source Signal'
                  : result.verdict === 'fake'
                  ? 'High Risk of Misinformation'
                  : 'Requires Secondary Cross-Reference'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-ink-100">Analysis Summary</h3>
            <p className="text-sm text-ink-200 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
              {result.explanation}
            </p>
          </div>

          {result.extractedText && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-ink-100">OCR Extracted Text</h3>
              <p className="text-xs text-ink-300 italic bg-black/20 p-3 rounded-xl max-h-32 overflow-y-auto">
                "{result.extractedText}"
              </p>
            </div>
          )}

          {!!result.labels?.length && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300">Model Scores Breakdown</h3>
              <div className="space-y-1.5">
                {result.labels.slice(0, 5).map((item) => (
                  <div key={`${item.label}-${item.score}`} className="flex items-center justify-between text-sm">
                    <span className="text-ink-200 font-mono text-xs">{item.label}</span>
                    <span className="text-ink-300 font-medium">{(Number(item.score) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
