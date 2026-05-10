import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ── Stub compiler modules (replace with your real imports) ──────────────────
const lexer = (expr) => {
  const tokens = []
  const parts = expr.match(/[a-zA-Z_]\w*|[0-9]+(\.[0-9]+)?|[+\-*/=()]/g) || []
  parts.forEach((p) => {
    if (/^[a-zA-Z_]\w*$/.test(p)) tokens.push({ value: p, type: "IDENTIFIER" })
    else if (/^[0-9]/.test(p)) tokens.push({ value: p, type: "NUMBER" })
    else if (["+", "-", "*", "/"].includes(p)) tokens.push({ value: p, type: "OPERATOR" })
    else if (p === "=") tokens.push({ value: p, type: "ASSIGN" })
    else tokens.push({ value: p, type: "SYMBOL" })
  })
  return tokens
}
const validateSyntax = (expr) => /^[a-zA-Z_]\w*\s*=\s*.+/.test(expr.trim())
const generateTAC = (expr) => {
  const parts = expr.split("=")
  if (parts.length < 2) return []
  const rhs = parts[1].trim()
  const lines = []
  let t = 1
  const ops = rhs.match(/[+\-*/]/) || []
  const operands = rhs.split(/[+\-*/]/).map((s) => s.trim())
  if (operands.length >= 3) {
    lines.push(`t${t} = ${operands[1]} * ${operands[2]}`)
    lines.push(`t${t + 1} = ${operands[0]} + t${t}`)
    lines.push(`${parts[0].trim()} = t${t + 1}`)
  } else if (operands.length === 2) {
    lines.push(`t${t} = ${operands[0]} ${ops[0] || "+"} ${operands[1]}`)
    lines.push(`${parts[0].trim()} = t${t}`)
  } else {
    lines.push(`${parts[0].trim()} = ${rhs}`)
  }
  return lines
}
const constantFolding = (expr) => {
  try {
    const parts = expr.split("=")
    if (parts.length < 2) return expr
    const variable = parts[0].trim()
    const rhs = parts[1].trim()
    const result = Function(`"use strict"; return (${rhs})`)()
    return `${variable} = ${result}`
  } catch {
    return expr
  }
}
const generateParseTree = (expr) => {
  try {
    const parts = expr.split("=")
    if (parts.length < 2) return null
    const rhs = parts[1].trim()
    const addMatch = rhs.match(/^(.+)\+(.+)$/)
    if (addMatch) {
      const leftPart = addMatch[1].trim()
      const rightPart = addMatch[2].trim()
      const mulMatch = rightPart.match(/^(.+)\*(.+)$/)
      if (mulMatch) {
        return {
          value: "+",
          left: { value: leftPart },
          right: {
            value: "*",
            left: { value: mulMatch[1].trim() },
            right: {
              value: mulMatch[2].trim(),
              left: { value: mulMatch[2].trim().split("")[0] || "?" },
              right: { value: mulMatch[2].trim().split("")[1] || "?" },
            },
          },
        }
      }
    }
    return null
  } catch {
    return null
  }
}
// ───────────────────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Lexical Analysis", short: "LEX", color: "emerald" },
  { label: "Syntax Analysis", short: "SYN", color: "sky" },
  { label: "TAC Generation", short: "TAC", color: "amber" },
  { label: "Optimization", short: "OPT", color: "violet" },
  { label: "Parse Tree", short: "TREE", color: "rose" },
]

const PHASE_INFO = [
  "Breaks source text into a flat sequence of tokens — identifiers, numeric literals, operators, and assignment symbols — stripping whitespace and comments along the way.",
  "Feeds the token stream through a context-free grammar to verify structural correctness, catching mismatched parentheses, missing operands, and other syntactic violations.",
  "Converts the validated expression into a linearised intermediate form where each instruction references at most three addresses, bridging high-level syntax and machine-level code.",
  "Applies algebraic simplifications — most notably constant folding — to collapse compile-time-known sub-expressions into their numeric results without altering program semantics.",
  "Constructs a hierarchical tree mirroring operator precedence and associativity, where internal nodes are operators and leaves are operands.",
]

const THEORY = [
  {
    title: "Introduction to Compilers",
    tag: "INTRO",
    content:
      "A compiler is a translator that maps source code written in a high-level language to an equivalent program in a lower-level target language, typically machine code or bytecode, through a sequence of well-defined transformation phases.",
  },
  {
    title: "Compiler Phases",
    tag: "ARCH",
    content:
      "The canonical pipeline runs: lexical analysis → syntax analysis → semantic analysis → intermediate code generation → machine-independent optimisation → code generation → machine-dependent optimisation.",
  },
  {
    title: "Lexical Analysis",
    tag: "LEX",
    content:
      "The scanner (lexer) reads the raw character stream and groups characters into tokens according to regular expressions, returning a flat list of typed lexemes for the parser to consume.",
  },
  {
    title: "Syntax Analysis",
    tag: "PARSE",
    content:
      "The parser applies a context-free grammar to the token stream, either building an explicit parse tree or driving a syntax-directed translation scheme to validate grammatical structure.",
  },
  {
    title: "Expression Evaluation",
    tag: "EXPR",
    content:
      "Arithmetic expressions obey a strict operator-precedence hierarchy (exponentiation > multiplication/division > addition/subtraction) and left-to-right associativity for operators of equal precedence.",
  },
  {
    title: "Three Address Code",
    tag: "TAC",
    content:
      "TAC is a linearised IR where every instruction is of the form x = y ⊕ z, with at most one operator per instruction and arbitrary temporary variables replacing complex sub-expressions.",
  },
  {
    title: "Constant Folding",
    tag: "OPT",
    content:
      "Constant folding evaluates sub-expressions whose operands are all compile-time constants, replacing them with their computed value and eliminating unnecessary run-time computation.",
  },
  {
    title: "Error Handling",
    tag: "ERR",
    content:
      "Robust compilers employ error-recovery strategies — panic mode, phrase-level recovery, error productions — to continue analysis after detecting a syntactic or semantic error rather than halting immediately.",
  },
  {
    title: "Applications",
    tag: "APP",
    content:
      "Compiler techniques underpin IDEs (incremental parsing, syntax highlighting), query optimisers (relational algebra rewrites), shader compilers, JIT engines, and domain-specific language toolchains.",
  },
]

const colorMap = {
  emerald: { ring: "ring-emerald-400/60", text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", dot: "bg-emerald-400" },
  sky: { ring: "ring-sky-400/60", text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/30", dot: "bg-sky-400" },
  amber: { ring: "ring-amber-400/60", text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", dot: "bg-amber-400" },
  violet: { ring: "ring-violet-400/60", text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30", dot: "bg-violet-400" },
  rose: { ring: "ring-rose-400/60", text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30", dot: "bg-rose-400" },
}

// ── Reusable output card ────────────────────────────────────────────────────
function OutputCard({ title, accent, children, delay = 0 }) {
  const c = colorMap[accent] || colorMap.emerald
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="rounded-2xl border border-white/[0.07] bg-[#0d1117] overflow-hidden"
    >
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]`}>
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <h2 className={`font-mono text-sm font-semibold tracking-widest uppercase ${c.text}`}>
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

// ── Token row ───────────────────────────────────────────────────────────────
function TokenRow({ token, index }) {
  const typeColors = {
    IDENTIFIER: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    NUMBER: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    OPERATOR: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    ASSIGN: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    SYMBOL: "text-slate-300 bg-slate-400/10 border-slate-400/20",
  }
  const cls = typeColors[token.type] || typeColors.SYMBOL
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors duration-200"
    >
      <span className="font-mono text-sm text-slate-200">{token.value}</span>
      <span className={`font-mono text-xs px-2.5 py-1 rounded-md border ${cls}`}>
        {token.type}
      </span>
    </motion.div>
  )
}

// ── TAC row ─────────────────────────────────────────────────────────────────
function TACRow({ line, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="flex items-center gap-4 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors duration-200"
    >
      <span className="font-mono text-xs text-slate-600 w-6 shrink-0 text-right">{index + 1}</span>
      <span className="font-mono text-sm text-amber-200">{line}</span>
    </motion.div>
  )
}

// ── SVG Parse Tree ──────────────────────────────────────────────────────────
// Renders the tree entirely in SVG so branch lines are pixel-perfect.
// Layout is computed once from fixed coordinates; all lines are drawn first
// (under the nodes) so circles always appear on top.

const NODE_R = 22          // radius of a node circle
const SMALL_R = 18         // radius for deeper nodes

// Palette: one colour per tree depth level
const NODE_STYLES = [
  { stroke: "#34d399", text: "#6ee7b7" },   // depth 0 — emerald  (root)
  { stroke: "#38bdf8", text: "#7dd3fc" },   // depth 1 — sky
  { stroke: "#fb7185", text: "#fda4af" },   // depth 1 — rose
  { stroke: "#fbbf24", text: "#fde68a" },   // depth 2 — amber
  { stroke: "#a78bfa", text: "#c4b5fd" },   // depth 2 — violet
  { stroke: "#94a3b8", text: "#cbd5e1" },   // depth 3 — slate
  { stroke: "#94a3b8", text: "#cbd5e1" },   // depth 3 — slate
]

// Fixed node positions [cx, cy] and their style index
// Tree shape for "a = 5 + 3 * 2":
//
//              [+]  (0)
//             /    \
//           [5]    [*]  (1,2)
//                  / \
//                [3] [2]  (3,4)
//                    / \
//                  [3] [2]  (5,6)  ← from right.right subtree leaves
//
// We lay this out on a 380×280 canvas (cx relative to centre = 190).

const NODES = [
  { id: 0, cx: 190, cy: 34,  r: NODE_R,  styleIdx: 0, key: "root"      },
  { id: 1, cx:  70, cy: 110, r: NODE_R,  styleIdx: 1, key: "left"      },
  { id: 2, cx: 295, cy: 110, r: NODE_R,  styleIdx: 2, key: "right"     },
  { id: 3, cx: 210, cy: 186, r: SMALL_R, styleIdx: 3, key: "right.left"      },
  { id: 4, cx: 360, cy: 186, r: SMALL_R, styleIdx: 4, key: "right.right"     },
  { id: 5, cx: 300, cy: 260, r: SMALL_R, styleIdx: 5, key: "right.right.left"  },
  { id: 6, cx: 410, cy: 260, r: SMALL_R, styleIdx: 6, key: "right.right.right" },
]

// Edges: [parentId, childId]
const EDGES = [
  [0, 1], [0, 2],
  [2, 3], [2, 4],
  [4, 5], [4, 6],
]

// Resolve a dot-path like "right.left.value" from the tree object
function resolvePath(tree, path) {
  return path.split(".").reduce((node, key) => node?.[key], tree) ?? "?"
}

function ParseTree({ tree }) {
  if (!tree) return null

  // Map each node key to the actual value from the tree
  const getValue = (key) => {
    if (key === "root") return tree.value
    return resolvePath(tree, key + ".value")
  }

  const SVG_W = 470
  const SVG_H = 300

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto"
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ minWidth: 320, maxWidth: SVG_W, display: "block", margin: "0 auto" }}
        aria-label="Parse tree diagram"
      >
        {/* ── Branch lines (drawn FIRST, underneath nodes) ── */}
        {EDGES.map(([pId, cId]) => {
          const p = NODES[pId]
          const c = NODES[cId]
          // Line runs from bottom of parent circle to top of child circle
          return (
            <line
              key={`${pId}-${cId}`}
              x1={p.cx}
              y1={p.cy + p.r}
              x2={c.cx}
              y2={c.cy - c.r}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )
        })}

        {/* ── Node circles + labels (drawn ON TOP of lines) ── */}
        {NODES.map((node) => {
          const style = NODE_STYLES[node.styleIdx]
          const val = getValue(node.key)
          return (
            <g key={node.id}>
              {/* Glow ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r + 4}
                fill="none"
                stroke={style.stroke}
                strokeWidth="1"
                opacity="0.18"
              />
              {/* Main circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="#0d1117"
                stroke={style.stroke}
                strokeWidth="2"
              />
              {/* Value label */}
              <text
                x={node.cx}
                y={node.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={style.text}
                fontSize={node.r >= NODE_R ? "13" : "11"}
                fontFamily="'DM Mono', ui-monospace, monospace"
                fontWeight="600"
              >
                {String(val).length > 3 ? String(val).slice(0, 3) : val}
              </text>
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

// ── Scanning animation for loader ───────────────────────────────────────────
function CompileLoader() {
  const steps = ["Tokenising input…", "Validating syntax…", "Generating TAC…", "Folding constants…", "Building parse tree…"]
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 220)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="relative w-14 h-14">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-400/40"
        />
      </div>
      <p className="font-mono text-xs text-emerald-400/80 tracking-widest">{steps[step]}</p>
    </div>
  )
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [expression, setExpression] = useState("")
  const [tokens, setTokens] = useState([])
  const [tac, setTac] = useState([])
  const [optimizedCode, setOptimizedCode] = useState("")
  const [error, setError] = useState("")
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePhase, setActivePhase] = useState(null)
  const [selectedTheory, setSelectedTheory] = useState(null)
  const [hasRun, setHasRun] = useState(false)

  const SAMPLES = ["a = 5 + 3 * 2", "x = 10 - 4 / 2", "y = 8 * 2 + 1"]

  const handleEvaluate = () => {
    if (!expression.trim()) return
    setLoading(true)
    setHasRun(false)
    setTimeout(() => {
      if (!validateSyntax(expression)) {
        setError("Syntax error: expected form  ‹identifier› = ‹expression›")
        setTokens([])
        setTac([])
        setOptimizedCode("")
        setTree(null)
        setLoading(false)
        return
      }
      setError("")
      setTokens(lexer(expression))
      setTac(generateTAC(expression))
      setOptimizedCode(constantFolding(expression))
      setTree(generateParseTree(expression))
      setLoading(false)
      setHasRun(true)
    }, 1400)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEvaluate()
  }

  return (
    <>
      {/* ── Google Fonts ────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --font-display: 'Syne', system-ui, sans-serif;
          --font-mono: 'DM Mono', ui-monospace, monospace;
        }

        body {
          background: #080c10;
          color: #e2e8f0;
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2a38; border-radius: 9999px; }

        /* Grid scan-line texture */
        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.012) 2px,
            rgba(255,255,255,0.012) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .font-display { font-family: var(--font-display); }
        .font-mono    { font-family: var(--font-mono); }

        /* Phase pill active */
        .phase-active {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.5);
          color: #6ee7b7;
        }

        /* Custom input */
        .expr-input {
          font-family: var(--font-mono);
          caret-color: #34d399;
        }
        .expr-input::placeholder { color: #3d5268; }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#080c10] text-slate-200 scanlines">

        {/* ── Ambient glow orbs ─────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
          <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-sky-500/[0.04] blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 space-y-32">

          {/* ══════════════════════════════════════════════════════════════
              HERO
          ══════════════════════════════════════════════════════════════ */}
          <section className="text-center space-y-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase">
                Compiler Design · Interactive Visualizer
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl font-extrabold leading-none tracking-tight"
            >
              <span className="text-white">Compiler</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Visualizer
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="max-w-2xl mx-auto font-mono text-sm sm:text-base text-slate-400 leading-relaxed"
            >
              Step through lexical analysis, syntax validation, three-address code
              generation, constant-folding optimisation, and parse-tree construction
              — one expression at a time.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 pt-4"
            >
              {[
                ["5", "Compiler Phases"],
                ["9", "Theory Concepts"],
                ["∞", "Expressions"],
              ].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl font-bold text-emerald-400">{num}</p>
                  <p className="font-mono text-xs text-slate-500 tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              PIPELINE PHASES
          ══════════════════════════════════════════════════════════════ */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel>Pipeline</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-10">
                Compiler Phases
              </h2>

              {/* Phase pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {PHASES.map((phase, i) => {
                  const c = colorMap[phase.color]
                  const isActive = activePhase === i
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActivePhase(isActive ? null : i)}
                      className={`
                        flex items-center gap-2.5 px-5 py-2.5 rounded-full border font-mono text-sm
                        transition-all duration-300
                        ${isActive
                          ? `${c.bg} ${c.border} ${c.text} border-opacity-60`
                          : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/20"
                        }
                      `}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? c.dot : "bg-slate-600"} transition-colors`} />
                      <span className="tracking-wide">{phase.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Active phase info */}
              <AnimatePresence mode="wait">
                {activePhase !== null && (
                  <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`overflow-hidden rounded-2xl border ${colorMap[PHASES[activePhase].color].border} ${colorMap[PHASES[activePhase].color].bg} p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`font-mono text-xs font-bold tracking-widest uppercase mt-0.5 ${colorMap[PHASES[activePhase].color].text}`}>
                        {PHASES[activePhase].short}
                      </span>
                      <p className="font-mono text-sm text-slate-300 leading-relaxed">
                        {PHASE_INFO[activePhase]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              THEORY GRID
          ══════════════════════════════════════════════════════════════ */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel>Reference</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-10">
                Compiler Theory
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {THEORY.map((section, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedTheory(selectedTheory === i ? null : i)}
                    className={`
                      text-left rounded-2xl border p-5 transition-all duration-300 w-full
                      ${selectedTheory === i
                        ? "bg-emerald-400/[0.07] border-emerald-400/40"
                        : "bg-white/[0.025] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-slate-500 tracking-widest uppercase">
                        {section.tag}
                      </span>
                      <motion.span
                        animate={{ rotate: selectedTheory === i ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-lg ${selectedTheory === i ? "text-emerald-400" : "text-slate-600"}`}
                      >
                        +
                      </motion.span>
                    </div>
                    <h3 className={`font-display font-semibold text-base mb-0 ${selectedTheory === i ? "text-emerald-300" : "text-slate-200"}`}>
                      {section.title}
                    </h3>

                    <AnimatePresence>
                      {selectedTheory === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="font-mono text-xs text-slate-400 leading-relaxed mt-4 overflow-hidden"
                        >
                          {section.content}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              COMPILER WORKBENCH
          ══════════════════════════════════════════════════════════════ */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionLabel>Interactive</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-10">
                Compiler Workbench
              </h2>

              {/* ── Input panel ──────────────────────────────────────────── */}
              <div className="rounded-3xl border border-white/[0.07] bg-[#0a0f16] p-6 sm:p-8 mb-6">

                {/* Terminal top-bar */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="font-mono text-xs text-slate-600 ml-3 tracking-widest">
                    compiler.workbench — expression input
                  </span>
                </div>

                {/* Input row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-emerald-500 select-none">
                      ›
                    </span>
                    <input
                      type="text"
                      placeholder="a = 5 + 3 * 2"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="expr-input w-full pl-9 pr-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-100 text-sm focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEvaluate}
                    disabled={loading || !expression.trim()}
                    className="
                      flex items-center gap-2.5 px-8 py-4 rounded-xl font-mono text-sm font-medium
                      bg-emerald-500 text-black
                      hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-200 whitespace-nowrap
                    "
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                        />
                        Compiling
                      </>
                    ) : (
                      <>
                        <span className="text-base">▶</span>
                        Run Pipeline
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Sample expressions */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="font-mono text-xs text-slate-600 self-center mr-1">Try:</span>
                  {SAMPLES.map((s, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setExpression(s)}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-emerald-400/30 transition-all duration-200"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>

                {/* Loading or error */}
                <AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CompileLoader />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-start gap-3 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <span className="text-red-400 text-lg shrink-0">⊗</span>
                      <div>
                        <p className="font-mono text-xs text-red-400 font-semibold tracking-wider uppercase mb-1">
                          Parse Error
                        </p>
                        <p className="font-mono text-sm text-red-300">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Output panels ─────────────────────────────────────────── */}
              <AnimatePresence>
                {hasRun && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 gap-5"
                  >
                    {/* Tokens */}
                    <OutputCard title="Tokens" accent="emerald" delay={0}>
                      <div className="space-y-2">
                        {tokens.length === 0 ? (
                          <p className="font-mono text-xs text-slate-600">No tokens generated.</p>
                        ) : (
                          tokens.map((t, i) => <TokenRow key={i} token={t} index={i} />)
                        )}
                      </div>
                    </OutputCard>

                    {/* Three Address Code */}
                    <OutputCard title="Three Address Code" accent="amber" delay={0.08}>
                      <div className="space-y-2">
                        {tac.length === 0 ? (
                          <p className="font-mono text-xs text-slate-600">No TAC generated.</p>
                        ) : (
                          tac.map((line, i) => <TACRow key={i} line={line} index={i} />)
                        )}
                      </div>
                    </OutputCard>

                    {/* Constant Folding */}
                    <OutputCard title="Constant Folding" accent="violet" delay={0.16}>
                      <div className="rounded-xl bg-violet-400/[0.06] border border-violet-400/20 px-5 py-5">
                        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">
                          Optimised result
                        </p>
                        <p className="font-mono text-xl font-medium text-violet-200">
                          {optimizedCode || "—"}
                        </p>
                      </div>
                      <p className="font-mono text-xs text-slate-600 mt-4 leading-relaxed">
                        Constant sub-expressions evaluated at compile time to eliminate redundant run-time computation.
                      </p>
                    </OutputCard>

                    {/* Parse Tree */}
                    <OutputCard title="Parse Tree" accent="rose" delay={0.24}>
                      {tree ? (
                        <div className="flex justify-center overflow-x-auto py-4">
                          <ParseTree tree={tree} />
                        </div>
                      ) : (
                        <p className="font-mono text-xs text-slate-600 text-center py-8">
                          Tree could not be generated for this expression.
                        </p>
                      )}
                    </OutputCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {!hasRun && !loading && !error && (
                <div className="rounded-2xl border border-dashed border-white/[0.07] py-16 text-center">
                  <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">
                    Enter an expression above and click Run Pipeline
                  </p>
                </div>
              )}
            </motion.div>
          </section>

        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/[0.05] mt-24 py-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["React", "Tailwind CSS", "Framer Motion", "Compiler Design"].map((tech, i) => (
              <span key={tech} className="flex items-center gap-2 font-mono text-xs text-slate-600">
                {i > 0 && <span className="text-slate-800">·</span>}
                {tech}
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-slate-700 mt-4">
            Built for students and professors of Compiler Design
          </p>
        </footer>

      </div>
    </>
  )
}

// ── Tiny section label ───────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-mono text-xs text-emerald-500/70 tracking-[0.2em] uppercase mb-3">
      — {children}
    </p>
  )
}
