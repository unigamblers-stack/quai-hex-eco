window.ECO = {
  meta: {
    title: "Quai Hex Ecosystem Map",
    tagline: "A layer-by-layer map of the DeFi stack being ported and built natively on Quai — anchored on QHEX and the PulseChain diaspora.",
    updated: "2026-08-10",
    verdicts: {
      LIVE:        { label: "Live",         color: "#3ddc84" },
      IN_WORK:     { label: "In work",      color: "#ffd60a" },
      BUILD_FIRST: { label: "Build first",  color: "#6ee7ff" },
      DEFERRED:    { label: "Deferred",     color: "#9aa4b2" },
      INTEGRATION: { label: "Integration",  color: "#b983ff" },
      REFERENCE:   { label: "Reference",    color: "#f29e6d" }
    },
    effort: { S: "small", M: "medium", L: "large", XL: "x-large" }
  },

  layers: [
    { id: "L0", name: "Base & Settlement", desc: "Chain primitives and the canonical DEX layer everything else buildson top of." },
    { id: "L1", name: "DEX & ve Governance", desc: "Weighted/stable pools, veToken liquidity direction." },
    { id: "L2", name: "Lending & CDPs", desc: "Borrow against collateral; stablecoin issuance from troves." },
    { id: "L3", name: "Margin & Perps", desc: "Leveraged perps — the last greenfield gap on Quai." },
    { id: "L4", name: "Stablecoins & RWA", desc: "Native risk-off medium (QI, energy-pegged), CDP stablecoin, external RWA rails." },
    { id: "L5", name: "Staking, Yield & Tokens", desc: "HEX-style staking lobbies, yield aggregators, incentive tokens." },
    { id: "L6", name: "Ops, Data & MEV", desc: "Indexers, executors, keepers, oracles — the machinery." }
  ],

  protocols: [
    {
      id: "quai", name: "Quai Network", origin: "native", layer: "L0",
      what: "PoW greenfield L1 — 9 sharded chains with free conversion, replaces the poW/ETH base.",
      quai: { repo: "n/a", status: "The chain everything else deploys to", verdict: "LIVE", effort: null,
        note: "No PoS, so no native staking yield — staking-yield layers must be built (QHEX, Tewkenaire)." }
    },
    {
      id: "quaiswap", name: "QuaiSwap / Quainance", origin: "native", layer: "L0",
      what: "Twin UniV2-style DEXs — the liquidity base of the ecosystem.",
      quai: { repo: "~/quaiswap-ui", status: "Live on Cyprus-1 mainnet", verdict: "LIVE", effort: null,
        note: "21 pairs indexed; USDT/WQUAI is the USD anchor." }
    },
    {
      id: "lockup", name: "Quai Lockup Precompile", origin: "native", layer: "L0",
      what: "0x…0A per-chain precompile: miner/lockup ledger driving emission multipliers.",
      quai: { repo: "go-quai (params/core/vm)", status: "Native — no port needed", verdict: "LIVE", effort: null,
        note: "Dispatch by input length, no selectors, rejects readOnly — every staking vault must be a per-miner delegate ledger. Real curve is LINEAR interpolation per lockup byte (LMR spec)." }
    },
    {
      id: "phux", name: "PHUX (Port of Balancer v2)", origin: "ethereum", layer: "L1",
      what: "Weighted/stable pools + veToken governance. The one big vault primitive Quai lacks.",
      quai: { repo: "~/quai-balancer", status: "Contracts authored, phase 1 of port order", verdict: "BUILD_FIRST", effort: "M",
        note: "No oracle needed — start immediately. Vault+WeightedPoolFactory+WeightedMath compiled." }
    },
    {
      id: "phiat", name: "Phiat (Port of Aave v2)", origin: "ethereum", layer: "L2",
      what: "Supply/borrow lending market — Quai has none today.",
      quai: { repo: "~/quai-lending", status: "Scaffold; shared IPriceOracle ADR-001", verdict: "DEFERRED", effort: "L",
        note: "Blocked on Phase 0 oracle adapter — same IPriceOracle decision as Liquid Loans." }
    },
    {
      id: "loan", name: "Liquid Loans (USDL)", origin: "pulsechain", layer: "L2",
      what: "Liquity-style CDP: 110% collateral, 0% interest, stability pool.",
      quai: { repo: "~/quai-liquid-loans", status: "Deployed+verified on Orchard (chainId 15000), live vault open", verdict: "IN_WORK", effort: "S",
        note: "10/10 contracts live; vault open (1200 WQUAI→1000 USDL). Rule: multi-contract txs need EIP-2930 access lists. Next: keeper oracle updates + UI." }
    },
    {
      id: "phame", name: "PHAME (Port of GMX v1)", origin: "ethereum", layer: "L3",
      what: "Perp DEX with AMM-style pricing — the last missing DeFi leg.",
      quai: { repo: "~/quai-perps", status: "Scaffold", verdict: "DEFERRED", effort: "XL",
        note: "Needs keepers + signed price feeds + oracle. Last build, highest complexity." }
    },
    {
      id: "qi", name: "QI (Energy Dollar)", origin: "native", layer: "L4",
      what: "Second native currency — energy-pegged 'stablecoin replacement' on the UTXO ledger. Value anchored to hash/energy cost via mining difficulty, not to USD.",
      quai: { repo: "protocol-native", status: "Mainnet-active since Apr 2025; QUAI↔QI conversion on-chain", verdict: "LIVE", effort: null,
        note: "The chain's designated risk-off asset — makes a USD CDP stablecoin partially redundant. But energy-peg ≠ USD-peg: USDL still owns the USD bucket (DEX quoting, perp margin, bridged-USDT flows). Qi's own conversion has a 2-week output lock + slippage — it cannot be borrowed." }
    },
    {
      id: "usdl", name: "USDL (Native Stablecoin)", origin: "pulsechain", layer: "L4",
      what: "The CDP stablecoin from Liquid Loans — 0% borrow fee, stability-pool backed.",
      quai: { repo: "~/quai-liquid-loans", status: "Minted on Orchard — 1000 USDL live", verdict: "IN_WORK", effort: "S",
        note: "Qi-strategy revision (2026-08-10): if Qi matures as risk-off, USDL's 'stablecoin issuance' role is redundant — reframe as ZERO-INTEREST LEVERAGE vs QHEX stakes (the PulseChain hook). Keep on Orchard; no mainnet push until QHEX launch." }
    },
    {
      id: "usdy", name: "USDY (Ondo RWA)", origin: "ethereum", layer: "L4",
      what: "Tokenized US-Treasury yield stablecoin — external partner, not a fork.",
      quai: { repo: "integration", status: "No chain deploy yet", verdict: "INTEGRATION", effort: "S",
        note: "Integration item: gives USDL an institutional yield floor/bridge story. Needs Ondo side interest." }
    },
    {
      id: "qhex", name: "QHEX (HexAA Lobby)", origin: "ethereum", layer: "L5",
      what: "The HEX stake/lobby contract clone — our signature launch.",
      quai: { repo: "TBD (HexAA lobby contracts)", status: "Planning — contract port anchored on verified LMR curve", verdict: "IN_WORK", effort: "M",
        note: "Lock depths 2wk/3mo/6mo/12mo from the 0x…0A precompile; linear multiplier curve (verified 2026-08-05) — real Year-2 = 1.0268/1.0766/1.1914x, NOT the old docs table." }
    },
    {
      id: "tewken", name: "Tewkenaire", origin: "tron", layer: "L5",
      what: "Token + staking + farm (dividends) + bonding pool suite.",
      quai: { repo: "~/quai-tewken", status: "Compiles+tests clean; Orchard deploy pending", verdict: "IN_WORK", effort: "S",
        note: "12 Solidity files, 4/4 smoke tests. Needs deployer/custodian wallet decision." }
    },
    {
      id: "egg", name: "EGG (egg.fi / Cocoricos)", origin: "ethereum", layer: "L5",
      what: "Staking, voting, periodic burns, lockable distribution — 'multiplies yields by escrowing assets'. Product (egg.fi) went offline Apr 2025.",
      quai: { repo: "none yet", status: "Not ported; product dead — pattern only", verdict: "REFERENCE", effort: "M",
        note: "Port the PATTERN, not the product: staking+voting+burn hook is a good value-accrual template for QHEX/Tewkenaire once pools exist. Do not copy the aggregator UI." }
    },
    {
      id: "inc", name: "INC (Incentive)", origin: "pulsechain", layer: "L5",
      what: "PulseX incentive token for PLS liquid staking — validator-retention token design.",
      quai: { repo: "design only", status: "Not applicable as-is: Quai is PoW", verdict: "REFERENCE", effort: "L",
        note: "Port the DESIGN (emission to stakers of a scarce token) onto QHEX stakers instead of validators. Contrast: EGG burns vs INC emissions." }
    },
    {
      id: "screener", name: "QuaiScreener", origin: "native", layer: "L6",
      what: "DexScreener-class indexer — no external screener covers Quai.",
      quai: { repo: "~/quaiswap-ui (indexer/)", status: "Live on Railway; API public", verdict: "LIVE", effort: null,
        note: "18+ pairs, 8k+ swaps indexed; /rates conversion sampling live. Multi-zone blocked: rpc.quai.network 404s outside cyprus1." }
    },
    {
      id: "arb", name: "Arb Executor v2/v3", origin: "native", layer: "L6",
      what: "Atomic cross-DEX arb executor + autonomous bot.",
      quai: { repo: "~/quaiswap-ui", status: "V2 live 0x00467596…, bot live on Cyprus-1", verdict: "LIVE", effort: null,
        note: "Qi-scope wallet lesson: check isQuaiAddress() before funding. Roadmap: PulseChain expansion (HTT discounts)." }
    }
  ],

  roadmap: [
    { phase: "0", date: "2026-08", name: "Foundations already laying", items: [
      "Liquid Loans keeper oracle + UI on the Orchard deploy",
      "QHEX/HexAA lobby contracts written against verified LMR curve",
      "Tewkenaire deploy to Orchard (wallet decision)",
      "PHUX Phase 1: WeightedPools on Orchard"
    ] },
    { phase: "1", date: "2026-09", name: "Port push", items: [
      "Phiat lending v1 (simple IPriceOracle, USDL/QUAI feed)",
      "EGG-style aggregator fork with burn hook",
      "QuaiScreener multi-zone + pairs growth",
      "QHEX launch: lobby opens, stakes accrue"
    ] },
    { phase: "2", date: "2026-10", name: "Composition", items: [
      "veGovernance on PHUX",
      "Collateral diversity: QHEX stakes + USDL in Phiat",
      "USDY integration talks (RWA floor for USDL)",
      "Perps keeper infra (PHAME Phase 0)"
    ] },
    { phase: "3", date: "2026-Q4", name: "Full stack", items: [
      "PHAME v1 perps live",
      "INC-style emission layer for QHEX stakers",
      "Audit round + bug bounty",
      "Diaspora marketing push (PulseChain → Quai)"
    ] }
  ],

  roles: [
    { role: "Solidity / protocol", who: "1–2", focus: "Ports: PHUX→Phiat→PHAME; QHEX lobby; Tewkenaire deploy", gap: "Full-time contract review capacity" },
    { role: "Keepers & oracles", who: "1", focus: "Liquid Loans price feed loop; Phiat oracle adapter; PHAME signed feeds", gap: "No Chainlink/Pyth on Quai — homegrown feeds are THE bottleneck" },
    { role: "Indexer & backend", who: "1", focus: "QuaiScreener tail/API, multi-zone, history", gap: "None critical" },
    { role: "UI/UX", who: "1", focus: "quaiswap-ui shell; this map; screener polish", gap: "Design tokens are getting tired — light refresh" },
    { role: "Infra/ops", who: "1", focus: "Railway deploys, bot supervision, key hygiene, EIP-2930 tooling", gap: "Access-list generation is still manual" },
    { role: "Marketing/community", who: "1", focus: "Launch sequence, PulseChain diaspora, QHEX narrative", gap: "Not started — single biggest untapped lever" }
  ],

  tools: [
    { tool: "Hardhat + quais", use: "All contract workspaces", status: "dogfooded", note: "quais quirk: WebSocketProvider hangs in Node; raw-shim used for Orchard" },
    { tool: "Raw deploy shim + salt grind", use: "Orchard deploys", status: "live", note: "CREATE scope b0==0x00 && b1≤0x7F verified empirically; ALWAYS bake EIP-2930 access lists" },
    { tool: "EIP-2930 access lists", use: "Multi-contract txs", status: "required", note: "Without them multi-CALL txs revert silently burning full gas limit" },
    { tool: "Railway + Postgres", use: "quaiswap-ui app, screener API, indexer DB", status: "live", note: "~$4/mo Postgres inside Hobby credit" },
    { tool: "GitHub Actions", use: "Arb monitor (hourly notify)", status: "live", note: "Cross-checks the bot independently" },
    { tool: "Obsidian vault + cloudctx", use: "Project memory / handoff", status: "live", note: "Single source of truth for lessons learned" },
    { tool: "TradingView", use: "Market surveillance for entry/exit timing", status: "routine" }
  ],

  funding: [
    { item: "Self-funded (no raise)", detail: "All deploy gas, server costs, bot capital out of pocket.", status: "current" },
    { item: "Arb bot float", detail: "500 QUAI funded position on Cyprus-1 — profits fund operations.", status: "live" },
    { item: "Railway bill", detail: "Hobby plan + Postgres (~$3.50–4.50/mo) within credit.", status: "live" },
    { item: "Mainnet deploy gas", detail: "~22 QUAI per contract-suite deploy (V2 executor class).", status: "cost pattern" },
    { item: "Optional future: QHEX launch allocation", detail: "Small dev-share in QHEX tokens if the lobby launch lands; keeps incentive aligned.", status: "proposed" }
  ],

  marketing: [
    { channel: "Diaspora targeting", detail: "PulseChain community is battle-tested and orphaned by SEC noise — 'everything you built, on a cleaner chain'.", status: "planned" },
    { channel: "QuaiScreener as proof", detail: "Public indexer API + screener page = credibility artifact; 'the only screener that covers Quai'.", status: "live" },
    { channel: "QHEX launch event", detail: "Signature moment: HexAA lobby opens, real stakes accrue, multiplier curve live.", status: "planned" },
    { channel: "Airdrop design", detail: "QHEX early-staker + USDL early-adopter allocations (design only — INC reference).", status: "proposed" },
    { channel: "Content", detail: "Write-up of the verified LMR curve (docs contradicted on-chain truth) as 'we actually read the chain' piece.", status: "proposed" }
  ]
};