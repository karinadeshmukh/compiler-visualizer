export function generateTAC(expression) {

  let tac = []
  let tempCount = 1

  const parts = expression.split("=")

  if (parts.length !== 2) {
    return ["Invalid Expression"]
  }

  const left = parts[0].trim()
  const right = parts[1].trim()

  const tokens = right.split(" ")

  // Handle multiplication first
  for (let i = 0; i < tokens.length; i++) {

    if (tokens[i] === "*") {

      const temp = `t${tempCount++}`

      tac.push(
        `${temp} = ${tokens[i - 1]} * ${tokens[i + 1]}`
      )

      tokens.splice(i - 1, 3, temp)

      i--
    }
  }

  // Handle addition
  for (let i = 0; i < tokens.length; i++) {

    if (tokens[i] === "+") {

      const temp = `t${tempCount++}`

      tac.push(
        `${temp} = ${tokens[i - 1]} + ${tokens[i + 1]}`
      )

      tokens.splice(i - 1, 3, temp)

      i--
    }
  }

  tac.push(`${left} = ${tokens[0]}`)

  return tac
}