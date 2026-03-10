import type { Route } from "./+types/requests";

import { PageHeader } from "~/components/page-header";
import { requestTemplates } from "~/services/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Requests | Backoffice Console" }];
}

export default function RequestsRoute() {
  return (
    <section>
      <PageHeader
        eyebrow="Requests"
        title="Shape API integrations by feature."
        description="Keep fetch logic in shared services, then let route modules focus on data loading and mutations."
      />

      <div className="request-grid">
        {requestTemplates.map((request) => (
          <article key={request.id} className="request-card">
            <span className="request-method">{request.method}</span>
            <h2>{request.name}</h2>
            <p className="request-path">{request.path}</p>
            <p className="request-meta">{request.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
