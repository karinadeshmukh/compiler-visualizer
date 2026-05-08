export function validateSyntax(expression) {

  const regex =
    /^[a-zA-Z]+\s*=\s*\d+(\s*[\+\-\*\/]\s*\d+)*$/

  return regex.test(expression)
}