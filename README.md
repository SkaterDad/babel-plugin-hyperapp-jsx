# babel-plugin-hyperapp-jsx

> THIS REPO IS A WORK IN PROGRESS, NOT YET FUNCTIONAL OR RELEASED.

## Acknowledgement
This plugin is a fork of Caleb Meredith‘s ([`@calebmer`][twcm] on Twitter) excellent [babel-plugin-transform-jsx](https://github.com/calebmer/node_modules/tree/master/babel-plugin-transform-jsx), customized for `hyperapp`.

## Description
This plugin turns JSX into plain `hyperapp` VNode objects and function calls for Components.

This plugin eliminates the need to `import { h } from 'hyperapp`, and aims to reduce the overhead of rendering by reducing the number of functions being called.

## A VNode Object
These virtual node objects are compatible with `hyperapp` and `ultradom`.
- `nodeName`: A string specifying the JSX element’s name. Most often a string, but might be a variable if it is considered a valid expression by the JSX spec.
- `attributes`: An object of key/value attributes for the VNode. Supports spread attributes.
- `children`: An array of VNodes, Component function calls, strings, etc...  If no children were present, it will default to `[]`.

## More docs with examples coming soon