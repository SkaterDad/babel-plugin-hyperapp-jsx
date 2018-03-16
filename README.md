# babel-plugin-hyperapp-jsx

> THIS REPO IS A WORK IN PROGRESS, NOT YET RELEASED.

## Acknowledgement

This plugin is a fork of Caleb Meredith‘s ([`@calebmer`][twcm] on Twitter) excellent [babel-plugin-transform-jsx](https://github.com/calebmer/node_modules/tree/master/babel-plugin-transform-jsx), customized for `hyperapp`.

## Description

This plugin turns JSX into plain `hyperapp` VNode objects and function calls for components.

With default options, this plugin eliminates the need to `import { h } from 'hyperapp'`, and aims to reduce the overhead of rendering by reducing the number of functions being called.

## A VNode Object

These virtual node objects are compatible with `hyperapp` and `ultradom`.

* `nodeName`: A string specifying the JSX element’s name. Most often a string, but might be a variable if it is considered a valid expression by the JSX spec.
* `attributes`: An object of key/value attributes for the VNode. Supports spread attributes.
* `children`: An array of VNodes, Component function calls, strings, etc... If no children were present, it will default to `[]`.

## Usage

In your `.babelrc` or build configuration, add this plugin.

Without options (Recommended):

```js
{
  "plugins": ["transform-hyperapp-jsx"]
}
```

With options:

```js
{
  "plugins": [
    ["transform-hyperapp-jsx", {
      "constructor": "h",
      "hyperapp": "hyperapp",
    }]
  ]
}
```

## Options

This plugin accepts the following optional arguments. These are provided to keep this plugin flexible, but may lead to lower performance at run-time.

* `constructor`: The name of your VDOM function.
* `module`: The name of the module to import the constructor from.
* `varsRegex`: Custom regular expression (string) to identify components.

## Optimizations

* Combines string children

  ```jsx
  // In
  children: ['a', 'b', 'c']

  // Out
  children: ['abc']
  ```

* Flattens arrays in `children` one level (when known)

  ```jsx
  // In
  <div>{[1, 2, [3, 4]]}</div>

  // Out
  children: [1, 2, 3, 4]
  ```

* Only passes necessary arguments to VDOM constructor

  ```jsx
  // In
  <div id="test"></div>

  // Out
  h('div', { id: "test" })

  // In
  <span>Child</span>

  // Out
  h('span', {}, "Child")
  ```

## TODO:

* Benchmarks
* Examples in DOCS (For now, look at the tests)
