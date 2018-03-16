var Component = function Component() {
  return [
    1, 2, 3
  ];
};

var object = h("div", {},
  h(Component, {})
);
