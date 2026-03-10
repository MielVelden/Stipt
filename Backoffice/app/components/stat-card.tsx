interface StatCardProps {
  label: string;
  value: string;
  copy: string;
}

export function StatCard({ label, value, copy }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="eyebrow">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-copy">{copy}</p>
    </article>
  );
}
