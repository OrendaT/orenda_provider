import { saveAs } from "file-saver";

interface ExecutiveKpi {
  label: string;
  value: string | number;
}

interface ExecutiveHighlight {
  label: string;
  value: string;
  detail: string;
}

interface ExecutiveVisualSection {
  title: string;
  subtitle: string;
  dataUrl: string;
}

interface ProviderRankingRow {
  name: string;
  total: number;
  hoboken: number;
  edison: number;
  morning: number;
  afternoon: number;
  fullDay: number;
}

interface ExecutiveHtmlExportPayload {
  generatedAt: string;
  kpis: ExecutiveKpi[];
  highlights: ExecutiveHighlight[];
  sections: ExecutiveVisualSection[];
  providerRanking: ProviderRankingRow[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function downloadExecutiveHtmlReport({ generatedAt, kpis, highlights, sections, providerRanking }: ExecutiveHtmlExportPayload) {
  const kpiMarkup = kpis.map(({ label, value }) => `
    <article class="kpi-card">
      <p class="kpi-label">${escapeHtml(label)}</p>
      <p class="kpi-value">${escapeHtml(String(value))}</p>
    </article>
  `).join("");

  const highlightMarkup = highlights.map(({ label, value, detail }) => `
    <article class="highlight-card">
      <p class="highlight-label">${escapeHtml(label)}</p>
      <h3>${escapeHtml(value)}</h3>
      <p>${escapeHtml(detail)}</p>
    </article>
  `).join("");

  const sectionMarkup = sections.map(({ title, subtitle, dataUrl }) => `
    <article class="visual-card">
      <div class="visual-header">
        <p class="section-tag">Dashboard View</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="visual-frame">
        <img src="${dataUrl}" alt="${escapeHtml(title)}" />
      </div>
    </article>
  `).join("");

  const providerRows = providerRanking.map((provider, index) => `
    <tr>
      <td>${index + 1}</td>
      <td class="provider-name">${escapeHtml(provider.name)}</td>
      <td>${provider.total}</td>
      <td>${provider.hoboken}</td>
      <td>${provider.edison}</td>
      <td>${provider.morning}</td>
      <td>${provider.afternoon}</td>
      <td>${provider.fullDay}</td>
    </tr>
  `).join("") || `
    <tr>
      <td colspan="8" class="empty-state">No provider booking data available.</td>
    </tr>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Orenda Psychiatry — Executive Analysis</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Montserrat', sans-serif;
      color: #26153e;
      background:
        radial-gradient(circle at top left, rgba(148, 106, 214, 0.18), transparent 28%),
        linear-gradient(180deg, #f7f3fb 0%, #ffffff 24%, #f7f3fb 100%);
    }
    img { display: block; max-width: 100%; }
    .page {
      width: min(1280px, calc(100vw - 48px));
      margin: 24px auto 48px;
    }
    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 32px;
      padding: 56px;
      background: linear-gradient(135deg, #24103f 0%, #462d6d 52%, #7c5cb7 100%);
      color: white;
      box-shadow: 0 24px 80px rgba(36, 16, 63, 0.28);
    }
    .hero::after {
      content: "";
      position: absolute;
      inset: auto -120px -120px auto;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
    }
    .eyebrow {
      margin: 0 0 14px;
      font-size: 12px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.68);
      font-weight: 700;
    }
    h1 {
      margin: 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(52px, 7vw, 84px);
      line-height: 0.95;
      letter-spacing: -0.03em;
    }
    .hero-subtitle {
      max-width: 760px;
      margin: 18px 0 0;
      color: rgba(255,255,255,0.8);
      font-size: 18px;
      line-height: 1.7;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }
    .meta-pill {
      padding: 12px 16px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(255,255,255,0.1);
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.92);
    }
    .content {
      display: grid;
      gap: 28px;
      margin-top: 28px;
    }
    .panel {
      border-radius: 28px;
      border: 1px solid rgba(70, 45, 109, 0.12);
      background: rgba(255,255,255,0.9);
      box-shadow: 0 18px 50px rgba(36, 16, 63, 0.08);
      padding: 28px;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      margin-bottom: 20px;
    }
    .panel-header h2 {
      margin: 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 40px;
      line-height: 1;
      color: #24103f;
    }
    .panel-header p {
      margin: 8px 0 0;
      color: #6a5a84;
      font-size: 14px;
      line-height: 1.7;
    }
    .kpi-grid, .highlight-grid, .visual-grid {
      display: grid;
      gap: 18px;
    }
    .kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    .kpi-card {
      border-radius: 22px;
      background: linear-gradient(180deg, #ffffff 0%, #f7f3fb 100%);
      border: 1px solid #e3d8f1;
      padding: 22px;
    }
    .kpi-label {
      margin: 0 0 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #8167af;
      font-weight: 700;
    }
    .kpi-value {
      margin: 0;
      font-size: 34px;
      line-height: 1;
      color: #24103f;
      font-weight: 700;
    }
    .highlight-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .highlight-card {
      border-radius: 22px;
      padding: 24px;
      background: linear-gradient(180deg, #2d1b4e 0%, #462d6d 100%);
      color: white;
      min-height: 170px;
    }
    .highlight-label {
      margin: 0 0 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: rgba(255,255,255,0.64);
      font-weight: 700;
    }
    .highlight-card h3 {
      margin: 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 34px;
      line-height: 1;
    }
    .highlight-card p:last-child {
      margin: 12px 0 0;
      color: rgba(255,255,255,0.78);
      font-size: 14px;
      line-height: 1.7;
    }
    .visual-grid {
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    }
    .visual-card {
      border-radius: 24px;
      border: 1px solid #e3d8f1;
      background: linear-gradient(180deg, #fbf9fe 0%, #ffffff 100%);
      overflow: hidden;
    }
    .visual-header {
      padding: 22px 22px 16px;
    }
    .section-tag {
      margin: 0 0 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #8167af;
      font-weight: 700;
    }
    .visual-header h3 {
      margin: 0;
      font-size: 22px;
      line-height: 1.15;
      color: #24103f;
    }
    .visual-header p {
      margin: 10px 0 0;
      color: #6a5a84;
      font-size: 14px;
      line-height: 1.6;
    }
    .visual-frame {
      padding: 0 18px 18px;
    }
    .visual-frame img {
      width: 100%;
      border-radius: 20px;
      border: 1px solid #e3d8f1;
      background: #f8f6fb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 20px;
      border: 1px solid #e3d8f1;
    }
    thead {
      background: #2d1b4e;
      color: white;
    }
    th, td {
      padding: 14px 16px;
      text-align: center;
      font-size: 13px;
      border-bottom: 1px solid #ece4f5;
    }
    th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    tbody tr:nth-child(even) {
      background: #faf7fd;
    }
    tbody tr:last-child td {
      border-bottom: 0;
    }
    td.provider-name, th.provider-name {
      text-align: left;
      font-weight: 600;
      color: #24103f;
    }
    .empty-state {
      text-align: center;
      color: #6a5a84;
      padding: 28px 16px;
    }
    @media (max-width: 900px) {
      .page { width: min(100vw - 24px, 1280px); margin: 12px auto 28px; }
      .hero, .panel { padding: 20px; border-radius: 22px; }
      .panel-header { display: block; }
      .visual-grid { grid-template-columns: 1fr; }
      table { display: block; overflow-x: auto; }
    }
    @media print {
      body { background: white; }
      .page { width: 100%; margin: 0; }
      .hero, .panel, .visual-card, .highlight-card, .kpi-card { break-inside: avoid; box-shadow: none; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <p class="eyebrow">Orenda Psychiatry</p>
      <h1>Executive Analysis</h1>
      <p class="hero-subtitle">A clean, shareable executive snapshot of provider booking performance with branded KPI cards, preserved chart views, and a full provider ranking table.</p>
      <div class="meta-row">
        <span class="meta-pill">Generated ${escapeHtml(generatedAt)}</span>
        <span class="meta-pill">Provider bookings only</span>
        <span class="meta-pill">Formatted for browser, print, and save-to-drive workflows</span>
      </div>
    </header>

    <div class="content">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Executive Snapshot</h2>
            <p>Branded high-level numbers for quick review and leadership updates.</p>
          </div>
        </div>
        <div class="kpi-grid">${kpiMarkup}</div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Key Takeaways</h2>
            <p>Automatically summarized signals pulled from the current reporting dataset.</p>
          </div>
        </div>
        <div class="highlight-grid">${highlightMarkup}</div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Dashboard Views</h2>
            <p>Downloaded as fixed visuals so the charts keep the same proportions and formatting outside the app.</p>
          </div>
        </div>
        <div class="visual-grid">${sectionMarkup}</div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Provider Rankings</h2>
            <p>Full booking distribution by provider, office, and time block.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th class="provider-name">Provider</th>
              <th>Total</th>
              <th>Hoboken</th>
              <th>Edison</th>
              <th>Morning</th>
              <th>Afternoon</th>
              <th>Full Day</th>
            </tr>
          </thead>
          <tbody>${providerRows}</tbody>
        </table>
      </section>
    </div>
  </main>
</body>
</html>`;

  saveAs(new Blob([html], { type: "text/html;charset=utf-8" }), "Orenda_Psychiatry_Executive_Analysis.html");
}