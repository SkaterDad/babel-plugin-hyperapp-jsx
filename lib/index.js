//@ts-check
const isString = require('lodash/isString')
const esutils = require('esutils')

const nameProperty = 'nodeName'
const attributesProperty = 'attributes'
const childrenProperty = 'children'

module.exports = function({ types: t }) {
  /* ==========================================================================
   * Utilities
   * ======================================================================= */

  const transformOnType = transforms => node => {
    const transformer = transforms[node.type]
    if (transformer) {
      return transformer(node)
    }
    throw new Error(`${node.type} could not be transformed`)
  }

  /* ==========================================================================
   * Initial configuration
   * ======================================================================= */

  const initConfig = (path, state) => {
    const { module = null, constructor = null, varsRegex = null } = state.opts

    let jsxObjectTransformer

    // Users can specify regex for finding Component function names.
    // Default is Uppercase
    let variablesRegex = isString(varsRegex) ? new RegExp(varsRegex) : /^[A-Z]/

    if (isString(constructor)) {
      // Use a vdom constructor:  ex. h(tagname, props, children)
      let funcName = constructor

      // If `module` is provided:
      // Automatically import vdom function from a module in each file.
      // ex: import { h } from 'hyperapp'
      if (isString(module)) {
        // To avoid conflicts with other identifiers in the file, generate a unique alias
        // ex:  import { h as _h } from 'hyperapp
        const uniqueIdentifier = path.scope.generateUidIdentifier(constructor)
        funcName = uniqueIdentifier.name

        // Create the import declaration
        const importDeclaration = t.importDeclaration(
          [t.importSpecifier(uniqueIdentifier, t.identifier(constructor))],
          t.stringLiteral(module)
        )

        // Add the import declaration to the top of the file.
        path
          .findParent(p => p.isProgram())
          .unshiftContainer('body', importDeclaration)
      }

      jsxObjectTransformer = jsxObj => {
        const jsxChildren = jsxObj.properties[2].value

        // Build up arguments to pass to vdom constructor
        let args = [jsxObj.properties[0].value, jsxObj.properties[1].value]

        // If there is only one child, we will not pass inside array
        // This should improve perf inside of `h`
        if (jsxChildren.elements.length === 1) {
          args.push(jsxChildren.elements[0])
        } else if (jsxChildren.elements.length > 1) {
          args.push(jsxChildren)
        }

        return t.callExpression(t.identifier(funcName), args)
      }
    } else {
      // Otherwise, produce runtime optimized code
      jsxObjectTransformer = jsxObj => {
        const jsxTag = jsxObj.properties[0].value
        const jsxAttrs = jsxObj.properties[1].value
        let jsxChildren = jsxObj.properties[2].value

        // Does this JSX object have attributes?
        const noAttrs =
          t.isObjectExpression(jsxAttrs) && jsxAttrs.properties.length === 0

        // Does this JSX object have children?
        const noChildren =
          t.isArrayExpression(jsxChildren) && jsxChildren.elements.length === 0

        // Try finding children which are arrays
        // We tagged them earlier in the process with an IS_ARRAY property
        const hasArrayChild =
          jsxChildren.elements.length > 0 &&
          jsxChildren.elements.some(el => el.IS_ARRAY === true)

        // Single array child can be passed directly
        if (hasArrayChild && jsxChildren.elements.length === 1) {
          jsxChildren = jsxChildren.elements[0]
          jsxObj.properties[2].value = jsxChildren
          // Otherwise, create an array concat
        } else if (hasArrayChild) {
          jsxChildren = t.callExpression(
            t.memberExpression(t.arrayExpression(), t.identifier('concat')),
            jsxChildren.elements
          )
          jsxObj.properties[2].value = jsxChildren
        }

        // Is this JSX object a component?
        if (jsxTag && t.isIdentifier(jsxTag)) {
          // Does this JSX object have attributes?
          const noAttrs =
            t.isObjectExpression(jsxAttrs) && jsxAttrs.properties.length === 0

          // Does this JSX object have children?
          const noChildren =
            t.isArrayExpression(jsxChildren) &&
            jsxChildren.elements.length === 0

          // Set function call arguments based on attrs & children
          let compFuncArgs = []

          switch (true) {
            // MyComponent()
            case noAttrs && noChildren:
              compFuncArgs = []
              break
            // MyComponent({}, ['Child'])
            case noAttrs && !noChildren:
              compFuncArgs = [jsxAttrs, jsxChildren]
              break
            // MyComponent({ prop1: true })
            case !noAttrs && noChildren:
              compFuncArgs = [jsxAttrs]
              break
            // MyComponent({ prop1: true }, ['Child'])
            case !noAttrs && !noChildren:
            default:
              compFuncArgs = [jsxAttrs, jsxChildren]
          }

          // Return component function call
          return t.callExpression(jsxTag, compFuncArgs)
        }

        // Not a component, so return raw VDOM object
        return jsxObj
      }
    }

    return {
      variablesRegex,
      jsxObjectTransformer,
    }
  }

  /* =========================================================================
   * Visitors
   * ======================================================================= */

  const visitJSXElement = (path, state) => {
    if (!state.get('jsxConfig')) {
      state.set('jsxConfig', initConfig(path, state))
    }

    const { variablesRegex, jsxObjectTransformer } = state.get('jsxConfig')

    /* ==========================================================================
     * Node Transformers
     * ======================================================================= */

    const JSXIdentifier = node => t.stringLiteral(node.name)

    const JSXNamespacedName = node =>
      t.stringLiteral(`${node.namespace.name}:${node.name.name}`)

    const JSXMemberExpression = transformOnType({
      JSXIdentifier: node => t.identifier(node.name),
      JSXMemberExpression: node =>
        t.memberExpression(
          JSXMemberExpression(node.object),
          JSXMemberExpression(node.property)
        ),
    })

    const JSXElementName = transformOnType({
      JSXIdentifier: node =>
        variablesRegex.test(node.name)
          ? t.identifier(node.name)
          : JSXIdentifier(node),
      JSXNamespacedName,
      JSXMemberExpression,
    })

    const JSXExpressionContainer = node => {
      if (t.isIdentifier(node.expression)) {
        let binding = path.scope.getBinding(node.expression.name)
        if (binding) {
          // Find array expressions and tag them
          if (binding.path.node.type === 'VariableDeclarator') {
            if (
              binding.path.node.init &&
              t.isArrayExpression(binding.path.node.init)
            ) {
              node.expression['IS_ARRAY'] = true
            }
          }
        }
      }
      return node.expression
    }
    const JSXAttributeName = transformOnType({
      JSXIdentifier,
      JSXNamespacedName,
      JSXMemberExpression,
    })

    const JSXAttributeValue = transformOnType({
      StringLiteral: node => node,
      JSXExpressionContainer,
    })

    const JSXAttributes = nodes => {
      let object = []
      const objects = []

      nodes.forEach(node => {
        switch (node.type) {
          case 'JSXAttribute': {
            if (!object) {
              object = []
            }

            const attributeName = JSXAttributeName(node.name)
            const objectKey = esutils.keyword.isIdentifierNameES6(
              attributeName.value
            )
              ? t.identifier(attributeName.value)
              : attributeName

            object.push(
              t.objectProperty(objectKey, JSXAttributeValue(node.value))
            )
            break
          }
          case 'JSXSpreadAttribute': {
            if (object) {
              objects.push(t.objectExpression(object))
              object = null
            }

            objects.push(node.argument)
            break
          }
          default:
            throw new Error(`${node.type} cannot be used as a JSX attribute`)
        }
      })

      if (object && object.length > 0) {
        objects.push(t.objectExpression(object))
      }

      if (objects.length === 0) {
        return t.objectExpression([])
      } else if (objects.length === 1) {
        return objects[0]
      }

      return t.callExpression(state.addHelper('extends'), objects)
    }

    const JSXText = node => {
      const value = node.value.replace(/\n\s*/g, '')
      return value === '' ? null : t.stringLiteral(value)
    }

    const JSXSpreadChild = node => {
      // Treat all ...<Children /> as arrays
      // This seems like the most common use, and should perform okay.
      node.expression['IS_ARRAY'] = true
      return node.expression
    }

    const JSXElement = node =>
      jsxObjectTransformer(
        t.objectExpression([
          t.objectProperty(
            t.identifier(nameProperty),
            JSXElementName(node.openingElement.name)
          ),
          t.objectProperty(
            t.identifier(attributesProperty),
            JSXAttributes(node.openingElement.attributes)
          ),
          t.objectProperty(
            t.identifier(childrenProperty),
            node.closingElement
              ? JSXChildren(node.children)
              : t.arrayExpression()
          ),
        ])
      )

    const JSXChild = transformOnType({
      JSXText,
      JSXElement,
      JSXExpressionContainer,
      JSXSpreadChild,
    })

    const JSXChildren = nodes =>
      t.arrayExpression(
        nodes
          .map(JSXChild)
          .filter(Boolean)
          // Normalize all of our string children into one big string. This can be
          // an optimization as we minimize the number of nodes created.
          // This step just turns `['1', '2']` into `['12']`.
          .reduce((children, child) => {
            const lastChild =
              children.length > 0 ? children[children.length - 1] : null

            // If this is a string literal, and the last child is a string literal, merge them.
            if (
              child.type === 'StringLiteral' &&
              lastChild &&
              lastChild.type === 'StringLiteral'
            ) {
              return [
                ...children.slice(0, -1),
                t.stringLiteral(lastChild.value + child.value),
              ]
            }

            // Otherwise just append the child to our array normally.
            return [...children, child]
          }, [])
          // This step will flatten arrays one level
          // ex: children: [1, [2,3], 4] to [1,2,3,4]
          .reduce((children, child) => {
            if (child.type === 'ArrayExpression') {
              child.elements.forEach(el => {
                children.push(el)
              })
            } else {
              children.push(child)
            }
            return children
          }, [])
      )

    // Actually replace JSX with an object.
    path.replaceWith(JSXElement(path.node))
  }

  /* ==========================================================================
   * Plugin
   * ======================================================================= */

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      JSXElement: visitJSXElement,
    },
  }
}
