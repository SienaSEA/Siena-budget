import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar,
} from "recharts";
import {
  LayoutDashboard, Receipt, Tags, Plus, Trash2, TrendingUp, TrendingDown,
  PiggyBank, Wallet, AlertTriangle, CheckCircle2, Pencil, X, Check, Table2, LogOut, Lock, Menu,
} from "lucide-react";
import { loadData, saveData } from "./dataClient.js";

// ---------------------------------------------------------------------------
// Data & constants
// ---------------------------------------------------------------------------

const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: "Nómina", tipo: "Ingreso", presupuesto: 0, esencial: null },
  { id: 2, nombre: "Vales", tipo: "Ingreso", presupuesto: 0, esencial: null },
  { id: 3, nombre: "Ahorro", tipo: "Ahorro", presupuesto: 0, esencial: true },
  { id: 4, nombre: "Tanda", tipo: "Ahorro", presupuesto: 0, esencial: true },
  { id: 5, nombre: "Nelo", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 6, nombre: "BBVA Seguro", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 7, nombre: "Mercado", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 8, nombre: "Movistar", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 9, nombre: "BBVA Prestamo", tipo: "Gasto", presupuesto: 0, esencial: false },
  { id: 10, nombre: "Telmex", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 11, nombre: "University", tipo: "Gasto", presupuesto: 0, esencial: true },
  { id: 12, nombre: "Auto", tipo: "Gasto", presupuesto: 0, esencial: false },
  { id: 13, nombre: "Renta", tipo: "Gasto", presupuesto: 0, esencial: true },
];

const MOVIMIENTOS_DEFAULT = [
  { id: 1, fecha: "2026-08-15", categoria: "Nelo", monto: 2630, notas: "" },
  { id: 2, fecha: "2026-08-15", categoria: "Mercado", monto: 1220, notas: "" },
  { id: 3, fecha: "2026-08-15", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 4, fecha: "2026-08-15", categoria: "Telmex", monto: 458, notas: "" },
  { id: 5, fecha: "2026-08-15", categoria: "Ahorro", monto: 9000, notas: "" },
  { id: 6, fecha: "2026-08-30", categoria: "Ahorro", monto: 5000, notas: "" },
  { id: 7, fecha: "2026-08-30", categoria: "Mercado", monto: 120, notas: "" },
  { id: 8, fecha: "2026-08-30", categoria: "Movistar", monto: 865.8, notas: "" },
  { id: 9, fecha: "2026-08-30", categoria: "Nelo", monto: 4000, notas: "" },
  { id: 10, fecha: "2026-08-30", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 11, fecha: "2026-08-30", categoria: "Vales", monto: 3500, notas: "" },
  { id: 12, fecha: "2026-09-15", categoria: "Ahorro", monto: 5500, notas: "" },
  { id: 13, fecha: "2026-09-15", categoria: "BBVA Seguro", monto: 1000, notas: "" },
  { id: 14, fecha: "2026-09-15", categoria: "Nelo", monto: 3260, notas: "" },
  { id: 15, fecha: "2026-09-15", categoria: "Nómina", monto: 11600, notas: "" },
  { id: 16, fecha: "2026-09-15", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 17, fecha: "2026-09-15", categoria: "Telmex", monto: 456, notas: "" },
  { id: 18, fecha: "2026-09-30", categoria: "Ahorro", monto: 5500, notas: "" },
  { id: 19, fecha: "2026-09-30", categoria: "Mercado", monto: 1200, notas: "" },
  { id: 20, fecha: "2026-09-30", categoria: "Movistar", monto: 825, notas: "" },
  { id: 21, fecha: "2026-09-30", categoria: "Nelo", monto: 1600, notas: "" },
  { id: 22, fecha: "2026-09-30", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 23, fecha: "2026-09-30", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 24, fecha: "2026-09-30", categoria: "Vales", monto: 3500, notas: "" },
  { id: 25, fecha: "2026-10-15", categoria: "Ahorro", monto: 6000, notas: "" },
  { id: 26, fecha: "2026-10-15", categoria: "BBVA Seguro", monto: 1000, notas: "" },
  { id: 27, fecha: "2026-10-15", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 28, fecha: "2026-10-15", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 29, fecha: "2026-10-30", categoria: "Ahorro", monto: 5000, notas: "" },
  { id: 30, fecha: "2026-10-30", categoria: "Mercado", monto: 850, notas: "" },
  { id: 31, fecha: "2026-10-30", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 32, fecha: "2026-10-30", categoria: "Renta", monto: 1500, notas: "" },
  { id: 33, fecha: "2026-10-30", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 34, fecha: "2026-10-30", categoria: "Vales", monto: 3500, notas: "" },
  { id: 35, fecha: "2026-11-15", categoria: "Ahorro", monto: 3500, notas: "" },
  { id: 36, fecha: "2026-11-15", categoria: "BBVA Seguro", monto: 1000, notas: "" },
  { id: 37, fecha: "2026-11-15", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 38, fecha: "2026-11-15", categoria: "Renta", monto: 2500, notas: "" },
  { id: 39, fecha: "2026-11-15", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 40, fecha: "2026-11-30", categoria: "Ahorro", monto: 3500, notas: "" },
  { id: 41, fecha: "2026-11-30", categoria: "Mercado", monto: 550, notas: "" },
  { id: 42, fecha: "2026-11-30", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 43, fecha: "2026-11-30", categoria: "Renta", monto: 2500, notas: "" },
  { id: 44, fecha: "2026-11-30", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 45, fecha: "2026-11-30", categoria: "Vales", monto: 3500, notas: "" },
  { id: 46, fecha: "2026-12-15", categoria: "Ahorro", monto: 3500, notas: "" },
  { id: 47, fecha: "2026-12-15", categoria: "BBVA Seguro", monto: 1000, notas: "" },
  { id: 48, fecha: "2026-12-15", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 49, fecha: "2026-12-15", categoria: "Renta", monto: 2500, notas: "" },
  { id: 50, fecha: "2026-12-15", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 51, fecha: "2026-12-30", categoria: "Ahorro", monto: 3500, notas: "" },
  { id: 52, fecha: "2026-12-30", categoria: "Nómina", monto: 10600, notas: "" },
  { id: 53, fecha: "2026-12-30", categoria: "Renta", monto: 2500, notas: "" },
  { id: 54, fecha: "2026-12-30", categoria: "Tanda", monto: 1000, notas: "" },
  { id: 55, fecha: "2026-12-30", categoria: "Vales", monto: 3500, notas: "" },
];

const PIE_COLORS = ["#4ADE80", "#818CF8", "#FB7185", "#38BDF8", "#FBBF24", "#A78BFA", "#34D399", "#F472B6", "#94A3B8"];

const DEFAULT_PADDING = 4;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function quincenaOf(iso) {
  const d = parseISO(iso);
  if (d.getDate() <= 15) {
    return toISO(new Date(d.getFullYear(), d.getMonth(), 15));
  }
  return toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

function nextQuincenaISO(iso) {
  const d = parseISO(iso);
  if (d.getDate() === 15) {
    return toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  }
  return toISO(new Date(d.getFullYear(), d.getMonth() + 1, 15));
}

function prevQuincenaISO(iso) {
  const d = parseISO(iso);
  if (d.getDate() === 15) {
    return toISO(new Date(d.getFullYear(), d.getMonth(), 0));
  }
  return toISO(new Date(d.getFullYear(), d.getMonth(), 15));
}

function buildPeriods(movEnriched, padding) {
  const qSet = new Set(movEnriched.map((m) => m.quincena));
  const todayQ = quincenaOf(toISO(new Date()));
  let all = Array.from(qSet);
  if (all.length === 0) all = [todayQ];
  all.sort();
  let first = all[0];
  let last = all[all.length - 1];
  if (todayQ > last) last = todayQ;
  for (let i = 0; i < padding; i++) last = nextQuincenaISO(last);
  const periods = [];
  let p = first;
  let guard = 0;
  while (p <= last && guard < 500) {
    periods.push(p);
    p = nextQuincenaISO(p);
    guard++;
  }
  return periods;
}

function fmtQuincena(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" });
}

function fmtMoney(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 });
}

function fmtDateShort(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function StatChip({ icon: Icon, label, value, tone }) {
  return (
    <div className={`stat-chip tone-${tone}`}>
      <div className="stat-chip-icon"><Icon size={16} strokeWidth={2.2} /></div>
      <div>
        <div className="stat-chip-label">{label}</div>
        <div className="stat-chip-value">{fmtMoney(value)}</div>
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  if (status === "excedido") {
    return <span className="status-chip status-bad"><AlertTriangle size={13} /> Excedido</span>;
  }
  if (status === "ok") {
    return <span className="status-chip status-good"><CheckCircle2 size={13} /> OK</span>;
  }
  return <span className="status-chip status-neutral">Sin presupuesto</span>;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [padding, setPadding] = useState(DEFAULT_PADDING);
  const [tab, setTab] = useState("resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Netlify Identity: login / logout ---
  // El widget de Netlify Identity a veces deja un elemento (iframe o badge)
  // cubriendo la página después de iniciar sesión, bloqueando cualquier clic.
  // Lo ocultamos de forma agresiva: por selector, y con un observer que
  // vigila el DOM por si el widget lo vuelve a insertar después.
  useEffect(() => {
    const idt = window.netlifyIdentity;
    if (!idt) { setAuthReady(true); return; }

    let widgetShouldBeOpen = false;

    const findWidgetEls = () => Array.from(document.querySelectorAll(
      '#netlify-identity-widget, .netlify-identity-widget, [class*="netlify-identity"], [id*="netlify-identity"], iframe[src*="identity.netlify.com"]'
    ));

    const hideWidgetOverlay = () => {
      if (widgetShouldBeOpen) return;
      findWidgetEls().forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("pointer-events", "none", "important");
      });
    };
    const showWidgetOverlay = () => {
      findWidgetEls().forEach((el) => {
        el.style.removeProperty("display");
        el.style.removeProperty("pointer-events");
      });
    };

    const observer = new MutationObserver(() => { if (!widgetShouldBeOpen) hideWidgetOverlay(); });
    observer.observe(document.body, { childList: true, subtree: true });

    idt.on("init", (u) => { setUser(u || null); setAuthReady(true); hideWidgetOverlay(); });
    idt.on("login", (u) => { setUser(u); idt.close(); });
    idt.on("open", () => { widgetShouldBeOpen = true; showWidgetOverlay(); });
    idt.on("close", () => { widgetShouldBeOpen = false; hideWidgetOverlay(); });
    idt.on("logout", () => { setUser(null); setCategorias([]); setMovimientos([]); setLoading(true); hideWidgetOverlay(); });
    idt.init();
    // por si algún evento no llega a tiempo, forzamos el ocultado unos momentos después también
    const t1 = setTimeout(hideWidgetOverlay, 500);
    const t2 = setTimeout(hideWidgetOverlay, 1500);
    const t3 = setTimeout(hideWidgetOverlay, 3000);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      observer.disconnect();
      idt.off("login"); idt.off("logout"); idt.off("init"); idt.off("open"); idt.off("close");
    };
  }, []);

  // --- load this user's data once logged in, seed on first run ---
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      try {
        const data = await loadData();
        if (data) {
          setCategorias(data.categorias || CATEGORIAS_DEFAULT);
          setMovimientos(data.movimientos || MOVIMIENTOS_DEFAULT);
          setPadding(data.padding || DEFAULT_PADDING);
        } else {
          setCategorias(CATEGORIAS_DEFAULT);
          setMovimientos(MOVIMIENTOS_DEFAULT);
          setPadding(DEFAULT_PADDING);
          await saveData({ categorias: CATEGORIAS_DEFAULT, movimientos: MOVIMIENTOS_DEFAULT, padding: DEFAULT_PADDING });
        }
        setSaveError("");
      } catch (e) {
        setCategorias(CATEGORIAS_DEFAULT);
        setMovimientos(MOVIMIENTOS_DEFAULT);
        setSaveError("No se pudieron cargar tus datos guardados. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const persistAll = useCallback(async (nextCats, nextMovs, nextPad) => {
    try {
      await saveData({ categorias: nextCats, movimientos: nextMovs, padding: nextPad });
      setSaveError("");
    } catch (e) {
      setSaveError("No se pudo guardar en la nube. Tus cambios podrían perderse al recargar.");
    }
  }, []);

  const persistPadding = useCallback((next) => {
    setPadding(next);
    persistAll(categorias, movimientos, next);
  }, [categorias, movimientos, persistAll]);

  const persistCategorias = useCallback((next) => {
    setCategorias(next);
    persistAll(next, movimientos, padding);
  }, [movimientos, padding, persistAll]);

  const persistMovimientos = useCallback((next) => {
    setMovimientos(next);
    persistAll(categorias, next, padding);
  }, [categorias, padding, persistAll]);

  // --- category lookup map ---
  const catMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c; });
    return map;
  }, [categorias]);

  // --- enrich movimientos with tipo/esencial/quincena ---
  const movEnriched = useMemo(() => {
    return movimientos.map((m) => {
      const c = catMap[m.categoria];
      return {
        ...m,
        tipo: c ? c.tipo : "",
        esencial: c ? c.esencial : null,
        quincena: quincenaOf(m.fecha),
      };
    });
  }, [movimientos, catMap]);

  // --- quincena summary table ---
  const quincenas = useMemo(() => {
    const map = {};
    movEnriched.forEach((m) => {
      if (!map[m.quincena]) {
        map[m.quincena] = { quincena: m.quincena, ingreso: 0, gasto: 0, ahorro: 0, nomina: 0, gastoSeguro: 0 };
      }
      const q = map[m.quincena];
      if (m.tipo === "Ingreso") q.ingreso += m.monto;
      if (m.tipo === "Gasto") q.gasto += m.monto;
      if (m.tipo === "Ahorro") q.ahorro += m.monto;
      if (m.categoria === "Nómina") q.nomina += m.monto;
      if (m.esencial === true) q.gastoSeguro += m.monto;
    });
    return Object.values(map)
      .map((q) => ({ ...q, balance: q.ingreso - q.gasto - q.ahorro, libre: q.nomina - q.gastoSeguro }))
      .sort((a, b) => (a.quincena < b.quincena ? -1 : 1));
  }, [movEnriched]);

  const todayQ = useMemo(() => quincenaOf(toISO(new Date())), []);

  const statsMap = useMemo(() => {
    const map = {};
    quincenas.forEach((q) => { map[q.quincena] = q; });
    return map;
  }, [quincenas]);

  // "Actual" siempre es la quincena de HOY (1-15 -> corte del 15, 16-fin -> corte de fin de mes),
  // no la última que tenga movimientos capturados (que puede ser una fecha futura).
  const ultima = statsMap[todayQ] || {
    quincena: todayQ, ingreso: 0, gasto: 0, ahorro: 0, nomina: 0, gastoSeguro: 0, balance: 0, libre: 0,
  };
  const anterior = statsMap[prevQuincenaISO(todayQ)] || null;

  // --- grid: quincena rows, category columns ---
  const periods = useMemo(() => buildPeriods(movEnriched, padding), [movEnriched, padding]);

  const cellMap = useMemo(() => {
    // key: `${quincena}|${categoria}` -> monto (last one wins if duplicates exist)
    const map = {};
    movEnriched.forEach((m) => { map[`${m.quincena}|${m.categoria}`] = m.monto; });
    return map;
  }, [movEnriched]);

  const lastNomina = useMemo(() => {
    const noms = movEnriched.filter((m) => m.categoria === "Nómina").sort((a, b) => (a.quincena < b.quincena ? -1 : 1));
    return noms.length ? noms[noms.length - 1].monto : "";
  }, [movEnriched]);

  const updateCell = useCallback((quincena, categoria, rawValue) => {
    const trimmed = String(rawValue).trim();
    const existingIdx = movimientos.findIndex((m) => quincenaOf(m.fecha) === quincena && m.categoria === categoria);
    if (trimmed === "") {
      if (existingIdx >= 0) {
        const next = movimientos.filter((_, i) => i !== existingIdx);
        persistMovimientos(next);
      }
      return;
    }
    const monto = parseFloat(trimmed);
    if (isNaN(monto)) return;
    if (existingIdx >= 0) {
      const next = movimientos.map((m, i) => (i === existingIdx ? { ...m, monto } : m));
      persistMovimientos(next);
    } else {
      const id = movimientos.length ? Math.max(...movimientos.map((m) => m.id)) + 1 : 1;
      persistMovimientos([...movimientos, { id, fecha: quincena, categoria, monto, notas: "" }]);
    }
  }, [movimientos, persistMovimientos]);

  // --- per-category totals for the current (latest) quincena + accumulated ---
  const categoriaResumen = useMemo(() => {
    return categorias.map((c) => {
      const movsCat = movEnriched.filter((m) => m.categoria === c.nombre);
      const total = movsCat.reduce((s, m) => s + m.monto, 0);
      const actual = ultima ? movsCat.filter((m) => m.quincena === ultima.quincena).reduce((s, m) => s + m.monto, 0) : 0;
      const nPeriodos = new Set(movsCat.map((m) => m.quincena)).size;
      const promedio = nPeriodos ? total / nPeriodos : 0;
      let status = "na";
      if (c.presupuesto > 0) status = actual > c.presupuesto ? "excedido" : "ok";
      return { ...c, total, actual, promedio, status };
    });
  }, [categorias, movEnriched, ultima]);

  const gastoCategorias = categoriaResumen.filter((c) => c.tipo === "Gasto" && c.total > 0);
  const alertas = categoriaResumen.filter((c) => c.status === "excedido");

  // --- chart data (trend, last 12 periods) ---
  const trendData = useMemo(() => {
    return quincenas.slice(-12).map((q) => ({
      name: fmtQuincena(q.quincena),
      Ingreso: Math.round(q.ingreso),
      Gasto: Math.round(q.gasto),
      Ahorro: Math.round(q.ahorro),
      Libre: Math.round(q.libre),
    }));
  }, [quincenas]);

  const pieData = gastoCategorias.map((c) => ({ name: c.nombre, value: Math.round(c.total) }));

  // --- category editing ---
  const [editingCat, setEditingCat] = useState(null);
  const [catDraft, setCatDraft] = useState({});
  const [newCat, setNewCat] = useState({ nombre: "", tipo: "Gasto", presupuesto: "", esencial: true });

  const startEditCat = (c) => { setEditingCat(c.id); setCatDraft({ ...c }); };
  const saveEditCat = () => {
    const next = categorias.map((c) => (c.id === editingCat ? { ...catDraft, presupuesto: parseFloat(catDraft.presupuesto) || 0 } : c));
    persistCategorias(next);
    setEditingCat(null);
  };
  const deleteCat = (id) => {
    persistCategorias(categorias.filter((c) => c.id !== id));
  };
  const addCategoria = () => {
    if (!newCat.nombre.trim()) return;
    const id = categorias.length ? Math.max(...categorias.map((c) => c.id)) + 1 : 1;
    const esencial = newCat.tipo === "Ingreso" ? null : newCat.esencial;
    persistCategorias([...categorias, { id, nombre: newCat.nombre.trim(), tipo: newCat.tipo, presupuesto: parseFloat(newCat.presupuesto) || 0, esencial }]);
    setNewCat({ nombre: "", tipo: "Gasto", presupuesto: "", esencial: true });
  };

  if (!authReady) {
    return (
      <div className="pd-root pd-loading">
        <div className="loading-mark">Cargando…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pd-root pd-loading">
        <div className="login-card">
          <div className="brand-stamp big">MQ</div>
          <div className="brand-title" style={{ fontSize: 20, marginTop: 14 }}>Mi Quincena</div>
          <div className="brand-sub" style={{ marginBottom: 22 }}>control de gastos</div>
          <p className="login-copy"><Lock size={14} /> Tus datos son privados. Inicia sesión o crea una cuenta para entrar.</p>
          <button className="btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={() => window.netlifyIdentity && window.netlifyIdentity.open()}>
            Iniciar sesión / Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pd-root pd-loading">
        <div className="loading-mark">Abriendo tu libreta…</div>
      </div>
    );
  }

  return (
    <div className="pd-root">
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
          <Menu size={20} />
        </button>
        <div className="mobile-topbar-title">Mi Quincena</div>
      </div>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-stamp">MQ</div>
          <div>
            <div className="brand-title">Mi Quincena</div>
            <div className="brand-sub">control de gastos</div>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>
        <nav className="nav">
          <button className={`nav-item ${tab === "resumen" ? "active" : ""}`} onClick={() => { setTab("resumen"); setSidebarOpen(false); }}>
            <LayoutDashboard size={17} /> Resumen
          </button>
          <button className={`nav-item ${tab === "tabla" ? "active" : ""}`} onClick={() => { setTab("tabla"); setSidebarOpen(false); }}>
            <Table2 size={17} /> Tabla
          </button>
          <button className={`nav-item ${tab === "categorias" ? "active" : ""}`} onClick={() => { setTab("categorias"); setSidebarOpen(false); }}>
            <Tags size={17} /> Categorías
          </button>
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-foot-label">Quincena actual</div>
          <div className="sidebar-foot-value">{fmtQuincena(ultima.quincena)}</div>
          <div className="sidebar-user">
            <span>{user.email}</span>
            <button className="icon-btn" onClick={() => window.netlifyIdentity && window.netlifyIdentity.logout()} aria-label="Cerrar sesión">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        {saveError && <div className="save-error">{saveError}</div>}

        {tab === "resumen" && (
          <ResumenTab
            ultima={ultima} anterior={anterior}
            categoriaResumen={categoriaResumen} alertas={alertas}
            trendData={trendData} pieData={pieData}
          />
        )}

        {tab === "tabla" && (
          <GridTab
            categorias={categorias}
            periods={periods}
            cellMap={cellMap}
            statsMap={statsMap}
            categoriaResumen={categoriaResumen}
            updateCell={updateCell}
            lastNomina={lastNomina}
            onAddQuincena={() => persistPadding(padding + 1)}
            todayQ={todayQ}
          />
        )}

        {tab === "categorias" && (
          <CategoriasTab
            categorias={categorias}
            editingCat={editingCat} catDraft={catDraft} setCatDraft={setCatDraft}
            startEditCat={startEditCat} saveEditCat={saveEditCat} setEditingCat={setEditingCat}
            deleteCat={deleteCat} newCat={newCat} setNewCat={setNewCat} addCategoria={addCategoria}
          />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function HeroRing({ pct, label }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;
  return (
    <div className="hero-ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#2E333D" strokeWidth="12" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="12"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 64 64)"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="hero-ring-center">
        <div className="hero-ring-pct">{clamped}%</div>
        <div className="hero-ring-label">{label}</div>
      </div>
    </div>
  );
}

function ResumenTab({ ultima, anterior, categoriaResumen, alertas, trendData, pieData }) {
  const libreDelta = ultima && anterior ? ultima.libre - anterior.libre : null;
  const comprometidoPct = ultima && ultima.nomina ? Math.round((ultima.gastoSeguro / ultima.nomina) * 100) : 0;

  return (
    <div className="tab-pane">
      <section className="hero">
        <div className="hero-eyebrow">{ultima ? `Quincena del ${fmtQuincena(ultima.quincena)}` : "Sin movimientos todavía"}</div>
        <div className="hero-row">
          <div>
            <div className="hero-label">Dinero libre esta quincena</div>
            <div className={`hero-number ${ultima && ultima.libre < 0 ? "neg" : "pos"}`}>
              {ultima ? fmtMoney(ultima.libre) : fmtMoney(0)}
            </div>
            {libreDelta !== null && (
              <div className={`hero-delta ${libreDelta >= 0 ? "pos" : "neg"}`}>
                {libreDelta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {fmtMoney(Math.abs(libreDelta))} {libreDelta >= 0 ? "más" : "menos"} que la quincena anterior
              </div>
            )}
          </div>
          <HeroRing pct={comprometidoPct} label="de tu nómina ya comprometido" />
        </div>
      </section>

      <section className="stat-row">
        <StatChip icon={Wallet} label="Ingreso total" value={ultima?.ingreso || 0} tone="forest" />
        <StatChip icon={TrendingDown} label="Gasto total" value={ultima?.gasto || 0} tone="brick" />
        <StatChip icon={PiggyBank} label="Ahorro" value={ultima?.ahorro || 0} tone="gold" />
        <StatChip icon={Receipt} label="Gasto seguro" value={ultima?.gastoSeguro || 0} tone="ink" />
      </section>

      {alertas.length > 0 && (
        <section className="alert-box">
          <AlertTriangle size={16} />
          <div>
            <strong>{alertas.length} {alertas.length === 1 ? "categoría excedida" : "categorías excedidas"} esta quincena: </strong>
            {alertas.map((a) => a.nombre).join(", ")}
          </div>
        </section>
      )}

      <section className="charts-row">
        <div className="panel">
          <div className="panel-title">Gasto acumulado por categoría</div>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#1B1E24" strokeWidth={2} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ background: "#22262E", border: "1px solid #333844", borderRadius: 10, color: "#F4F5F7" }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, color: "#C7CCD6" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-note">Todavía no hay gastos registrados.</div>}
        </div>

        <div className="panel">
          <div className="panel-title">Ingreso, gasto y libre por quincena</div>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData} margin={{ top: 6, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#2E333D" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8B92A0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8B92A0" }} />
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ background: "#22262E", border: "1px solid #333844", borderRadius: 10, color: "#F4F5F7" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#8B92A0" }} />
                <Line type="monotone" dataKey="Ingreso" stroke="#4ADE80" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Gasto" stroke="#FB7185" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Libre" stroke="#818CF8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="empty-note">Todavía no hay movimientos registrados.</div>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">Presupuesto vs. real por categoría (quincena actual)</div>
        <div className="table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Categoría</th><th>Tipo</th><th className="num">Presupuesto</th>
                <th className="num">Actual</th><th className="num">Promedio</th>
                <th className="num">Acumulado</th><th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {categoriaResumen.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td><span className={`tipo-pill tipo-${c.tipo}`}>{c.tipo}</span></td>
                  <td className="num">{c.presupuesto > 0 ? fmtMoney(c.presupuesto) : "—"}</td>
                  <td className="num">{fmtMoney(c.actual)}</td>
                  <td className="num">{fmtMoney(c.promedio)}</td>
                  <td className="num">{fmtMoney(c.total)}</td>
                  <td><StatusChip status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function GridCell({ value, placeholder, onCommit, tone }) {
  const [draft, setDraft] = useState(value === "" || value === undefined ? "" : String(value));
  useEffect(() => {
    setDraft(value === "" || value === undefined ? "" : String(value));
  }, [value]);
  return (
    <input
      type="number"
      className={`grid-cell-input tone-text-${tone}`}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { if (draft !== (value === "" || value === undefined ? "" : String(value))) onCommit(draft); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
    />
  );
}

function GridTab({ categorias, periods, cellMap, statsMap, categoriaResumen, updateCell, lastNomina, onAddQuincena, todayQ }) {
  const groups = [
    { tipo: "Ingreso", label: "Ingresos" },
    { tipo: "Ahorro", label: "Ahorro" },
    { tipo: "Gasto", label: "Gastos" },
  ].map((g) => ({ ...g, cats: categorias.filter((c) => c.tipo === g.tipo) }));

  const totalByNombre = {};
  categoriaResumen.forEach((c) => { totalByNombre[c.nombre] = c.total; });

  const zeroStats = { ingreso: 0, gasto: 0, ahorro: 0, gastoSeguro: 0, libre: 0, balance: 0 };

  return (
    <div className="tab-pane">
      <section className="panel">
        <div className="panel-title-row">
          <div className="panel-title">Captura quincenal — categorías en columnas, igual que tu formato original</div>
          <button className="btn-secondary" onClick={onAddQuincena}><Plus size={14} /> Agregar quincena</button>
        </div>
        <div className="table-wrap tall grid-scroll">
          <table className="ledger-table grid-table">
            <thead>
              <tr className="group-row">
                <th className="sticky-col corner"></th>
                {groups.map((g) => (
                  <th key={g.tipo} colSpan={g.cats.length} className={`group-head group-${g.tipo}`}>{g.label}</th>
                ))}
                <th colSpan={3} className="group-head group-Calc">Cálculos</th>
              </tr>
              <tr>
                <th className="sticky-col">Quincena</th>
                {groups.map((g) => g.cats.map((c) => (
                  <th key={c.id} className={`cat-head group-${g.tipo} tipo-text-${g.tipo}`}>{c.nombre}</th>
                )))}
                <th className="cat-head col-gastoseguro">Gasto Seguro</th>
                <th className="cat-head col-libre">Libre</th>
                <th className="cat-head group-Calc">Balance</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((q) => {
                const stats = statsMap[q] || zeroStats;
                const isCurrent = q === todayQ;
                return (
                  <tr key={q} className={isCurrent ? "current-row" : ""}>
                    <td className="sticky-col quincena-cell">
                      {fmtQuincena(q)}
                      {isCurrent && <span className="hoy-dot" title="Quincena actual" />}
                    </td>
                    {groups.map((g) => g.cats.map((c) => {
                      const key = `${q}|${c.nombre}`;
                      const raw = cellMap[key];
                      const placeholder = c.nombre === "Nómina" && raw === undefined ? lastNomina : "";
                      return (
                        <td key={c.id} className="cell-td">
                          <GridCell
                            value={raw === undefined ? "" : raw}
                            placeholder={placeholder ? String(placeholder) : ""}
                            onCommit={(v) => updateCell(q, c.nombre, v)}
                            tone={g.tipo}
                          />
                        </td>
                      );
                    }))}
                    <td className="num calc-td col-gastoseguro">{fmtMoney(stats.gastoSeguro)}</td>
                    <td className={`num calc-td col-libre ${stats.libre < 0 ? "neg" : ""}`}>{fmtMoney(stats.libre)}</td>
                    <td className={`num calc-td ${stats.balance < 0 ? "neg" : ""}`}>{fmtMoney(stats.balance)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="sticky-col total-label">Total acumulado</td>
                {groups.map((g) => g.cats.map((c) => (
                  <td key={c.id} className={`num total-td ${c.nombre === "Nómina" ? "total-nomina" : ""}`}>{fmtMoney(totalByNombre[c.nombre] || 0)}</td>
                )))}
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="grid-hint">Escribe un monto y presiona Enter o haz clic fuera de la celda para guardarlo. Deja la celda vacía y guárdala para borrar ese movimiento.</div>
      </section>
    </div>
  );
}

function CategoriasTab({ categorias, editingCat, catDraft, setCatDraft, startEditCat, saveEditCat, setEditingCat, deleteCat, newCat, setNewCat, addCategoria }) {
  return (
    <div className="tab-pane">
      <section className="panel">
        <div className="panel-title">Tus categorías</div>
        <div className="table-wrap">
          <table className="ledger-table">
            <thead>
              <tr><th>Categoría</th><th>Tipo</th><th className="num">Presupuesto quincenal</th><th>Esencial</th><th></th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => {
                const isEditing = editingCat === c.id;
                return (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>
                      {isEditing ? (
                        <select value={catDraft.tipo} onChange={(e) => setCatDraft({ ...catDraft, tipo: e.target.value, esencial: e.target.value === "Ingreso" ? null : catDraft.esencial })}>
                          <option>Ingreso</option><option>Gasto</option><option>Ahorro</option>
                        </select>
                      ) : <span className={`tipo-pill tipo-${c.tipo}`}>{c.tipo}</span>}
                    </td>
                    <td className="num">
                      {isEditing ? (
                        <input type="number" min="0" step="0.01" value={catDraft.presupuesto} onChange={(e) => setCatDraft({ ...catDraft, presupuesto: e.target.value })} style={{ width: 110 }} />
                      ) : (c.presupuesto > 0 ? fmtMoney(c.presupuesto) : "—")}
                    </td>
                    <td>
                      {c.tipo === "Ingreso" ? "—" : isEditing ? (
                        <select value={catDraft.esencial ? "Sí" : "No"} onChange={(e) => setCatDraft({ ...catDraft, esencial: e.target.value === "Sí" })}>
                          <option>Sí</option><option>No</option>
                        </select>
                      ) : (c.esencial ? "Sí" : "No")}
                    </td>
                    <td className="row-actions">
                      {isEditing ? (
                        <>
                          <button className="icon-btn" onClick={saveEditCat} aria-label="Guardar"><Check size={14} /></button>
                          <button className="icon-btn" onClick={() => setEditingCat(null)} aria-label="Cancelar"><X size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button className="icon-btn" onClick={() => startEditCat(c)} aria-label="Editar"><Pencil size={14} /></button>
                          <button className="icon-btn" onClick={() => deleteCat(c.id)} aria-label="Eliminar"><Trash2 size={14} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">Agregar categoría</div>
        <div className="form-row">
          <label>
            <span>Nombre</span>
            <input type="text" value={newCat.nombre} onChange={(e) => setNewCat({ ...newCat, nombre: e.target.value })} />
          </label>
          <label>
            <span>Tipo</span>
            <select value={newCat.tipo} onChange={(e) => setNewCat({ ...newCat, tipo: e.target.value })}>
              <option>Ingreso</option><option>Gasto</option><option>Ahorro</option>
            </select>
          </label>
          <label>
            <span>Presupuesto quincenal</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={newCat.presupuesto} onChange={(e) => setNewCat({ ...newCat, presupuesto: e.target.value })} />
          </label>
          {newCat.tipo !== "Ingreso" && (
            <label>
              <span>Esencial</span>
              <select value={newCat.esencial ? "Sí" : "No"} onChange={(e) => setNewCat({ ...newCat, esencial: e.target.value === "Sí" })}>
                <option>Sí</option><option>No</option>
              </select>
            </label>
          )}
          <button className="btn-primary" onClick={addCategoria}><Plus size={16} /> Agregar</button>
        </div>
      </section>
    </div>
  );
}


