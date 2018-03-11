var object = {
  a: 1,
  b: {
    c: 2
  }
};

var jsxA = {
  nodeName: object.a,
  attributes: {},
  children: []
};
var jsxB = {
  nodeName: object.b.c,
  attributes: {},
  children: []
};
var jsxC = {
  nodeName: object.a,
  attributes: {},
  children: []
};
var jsxD = {
  nodeName: object.b.c,
  attributes: {},
  children: []
};
var jsxE = {
  nodeName: object.a,
  attributes: {},
  children: [object.a]
};
var jsxF = {
  nodeName: object.b.c,
  attributes: {},
  children: [object.b.c]
};
