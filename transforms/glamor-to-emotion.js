import prettier from 'prettier'
import createUtils from './utils'

export const parser = 'flow'

export default function transformer(file, api) {
  const options = prettier.resolveConfig.sync(process.cwd())
  const j = api.jscodeshift
  const root = j(file.source)
  const utils = createUtils(j)

  const classnames = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'classnames',
    },
  })

  const classnamesLocalName = classnames.find(j.Identifier).get(0).node.name

  const glamor = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'glamor',
    },
  })

  glamor.forEach(path => {
    path.node.source = j.literal('emotion')

    if (classnames.length) {
      path.node.specifiers.push(j.importSpecifier(j.identifier('cx')))
    }
  })

  // classnames =>  cx
  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: classnamesLocalName,
      },
    })
    .forEach(path => {
      path.value.callee = j.identifier('cx')
    })

  classnames.remove()

  // {...styles} => className={styles}
  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'css',
      },
    })
    .filter(path => path.parent.value.type !== 'MemberExpression')
    .forEach(path => {
      const { name } = path.parent.value.id
      const spreadAttrs = root.find(j.JSXSpreadAttribute, {
        argument: { name },
      })
      const toStringCalls = root.find(j.MemberExpression, {
        object: { name },
        property: { name: 'toString' },
      })

      spreadAttrs.forEach(path => {
        // check if className is already a declared attr
        const { attributes } = path.parent.value

        const hasClassName = !!attributes.find(attr =>
          utils.isJsxAttribute(attr, 'className'),
        )

        const newAttributes = attributes.reduce((acc, attr) => {
          if (utils.isJsxAttribute(attr, 'className')) {
            // check if cx() has already been used
            if (
              attr.value.type === 'JSXExpressionContainer' &&
              attr.value.expression.type === 'CallExpression' &&
              attr.value.expression.callee.name === 'cx'
            ) {
              attr.value.expression.arguments.push(j.identifier(name))
              acc.push(attr)
            } else {
              const container = j.jsxExpressionContainer(
                j.callExpression(j.identifier('cx'), [
                  attr.value.type === 'JSXExpressionContainer'
                    ? attr.value.expression
                    : attr.value,
                  j.identifier(name),
                ]),
              )
              acc.push(utils.createJsxAttribute('className', container))
            }
          } else if (attr === path.value) {
            // leave the spread style out of the attributes
          } else {
            acc.push(attr)
          }

          return acc
        }, [])

        if (!hasClassName) {
          const container = j.jsxExpressionContainer(j.identifier(name))
          newAttributes.push(utils.createJsxAttribute('className', container))
        }

        j(path.parent).replaceWith(
          j.jsxOpeningElement(
            path.parent.value.name,
            newAttributes,
            path.parent.value.selfClosing,
          ),
        )
        // path.parent.value.attributes = newAttributes
      })

      toStringCalls.forEach(path => {
        const identifier = j.identifier(name)
        j(path.parent).replaceWith(identifier)
      })
    })

  // @TODO refactor this
  // css().toString() =>  css()
  root
    .find(j.MemberExpression, {
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
      const expression = j.callExpression(
        j.identifier('css'),
        path.value.object.arguments,
      )

      j(path.parent).replaceWith(expression)
    })

  return prettier.format(root.toSource(), options)
}
