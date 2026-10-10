export default function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-panel ${className}`}>
      {children}
    </div>
  );
}
