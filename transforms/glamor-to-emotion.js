import createUtils from './utils'

export const parser = 'flow'

export default function transformer(file, api, options) {
  const j = api.jscodeshift
  const ast = j(file.source)
  const utils = createUtils(j)

  const classnames = ast.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'classnames',
    },
  })

  const classnamesLocalName = classnames.find(j.Identifier).get(0).node.name

  const glamor = ast.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'glamor',
    },
  })

  glamor.forEach(path => {
    path.node.source.value = 'emotion'

    if (classnames.length) {
      path.node.specifiers.push(j.importSpecifier(j.identifier('cx')))
    }
  })

  const cnCalls = ast
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: classnamesLocalName,
      },
    })
    .forEach(path => {
      path.value.callee.name = 'cx'
    })

  classnames.remove()

  const cssCalls = ast
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'css',
      },
    })
    .filter(path => path.parent.value.type !== 'MemberExpression')
    .forEach(path => {
      const { name } = path.parent.value.id
      const spreadAttrs = ast.find(j.JSXSpreadAttribute, {
        argument: { name },
      })

      const toStringCalls = ast.find(j.MemberExpression, {
        object: {
          name,
          type: 'Identifier',
        },
      })

      const jsxAttribute = utils.createJsxAttribute(
        'className',
        j.jsxExpressionContainer(j.identifier(name)),
      )

      spreadAttrs.forEach(path => j(path).replaceWith(jsxAttribute))

      toStringCalls.forEach(path => {
        const identifier = j.identifier(name)
        j(path.parent).replaceWith(identifier)
      })
    })

  // @TODO refactor this
  const cssCallsWithToString = ast
    .find(j.CallExpression, {
      object: {
        callee: {
          type: 'Identifier',
          name: 'css',
        },
      },
      property: {
        type: 'Identifier',
        name: 'toString',
      },
    })
    .forEach(path => {
      const args = path.value.callee.object.arguments.slice()
      path.value.callee = j.identifier('css')
      path.value.arguments = args
    })

  return ast.toSource({ wrapColumn: 80, quote: 'single' })
}
