import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md place-items-center px-4 py-12">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="panel w-full space-y-4 p-6"
      >
        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-ink-300">Sign in to continue analyzing claims.</p>
        {error && <p className="rounded-lg bg-signal-fake/20 px-3 py-2 text-sm text-red-200">{error}</p>}
        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-ink-400"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-ink-400"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-ink-300">
          No account?{' '}
          <Link to="/register" className="text-white underline-offset-2 hover:underline">
            Create one
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
