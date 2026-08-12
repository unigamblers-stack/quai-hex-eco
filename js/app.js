(function () {
  "use strict";
  var D = window.ECO;
  var $ = function (id) { return document.getElementById(id); };

  var V = D.meta.verdicts;
  var effLabels = D.meta.effort;

  function verdictColor(v) { return (V[v] || {}).color || "#9aa4b2"; }
  function verdictLabel(v) { return (V[v] || {}).label || v; }

  /* ---------- hero ---------- */
  $("kicker").textContent = "Updated " + D.meta.updated + " · DeFi build map · not financial advice";
  $("lede").textContent = D.meta.tagline;
  $("updated").textContent = "Data as of " + D.meta.updated + " — grounded in the project vault (repos: ~/quai-*, quaiswap-ui).";
  $("footDate").textContent = D.meta.updated;

  var layerCount = D.layers.length;
  var liveCount = D.protocols.filter(function (p) { return p.quai.verdict === "LIVE"; }).length;
  var inWork = D.protocols.filter(function (p) { return p.quai.verdict === "IN_WORK"; }).length;
  $("stats").innerHTML =
    '<span class="stat"><b>' + D.protocols.length + "</b> protocols</span>" +
    '<span class="stat"><b>' + layerCount + "</b> layers</span>" +
    '<span class="stat"><b>' + liveCount + "</b> live</span>" +
    '<span class="stat"><b>' + inWork + "</b> in work</span>" +
    '<span class="stat"><b>' + (D.protocols.filter(function (p) { return p.quai.verdict === "DEFERRED" || p.quai.verdict === "BUILD_FIRST"; }).length) + "</b> queued</span>";

  /* ---------- layer map ---------- */
  var layerEl = $("layerList");
  D.layers.forEach(function (L) {
    var prots = D.protocols.filter(function (p) { return p.layer === L.id; });
    var card = document.createElement("div");
    card.className = "layer-card";
    var chips = prots.map(function (p) {
      var c = verdictColor(p.quai.verdict);
      var eff = p.quai.effort ? " <small>· " + p.quai.effort + "</small>" : "";
      return '<span class="chip" style="--c:' + c + '" title="' + (p.quai.note || p.what) + '">' +
        '<span class="lid">' + p.id + "</span>" + p.name + eff + "</span>";
    }).join("");
    card.innerHTML =
      '<div class="layer-id">' + L.id + "</div>" +
      '<div class="layer-name">' + L.name + "</div>" +
      '<div class="layer-desc">' + L.desc + "</div>" +
      '<div class="layer-chips">' + chips + "</div>";
    layerEl.appendChild(card);
  });

  /* ---------- matrix ---------- */
  var filterEl = $("filters");
  var filters = { q: "", layer: "all", verdict: "all", origin: "all", effort: "all" };

  function originList() {
    var set = {};
    D.protocols.forEach(function (p) { set[p.origin] = true; });
    return Object.keys(set).sort();
  }
  function effortList() {
    var set = {};
    D.protocols.forEach(function (p) { if (p.quai.effort) set[p.quai.effort] = true; });
    return Object.keys(set).sort();
  }

  function selOpts(key, list, allLabel) {
    var opts = '<option value="all">' + allLabel + "</option>";
    list.forEach(function (v) {
      opts += '<option value="' + v + '">' + v + "</option>";
    });
    return '<select data-f=' + key + ">" + opts + "</select>";
  }

  filterEl.innerHTML =
    '<input type="search" data-f="q" placeholder="Search protocols…">' +
    selOpts("layer", D.layers.map(function (l) { return l.id; }), "Layer: all") +
    selOpts("verdict", Object.keys(V), "Verdict: all") +
    selOpts("origin", originList(), "Origin: all") +
    selOpts("effort", effortList(), "Effort: all") +
    '<button class="btn-filter" id="clearFilters">Clear</button>';

  filterEl.addEventListener("input", function (e) {
    if (e.target.dataset && e.target.dataset.f !== undefined) {
      filters[e.target.dataset.f] = e.target.value;
      renderMatrix();
    }
  });
  $("clearFilters").addEventListener("click", function () {
    filterEl.querySelectorAll("[data-f]").forEach(function (el) {
      if (el.tagName === "INPUT") { el.value = ""; filters.q = ""; }
      else { el.value = "all"; filters[el.dataset.f] = "all"; }
    });
    renderMatrix();
  });

  var rows = D.protocols.map(function (p) {
    var vc = verdictColor(p.quai.verdict);
    return {
      p: p,
      html:
        "<tr data-id='" + p.id + "'>" +
        "<td><b>" + p.name + "</b><br><span class='mono'>" + p.id + "</span></td>" +
        "<td>" + p.origin + "</td>" +
        '<td><span class="mono">' + p.layer + "</span></td>" +
        "<td>" + p.quai.repo + "<br><span style='color:var(--muted);font-size:12px'>" + p.quai.status + "</span></td>" +
        '<td><span class="pill" style="--c:' + vc + '">' + verdictLabel(p.quai.verdict) + "</span></td>" +
        "<td>" + (p.quai.effort ? '<span class="mono">' + p.quai.effort + " <span style='color:var(--muted)'>(" + effLabels[p.quai.effort] + ")</span></span>" : '—') + "</td>" +
        '<td class="note-cell">' + p.quai.note + "</td>" +
        "</tr>"
    };
  });

  function renderMatrix() {
    var q = filters.q.trim().toLowerCase();
    var out = rows.filter(function (r) {
      var p = r.p;
      if (filters.layer !== "all" && p.layer !== filters.layer) return false;
      if (filters.verdict !== "all" && p.quai.verdict !== filters.verdict) return false;
      if (filters.origin !== "all" && p.origin !== filters.origin) return false;
      if (filters.effort !== "all" && p.quai.effort !== filters.effort) return false;
      if (q) {
        var hay = (p.name + " " + p.id + " " + p.what + " " + p.quai.repo + " " + p.quai.note + " " + p.origin).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    $("matrixBody").innerHTML = out.map(function (r) { return r.html; }).join("");
    $("matrixCount").textContent = out.length + " of " + rows.length + " protocols shown";
  }
  renderMatrix();

  /* ---------- roadmap ---------- */
  var tl = $("timeline");
  D.roadmap.forEach(function (ph) {
    var div = document.createElement("div");
    div.className = "tl-item";
    div.innerHTML =
      '<div class="tl-phase">Phase ' + ph.phase + "</div>" +
      '<div class="tl-date">' + ph.date + "</div>" +
      "<div>" +
      '<div class="tl-name">' + ph.name + "</div>" +
      '<div class="tl-items">' + ph.items.map(function (i) { return "<span>" + i + "</span>"; }).join("") + "</div>" +
      "</div>";
    tl.appendChild(div);
  });

  /* ---------- ops tables ---------- */
  function fill(id, keys, rows) {
    var tb = $(id).querySelector("tbody");
    tb.innerHTML = rows.map(function (r) {
      var tds = keys.map(function (k) {
        return k === "st" ? '<td class="st">' + r[k] + "</td>" : "<td>" + r[k] + "</td>";
      }).join("");
      return "<tr>" + tds + "</tr>";
    }).join("");
  }
  fill("rolesTable", ["role", "who", "focus", "gap"], D.roles.map(function (r) { return { role: r.role, who: r.who, focus: r.focus, gap: r.gap }; }));
  fill("toolsTable", ["tool", "use", "st", "note"], D.tools.map(function (t) { return { tool: t.tool, use: t.use, st: t.status, note: t.note }; }));
  fill("fundingTable", ["item", "detail", "st"], D.funding.map(function (f) { return { item: f.item, detail: f.detail, st: f.status }; }));
  fill("marketingTable", ["channel", "detail", "st"], D.marketing.map(function (m) { return { channel: m.channel, detail: m.detail, st: m.status }; }));
})();