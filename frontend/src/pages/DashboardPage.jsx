import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, History, Image, Link2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getHistory } from '../services/analysisService.js';
import VerdictBadge from '../components/VerdictBadge.jsx';

const tiles = [
  {
    to: '/analyze',
    title: 'Analyze Content',
    copy: 'Run multimodal checks on text, URLs, or OCR image screenshots.',
    icon: FileSearch,
  },
  {
    to: '/history',
    title: 'Review History',
    copy: 'Inspect past verifications, confidence scores, and raw model signals.',
    icon: History,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, realCount: 0, fakeCount: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await getHistory();
        const items = data.analyses || [];
        setRecent(items.slice(0, 3));
        
        const real = items.filter((i) => i.verdict === 'real').length;
        const fake = items.filter((i) => i.verdict === 'fake').length;
        setStats({ total: items.length, realCount: real, fakeCount: fake });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.25em] text-ink-300 font-medium">Analyst Operations</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Welcome back, {user?.name?.split(' ')[0] || 'Analyst'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-200">
          Multimodal fake news and claim evaluation powered by Hugging Face NLP and OCR analysis engines.
        </p>
      </motion.div>

      {/* Metrics Row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-300">Total Analyzed</span>
            <ShieldCheck className="h-5 w-5 text-ink-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">{loading ? '...' : stats.total}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Verified Real</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-emerald-200">{loading ? '...' : stats.realCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Flagged Fake</span>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-red-200">{loading ? '...' : stats.fakeCount}</p>
        </motion.div>
      </div>

      {/* Quick Access Tiles */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + 0.08 * i }}
          >
            <Link to={tile.to} className="panel group block p-6 transition hover:bg-white/10 hover:border-white/20">
              <tile.icon className="mb-4 h-6 w-6 text-ink-300 transition group-hover:text-white" />
              <h2 className="font-display text-xl font-semibold">{tile.title}</h2>
              <p className="mt-1 text-sm text-ink-300">{tile.copy}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      {recent.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent Verifications</h2>
            <Link to="/history" className="text-xs text-ink-300 hover:text-white underline-offset-2 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((item) => (
              <div key={item._id} className="panel p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono text-ink-300">{item.inputType}</span>
                    <span className="text-xs text-ink-400">• {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-ink-100">
                    {item.sourceText || item.sourceUrl || item.extractedText || '—'}
                  </p>
                </div>
                <VerdictBadge verdict={item.verdict} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
