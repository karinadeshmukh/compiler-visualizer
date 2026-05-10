import { useState } from "react"
import { lexer } from "./compiler/lexer"
import { generateTAC } from "./compiler/tac"
import { constantFolding } from "./compiler/optimizer"
import { validateSyntax } from "./compiler/parser"
import { generateParseTree } from "./compiler/tree"
import { motion } from "framer-motion"

function App() {

  const [expression, setExpression] = useState("")
  const [tokens, setTokens] = useState([])
  const [tac, setTac] = useState([])
  const [optimizedCode, setOptimizedCode] = useState("")
  const [error, setError] = useState("")
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePhase, setActivePhase] = useState(null)
  const [selectedTheory, setSelectedTheory] = useState(null)

  const theorySections = [

    {
      title: "Introduction to Compiler",
      icon: "💻",
      content:
        "A compiler converts high-level programming language into machine-level code through multiple phases."
    },

    {
      title: "Phases of Compiler",
      icon: "⚡",
      content:
        "Compiler phases include lexical analysis, syntax analysis, intermediate code generation, optimization and code generation."
    },

    {
      title: "Lexical Analysis",
      icon: "🧠",
      content:
        "Lexical analysis converts source code into tokens such as identifiers, operators and constants."
    },

    {
      title: "Syntax Analysis",
      icon: "🌳",
      content:
        "Syntax analysis checks whether the expression follows proper grammar and valid syntax rules."
    },

    {
      title: "Arithmetic Expression Evaluation",
      icon: "➗",
      content:
        "Arithmetic expressions are evaluated using operator precedence and associativity rules."
    },

    {
      title: "Three Address Code",
      icon: "⚙️",
      content:
        "Three Address Code is an intermediate representation where instructions contain at most three addresses."
    },

    {
      title: "Constant Folding",
      icon: "🚀",
      content:
        "Constant folding simplifies constant expressions during compilation to improve efficiency."
    },

    {
      title: "Error Handling",
      icon: "❌",
      content:
        "Compiler detects invalid expressions and syntax errors to prevent incorrect execution."
    },

    {
      title: "Applications",
      icon: "📚",
      content:
        "Compiler concepts are used in IDEs, interpreters, optimization systems and programming languages."
    },

    {
      title: "Future Scope",
      icon: "🔮",
      content:
        "Future enhancements include semantic analysis, SVG parse trees and AI-based optimization."
    }

  ]

  const handleEvaluate = () => {

    setLoading(true)

    setTimeout(() => {

      const isValid = validateSyntax(expression)

      if (!isValid) {

        setError("Invalid Expression Syntax")
        setTokens([])
        setTac([])
        setOptimizedCode("")
        setTree(null)
        setLoading(false)

        return
      }

      setError("")

      const tokenResult = lexer(expression)
      setTokens(tokenResult)

      const tacResult = generateTAC(expression)
      setTac(tacResult)

      const optimizedResult = constantFolding(expression)
      setOptimizedCode(optimizedResult)

      const treeResult = generateParseTree(expression)
      setTree(treeResult)

      setLoading(false)

    }, 1200)
  }

  return (

    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white px-10 py-16 relative">

      {/* Animated Blobs */}

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity
        }}
        className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 60, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, -80, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity
        }}
        className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl"
      />

      {/* HERO */}

      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-7xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Compiler Visualizer
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center text-slate-300 text-xl mb-20 max-w-5xl mx-auto leading-9"
      >
        Interactive visualization of compiler phases including lexical analysis,
        syntax analysis, TAC generation, optimization and parse tree generation.
      </motion.p>

      {/* COMPILER PHASES */}

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-6 mb-20"
      >

        {

          [
            "Lexical Analysis",
            "Syntax Analysis",
            "TAC Generation",
            "Optimization",
            "Parse Tree"
          ].map((phase, index) => (

            <motion.button
              key={index}
              whileHover={{
                scale: 1.08,
                y: -8,
                boxShadow: "0px 0px 40px rgba(34,211,238,0.35)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setActivePhase(
                  activePhase === index ? null : index
                )
              }
              className="px-8 py-4 rounded-full backdrop-blur-lg border border-cyan-400/30 bg-white/5 text-lg font-semibold"
            >
              {phase}
            </motion.button>

          ))

        }

      </motion.div>

      {/* ACTIVE PHASE INFO */}

      {

        activePhase !== null && (

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-slate-900/70 border border-slate-700 rounded-3xl p-8 mb-20 text-slate-300 text-lg leading-9"
          >

            {
              activePhase === 0 &&
              "Lexical Analysis converts source code into tokens such as identifiers, operators and constants."
            }

            {
              activePhase === 1 &&
              "Syntax Analysis validates the grammar structure of arithmetic expressions."
            }

            {
              activePhase === 2 &&
              "Three Address Code simplifies arithmetic expressions into intermediate instructions."
            }

            {
              activePhase === 3 &&
              "Optimization improves efficiency using techniques such as constant folding."
            }

            {
              activePhase === 4 &&
              "Parse Tree visually represents the hierarchical structure of expressions."
            }

          </motion.div>

        )

      }

      {/* THEORY */}

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mb-24"
      >

        <h2 className="text-5xl font-bold text-center mb-16 text-cyan-400">
          📘 Compiler Theory
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

          {

            theorySections.map((section, index) => (

              <motion.div
                key={index}
                whileHover={{
                  scale: 1.04,
                  y: -10,
                  boxShadow: "0px 0px 40px rgba(34,211,238,0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setSelectedTheory(
                    selectedTheory === index ? null : index
                  )
                }
                className="cursor-pointer bg-white/5 backdrop-blur-xl border border-cyan-400/10 rounded-3xl p-8 hover:border-cyan-400 transition-all duration-500"
              >

                <div className="text-5xl mb-6">
                  {section.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {section.title}
                </h3>

                <p className="text-slate-400">
                  Click to explore theory
                </p>

                {

                  selectedTheory === index && (

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-slate-300 leading-8"
                    >
                      {section.content}
                    </motion.div>

                  )

                }

              </motion.div>

            ))

          }

        </div>

      </motion.div>

      {/* MAIN PANEL */}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-[1900px] mx-auto bg-white/5 backdrop-blur-2xl border border-cyan-400/10 rounded-[40px] shadow-[0_0_50px_rgba(34,211,238,0.18)] p-14"
      >

        {/* INPUT */}

        <div className="flex flex-col lg:flex-row gap-6">

          <input
            type="text"
            placeholder="Enter expression (example: a = 5 + 3 * 2)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="flex-1 p-6 rounded-3xl bg-slate-800/80 border border-slate-600 outline-none focus:border-cyan-400 transition-all duration-300 text-lg"
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 40px rgba(34,211,238,0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEvaluate}
            className="px-12 py-6 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-500"
          >
            {loading ? "Compiling..." : "Evaluate"}
          </motion.button>

        </div>

        {/* SAMPLE BUTTONS */}

        <div className="flex flex-wrap gap-4 mt-8">

          {

            [
              "a = 5 + 3 * 2",
              "x = 10 - 4 / 2",
              "y = 8 * 2 + 1"
            ].map((sample, index) => (

              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                onClick={() => setExpression(sample)}
                className="px-5 py-3 bg-slate-700/80 border border-slate-600 rounded-2xl hover:bg-slate-600 transition-all duration-300"
              >
                {sample}
              </motion.button>

            ))

          }

        </div>

        {/* LOADER */}

        {

          loading && (

            <div className="flex justify-center mt-12">

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear"
                }}
                className="w-20 h-20 border-[6px] border-cyan-400 border-t-transparent rounded-full"
              />

            </div>

          )

        }

        {/* ERROR */}

        {

          error && (

            <div className="mt-10 bg-red-500/20 border border-red-500 p-6 rounded-3xl text-lg">
              {error}
            </div>

          )

        }

        {/* OUTPUTS */}

        <div className="grid xl:grid-cols-2 gap-12 mt-16">

          {/* TOKENS */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-cyan-400">
              🧠 Tokens
            </h2>

            <div className="space-y-4">

              {

                tokens.map((token, index) => (

                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/80 p-5 rounded-2xl flex justify-between border border-slate-600 text-lg"
                  >
                    <span>{token.value}</span>
                    <span className="text-cyan-300">
                      {token.type}
                    </span>
                  </motion.div>

                ))

              }

            </div>

          </motion.div>

          {/* TAC */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-yellow-400">
              ⚙️ Three Address Code
            </h2>

            <div className="space-y-4">

              {

                tac.map((line, index) => (

                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/80 p-5 rounded-2xl border border-slate-600 font-mono text-lg"
                  >
                    {line}
                  </motion.div>

                ))

              }

            </div>

          </motion.div>

          {/* OPTIMIZATION */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-green-400">
              🚀 Constant Folding
            </h2>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-500/20 border border-green-500 p-7 rounded-3xl text-2xl font-semibold"
            >
              {optimizedCode}
            </motion.div>

          </motion.div>

          {/* PARSE TREE */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8 overflow-x-auto"
          >

            <h2 className="text-3xl font-bold mb-10 text-pink-400">
              🌳 Parse Tree
            </h2>

            {

              tree && (

                <div className="flex justify-center min-w-[500px]">

                  <div className="flex flex-col items-center">

                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center text-2xl font-bold bg-slate-800"
                    >
                      {tree.value}
                    </motion.div>

                    <div className="h-10 w-[2px] bg-cyan-400"></div>

                    <div className="flex items-start gap-32">

                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className="w-14 h-14 rounded-full border-4 border-purple-400 flex items-center justify-center text-2xl font-bold bg-slate-800"
                      >
                        {tree.left.value}
                      </motion.div>

                      <div className="flex flex-col items-center">

                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          className="w-14 h-14 rounded-full border-4 border-pink-400 flex items-center justify-center text-2xl font-bold bg-slate-800"
                        >
                          {tree.right.value}
                        </motion.div>

                        <div className="h-10 w-[2px] bg-cyan-400"></div>

                        <div className="flex items-start gap-24">

                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="w-12 h-12 rounded-full border-4 border-yellow-400 flex items-center justify-center text-xl font-bold bg-slate-800"
                          >
                            {tree.right.left.value}
                          </motion.div>

                          <div className="flex flex-col items-center">

                            <motion.div
                              whileHover={{ scale: 1.08 }}
                              className="w-12 h-12 rounded-full border-4 border-green-400 flex items-center justify-center text-xl font-bold bg-slate-800"
                            >
                              {tree.right.right.value}
                            </motion.div>

                            <div className="h-10 w-[2px] bg-cyan-400"></div>

                            <div className="flex gap-16">

                              <motion.div
                                whileHover={{ scale: 1.08 }}
                                className="w-10 h-10 rounded-full border-4 border-slate-400 flex items-center justify-center text-lg font-bold bg-slate-800"
                              >
                                {tree.right.right.left.value}
                              </motion.div>

                              <motion.div
                                whileHover={{ scale: 1.08 }}
                                className="w-10 h-10 rounded-full border-4 border-slate-400 flex items-center justify-center text-lg font-bold bg-slate-800"
                              >
                                {tree.right.right.right.value}
                              </motion.div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              )

            }

          </motion.div>

        </div>

      </motion.div>

      {/* FOOTER */}

      <div className="text-center text-slate-400 mt-16 text-lg">
        Built using React, Tailwind CSS, Framer Motion & Compiler Design Concepts 🚀
      </div>

    </div>
  )
}

export default App