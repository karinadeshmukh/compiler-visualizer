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

      {/* Animated Glow Effects */}

      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 25, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity
        }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl"
      />

      {/* Heading */}

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Compiler Visualizer
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-cyan-400 text-2xl mb-10"
      >
        Interactive Compiler Design Simulator
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-slate-300 text-xl mb-16 max-w-5xl mx-auto leading-9"
      >
        Design and implementation of an Arithmetic Expression Evaluator
        using compiler phases including lexical analysis, TAC generation,
        optimization, and parse tree visualization.
      </motion.p>

      {/* Compiler Pipeline */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="flex flex-col items-center gap-6 mb-16"
      >

        <div className="flex flex-wrap justify-center gap-6">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePhase(activePhase === 0 ? null : 0)}
            className="px-6 py-3 rounded-full backdrop-blur-lg border border-cyan-400 bg-cyan-500/10 text-lg font-semibold"
          >
            1️⃣ Lexical Analysis
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePhase(activePhase === 1 ? null : 1)}
            className="px-6 py-3 rounded-full backdrop-blur-lg border border-purple-400 bg-purple-500/10 text-lg font-semibold"
          >
            2️⃣ Syntax Analysis
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePhase(activePhase === 2 ? null : 2)}
            className="px-6 py-3 rounded-full backdrop-blur-lg border border-yellow-400 bg-yellow-500/10 text-lg font-semibold"
          >
            3️⃣ TAC Generation
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePhase(activePhase === 3 ? null : 3)}
            className="px-6 py-3 rounded-full backdrop-blur-lg border border-green-400 bg-green-500/10 text-lg font-semibold"
          >
            4️⃣ Optimization
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePhase(activePhase === 4 ? null : 4)}
            className="px-6 py-3 rounded-full backdrop-blur-lg border border-pink-400 bg-pink-500/10 text-lg font-semibold"
          >
            5️⃣ Parse Tree
          </motion.button>

        </div>

        {/* Definition Box */}

        {
          activePhase !== null && (

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl bg-slate-900/80 border border-slate-700 rounded-3xl p-6 text-slate-300 text-lg leading-8 shadow-2xl"
            >

              {
                activePhase === 0 &&
                "Breaks the input expression into tokens such as identifiers, operators, constants, and symbols."
              }

              {
                activePhase === 1 &&
                "Checks whether the arithmetic expression follows valid grammar and syntax rules."
              }

              {
                activePhase === 2 &&
                "Converts the arithmetic expression into intermediate Three Address Code representation."
              }

              {
                activePhase === 3 &&
                "Applies constant folding optimization to simplify arithmetic expressions and improve efficiency."
              }

              {
                activePhase === 4 &&
                "Creates a hierarchical tree structure representing the arithmetic expression."
              }

            </motion.div>

          )
        }

      </motion.div>

      {/* Main Card */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-[1700px] mx-auto bg-white/5 backdrop-blur-2xl border border-cyan-400/10 rounded-[40px] shadow-[0_0_50px_rgba(34,211,238,0.18)] p-14"
      >

        {/* Input */}

        <div className="flex flex-col lg:flex-row gap-6">

          <input
            type="text"
            placeholder="Enter expression (example: a = 5 + 3 * 2)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="flex-1 p-6 rounded-3xl bg-slate-800/80 border border-slate-600 outline-none focus:border-cyan-400 transition-all duration-300 text-lg"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEvaluate}
            className="px-12 py-6 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-lg shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300"
          >
            {loading ? "Compiling..." : "Evaluate"}
          </motion.button>

        </div>

        {/* Sample Expressions */}

        <div className="flex flex-wrap gap-4 mt-6">

          <button
            onClick={() => setExpression("a = 5 + 3 * 2")}
            className="px-5 py-3 bg-slate-700/80 border border-slate-600 rounded-2xl hover:bg-slate-600 transition-all duration-300"
          >
            a = 5 + 3 * 2
          </button>

          <button
            onClick={() => setExpression("x = 10 - 4 / 2")}
            className="px-5 py-3 bg-slate-700/80 border border-slate-600 rounded-2xl hover:bg-slate-600 transition-all duration-300"
          >
            x = 10 - 4 / 2
          </button>

          <button
            onClick={() => setExpression("y = 8 * 2 + 1")}
            className="px-5 py-3 bg-slate-700/80 border border-slate-600 rounded-2xl hover:bg-slate-600 transition-all duration-300"
          >
            y = 8 * 2 + 1
          </button>

        </div>

        {/* Loader */}

        {
          loading && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-10"
            >

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear"
                }}
                className="w-20 h-20 border-[6px] border-cyan-400 border-t-transparent rounded-full"
              />

            </motion.div>
          )
        }

        {/* Error */}

        {
          error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 bg-red-500/20 border border-red-500 p-6 rounded-3xl text-lg"
            >
              {error}
            </motion.div>
          )
        }

        {/* Sections Grid */}

        <div className="grid xl:grid-cols-2 gap-12 mt-14">

          {/* Tokens */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-cyan-400">
              🧠 Tokens
            </h2>

            <div className="space-y-4">

              {tokens.map((token, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1
                  }}
                  key={index}
                  className="bg-slate-800/80 p-5 rounded-2xl flex justify-between border border-slate-600 text-lg"
                >
                  <span>{token.value}</span>
                  <span className="text-cyan-300">{token.type}</span>
                </motion.div>
              ))}

            </div>

          </motion.div>

          {/* TAC */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-yellow-400">
              ⚙️ Three Address Code
            </h2>

            <div className="space-y-4">

              {tac.map((line, index) => (

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.4,
                    duration: 0.5
                  }}
                  key={index}
                  className="bg-slate-800/80 p-5 rounded-2xl border border-slate-600 font-mono text-lg"
                >
                  {line}
                </motion.div>

              ))}

            </div>

          </motion.div>

          {/* Optimization */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-green-400">
              🚀 Constant Folding
            </h2>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-green-500/20 border border-green-500 p-7 rounded-3xl text-2xl font-semibold"
            >
              {optimizedCode}
            </motion.div>

          </motion.div>

          {/* Parse Tree */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-700 rounded-[35px] p-8"
          >

            <h2 className="text-3xl font-bold mb-7 text-pink-400">
              🌳 Parse Tree
            </h2>

            {
              tree && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/80 border border-slate-600 rounded-3xl p-10 text-center leading-[60px] text-xl"
                >

                  <div className="text-cyan-400 text-4xl font-bold">
                    {tree.value}
                  </div>

                  <div className="flex justify-center gap-32 mt-6">

                    <div className="text-2xl">
                      {tree.left.value}
                    </div>

                    <div>

                      <div className="text-2xl">
                        {tree.right.value}
                      </div>

                      <div className="flex justify-center gap-24 mt-6">

                        <div className="text-xl">
                          {tree.right.left.value}
                        </div>

                        <div>

                          <div className="text-xl">
                            {tree.right.right.value}
                          </div>

                          <div className="flex justify-center gap-16 mt-6">

                            <div className="text-lg">
                              {tree.right.right.left.value}
                            </div>

                            <div className="text-lg">
                              {tree.right.right.right.value}
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </motion.div>
              )
            }

          </motion.div>

        </div>

      </motion.div>

      {/* Footer */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-center text-slate-400 mt-16 text-lg"
      >
        Built using React, Tailwind CSS, Framer Motion & Compiler Design Concepts 🚀
      </motion.div>

    </div>
  )
}

export default App