import { NavLink } from "react-router";

import { appConfig } from "~/config/app";

const navigationItems = [
  { to: "/", label: "Dashboard" },
  { to: "/requests", label: "Requests" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <div className="app-shell">
        <aside className="sidebar-panel">
          <div>
            <p className="brand-mark">{appConfig.appName}</p>
            <p className="brand-subtitle">
              Front-end scaffold for a REST-driven backoffice.
            </p>
          </div>

          <nav className="nav-list" aria-label="Primary">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p className="eyebrow">API target</p>
            <p>{appConfig.apiBaseUrl}</p>
          </div>
        </aside>

        <main className="content-panel">{children}</main>
      </div>
    </div>
  );
}
