export default function createUtils(j) {
  function createJsxAttribute(propName, value) {
    const jsxIdentifier = j.jsxIdentifier(propName)
    return j.jsxAttribute(jsxIdentifier, value)
  }

  function isJsxAttribute(attr, name) {
    return (
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === name
    )
  }

  return {
    createJsxAttribute,
    isJsxAttribute
  }
}
