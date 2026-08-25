/**
 * The demo dataset. In the real product this comes from `GET /v1/deploys`;
 * here it is a static fixture so the marketing site and the dashboard can be
 * served as a plain static bundle.
 */
export const deploys = [
  {
    service: "checkout-api",
    sha: "a3f19c2",
    author: "Rhea Kapoor",
    initials: "RK",
    deployedAt: "16:42",
    latencyDelta: -12,
    errorRate: 0.04,
    verdict: "healthy",
  },
  {
    service: "web-storefront",
    sha: "7d40e18",
    author: "Marco Silva",
    initials: "MS",
    deployedAt: "16:05",
    latencyDelta: 3,
    errorRate: 0.02,
    verdict: "healthy",
  },
  {
    service: "ledger-worker",
    sha: "bb92004",
    author: "Ana Ferreira",
    initials: "AF",
    deployedAt: "15:28",
    latencyDelta: 41,
    errorRate: 0.31,
    verdict: "regressed",
  },
  {
    service: "search-indexer",
    sha: "c0d5511",
    author: "Tomas Nowak",
    initials: "TN",
    deployedAt: "14:57",
    latencyDelta: 8,
    errorRate: 0.06,
    verdict: "watch",
  },
  {
    service: "notifications",
    sha: "1f7ab30",
    author: "Priya Menon",
    initials: "PM",
    deployedAt: "13:19",
    latencyDelta: -4,
    errorRate: 0.01,
    verdict: "healthy",
  },
  {
    service: "identity-gateway",
    sha: "9e2c7d4",
    author: "Sam Okafor",
    initials: "SO",
    deployedAt: "11:46",
    latencyDelta: 0,
    errorRate: 0.03,
    verdict: "healthy",
  },
];

/** p95 latency samples, 09:00–17:00 UTC, one point every 20 minutes. */
export const latencySeries = [
  196, 201, 198, 205, 210, 199, 194, 190, 203, 214, 226, 241, 262, 248, 231, 220, 214, 209, 206,
  212, 218, 224, 219, 213, 208,
];

export const baselineSeries = [
  198, 199, 200, 201, 202, 200, 198, 197, 199, 201, 203, 204, 205, 204, 203, 202, 202, 201, 200,
  201, 202, 203, 203, 202, 201,
];
