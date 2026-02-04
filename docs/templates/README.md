**Dashboard Templates**
These templates are ready-to-copy Vue SFCs that use the published `@stlhorizon/vue-ui` package to assemble a dashboard UI.

**Files**
1. `docs/templates/dashboard/DashboardShell.vue`
2. `docs/templates/dashboard/DashboardOverview.vue`
3. `docs/templates/dashboard/DashboardAnalytics.vue`
4. `docs/templates/dashboard/DashboardUsers.vue`

**Usage Steps**
1. Copy the templates into your target repo.
2. Ensure `@stlhorizon/vue-ui` is installed and its CSS is imported in your app entry.
3. Register the plugin globally or use the named imports shown in the templates.
4. Wire routes to the template pages and replace the mock data with your API data.

**Notes**
- `DashboardShell.vue` composes `Header` and `Sidebar` and exposes a slot for page content.
- The page templates assume Vue Router paths like `/dashboard`, `/dashboard/analytics`, and `/dashboard/users`.
- Replace demo charts and tables with real data sources once wired into your backend.
