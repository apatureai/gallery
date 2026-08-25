import { baselineSeries, deploys, latencySeries } from "./deploys.js";

const VERDICT_LABELS = {
  healthy: { text: "Healthy", className: "badge badge--ok" },
  watch: { text: "Watch", className: "badge badge--warn" },
  regressed: { text: "Regressed", className: "badge badge--risk" },
};

function formatDelta(ms) {
  if (ms === 0) return "no change";
  return `${ms > 0 ? "+" : "−"}${Math.abs(ms)} ms`;
}

function renderRows() {
  const body = document.querySelector("#deploy-rows");
  if (!body) return;

  body.innerHTML = deploys
    .map((d) => {
      const verdict = VERDICT_LABELS[d.verdict];
      return `
        <tr>
          <td class="table__service">${d.service}</td>
          <td class="table__sha">${d.sha}</td>
          <td>
            <span class="table__author">
              <span class="avatar avatar--sm" aria-hidden="true">${d.initials}</span>
              ${d.author}
            </span>
          </td>
          <td class="table__num">${d.deployedAt}</td>
          <td class="table__num">${formatDelta(d.latencyDelta)}</td>
          <td class="table__num">${d.errorRate.toFixed(2)}%</td>
          <td><span class="${verdict.className}"><span class="badge__dot" aria-hidden="true"></span>${verdict.text}</span></td>
          <td><button class="row-action" type="button">Details</button></td>
        </tr>
      `;
    })
    .join("");
}

/** A small dependency-free area chart, drawn as inline SVG. */
function renderChart() {
  const mount = document.querySelector("#chart-mount");
  if (!mount) return;

  const width = 960;
  const height = 260;
  const padding = { top: 16, right: 28, bottom: 28, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const all = [...latencySeries, ...baselineSeries];
  const min = Math.floor(Math.min(...all) / 20) * 20 - 20;
  const max = Math.ceil(Math.max(...all) / 20) * 20;

  const x = (i, series) => padding.left + (i / (series.length - 1)) * plotWidth;
  const y = (v) => padding.top + plotHeight - ((v - min) / (max - min)) * plotHeight;

  const line = (series) =>
    series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i, series).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const area = `${line(latencySeries)} L${x(latencySeries.length - 1, latencySeries).toFixed(1)},${(
    padding.top + plotHeight
  ).toFixed(1)} L${padding.left},${(padding.top + plotHeight).toFixed(1)} Z`;

  const ticks = [min, Math.round((min + max) / 2), max];
  const gridLines = ticks
    .map(
      (t) =>
        `<line x1="${padding.left}" x2="${width - padding.right}" y1="${y(t).toFixed(1)}" y2="${y(
          t,
        ).toFixed(1)}" stroke="var(--border-subtle)" stroke-width="1" />` +
        `<text x="${padding.left - 10}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--text-secondary)">${t}</text>`,
    )
    .join("");

  const hourLabels = ["09:00", "11:00", "13:00", "15:00", "17:00"]
    .map((label, i, arr) => {
      const px = padding.left + (i / (arr.length - 1)) * plotWidth;
      return `<text x="${px.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="var(--text-secondary)">${label}</text>`;
    })
    .join("");

  mount.innerHTML = `
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img"
         aria-label="p95 latency rose from about 195 to 262 milliseconds after the 15:28 ledger-worker deploy, then recovered to about 208.">
      <defs>
        <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-brand-500)" stop-opacity="0.22" />
          <stop offset="100%" stop-color="var(--color-brand-500)" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${area}" fill="url(#latencyFill)" />
      <path d="${line(baselineSeries)}" fill="none" stroke="var(--color-neutral-300)" stroke-width="2" stroke-dasharray="4 4" />
      <path d="${line(latencySeries)}" fill="none" stroke="var(--color-brand-600)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      ${hourLabels}
    </svg>
  `;
}

function wireSegmentedControl() {
  const group = document.querySelector(".segmented");
  if (!group) return;
  group.addEventListener("click", (event) => {
    const button = event.target.closest(".segmented__option");
    if (!button) return;
    for (const option of group.querySelectorAll(".segmented__option")) {
      option.setAttribute("aria-pressed", String(option === button));
    }
  });
}

renderRows();
renderChart();
wireSegmentedControl();
