export default function createUtils(j) {
  function createJsxAttribute(prop, value) {
    const jsxIdentifier = j.jsxIdentifier(prop)
    return j.jsxAttribute(jsxIdentifier, value)
  }

  return {
    createJsxAttribute,
  }
}
