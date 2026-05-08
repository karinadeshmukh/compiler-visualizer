export function constantFolding(expression) {

  try {

    const parts = expression.split("=")

    if (parts.length !== 2) {
      return "Invalid Expression"
    }

    const left = parts[0].trim()
    const right = parts[1].trim()

    const result = eval(right)

    return `${left} = ${result}`

  } catch (error) {

    return "Optimization Error"
  }
}