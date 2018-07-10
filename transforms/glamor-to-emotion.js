module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Replace glamor with emotion
  root
    .find(j.ImportDeclaration, { source: { value: 'glamor' } })
    .forEach(path => {
      path.node.source.value = 'emotion';
    });

  // Remove toString() from css() calls
  root
    .find(j.CallExpression, {
      callee: {
        object: {
          callee: {
            name: 'css'
          }
        },
        property: {
          name: 'toString'
        }
      }
    })
    .forEach(path => {
      const args = path.value.callee.object.arguments.slice();
      path.value.callee = j.identifier('css');
      path.value.arguments = args;
    });

  //

  root
    .find(j.CallExpression, {
      callee: {
        object: {
          callee: {
            name: 'css'
          }
        },
        property: {
          name: 'toString'
        }
      }
    })
    .forEach(path => {
      const args = path.value.callee.object.arguments.slice();
      path.value.callee = j.identifier('css');
      path.value.arguments = args;
    });

  return root.toSource({ quote: 'single' });
};
