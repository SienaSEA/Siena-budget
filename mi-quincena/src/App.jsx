import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar,
} from "recharts";
import {
  LayoutDashboard, Receipt, Tags, Plus, Trash2, TrendingUp, TrendingDown,
  PiggyBank, Wallet, AlertTriangle, CheckCircle2, Pencil, X, Check, Table2, LogOut, Lock,
  ChevronLeft, ChevronRight, GripVertical, Star, Rows3, Loader2, WifiOff, Target,
} from "lucide-react";
import { loadData, saveData } from "./dataClient.js";

// ---------------------------------------------------------------------------
// Data & constants
// ---------------------------------------------------------------------------

const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: "Nómina", tipo: "Ingreso", presupuesto: 0, esNomina: true, cuentaIngreso: true },
  { id: 2, nombre: "Vales", tipo: "Vale", presupuesto: 0 },
  { id: 3, nombre: "Ahorro", tipo: "Ahorro", presupuesto: 0 },
  { id: 4, nombre: "Tanda", tipo: "Ahorro", presupuesto: 0 },
  { id: 5, nombre: "Nelo", tipo: "Gasto", presupuesto: 0 },
  { id: 6, nombre: "BBVA Seguro", tipo: "Gasto", presupuesto: 0 },
  { id: 7, nombre: "Mercado", tipo: "Gasto", presupuesto: 0 },
  { id: 8, nombre: "Movistar", tipo: "Gasto", presupuesto: 0 },
  { id: 9, nombre: "BBVA Prestamo", tipo: "Gasto", presupuesto: 0 },
  { id: 10, nombre: "Telmex", tipo: "Gasto", presupuesto: 0 },
  { id: 11, nombre: "University", tipo: "Gasto", presupuesto: 0 },
  { id: 12, nombre: "Auto", tipo: "Gasto", presupuesto: 0 },
  { id: 13, nombre: "Renta", tipo: "Gasto", presupuesto: 0 },
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

const PIE_COLORS = ["#5B7A63", "#A9713D", "#7D8CA3", "#B4655B", "#8C7D9E", "#6B8E9E", "#A68A5B", "#7A6B8C", "#8A8A84"];

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

// Cuenta cuántas quincenas hay entre dos fechas de corte (para saber cuántas
// ya pasaron desde que se creó una meta, y así recalcular el plazo restante).
function countQuincenasBetween(fromQ, toQ) {
  if (!fromQ || !toQ || fromQ >= toQ) return 0;
  let count = 0;
  let q = fromQ;
  let guard = 0;
  while (q < toQ && guard < 500) {
    q = nextQuincenaISO(q);
    count++;
    guard++;
  }
  return count;
}

// Dado el avance actual de una meta, calcula cuánto falta ahorrar por
// quincena para cumplir el plazo que el usuario definió.
function computeMetaPlan(m, actual, todayQ) {
  if (!m.plazoQuincenas || m.plazoQuincenas <= 0) return null;
  const transcurridas = countQuincenasBetween(m.creadaQuincena || todayQ, todayQ);
  const restantes = Math.max(0, m.plazoQuincenas - transcurridas);
  const faltante = Math.max(0, m.montoObjetivo - actual);
  if (faltante === 0) return { restantes, recomendado: 0, lograda: true, vencido: false };
  if (restantes === 0) return { restantes: 0, recomendado: faltante, lograda: false, vencido: true };
  return { restantes, recomendado: faltante / restantes, lograda: false, vencido: false };
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

// Versión compacta para la columna de la Tabla: "15/09" en vez de "15 sep 26"
function fmtQuincenaCompact(iso) {
  const d = parseISO(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
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

function StatChip({ icon: Icon, label, hint, value, tone }) {
  return (
    <div className={`stat-chip tone-${tone}`}>
      <div className="stat-chip-icon"><Icon size={16} strokeWidth={2.2} /></div>
      <div>
        <div className="stat-chip-label">{label}</div>
        <div className="stat-chip-value">{fmtMoney(value)}</div>
        {hint && <div className="stat-chip-hint">{hint}</div>}
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

function SaveStatusPill({ status }) {
  if (status === "idle") return null;
  const map = {
    saving: { icon: Loader2, texto: "Guardando…", cls: "st-saving" },
    saved: { icon: CheckCircle2, texto: "Guardado", cls: "st-saved" },
    offline: { icon: WifiOff, texto: "Sin conexión", cls: "st-offline" },
    error: { icon: AlertTriangle, texto: "Error al guardar", cls: "st-error" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`save-status-pill ${s.cls}`}>
      <s.icon size={12} className={status === "saving" ? "spin" : ""} /> {s.texto}
    </span>
  );
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
  const [metas, setMetas] = useState([]);
  const [padding, setPadding] = useState(DEFAULT_PADDING);
  const [tab, setTab] = useState("resumen");
  const [fabOpen, setFabOpen] = useState(false);
  const [fabMode, setFabMode] = useState("existente"); // "existente" | "nueva"
  const [fabCat, setFabCat] = useState("");
  const [fabAmt, setFabAmt] = useState("");
  const [fabNewNombre, setFabNewNombre] = useState("");
  const [fabNewTipo, setFabNewTipo] = useState("Gasto");

  // --- Netlify Identity: login / logout ---
  // El widget de Netlify Identity a veces deja un elemento (iframe o badge)
  // cubriendo la página después de iniciar sesión, bloqueando cualquier clic.
  // Lo ocultamos de forma agresiva: por selector, y con un observer que
  // vigila el DOM por si el widget lo vuelve a insertar después.
  useEffect(() => {
    // Modo vista previa local: SOLO se activa con `npm run dev` (Vite),
    // nunca en el sitio real desplegado (import.meta.env.DEV es siempre
    // false en el build de producción). Salta el login por completo para
    // poder revisar cambios visuales sin Netlify CLI ni conexión.
    if (import.meta.env.DEV) {
      setUser({ email: "vista-previa-local" });
      setAuthReady(true);
      return;
    }

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

    if (import.meta.env.DEV) {
      // Vista previa local: datos de ejemplo en memoria, sin llamar a
      // ninguna función de Netlify (no hay backend disponible con `npm run dev`).
      setCategorias(CATEGORIAS_DEFAULT);
      setMovimientos(MOVIMIENTOS_DEFAULT);
      setMetas([]);
      setPadding(DEFAULT_PADDING);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const data = await loadData();
        if (data) {
          setCategorias(data.categorias || CATEGORIAS_DEFAULT);
          setMovimientos(data.movimientos || MOVIMIENTOS_DEFAULT);
          setMetas(data.metas || []);
          setPadding(data.padding || DEFAULT_PADDING);
        } else {
          // Usuario nuevo: empieza completamente en blanco, sin categorías
          // ni movimientos de otra persona. Arranca desde la pestaña
          // Categorías agregando las suyas propias.
          setCategorias([]);
          setMovimientos([]);
          setMetas([]);
          setPadding(DEFAULT_PADDING);
          await saveData({ categorias: [], movimientos: [], metas: [], padding: DEFAULT_PADDING });
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

  const persistAll = useCallback(async (nextCats, nextMovs, nextPad, nextMetas) => {
    if (import.meta.env.DEV) {
      // Vista previa local: solo en memoria, no hay backend que guardar.
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 1200);
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setSaveStatus("offline");
      return;
    }
    setSaveStatus("saving");
    try {
      await saveData({ categorias: nextCats, movimientos: nextMovs, padding: nextPad, metas: nextMetas });
      setSaveError("");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      setSaveError("No se pudo guardar en la nube. Tus cambios podrían perderse al recargar.");
      setSaveStatus("error");
    }
  }, []);

  const persistPadding = useCallback((next) => {
    setPadding(next);
    persistAll(categorias, movimientos, next, metas);
  }, [categorias, movimientos, metas, persistAll]);

  const persistCategorias = useCallback((next) => {
    setCategorias(next);
    persistAll(next, movimientos, padding, metas);
  }, [movimientos, padding, metas, persistAll]);

  const persistMovimientos = useCallback((next) => {
    setMovimientos(next);
    persistAll(categorias, next, padding, metas);
  }, [categorias, padding, metas, persistAll]);

  const persistMetas = useCallback((next) => {
    setMetas(next);
    persistAll(categorias, movimientos, padding, next);
  }, [categorias, movimientos, padding, persistAll]);

  // Crea una categoría nueva Y su primer movimiento en un solo guardado
  // (evita que dos guardados seguidos se pisen entre sí).
  const addCategoriaAndMovimiento = useCallback((newCatPartial, quincena, monto) => {
    const catId = categorias.length ? Math.max(...categorias.map((c) => c.id)) + 1 : 1;
    const esNomina = newCatPartial.tipo === "Ingreso" && !categorias.some((c) => c.tipo === "Ingreso" && c.esNomina);
    const newCat = { id: catId, ...newCatPartial, esNomina };
    const nextCats = [...categorias, newCat];

    const movId = movimientos.length ? Math.max(...movimientos.map((m) => m.id)) + 1 : 1;
    const nextMovs = [...movimientos, { id: movId, fecha: quincena, categoria: newCat.nombre, monto, notas: "", createdAt: Date.now() }];

    setCategorias(nextCats);
    setMovimientos(nextMovs);
    persistAll(nextCats, nextMovs, padding, metas);
  }, [categorias, movimientos, padding, metas, persistAll]);

  // --- category lookup map ---
  const catMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c; });
    return map;
  }, [categorias]);

  // --- enrich movimientos with tipo/quincena ---
  const movEnriched = useMemo(() => {
    return movimientos.map((m) => {
      const c = catMap[m.categoria];
      return {
        ...m,
        tipo: c ? c.tipo : "",
        esNomina: c ? !!c.esNomina : false,
        cuentaIngreso: c ? c.cuentaIngreso !== false : true,
        quincena: quincenaOf(m.fecha),
      };
    });
  }, [movimientos, catMap]);

  // --- quincena summary table ---
  const quincenas = useMemo(() => {
    const map = {};
    movEnriched.forEach((m) => {
      if (!map[m.quincena]) {
        map[m.quincena] = { quincena: m.quincena, ingreso: 0, gasto: 0, ahorro: 0, vale: 0, nomina: 0, gastoSeguro: 0 };
      }
      const q = map[m.quincena];
      if (m.tipo === "Ingreso" && m.cuentaIngreso) q.ingreso += m.monto;
      if (m.tipo === "Gasto") q.gasto += m.monto;
      if (m.tipo === "Ahorro") q.ahorro += m.monto;
      if (m.tipo === "Vale") q.vale += m.monto;
      if (m.categoria === "Nómina" || m.esNomina) q.nomina += m.monto;
      if (m.tipo === "Gasto" || m.tipo === "Ahorro") q.gastoSeguro += m.monto;
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
    quincena: todayQ, ingreso: 0, gasto: 0, ahorro: 0, vale: 0, nomina: 0, gastoSeguro: 0, balance: 0, libre: 0,
  };
  const anterior = statsMap[prevQuincenaISO(todayQ)] || null;

  // ¿Ya se capturó algo esta quincena? — para el recordatorio dentro de la app
  const hasCapturedToday = useMemo(
    () => movEnriched.some((m) => m.quincena === todayQ),
    [movEnriched, todayQ]
  );

  // --- grid: quincena rows, category columns ---
  const periods = useMemo(() => buildPeriods(movEnriched, padding), [movEnriched, padding]);

  const cellMap = useMemo(() => {
    // key: `${quincena}|${categoria}` -> monto (last one wins if duplicates exist)
    const map = {};
    movEnriched.forEach((m) => { map[`${m.quincena}|${m.categoria}`] = m.monto; });
    return map;
  }, [movEnriched]);

  const notaMap = useMemo(() => {
    const map = {};
    movEnriched.forEach((m) => { if (m.notas) map[`${m.quincena}|${m.categoria}`] = m.notas; });
    return map;
  }, [movEnriched]);

  const updateNota = useCallback((quincena, categoria, notaText) => {
    const idx = movimientos.findIndex((m) => quincenaOf(m.fecha) === quincena && m.categoria === categoria);
    if (idx < 0) return; // sin monto capturado todavía, no hay nada que anotar
    const next = movimientos.map((m, i) => (i === idx ? { ...m, notas: notaText } : m));
    persistMovimientos(next);
  }, [movimientos, persistMovimientos]);

  const lastNomina = useMemo(() => {
    const noms = movEnriched.filter((m) => m.categoria === "Nómina" || m.esNomina).sort((a, b) => (a.quincena < b.quincena ? -1 : 1));
    return noms.length ? noms[noms.length - 1].monto : "";
  }, [movEnriched]);

  // --- "recién agregado": movimientos creados desde tu última visita a este navegador ---
  const [lastVisit] = useState(() => {
    try {
      const stored = localStorage.getItem("mq-last-visit");
      const prev = stored ? Number(stored) : 0;
      localStorage.setItem("mq-last-visit", String(Date.now()));
      return prev;
    } catch (e) {
      return 0;
    }
  });
  const recentMovs = useMemo(() => {
    if (!lastVisit) return [];
    return movEnriched
      .filter((m) => m.createdAt && m.createdAt > lastVisit)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [movEnriched, lastVisit]);

  // --- racha: quincenas consecutivas con al menos un movimiento, empezando hoy hacia atrás ---
  const racha = useMemo(() => {
    let count = 0;
    let q = todayQ;
    let guard = 0;
    while (statsMap[q] && (statsMap[q].ingreso || statsMap[q].gasto || statsMap[q].ahorro || statsMap[q].vale) && guard < 200) {
      count++;
      q = prevQuincenaISO(q);
      guard++;
    }
    return count;
  }, [statsMap, todayQ]);

  // --- estado de guardado (guardando / guardado / sin conexión / error) ---
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | offline | error
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

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
      persistMovimientos([...movimientos, { id, fecha: quincena, categoria, monto, notas: "", createdAt: Date.now() }]);
    }
  }, [movimientos, persistMovimientos]);

  const openFab = useCallback(() => {
    setFabMode("existente");
    setFabCat((cur) => cur || categorias[0]?.nombre || "");
    setFabAmt("");
    setFabNewNombre("");
    setFabNewTipo("Gasto");
    setFabOpen(true);
  }, [categorias]);

  const saveFab = useCallback(() => {
    if (fabMode === "nueva") {
      const nombre = fabNewNombre.trim();
      if (!nombre || !fabAmt) return;
      const monto = parseFloat(fabAmt);
      if (isNaN(monto)) return;
      addCategoriaAndMovimiento({ nombre, tipo: fabNewTipo, presupuesto: 0 }, todayQ, monto);
      setFabAmt("");
      setFabNewNombre("");
      setFabOpen(false);
      return;
    }
    if (!fabCat || !fabAmt) return;
    updateCell(todayQ, fabCat, fabAmt);
    setFabAmt("");
    setFabOpen(false);
  }, [fabMode, fabCat, fabAmt, fabNewNombre, fabNewTipo, todayQ, updateCell, addCategoriaAndMovimiento]);

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
  const [newCat, setNewCat] = useState({ nombre: "", tipo: "Gasto", presupuesto: "" });

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
    // si es la primera categoría de Ingreso, la marcamos como Nómina principal automáticamente
    const esNomina = newCat.tipo === "Ingreso" && !categorias.some((c) => c.tipo === "Ingreso" && c.esNomina);
    persistCategorias([...categorias, { id, nombre: newCat.nombre.trim(), tipo: newCat.tipo, presupuesto: parseFloat(newCat.presupuesto) || 0, esNomina }]);
    setNewCat({ nombre: "", tipo: "Gasto", presupuesto: "" });
  };

  const setNominaPrincipal = (id) => {
    // solo una categoría puede ser la Nómina principal a la vez
    persistCategorias(categorias.map((c) => ({ ...c, esNomina: c.id === id })));
  };

  const toggleCuentaIngreso = (id) => {
    persistCategorias(categorias.map((c) => (c.id === id ? { ...c, cuentaIngreso: !(c.cuentaIngreso !== false) } : c)));
  };

  // --- Metas de ahorro ---
  const [editingMeta, setEditingMeta] = useState(null);
  const [metaDraft, setMetaDraft] = useState({});
  const [newMeta, setNewMeta] = useState({ nombre: "", montoObjetivo: "", categoria: "", montoManual: "", plazoQuincenas: "" });

  const startEditMeta = (m) => { setEditingMeta(m.id); setMetaDraft({ ...m, categoria: m.categoria || "", plazoQuincenas: m.plazoQuincenas || "" }); };
  const saveEditMeta = () => {
    const next = metas.map((m) => (m.id === editingMeta ? {
      ...m,
      nombre: metaDraft.nombre,
      montoObjetivo: parseFloat(metaDraft.montoObjetivo) || 0,
      categoria: metaDraft.categoria || null,
      montoManual: metaDraft.categoria ? 0 : (parseFloat(metaDraft.montoManual) || 0),
      plazoQuincenas: parseInt(metaDraft.plazoQuincenas, 10) || null,
      // si cambia el plazo, reiniciamos el conteo de quincenas transcurridas desde hoy
      creadaQuincena: (parseInt(metaDraft.plazoQuincenas, 10) || null) !== m.plazoQuincenas ? todayQ : m.creadaQuincena,
    } : m));
    persistMetas(next);
    setEditingMeta(null);
  };
  const deleteMeta = (id) => persistMetas(metas.filter((m) => m.id !== id));
  const addMeta = () => {
    if (!newMeta.nombre.trim()) return;
    const id = metas.length ? Math.max(...metas.map((m) => m.id)) + 1 : 1;
    persistMetas([...metas, {
      id, nombre: newMeta.nombre.trim(),
      montoObjetivo: parseFloat(newMeta.montoObjetivo) || 0,
      categoria: newMeta.categoria || null,
      montoManual: newMeta.categoria ? 0 : (parseFloat(newMeta.montoManual) || 0),
      plazoQuincenas: parseInt(newMeta.plazoQuincenas, 10) || null,
      creadaQuincena: todayQ,
    }]);
    setNewMeta({ nombre: "", montoObjetivo: "", categoria: "", montoManual: "", plazoQuincenas: "" });
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
        <div className="mobile-topbar-brand">
          <div className="brand-stamp small">MQ</div>
          <div className="mobile-topbar-title">Mi Quincena</div>
        </div>
        <SaveStatusPill status={isOnline ? saveStatus : "offline"} />
        <button className="mobile-logout-btn" onClick={() => window.netlifyIdentity && window.netlifyIdentity.logout()} aria-label="Cerrar sesión">
          <LogOut size={16} />
        </button>
      </div>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-stamp">MQ</div>
          <div>
            <div className="brand-title">Mi Quincena</div>
            <div className="brand-sub">control de gastos</div>
          </div>
        </div>
        <nav className="nav">
          <button className={`nav-item ${tab === "resumen" ? "active" : ""}`} onClick={() => setTab("resumen")}>
            <LayoutDashboard size={17} /> Resumen
          </button>
          <button className={`nav-item ${tab === "tabla" ? "active" : ""}`} onClick={() => setTab("tabla")}>
            <Table2 size={17} /> Tabla
          </button>
          <button className={`nav-item ${tab === "categorias" ? "active" : ""}`} onClick={() => setTab("categorias")}>
            <Tags size={17} /> Categorías
          </button>
          <button className={`nav-item ${tab === "metas" ? "active" : ""}`} onClick={() => setTab("metas")}>
            <Target size={17} /> Metas
          </button>
        </nav>
        <div className="sidebar-foot">
          <SaveStatusPill status={isOnline ? saveStatus : "offline"} />
          <div className="sidebar-foot-label">Quincena actual</div>
          <div className="sidebar-foot-value">{fmtQuincena(ultima.quincena)}</div>
          <div className="sidebar-user-email" title={user.email}>{user.email}</div>
          <button className="logout-btn" onClick={() => window.netlifyIdentity && window.netlifyIdentity.logout()}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <nav className="bottom-nav">
        <button className={`bottom-nav-item ${tab === "resumen" ? "active" : ""}`} onClick={() => setTab("resumen")}>
          <LayoutDashboard size={19} /> <span>Resumen</span>
        </button>
        <button className={`bottom-nav-item ${tab === "tabla" ? "active" : ""}`} onClick={() => setTab("tabla")}>
          <Table2 size={19} /> <span>Tabla</span>
        </button>
        <button className={`bottom-nav-item ${tab === "categorias" ? "active" : ""}`} onClick={() => setTab("categorias")}>
          <Tags size={19} /> <span>Categorías</span>
        </button>
        <button className={`bottom-nav-item ${tab === "metas" ? "active" : ""}`} onClick={() => setTab("metas")}>
          <Target size={19} /> <span>Metas</span>
        </button>
      </nav>

      <main className="main">
        {saveError && <div className="save-error">{saveError}</div>}

        {tab === "resumen" && (
          <ResumenTab
            ultima={ultima} anterior={anterior}
            categoriaResumen={categoriaResumen} alertas={alertas}
            trendData={trendData} pieData={pieData}
            hasCapturedToday={hasCapturedToday}
            onQuickAdd={openFab}
            racha={racha}
            recentMovs={recentMovs}
            metas={metas}
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
            notaMap={notaMap}
            updateNota={updateNota}
          />
        )}

        {tab === "categorias" && (
          <CategoriasTab
            categorias={categorias}
            editingCat={editingCat} catDraft={catDraft} setCatDraft={setCatDraft}
            startEditCat={startEditCat} saveEditCat={saveEditCat} setEditingCat={setEditingCat}
            deleteCat={deleteCat} newCat={newCat} setNewCat={setNewCat} addCategoria={addCategoria}
            reorderCategorias={persistCategorias}
            setNominaPrincipal={setNominaPrincipal}
            toggleCuentaIngreso={toggleCuentaIngreso}
          />
        )}

        {tab === "metas" && (
          <MetasTab
            metas={metas}
            categoriasAhorro={categorias.filter((c) => c.tipo === "Ahorro")}
            categoriaResumen={categoriaResumen}
            editingMeta={editingMeta} metaDraft={metaDraft} setMetaDraft={setMetaDraft}
            startEditMeta={startEditMeta} saveEditMeta={saveEditMeta} setEditingMeta={setEditingMeta}
            deleteMeta={deleteMeta} newMeta={newMeta} setNewMeta={setNewMeta} addMeta={addMeta}
            todayQ={todayQ}
          />
        )}
      </main>

      <button className="fab-btn" onClick={openFab} aria-label="Agregar gasto rápido">
        <Plus size={22} />
      </button>

      {fabOpen && (
        <div className="fab-backdrop" onClick={() => setFabOpen(false)}>
          <div className="fab-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="fab-sheet-title">Agregar a {fmtQuincena(todayQ)}</div>

            <div className="fab-mode-toggle">
              <button className={fabMode === "existente" ? "active" : ""} onClick={() => setFabMode("existente")}>Categoría existente</button>
              <button className={fabMode === "nueva" ? "active" : ""} onClick={() => setFabMode("nueva")}>Categoría nueva</button>
            </div>

            {fabMode === "existente" ? (
              <label className="fab-field">
                <span>Categoría</span>
                <select value={fabCat} onChange={(e) => setFabCat(e.target.value)}>
                  {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </label>
            ) : (
              <>
                <label className="fab-field">
                  <span>Nombre de la categoría</span>
                  <input type="text" placeholder="Ej. Netflix" autoFocus value={fabNewNombre} onChange={(e) => setFabNewNombre(e.target.value)} />
                </label>
                <label className="fab-field">
                  <span>Tipo</span>
                  <select value={fabNewTipo} onChange={(e) => setFabNewTipo(e.target.value)}>
                    <option>Ingreso</option><option>Vale</option><option>Gasto</option><option>Ahorro</option>
                  </select>
                </label>
              </>
            )}

            <label className="fab-field">
              <span>Monto</span>
              <input type="number" min="0" step="0.01" placeholder="0.00" autoFocus={fabMode === "existente"} value={fabAmt} onChange={(e) => setFabAmt(e.target.value)} />
            </label>
            <div className="fab-sheet-actions">
              <button className="btn-secondary" onClick={() => setFabOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={saveFab}><Check size={16} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
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
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E8E6E0" strokeWidth="12" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="12"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 64 64)"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
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

function ResumenTab({ ultima, anterior, categoriaResumen, alertas, trendData, pieData, hasCapturedToday, onQuickAdd, racha, recentMovs, metas }) {
  const libreDelta = ultima && anterior ? ultima.libre - anterior.libre : null;
  const totalByNombreMeta = {};
  categoriaResumen.forEach((c) => { totalByNombreMeta[c.nombre] = c.total; });
  const comprometidoPct = ultima && ultima.nomina ? Math.round((ultima.gastoSeguro / ultima.nomina) * 100) : 0;

  // semáforo: rojo si ya te pasaste, ámbar si te queda poco margen, verde si vas bien
  const nomina = ultima?.nomina || 0;
  const libre = ultima?.libre ?? 0;
  const libreState = libre < 0 ? "red" : (nomina > 0 && libre < nomina * 0.15) ? "amber" : "green";
  const libreCopy = {
    red: { icon: AlertTriangle, texto: "Ya te pasaste de tu Libre esta quincena" },
    amber: { icon: AlertTriangle, texto: "Vas ajustado — te queda poco margen" },
    green: { icon: CheckCircle2, texto: "Vas bien, tienes margen esta quincena" },
  }[libreState];

  // gasto puro (sin ahorro) como % de la nómina — el ahorro no cuenta para esta métrica
  const gastoPct = nomina > 0 ? Math.round(((ultima?.gasto || 0) / nomina) * 100) : 0;
  const gastoAlto = gastoPct >= 75;

  return (
    <div className="tab-pane">
      {!hasCapturedToday && (
        <section className="reminder-box">
          <AlertTriangle size={15} />
          <span>Aún no registras nada esta quincena — toma menos de un minuto.</span>
          <button className="btn-secondary" onClick={onQuickAdd}><Plus size={14} /> Agregar ahora</button>
        </section>
      )}

      {gastoAlto && (
        <section className="reminder-box gasto-alto-box">
          <AlertTriangle size={15} />
          <span>Ya usaste el {gastoPct}% de tu nómina en gastos esta quincena (sin contar el ahorro).</span>
        </section>
      )}

      <section className="hero">
        <div className="hero-eyebrow-row">
          <div className="hero-eyebrow">{ultima ? `Quincena del ${fmtQuincena(ultima.quincena)}` : "Sin movimientos todavía"}</div>
          {racha > 1 && <span className="racha-pill">🔥 {racha} quincenas seguidas</span>}
        </div>
        <div className="hero-row">
          <div>
            <div className="hero-label">Dinero libre esta quincena</div>
            <div className={`hero-number state-${libreState}`}>
              {ultima ? fmtMoney(ultima.libre) : fmtMoney(0)}
            </div>
            <div className={`hero-status state-${libreState}`}>
              <libreCopy.icon size={14} /> {libreCopy.texto}
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
        <StatChip icon={Wallet} label="Ingreso total" hint="lo que entró esta quincena" value={ultima?.ingreso || 0} tone="forest" />
        <StatChip icon={TrendingDown} label="Gasto total" hint="lo que ya gastaste" value={ultima?.gasto || 0} tone="brick" />
        <StatChip icon={PiggyBank} label="Ahorro" hint="lo que apartaste" value={ultima?.ahorro || 0} tone="gold" />
        <StatChip icon={Receipt} label="Gasto seguro" hint="gasto + ahorro comprometido" value={ultima?.gastoSeguro || 0} tone="ink" />
      </section>

      {alertas.length > 0 && (
        <section className="alert-box">
          <AlertTriangle size={16} />
          <div>
            <strong>{alertas.length} {alertas.length === 1 ? "categoría excedida" : "categorías excedidas"} esta quincena</strong>
            <ul className="alert-list">
              {alertas.map((a) => (
                <li key={a.id}>{a.nombre}: {fmtMoney(a.actual - a.presupuesto)} sobre presupuesto</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(anterior || recentMovs?.length > 0) && (
        <section className="recap-row">
          {anterior && (
            <div className="panel recap-panel">
              <div className="panel-title">Cierre de la quincena pasada</div>
              <div className="recap-grid">
                <div><span>Ingreso</span><strong className="c-forest">{fmtMoney(anterior.ingreso)}</strong></div>
                <div><span>Gasto</span><strong className="c-brick">{fmtMoney(anterior.gasto)}</strong></div>
                <div><span>Ahorro</span><strong className="c-gold">{fmtMoney(anterior.ahorro)}</strong></div>
                <div><span>Libre</span><strong className={anterior.libre < 0 ? "c-brick" : "c-forest"}>{fmtMoney(anterior.libre)}</strong></div>
              </div>
            </div>
          )}
          {recentMovs?.length > 0 && (
            <div className="panel recap-panel">
              <div className="panel-title">Recién agregado</div>
              <ul className="recent-list">
                {recentMovs.slice(0, 6).map((m) => (
                  <li key={m.id}>
                    <span className={`tone-text-${m.tipo}`}>{m.categoria}</span>
                    <span className="num">{fmtMoney(m.monto)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {metas.length > 0 && (
        <section className="panel">
          <div className="panel-title">Tus metas</div>
          <div className="metas-summary-list">
            {metas.map((m) => {
              const actual = m.categoria ? (totalByNombreMeta[m.categoria] || 0) : (m.montoManual || 0);
              const pct = m.montoObjetivo > 0 ? Math.min(100, Math.round((actual / m.montoObjetivo) * 100)) : 0;
              const plan = computeMetaPlan(m, actual, ultima?.quincena);
              return (
                <div className="metas-summary-row" key={m.id}>
                  <div className="metas-summary-head">
                    <span className="metas-summary-name">{m.nombre}</span>
                    <span className="meta-pct">{pct}%</span>
                  </div>
                  <div className="meta-progress-track"><div className="meta-progress-fill" style={{ width: `${pct}%` }} /></div>
                  {plan && (
                    <div className={`meta-plan ${plan.vencido ? "meta-plan-warn" : ""}`}>
                      {plan.lograda
                        ? "🎉 ¡Meta lograda!"
                        : plan.vencido
                          ? `Plazo vencido — faltan ${fmtMoney(plan.recomendado)}`
                          : `${fmtMoney(plan.recomendado)}/quincena para lograrlo en ${plan.restantes} quincena${plan.restantes === 1 ? "" : "s"}`}
                    </div>
                  )}
                </div>
              );
            })}
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
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#FFFFFF" strokeWidth={2} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ background: "#FFFFFF", border: "1px solid #E8E6E0", borderRadius: 10, color: "#1A1D21" }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, color: "#45484D" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-note-cta">
              <div>Todavía no hay gastos registrados.</div>
              <button className="btn-secondary" onClick={onQuickAdd}><Plus size={13} /> Agregar el primero</button>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">Ingreso, gasto y libre por quincena</div>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData} margin={{ top: 6, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#E8E6E0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9C9C96" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9C9C96" }} />
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ background: "#FFFFFF", border: "1px solid #E8E6E0", borderRadius: 10, color: "#1A1D21" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#6B6B64" }} />
                <Line type="monotone" dataKey="Ingreso" stroke="#16A34A" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Gasto" stroke="#DC2626" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Libre" stroke="#57534E" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-note-cta">
              <div>Todavía no hay movimientos registrados.</div>
              <button className="btn-secondary" onClick={onQuickAdd}><Plus size={13} /> Agregar el primero</button>
            </div>
          )}
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

function GridCell({ value, placeholder, onCommit, tone, nota, onSaveNota }) {
  const [draft, setDraft] = useState(value === "" || value === undefined ? "" : String(value));
  const [justSaved, setJustSaved] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(nota || "");
  const pressTimer = useRef(null);

  useEffect(() => {
    setDraft(value === "" || value === undefined ? "" : String(value));
  }, [value]);
  useEffect(() => {
    setNoteDraft(nota || "");
  }, [nota]);

  const commit = () => {
    if (draft !== (value === "" || value === undefined ? "" : String(value))) {
      onCommit(draft);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 700);
    }
  };

  const hasAmount = value !== "" && value !== undefined;
  const startPress = () => {
    if (!hasAmount || !onSaveNota) return;
    pressTimer.current = setTimeout(() => setNoteOpen(true), 550);
  };
  const cancelPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

  return (
    <div className="grid-cell-wrap">
      <input
        type="number"
        className={`grid-cell-input tone-text-${tone} ${justSaved ? "just-saved" : ""}`}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        onTouchMove={cancelPress}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onContextMenu={(e) => { if (hasAmount && onSaveNota) e.preventDefault(); }}
      />
      {nota && <span className="nota-dot" title={nota} />}
      {noteOpen && (
        <div className="note-popover" onClick={(e) => e.stopPropagation()}>
          <textarea
            autoFocus
            placeholder="Agrega una nota para este movimiento…"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
          />
          <div className="note-popover-actions">
            <button className="btn-secondary" onClick={() => setNoteOpen(false)}>Cancelar</button>
            <button className="btn-primary" onClick={() => { onSaveNota(noteDraft); setNoteOpen(false); }}><Check size={14} /> Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const ZERO_STATS = { ingreso: 0, gasto: 0, ahorro: 0, vale: 0, gastoSeguro: 0, libre: 0, balance: 0 };

function CatIcon({ nombre, tipo }) {
  return <span className={`cat-icon tone-bg-${tipo}`}>{nombre.charAt(0)}</span>;
}

function GridTab({ categorias, periods, cellMap, statsMap, categoriaResumen, updateCell, lastNomina, onAddQuincena, todayQ, notaMap, updateNota }) {
  const [mobileView, setMobileView] = useState("tarjetas"); // "tarjetas" | "cuadricula"
  const groups = [
    { tipo: "Ingreso", label: "Ingresos" },
    { tipo: "Vale", label: "Vales" },
    { tipo: "Ahorro", label: "Ahorro" },
    { tipo: "Gasto", label: "Gastos" },
  ].map((g) => ({ ...g, cats: categorias.filter((c) => c.tipo === g.tipo) }));

  const totalByNombre = {};
  categoriaResumen.forEach((c) => { totalByNombre[c.nombre] = c.total; });

  return (
    <div className="tab-pane">
      <section className={`panel mobile-view-${mobileView}`}>
        <div className="panel-title-row">
          <div className="panel-title">Captura quincenal</div>
          <div className="panel-title-actions">
            <div className="view-toggle">
              <button className={mobileView === "tarjetas" ? "active" : ""} onClick={() => setMobileView("tarjetas")} aria-label="Ver como tarjetas">
                <Rows3 size={14} />
              </button>
              <button className={mobileView === "cuadricula" ? "active" : ""} onClick={() => setMobileView("cuadricula")} aria-label="Ver como cuadrícula">
                <Table2 size={14} />
              </button>
            </div>
            <button className="btn-secondary" onClick={onAddQuincena}><Plus size={14} /> Agregar quincena</button>
          </div>
        </div>

        <div className="desktop-only">
        <div className="grid-scroll-wrap">
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
                  <th key={c.id} className={`cat-head group-${g.tipo} tipo-text-${g.tipo}`}>
                    <span className="cat-head-inner"><CatIcon nombre={c.nombre} tipo={g.tipo} />{c.nombre}</span>
                  </th>
                )))}
                <th className="cat-head col-gastoseguro">Gasto Seguro</th>
                <th className="cat-head col-libre">Libre</th>
                <th className="cat-head group-Calc">Balance</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((q) => {
                const stats = statsMap[q] || ZERO_STATS;
                const isCurrent = q === todayQ;
                return (
                  <tr key={q} className={isCurrent ? "current-row" : ""}>
                    <td className="sticky-col quincena-cell" title={fmtQuincena(q)}>
                      {fmtQuincenaCompact(q)}
                      {isCurrent && <span className="hoy-dot" title="Quincena actual" />}
                    </td>
                    {groups.map((g) => g.cats.map((c) => {
                      const key = `${q}|${c.nombre}`;
                      const raw = cellMap[key];
                      const placeholder = (c.nombre === "Nómina" || c.esNomina) && raw === undefined ? lastNomina : "";
                      return (
                        <td key={c.id} className="cell-td">
                          <GridCell
                            value={raw === undefined ? "" : raw}
                            placeholder={placeholder ? String(placeholder) : ""}
                            onCommit={(v) => updateCell(q, c.nombre, v)}
                            tone={g.tipo}
                            nota={notaMap[key]}
                            onSaveNota={(text) => updateNota(q, c.nombre, text)}
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
                <td className="sticky-col total-label" title="Total acumulado">Total</td>
                {groups.map((g) => g.cats.map((c) => (
                  <td key={c.id} className={`num total-td ${(c.nombre === "Nómina" || c.esNomina) ? "total-nomina" : ""}`}>{fmtMoney(totalByNombre[c.nombre] || 0)}</td>
                )))}
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        </div>
        <div className="grid-hint">Escribe un monto y presiona Enter o haz clic fuera de la celda para guardarlo. Deja la celda vacía y guárdala para borrar ese movimiento.</div>
        </div>

        <div className="mobile-only">
          <MobileQuincenaCards
            categorias={categorias}
            periods={periods}
            cellMap={cellMap}
            statsMap={statsMap}
            updateCell={updateCell}
            lastNomina={lastNomina}
            todayQ={todayQ}
            notaMap={notaMap}
            updateNota={updateNota}
          />
        </div>
      </section>
    </div>
  );
}

function MobileQuincenaCards({ categorias, periods, cellMap, statsMap, updateCell, lastNomina, todayQ, notaMap, updateNota }) {
  const todayIdx = periods.indexOf(todayQ);
  const [idx, setIdx] = useState(todayIdx >= 0 ? todayIdx : periods.length - 1);

  useEffect(() => {
    const i = periods.indexOf(todayQ);
    if (i >= 0) setIdx(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayQ]);

  const safeIdx = Math.min(idx, periods.length - 1);
  const q = periods[safeIdx];
  const stats = (q && statsMap[q]) || ZERO_STATS;
  const isCurrent = q === todayQ;

  if (!q) return <div className="empty-note">Agrega una quincena para empezar.</div>;

  return (
    <div className="mobile-cards">
      <div className="mobile-cards-nav">
        <button className="icon-btn" onClick={() => setIdx(Math.max(0, safeIdx - 1))} disabled={safeIdx === 0} aria-label="Quincena anterior">
          <ChevronLeft size={16} />
        </button>
        <div className="mobile-cards-title">
          <span className="mobile-cards-q">{fmtQuincena(q)}</span>
          {isCurrent && <span className="hoy-pill">Hoy</span>}
        </div>
        <button className="icon-btn" onClick={() => setIdx(Math.min(periods.length - 1, safeIdx + 1))} disabled={safeIdx === periods.length - 1} aria-label="Quincena siguiente">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mobile-summary-row">
        <div className="mobile-summary-chip c-forest"><span>Ingreso</span><strong>{fmtMoney(stats.ingreso)}</strong></div>
        <div className="mobile-summary-chip c-brick"><span>Gasto</span><strong>{fmtMoney(stats.gasto)}</strong></div>
        <div className="mobile-summary-chip c-gold"><span>Libre</span><strong>{fmtMoney(stats.libre)}</strong></div>
      </div>

      <div className="mobile-cat-list">
        {categorias.map((c) => {
          const key = `${q}|${c.nombre}`;
          const raw = cellMap[key];
          const placeholder = (c.nombre === "Nómina" || c.esNomina) && raw === undefined ? lastNomina : "";
          return (
            <div className="mobile-cat-row" key={c.id}>
              <CatIcon nombre={c.nombre} tipo={c.tipo} />
              <div className="mobile-cat-info">
                <div className="mobile-cat-name">{c.nombre}</div>
                <div className="mobile-cat-tipo">{c.tipo}</div>
              </div>
              <div className="mobile-cat-amount">
                <GridCell
                  value={raw === undefined ? "" : raw}
                  placeholder={placeholder ? String(placeholder) : ""}
                  onCommit={(v) => updateCell(q, c.nombre, v)}
                  tone={c.tipo}
                  nota={notaMap[key]}
                  onSaveNota={(text) => updateNota(q, c.nombre, text)}
                />
              </div>
            </div>
          );
        })}
        {categorias.length === 0 && <div className="empty-note">Agrega categorías en la pestaña Categorías para empezar a capturar.</div>}
      </div>
    </div>
  );
}

function CategoriasTab({ categorias, editingCat, catDraft, setCatDraft, startEditCat, saveEditCat, setEditingCat, deleteCat, newCat, setNewCat, addCategoria, reorderCategorias, setNominaPrincipal, toggleCuentaIngreso }) {
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDrop = (i) => (e) => {
    e.preventDefault();
    const from = dragIndex.current;
    setDragOverIndex(null);
    if (from === null || from === i) return;
    const next = [...categorias];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    reorderCategorias(next);
    dragIndex.current = null;
  };

  return (
    <div className="tab-pane">
      <section className="panel">
        <div className="panel-title">Tus categorías</div>
        <div className="grid-hint" style={{ marginTop: -8, marginBottom: 12 }}>
          Arrastra <GripVertical size={12} style={{ verticalAlign: "-2px" }} /> para reordenarlas. Marca con <Star size={12} style={{ verticalAlign: "-2px" }} /> cuál de tus ingresos es tu Nómina principal (se usa para calcular "Libre").
        </div>
        <div className="table-wrap">
          <table className="ledger-table">
            <thead>
              <tr><th></th><th>Categoría</th><th>Tipo</th><th style={{ textAlign: "center" }}>Nómina</th><th style={{ textAlign: "center" }}>Cuenta en ingreso</th><th className="num">Presupuesto quincenal</th><th></th></tr>
            </thead>
            <tbody>
              {categorias.map((c, i) => {
                const isEditing = editingCat === c.id;
                return (
                  <tr
                    key={c.id}
                    className={dragOverIndex === i ? "drag-over" : ""}
                    draggable
                    onDragStart={(e) => { dragIndex.current = i; e.dataTransfer.effectAllowed = "move"; }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i); }}
                    onDragLeave={() => setDragOverIndex((cur) => (cur === i ? null : cur))}
                    onDrop={handleDrop(i)}
                    onDragEnd={() => { dragIndex.current = null; setDragOverIndex(null); }}
                  >
                    <td className="drag-handle-cell"><GripVertical size={14} /></td>
                    <td>{c.nombre}</td>
                    <td>
                      {isEditing ? (
                        <select value={catDraft.tipo} onChange={(e) => setCatDraft({ ...catDraft, tipo: e.target.value })}>
                          <option>Ingreso</option><option>Vale</option><option>Gasto</option><option>Ahorro</option>
                        </select>
                      ) : <span className={`tipo-pill tipo-${c.tipo}`}>{c.tipo}</span>}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {c.tipo === "Ingreso" ? (
                        <button
                          className={`nomina-star ${c.esNomina ? "active" : ""}`}
                          onClick={() => setNominaPrincipal(c.id)}
                          title={c.esNomina ? "Es tu Nómina principal" : "Marcar como Nómina principal"}
                        >
                          <Star size={15} fill={c.esNomina ? "currentColor" : "none"} />
                        </button>
                      ) : "—"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {c.tipo === "Ingreso" ? (
                        <input
                          type="checkbox"
                          checked={c.cuentaIngreso !== false}
                          onChange={() => toggleCuentaIngreso(c.id)}
                          title={c.cuentaIngreso !== false ? "Cuenta en tu Ingreso total" : "No cuenta en tu Ingreso total (ej. vales, dinero no líquido)"}
                        />
                      ) : "—"}
                    </td>
                    <td className="num">
                      {isEditing ? (
                        <input type="number" min="0" step="0.01" value={catDraft.presupuesto} onChange={(e) => setCatDraft({ ...catDraft, presupuesto: e.target.value })} style={{ width: 110 }} />
                      ) : (c.presupuesto > 0 ? fmtMoney(c.presupuesto) : "—")}
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
              <option>Ingreso</option><option>Vale</option><option>Gasto</option><option>Ahorro</option>
            </select>
          </label>
          <label>
            <span>Presupuesto quincenal</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={newCat.presupuesto} onChange={(e) => setNewCat({ ...newCat, presupuesto: e.target.value })} />
          </label>
          <button className="btn-primary" onClick={addCategoria}><Plus size={16} /> Agregar</button>
        </div>
      </section>
    </div>
  );
}

function MetasTab({ metas, categoriasAhorro, categoriaResumen, editingMeta, metaDraft, setMetaDraft, startEditMeta, saveEditMeta, setEditingMeta, deleteMeta, newMeta, setNewMeta, addMeta, todayQ }) {
  const totalByNombre = {};
  categoriaResumen.forEach((c) => { totalByNombre[c.nombre] = c.total; });

  return (
    <div className="tab-pane">
      <section className="panel">
        <div className="panel-title">Tus metas de ahorro</div>
        {metas.length === 0 ? (
          <div className="empty-note">Todavía no tienes metas — agrega una abajo.</div>
        ) : (
          <div className="metas-list">
            {metas.map((m) => {
              const actual = m.categoria ? (totalByNombre[m.categoria] || 0) : (m.montoManual || 0);
              const pct = m.montoObjetivo > 0 ? Math.min(100, Math.round((actual / m.montoObjetivo) * 100)) : 0;
              const plan = computeMetaPlan(m, actual, todayQ);
              const isEditing = editingMeta === m.id;
              return (
                <div className="meta-card" key={m.id}>
                  {isEditing ? (
                    <div className="meta-edit-form">
                      <input type="text" placeholder="Nombre" value={metaDraft.nombre} onChange={(e) => setMetaDraft({ ...metaDraft, nombre: e.target.value })} />
                      <input type="number" min="0" step="0.01" placeholder="Monto objetivo" value={metaDraft.montoObjetivo} onChange={(e) => setMetaDraft({ ...metaDraft, montoObjetivo: e.target.value })} />
                      <select value={metaDraft.categoria || ""} onChange={(e) => setMetaDraft({ ...metaDraft, categoria: e.target.value })}>
                        <option value="">Manual (yo escribo el avance)</option>
                        {categoriasAhorro.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                      </select>
                      {!metaDraft.categoria && (
                        <input type="number" min="0" step="0.01" placeholder="Cuánto llevas ya" value={metaDraft.montoManual} onChange={(e) => setMetaDraft({ ...metaDraft, montoManual: e.target.value })} />
                      )}
                      <input type="number" min="0" step="1" placeholder="¿En cuántas quincenas lo quieres?" value={metaDraft.plazoQuincenas} onChange={(e) => setMetaDraft({ ...metaDraft, plazoQuincenas: e.target.value })} />
                      <div className="meta-edit-actions">
                        <button className="icon-btn" onClick={saveEditMeta} aria-label="Guardar"><Check size={14} /></button>
                        <button className="icon-btn" onClick={() => setEditingMeta(null)} aria-label="Cancelar"><X size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="meta-card-head">
                        <div className="meta-card-name">{m.nombre}</div>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => startEditMeta(m)} aria-label="Editar"><Pencil size={14} /></button>
                          <button className="icon-btn" onClick={() => deleteMeta(m.id)} aria-label="Eliminar"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="meta-progress-track"><div className="meta-progress-fill" style={{ width: `${pct}%` }} /></div>
                      <div className="meta-card-nums">
                        <span>{fmtMoney(actual)} de {fmtMoney(m.montoObjetivo)}</span>
                        <span className="meta-pct">{pct}%</span>
                      </div>
                      {m.categoria && <div className="meta-card-link">Vinculada a "{m.categoria}" — se actualiza sola</div>}
                      {plan && (
                        <div className={`meta-plan ${plan.vencido ? "meta-plan-warn" : ""}`}>
                          {plan.lograda
                            ? "🎉 ¡Meta lograda!"
                            : plan.vencido
                              ? `Se venció el plazo — todavía faltan ${fmtMoney(plan.recomendado)}`
                              : `Ahorra ${fmtMoney(plan.recomendado)} por quincena para lograrlo en ${plan.restantes} quincena${plan.restantes === 1 ? "" : "s"} más`}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-title">Agregar meta</div>
        <div className="form-row">
          <label>
            <span>Nombre</span>
            <input type="text" placeholder="Ej. Viaje, Fondo de emergencia" value={newMeta.nombre} onChange={(e) => setNewMeta({ ...newMeta, nombre: e.target.value })} />
          </label>
          <label>
            <span>Monto objetivo</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={newMeta.montoObjetivo} onChange={(e) => setNewMeta({ ...newMeta, montoObjetivo: e.target.value })} />
          </label>
          <label>
            <span>Vincular a categoría</span>
            <select value={newMeta.categoria} onChange={(e) => setNewMeta({ ...newMeta, categoria: e.target.value })}>
              <option value="">Manual (yo escribo el avance)</option>
              {categoriasAhorro.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </label>
          {!newMeta.categoria && (
            <label>
              <span>Cuánto llevas ya</span>
              <input type="number" min="0" step="0.01" placeholder="0.00" value={newMeta.montoManual} onChange={(e) => setNewMeta({ ...newMeta, montoManual: e.target.value })} />
            </label>
          )}
          <label>
            <span>¿En cuántas quincenas lo quieres?</span>
            <input type="number" min="0" step="1" placeholder="Ej. 10" value={newMeta.plazoQuincenas} onChange={(e) => setNewMeta({ ...newMeta, plazoQuincenas: e.target.value })} />
          </label>
          <button className="btn-primary" onClick={addMeta}><Plus size={16} /> Agregar</button>
        </div>
        {categoriasAhorro.length === 0 && (
          <div className="grid-hint" style={{ marginTop: 10 }}>Tip: si vinculas una meta a una categoría de Ahorro (ej. "Tanda"), el avance se calcula solo con lo que ya capturas en la Tabla — no necesitas escribirlo dos veces. Si además le pones un plazo, te decimos cuánto ahorrar por quincena.</div>
        )}
      </section>
    </div>
  );
}


