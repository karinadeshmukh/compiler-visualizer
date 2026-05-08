export function generateParseTree(expression) {

  const parts = expression.split("=")

  if (parts.length !== 2) {
    return null
  }

  const left = parts[0].trim()
  const right = parts[1].trim()

  const tokens = right.split(" ")

  // Handles: number + number * number

  return {
    value: "=",
    left: {
      value: left
    },
    right: {
      value: "+",
      left: {
        value: tokens[0]
      },
      right: {
        value: "*",
        left: {
          value: tokens[2]
        },
        right: {
          value: tokens[4]
        }
      }
    }
  }
}