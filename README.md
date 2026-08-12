# Quai Hex Ecosystem Map

Layer-by-layer map of the DeFi stack being ported and built natively on Quai —
anchored on **QHEX** (the HexAA lobby contract launch) and the PulseChain diaspora.

Pure static site (vanilla HTML/CSS/JS, no build step). All content lives in
`js/data.js`; `js/app.js` renders the layer map, filterable protocol matrix,
roadmap timeline, and ops/roles/funding/marketing tables.

## Contents

- **Layer map** — 7 layers (L0 Base & Settlement → L6 Ops, Data & MEV) with
  verdict-colored protocol chips
- **Protocol matrix** — filterable/searchable table: origin, layer, Quai repo
  & status, verdict, effort, notes
- **Roadmap** — 4 phases sequenced by dependency (no-oracle work first)
- **Ops** — roles & gaps, tooling, funding, marketing

## Verdicts

| Verdict | Meaning |
|---|---|
| LIVE | Running on-chain or in production |
| IN_WORK | Actively being built |
| BUILD_FIRST | Highest-priority next ports (no oracle dependency) |
| DEFERRED | Blocked (oracle/keeper dependent) |
| INTEGRATION | External partner rail, not a fork |
| REFERENCE | Design inspiration only |

## Develop

```sh
python3 -m http.server 8080
# or
npx serve -s .
```

## Deploy (Railway)

Static site — `railway.json` serves the repo root via `npx serve` on port 3000.
Connect the repo at https://railway.app and deploy; no environment variables.

## Data sources

Grounded in the project vault (`~/Desktop/dev-projects/Projects/` — Liquid
Loans Fork, Phame-Phiat-Phux Port, Tewkenaire Contracts, Hex + HexAA Lobby
Contracts, QuaiScreener, Arb Executor v2-v3, LMR-LMT Lockup Curve) plus live
research on the PulseChain originals (INC, EGG, USDY).

Not financial advice.