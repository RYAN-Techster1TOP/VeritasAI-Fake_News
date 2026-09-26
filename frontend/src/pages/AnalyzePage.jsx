import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeImage, analyzeText, analyzeUrl } from '../services/analysisService.js';
import VerdictBadge from '../components/VerdictBadge.jsx';

const tabs = [
  { id: 'text', label: 'Text' },
  { id: 'url', label: 'URL' },
  { id: 'image', label: 'Image' },
];

export default function AnalyzePage() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      let response;
      if (mode === 'text') response = await analyzeText(text);
      if (mode === 'url') response = await analyzeUrl(url);
      if (mode === 'image') response = await analyzeImage(file);
      setResult(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Analyze claim</h1>
      <p className="mt-2 text-ink-300">
        Submit article text, a public URL, or an image containing text.
      </p>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              mode === tab.id ? 'bg-ink-500 text-white' : 'bg-white/5 text-ink-300 hover:bg-white/10'
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
        className="panel mt-4 space-y-4 p-5"
      >
        {mode === 'text' && (
          <textarea
            required
            rows={8}
            placeholder="Paste article or claim text..."
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-ink-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        {mode === 'url' && (
          <input
            type="url"
            required
            placeholder="https://example.com/article"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-ink-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}
        {mode === 'image' && (
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-ink-200 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-500 file:px-3 file:py-2 file:text-white"
          />
        )}

        {error && <p className="rounded-lg bg-signal-fake/20 px-3 py-2 text-sm text-red-200">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Running model...' : 'Run analysis'}
        </button>
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel mt-6 space-y-3 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Result</h2>
            <VerdictBadge verdict={result.verdict} />
          </div>
          <p className="text-sm text-ink-200">
            Confidence: {(Number(result.confidence) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-ink-300">{result.explanation}</p>
          {!!result.labels?.length && (
            <ul className="space-y-1 text-sm text-ink-200">
              {result.labels.slice(0, 5).map((item) => (
                <li key={`${item.label}-${item.score}`}>
                  {item.label}: {(Number(item.score) * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  );
}
