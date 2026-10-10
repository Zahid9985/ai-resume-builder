export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-ink text-white hover:bg-slate-800',
    secondary: 'bg-white text-ink border border-slate-300 hover:border-ink',
    accent: 'bg-citrus text-ink hover:bg-lime-200'
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
