export default function TagList({ items = [], tone = 'neutral' }) {
  const color = tone === 'good' ? 'bg-emerald-50 text-emerald-800' : tone === 'warn' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700';
  if (!items.length) return <p className="text-sm text-slate-500">No items returned yet.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${color}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
