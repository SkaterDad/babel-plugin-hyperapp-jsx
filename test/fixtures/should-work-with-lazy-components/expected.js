var Component = function Component(props) {
  return {
    nodeName: "div",
    attributes: {},
    children: ["This is a component."]
  };
};

var LazyComp = function LazyComp(props) {
  return function (state, actions) {
    return Component(babelHelpers.extends({}, props, {
      lazy: true
    }));
  };
};

var view = function view(state, actions) {
  return {
    nodeName: "div",
    attributes: { class: "container" },
    children: [
      Component(),
      LazyComp()
    ]
  };
};