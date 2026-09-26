import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, History, Image, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const tiles = [
  {
    to: '/analyze',
    title: 'Analyze content',
    copy: 'Score text, URLs, or image screenshots.',
    icon: FileSearch,
  },
  {
    to: '/history',
    title: 'Review history',
    copy: 'Inspect past verdicts and confidence scores.',
    icon: History,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-300">Dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Hello, {user?.name?.split(' ')[0] || 'analyst'}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-200">
          Run multimodal checks with Hugging Face inference and OCR extraction.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
          >
            <Link to={tile.to} className="panel block p-5 transition hover:bg-white/10">
              <tile.icon className="mb-3 h-5 w-5 text-ink-300" />
              <h2 className="font-display text-xl">{tile.title}</h2>
              <p className="mt-1 text-sm text-ink-300">{tile.copy}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-300">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5">
          <FileSearch className="h-3.5 w-3.5" /> Text
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5">
          <Link2 className="h-3.5 w-3.5" /> URL
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5">
          <Image className="h-3.5 w-3.5" /> Image OCR
        </span>
      </div>
    </div>
  );
}
