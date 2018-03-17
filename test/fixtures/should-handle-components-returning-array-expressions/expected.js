var Component = function Component() {
  return [
    1, 2, 3
  ];
};

var view = {
  nodeName: "main",
  attributes: {},
  children: [{
    nodeName: "div",
    attributes: {},
    children: Component()
  }]
}