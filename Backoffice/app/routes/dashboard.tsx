import type { Route } from "./+types/dashboard";
import { Link } from "react-router";

import { PageHeader } from "~/components/page-header";
import { StatCard } from "~/components/stat-card";
import { requestTemplates, dashboardStats } from "~/services/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | Backoffice Console" },
    {
      name: "description",
      content: "Backoffice front-end scaffold for REST API operations.",
    },
  ];
}

export default function DashboardRoute() {
  return (
    <div className="hero-grid">
      <section className="hero-card">
        <PageHeader
          eyebrow="Overview"
          title="Build the UI around your API contracts."
          description="Use route loaders, forms, and feature modules to turn REST endpoints into backoffice workflows."
          aside={<span className="status-pill">API connected via services</span>}
        />

        <div className="button-row">
          <Link className="button-primary" to="/requests">
            Review endpoints
          </Link>
          <Link className="button-secondary" to="/settings">
            Configure environment
          </Link>
        </div>
      </section>

      <section>
        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              copy={stat.copy}
            />
          ))}
        </div>
      </section>

      <section className="request-grid">
        {requestTemplates.map((request) => (
          <article key={request.id} className="request-card">
            <span className="request-method">{request.method}</span>
            <h2>{request.name}</h2>
            <p className="request-path">{request.path}</p>
            <p className="request-meta">{request.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
