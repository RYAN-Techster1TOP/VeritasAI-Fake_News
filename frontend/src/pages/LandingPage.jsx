import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanSearch } from 'lucide-react';
import HeroScene from '../components/three/HeroScene.jsx';

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden">
      <HeroScene />
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col justify-center px-4 py-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-display text-sm uppercase tracking-[0.28em] text-ink-300"
        >
          VeritasAI
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl font-display text-4xl font-semibold leading-tight text-white md:text-6xl"
        >
          Detect fabricated narratives before they spread.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 max-w-xl text-lg text-ink-200"
        >
          Analyze articles, links, and screenshot claims with Hugging Face models
          and OCR — built for clarity, not clickbait.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link to="/register" className="btn-primary">
            <ScanSearch className="h-4 w-4" />
            Start analyzing
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center rounded-xl border border-white/20 px-5 py-2.5 text-ink-100 hover:bg-white/5"
          >
            Sign in
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
