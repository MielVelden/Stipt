import type { Route } from "./+types/settings";

import { PageHeader } from "~/components/page-header";
import { environmentSettings } from "~/services/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings | Backoffice Console" }];
}

export default function SettingsRoute() {
  return (
    <section className="settings-list">
      <PageHeader
        eyebrow="Settings"
        title="Centralize client-side configuration."
        description="Keep API base URL and request behavior in one predictable place, with room to add authentication later."
      />

      <div className="settings-grid">
        {environmentSettings.map((setting) => (
          <article key={setting.id} className="settings-card">
            <label className="field-label" htmlFor={setting.id}>
              {setting.label}
            </label>
            <input
              id={setting.id}
              className="text-input"
              defaultValue={setting.value}
              readOnly
            />
            <p className="field-note">{setting.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
