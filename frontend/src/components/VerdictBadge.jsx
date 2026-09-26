const styles = {
  real: 'bg-signal-real/20 text-emerald-200 border-signal-real/40',
  fake: 'bg-signal-fake/20 text-red-200 border-signal-fake/40',
  uncertain: 'bg-signal-uncertain/20 text-amber-100 border-signal-uncertain/40',
  pending: 'bg-white/10 text-ink-200 border-white/20',
};

export default function VerdictBadge({ verdict = 'pending' }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${
        styles[verdict] || styles.pending
      }`}
    >
      {verdict}
    </span>
  );
}
