interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: PageHeaderProps) {
  return (
    <header className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title">{title}</h1>
        <p className="section-copy">{description}</p>
      </div>
      {aside}
    </header>
  );
}
