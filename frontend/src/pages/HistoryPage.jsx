import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory } from '../services/analysisService.js';
import VerdictBadge from '../components/VerdictBadge.jsx';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getHistory();
        setItems(data.analyses || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Analysis history</h1>
      <p className="mt-2 text-ink-300">Your latest 50 analyses, newest first.</p>

      {loading && <p className="mt-8 text-ink-300">Loading...</p>}
      {error && <p className="mt-8 rounded-lg bg-signal-fake/20 px-3 py-2 text-sm text-red-200">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="mt-8 text-ink-300">No analyses yet. Run your first check.</p>
      )}

      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <motion.article
            key={item._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="panel p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm uppercase tracking-wide text-ink-300">{item.inputType}</p>
              <VerdictBadge verdict={item.verdict} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-ink-100">
              {item.sourceText || item.sourceUrl || item.extractedText || '—'}
            </p>
            <p className="mt-2 text-xs text-ink-400">
              {(Number(item.confidence) * 100).toFixed(1)}% ·{' '}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
