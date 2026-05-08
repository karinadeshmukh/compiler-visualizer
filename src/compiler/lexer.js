export function lexer(input) {
  const regex = /\d+|[+\-*/=()]|[a-zA-Z]+/g

  const matches = input.match(regex)

  if (!matches) return []

  return matches.map((token) => {
    if (!isNaN(token)) {
      return { value: token, type: "NUMBER" }
    }

    if (/^[a-zA-Z]+$/.test(token)) {
      return { value: token, type: "IDENTIFIER" }
    }

    return { value: token, type: "OPERATOR" }
  })
}